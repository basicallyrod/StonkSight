import { useState, useEffect, useRef, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify' 
import * as d3 from "d3"
import { useForm } from 'react-hook-form';
import {ListForm} from './ListForm'
// import {ListItem} from './ListItem'
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {createList, getLists, deleteList} from '../features/lists/listSlice'
import {getHistoricalData, getSpecificHistoricalData, getSpecificHistoricalDataRange, reset} from '../features/iex/core/historicalPriceSlice'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import {helpers} from '../features/technical_analysis_formulas/iex_helpers/prevDataGetter'
import { rolling_ema, rolling_sma } from '../features/technical_analysis_formulas/moving_average.js'
import { macd, signal } from '../features/technical_analysis_formulas/macd.js'
import { rsi } from '../features/technical_analysis_formulas/rsi'
import Home from "../components/pages/home/index.js"
import {Button} from "../components/commonElements/buttons/index.js"
import Form from '../components/commonElements/list'
import { svg } from 'd3'
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup'
// import { CandlestickChart } from '../components/chart/chartView/views/Candlestick'
function CandlestickChartContainer({list}) {

    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //use this as the initial unformatted chartData used in listData and chartObjectHelper
    // let chartData = []

    // use this as the array for the formatted data for d3 manipulation
    let chartObjectData = []

    const {historicalPrice} = useSelector((state) => state.historicalPrice)//react redux state
    const { lists, isError, message} = useSelector ((state) =>
    state.lists)
    const {user} = useSelector((state) => state.auth);
    let [viewSelector, setViewSelector] = useState("candlestick")
    let [taSelector, setTaSelector] = useState("")

    let [currentDateCounter, setCurrentDateCounter] = useState("")
    let [currentList, setCurrentList] = useState("")
    let [isLoading, setIsLoading] = useState(false)
    let [isChartLoading, setIsChartLoading] = useState(false)
    let [longestPeriod, setLongestPeriod] = useState(0);
    let [earliestDate, setEarliestDate] = useState();//initialize the earliest date that we need to generate the chart(specifically ta data)
    let [markedDate, setMarkedDate] = useState();//inititalize the earliest date on the chart (14 periods after the earliestDate)
    let [stateHistoricalPrice, setStateHistoricalPrice] = useState() //react state
    let [previousDates, setPreviousDates] = useState([]);

    let [rsiValues, setRsiValues] = useState([]);
    let [macdValues, setMacdValues] = useState([]);

    let [activeTACharts, setActiveTACharts] = useState([])
    let svgArr = []
    let svgNode
    let svg;
    let svgRef = useRef(null)
    let svgTA;
    let svgTaRef = useRef(null)
    // const activeTACharts
    let svgTA1;
    let svgTARef1 = useRef(null)
    let taRef1 = useRef(null);
    let activeTARefs = useRef([]);

    let svgRSI, svgMACD;
    let svgRSIChart = useRef(null);
    let svgMACDChart = useRef(null);

    // let activeTARefs = useRef(new Array())
    activeTARefs.current = [];
    // let svgTARefArray = useRef([null])

    //top: refactor this for the use of multiple TA charts

    // let [svgTARef, setsvgTARef] = useState([]) //react state
    
    
    // const watchlistRefs = useRef([]);
    // const watchlists = [
    //     {
    //         watchlist: true,
    //     },
    //     {
    //         watchlist: true,
    //     },

    // ]

    // //watchlistStates aren't being used for handling current watchlist being watched so delete later

    // let watchlistsStateContent = [];

    // const watchlistsStateContentMap = watchlists.map((watchlist) => {
    //     watchlistsStateContent.push({
    //         disabled: false,
    //         value: "",
    //     });
    // });

    // const [watchlistsState, setWatchlistsState] = useState(watchlistsStateContent);

    // function handleWatchlist(i) {
    //     const updateWatchlistInState = watchlistsState.map((watchliststate, index) => {
    //         if ( i === index) {
    //             const newwatchliststate = {
    //                 ...watchliststate,
    //                 disabled: !watchliststate.disabled,
    //             };
    //             return newwatchliststate;
                
    //         } else {
    //             return watchliststate;

    //         }

    //     });
    //     setWatchlistsState(updateWatchlistInState)
    // }

    // function handleScrollSnap(i, value) {
    //     const updateWatchlistInState = watchlistsState.map((watchliststate, index) => {
    //         if ( i === index) {
    //             const newwatchliststate = {
    //                 ...watchliststate,
    //                 value: value,
    //             };
    //             return newwatchliststate;
                
    //         } else {
    //             return watchliststate;

    //         }

    //     });
    //     setWatchlistsState(updateWatchlistInState)
    // }

    // useEffect(() => {
    //     console.log(watchlistsState);
    // }, [watchlistsState]);


    //Bottom: Refactor This 

    // const svgTARef1 = useRef()
    // const taRef1 = useRef(null);
    // const activeTARefs = useRef([]);
    // activeTARefs.current = [];

    // const addToTARefs = (e) => {
    //     if(e && !activeTARefs.current.includes(e)) {
    //         activeTARefs.push(e)
    //     }
    // }


    //takes in the current stateHistoricalPrice and the earliestDate provided from the user to see if the state has that date
    const updatedDatesHelper = (earliestDate) => {
        console.log(historicalPrice)
        console.log(earliestDate)
        let range = historicalPrice[0].map(({date}) => console.log(date))

        //if we don't have that date in the range run and return the updated state
        if(!range.includes(earliestDate)){
            //do not runf
            console.log('the range is false')
            console.log(range.includes(earliestDate))
            return false

            //setHistoricalPrice
        }
        //do nothing and return the current state
        else{

            console.log('the date is in the range')
            return true
            //update the price
        }


    }
    //update chartData so that it can be used by the function outside of this scope
    const tickerHistoricalData = async (ticker, range) => {


        const historicalData = await dispatch(getHistoricalData({ticker, range})).then(res => {
            console.log(res)
            setStateHistoricalPrice([
                res.payload,
                ...stateHistoricalPrice
            ])
            return res.payload
        })

        console.log(historicalData)
        console.log(stateHistoricalPrice)
        
        return historicalData
    }
    
    //ToDo Later: TypeScript Implementation => function overload maybe?
    const tickerHistoricalDataRange = async(ticker, firstDay, lastDay, index) => {
        console.log(historicalPrice[0])
        console.log(markedDate)
        console.log(firstDay)
        console.log(lastDay)

        const historicalData = await dispatch(getSpecificHistoricalDataRange({ticker, firstDay, lastDay, index}))
        
        .then(res => {
            console.log(res.payload)
            // let data = res.payload.reverse();
            // setStateHistoricalPrice([
            //     res.payload,
            //     ...stateHistoricalPrice
            // ])
            // res.payload.map(data => {
            //     setStateHistoricalPrice([
            //         data,
            //         ...stateHistoricalPrice[index]
            //     ])
            // })
            // let data = res.payload.reverse().map((data, key) => {
            //     console.log(data)
            //     console.log(data.priceDate)
            //     setStateHistoricalPrice([
            //         data,
            //         ...stateHistoricalPrice
            //     ])
                
            // })
            //passed the current object(price, date, etc)
            //loop through the historicalPrice array to see if it is in there
            // let dayIsInState = (day) => {
            //     console.log(day.priceDate)
            //     historicalPrice[0].some(object => {
            //         console.log(object.priceDate)

            //         if(object.priceDate === day.priceDate){
            //             console.log("true")
            //             return true;
            //         }
            //         else {
            //             console.log("false")
            //             setStateHistoricalPrice([
            //                 day,
            //                 ...stateHistoricalPrice
            //             ])
            //             return false;
            //         }

            //     })
            // }
            // res.payload.map((day, key) => {
            //     console.log(day)
            //     // if(historicalPrice[0].includes(day)){
            //         // historicalPrice[0].some(dayIsInState(day))

            //         dayIsInState(day)
            //         // console.log(historicalPrice[0].includes(day))
            //     // }
            //     // setStateHistoricalPrice([
            //     //     day,
            //     //     ...stateHistoricalPrice
            //     // ])

            // })
            console.log(res.payload)
            
            return res.payload
        })
        console.log(historicalData)
        return historicalData
    }


    // const chart = CandlestickChart(listDa
    
    // fetches the tickers in the list
    const listData = async () => {

        //grab all the lists and their tickers

        // let range = '1m'
        let range = rangeSelector.fixedRange
        console.log(range)


        
        //this will grab the historical data of each ticker in the first list
        const data = list.map((ticker) => {
            console.log(ticker)
            tickerHistoricalData(ticker, range)

        })

        

        return data
        // setStateHistoricalPrice()



    }

    //first check if the range is a fixedRange(1d, 1w, 1m, 1y, etc) or custom(user inputted dates)
    //generate data based on the user's selection
    const listData1 = async (rangeSelector) => {
        console.log(rangeSelector.currentSelector)        
        //call the normal(change to fixed later) getHistoricalData
        if(rangeSelector.currentSelector === 'fixedRange'){
            console.log(rangeSelector)
            const data = list.map((ticker) => {
                console.log(ticker)
                return tickerHistoricalData(ticker, rangeSelector.fixedRange).then(res => {
                    console.log(res)
                    setCurrentDateCounter(res[0].date)
                })
    
            })
            console.log(data)
            return data

        }

        //call getSpecificHistoricalDataRange
        else if(rangeSelector.currentSelector === 'customRange'){
            console.log(rangeSelector)
            const data = list.map((ticker) => {
                console.log(ticker)
                return tickerHistoricalDataRange(ticker, rangeSelector.firstDay, rangeSelector.lastDay).then(res => {
                    console.log(res)
                    setCurrentDateCounter(res[0].date)
                })
            })
            console.log(data)
            return data
            // const data = dispatch(getSpecificHistoricalDataRange(selector.firstDay, selector.lastDay))

        }
    }
    

    //To have both the two symbol scale properly on one chart, we must create a Y axis for both symbols.
    //Simple, take the absolute range of the two
    //Another is 0 to the highest range
    //the function will take an array of chartObjects to create multiple lines

    const multiChartHL = ({chartObjects}) => {
        //Iterate through the array of chartObjects
        //Math.max the chartHigh
        //Math.min the chartLow
        //Return a new chartHigh and chartLow

    }

    /** 
     * Function 0 to generate the charts(takes in view variable(line/candlestick))
     * 
     *  Function 1 to generate the X/Y axis - Returns svg.node
     *      chartDomainRange
     * 
     *  Function 2 to generate the lines(takes in svg.node containing the chart) - returns svg.node with chart & line
     * 
     *      Line or Candlestick function
     * 
     * 
     *  Returns svg.node generated from function 2
     *      
    */

    const chartDomainRange = (chartObject) => {
        let X = d3.map(chartObject.chartDate, x => x)
        // let Yo = d3.map(chartOpen, x => x);
        const Y = d3.map(chartObject.chartClose, x => x);

        const I = d3.range(X[0].length);
        const xFormat = "%b %d";
        const yFormat = "~f";


        const strokeLinejoin = "round"; // stroke line join of the line
        const strokeWidth = 1.5; // stroke width of line, in pixels
        const strokeOpacity = 1; // stroke opacity of line
        let defined = (d, i) =>  !isNaN(X[0][i]) && !isNaN(Y[0][i]);

        const D = chartObject.chartDate[0].map((data, index) => defined(data, index));
        let title = 'AAPL'
        const symbol = list[0]
        // console.log(chartData)
        // console.log(defined)
        // console.log(defined([0, 1, 2, 3, 4]))
        console.log(D)


        const marginTop = 80;
        const marginRight = 50;
        const marginBottom = 80;
        const marginLeft = 60;
        const width = '100%';
        const height = '100%';
        const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
        let weekdays = (start, stop) => {
            d3.utcDays(start, stop)
        }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

        const minDay = new Date(d3.min(chartObject.chartDate[0]))
        const maxDay = new Date(d3.max(chartObject.chartDate[0]))

        const xTicks = weeks(d3.min(chartObject.chartDate[0]), d3.max(chartObject.chartDate[0]), 2);

        const xPadding = 0.2;
        const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        const xRange = [marginLeft, width - marginRight];
        const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);

        const yDomain = [(d3.min(Y[0])*.6), (d3.max(Y[0])*1.2)];
        const yRange = [height - marginBottom, marginTop];

        const yLabel = "Price $";
        const yType = d3.scaleLinear;

        const stroke = "currentColor";
        const strokeLinecap = "round";
        const color = "#a11616";

        if(title === undefined) {
            const formatData = d3.utcFormat("%B %-d, %Y");
            const formatValue = d3.format(".2f");
            const formatChange = (f => (y0, y1) => f((y1 - y0) / y0))(d3.format("+.2%"));
            title = i => `${formatData(X[i])}
        Close: ${formatValue(Y[i])} (${formatChange(Y[i])})`
        } else if (title !== null) {
            const T = d3.map(title, title => title);
            title = i => T[i];
        }

        const yScale = yType(yDomain, yRange)
        const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);

        const svg = d3.select(svgRef.current)
            // .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("fill", "cream")
            .attr("fill_opacity", "1")
            .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
            // .style('position', 'relative')
            // .join('path')

        svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white")

        svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .style("font-size", "12px")
        .call(xAxis)
        .call(g => g.select(".domain").remove());

        //Title
        d3.select("svg")
        // .append("rect")
        // .attr("fill", "yellow")
        .append("text")
        .attr("transform", `translate(${width/2}, ${marginTop})`)
        .style("font-size", "64px")
        .style("font-color", "black")
        .text(symbol)        
        //Y Axis Price Scale Label
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .style("font-size", "18px")
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("stroke-opacity", 0.2)
                .attr("x2", width - marginLeft - marginRight))
                
        //Y Axis Label    
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", marginTop)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .style("font-size", "28px")
            .text(yLabel));


        const tooltip = d3.select('#svgEle')
        .append('g')
        .data(I)
        .style('visibility','hidden')
        .style("z-index", "10")
        // .style('position','relative')
        .style('background-color','red')
        .append("g")
            .append("textArea")
            .style('position','absolute')
            .attr("disabled", true)        

        return svg.node;
    }

    const LineChart = (chartObject) => {
        console.log(chartObject)

        let X = d3.map(chartObject.chartDate[0], x => x)
        console.log(X)
        // let Yo = d3.map(chartOpen, x => x);
        const Y = d3.map(chartObject.chartClose[0], x => x);
        console.log(Y)
        // const Yh = d3.map(chartHigh, x => x);
        // const Yl = d3.map(chartLow, x => x);

        const I = d3.range(X.length);
        console.log(I)
        const xFormat = "%b %d";
        const yFormat = "~f";


        const strokeLinejoin = "round"; // stroke line join of the line
        const strokeWidth = 1.5; // stroke width of line, in pixels
        const strokeOpacity = 1; // stroke opacity of line
        let defined = (d, i) =>  !isNaN(X[0][i]) && !isNaN(Y[0][i]);
        
        // const D = d3.map(chartDate, (d, i) => defined(d, i));
        // const D = chartObject.chartDate[0].map((data, index) => defined(data, index));
        let title = 'AAPL'
        // console.log(D)


        const marginTop = 80;
        const marginRight = 50;
        const marginBottom = 80;
        const marginLeft = 60;
        const width = 80;
        const height = 800;
        const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
        let weekdays = (start, stop) => {
            d3.utcDays(start, stop).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

        const minDay = new Date(d3.min(chartObject.chartDate[0]))
        const maxDay = new Date(d3.max(chartObject.chartDate[0]))

        // const xTicks = weekdays(d3.min(chartObject.chartDate[0]), d3.max(chartObject.chartDate[0]), 2);

        const xPadding = 0.2;
        // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        const xDomain = X;
        const xRange = [marginLeft, width - marginRight];
        // const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        const xScale = d3.scaleBand(xRange).domain(xDomain).range(xRange).padding(xPadding);
        
        // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
        const xAxis = d3.axisBottom(xScale)//.tickFormat(xFormat);//.tickValues(xTicks)

        console.log(xScale)
        console.log(xAxis)

        const yDomain = [(d3.min(Y)*.9), (d3.max(Y)*1.1)];
        console.log(yDomain)
        // const yDomain = [100,500];

        const yRange = [height - marginBottom, marginTop];

        const yLabel = "Price $";
        const yType = d3.scaleLinear;
        const curve = d3.curveLinear;
        const stroke = "currentColor";
        const strokeLinecap = "round";
        const color = "#a11616";

        if(title === undefined) {
            const formatData = d3.utcFormat("%B %-d, %Y");
            const formatValue = d3.format(".2f");
            const formatChange = (f => (y0, y1) => f((y1 - y0) / y0))(d3.format("+.2%"));
            title = i => `${formatData(X[i])}
        Close: ${formatValue(Y[i])} (${formatChange(Y[i])})`
        } else if (title !== null) {
            const T = d3.map(title, title => title);
            title = i => T[i];
        }

        const yScale = yType(yDomain, yRange)
        const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);


        // Construct a line generator.

    
        svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        // const tooltip = d3.select('#svgEle')
        //     .append('g')
        //     .data(I)
        //     .style('visibility','hidden')
        //     .style("z-index", "10")
        //     .style('position','absolute')
        //     .style('background-color','red')
        //     .append("g")
        //         .append("textArea")
        //         .style('position','absolute')
        //         .attr("disabled", true)

        const line = d3.line()
            // .defined(i => D[i])
            .curve(curve)
            
            .x(i => xScale(X[i]))
            // .y(450)
            .y(i => yScale(Y[i]));

        // console.log(`${D.length} || ${X.length} || ${Y.length}`)
        // console.log(D)
        console.log(X)
        console.log(Y)

        console.log(line(I))

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis);
    
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(yLabel));
    
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .attr("d", line(I));

        const g = svg.append("g")
            .attr("stroke", stroke)
            .attr("stroke-linecap", strokeLinecap)
        .selectAll("g")
        .data(I)
        .join("g")
                .attr("transform", i => `translate(${xScale(X[i])},0)`)
                
        // g.append("line")
        //     .attr("y1", i => yScale(marginBottom))
        //     .attr("y2", i => yScale(height))
        //     .attr("stroke-width", strokeWidth)
        //     // .style("visibility", "hidden")
        //     .style("opacity", "0")
        //     .on('mouseover', (e,d)=> {
        //         console.log(e)
        //         console.log(d)
        //         console.log(Y[0][d])
        //         tooltip.style('visibility', 'visible')
        //             .style("opacity", "1")
        //             .text(`
        //             Price: ${Y[0][d]}`)
        //             .attr("disabled", true)
        //             .style("height", "120px")
        //             .style("width", "auto")
        //             .style("resize", "none")
    
        //     })
            
        return svg.node();
            // svgRef.current = svg;
            // return svgRef.current;
    }

    const CandlestickChart = async(chartObject, taCharts) => {
        console.log(taCharts)
        console.log(historicalPrice)
        console.log(macdValues)
        console.log(rsiValues)
        
        const xFormat = "%m-%d-%y";
        const yFormat = "~f";
        const title = 'AAPL';
        // console.log(index)
        // console.log(chartObjectData[index])

        let chartData = chartObject
    
        console.log(chartObject)
        console.log(chartObject.chartDate)
        console.log(chartObject.chartDate[0])
        
        // console.log(symbol)
        const symbol = list[0]
        console.log(symbol)
        //sets up the image h, w, and margins
        const containerSize = document.querySelector(".ChartContainer").getBoundingClientRect()
        const width = containerSize.width * .95;
        const height = containerSize.height * (.95 - (.15 * activeTACharts.length));
        const marginTop = 50;
        const marginRight = 50;
        const marginBottom = 50;
        const marginLeft = 50;

        // const width = "100%";
        // const height = "100%";
        // const marginTop = "8%";
        // const marginRight = "5%";
        // const marginBottom = "8%";
        // const marginLeft = "6%";

    
    
        //generates the OHLC 
        let X = d3.map(chartObject.chartDate[0], x => {
            // let isoFormat = d3.utcParse("%a %B %d %Y")
            // console.log(isoFormat(x))
            // let formattedDate = d3.utcFormat("%m-%d-%y")
            // console.log(formattedDate(new Date(localizedDate)))
            console.log(x)
            // console.log(Date.getUTCDay(x))
            return x
        });
        const Yo = d3.map(chartObject.chartOpen[0], x => x);
        const Yc = d3.map(chartObject.chartClose[0], x => x);
        const Yh = d3.map(chartObject.chartHigh[0], x => x);
        const Yl = d3.map(chartObject.chartLow[0], x => x);

    
        //I is the index we are using for the chart object
        const I = d3.range(X.length);
        console.log(I)

        console.log(X)

        console.log(Yo)
        console.log(Yc)
        console.log(Yh)
        console.log(Yl)

        //sets up the domain of the chart 
    
        const minDay = new Date(d3.min(X));
        const maxDay = new Date(d3.max(X));
        console.log(minDay)
    
        // this is the sets the domain in terms of days
        const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
        // const weekdays = (start, stop) => {
        //     d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        // }
        // const weekdays = (start, stop) => {
        //     return d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);
        // }
        const weekdays = (start, stop) => {
            return d3.utcDay.range(start, +stop + 1)
            .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
            // .range([marginLeft, width - marginRight])
        }

        // const weekdays = (start, stop) => d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);
    
        // let xDomain, yDomain, xTicks;
        // if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
        // if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
        // if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);

        //sets up the x axis line and scale
        // const xTicks = weeks(d3.min(X), d3.max(X), 1);
        const xTicks = X
        
        const xPadding = 0.2;
        // const xDomain = weekdays(minDay, maxDay)
        // const xDomain = weeks(minDay, maxDay, 1)
        const xDomain = X
        //this is the monthly/every 4 weeks
        console.log(weeks(minDay, maxDay, 4))
        console.log(xDomain)

        //this is the weekly/every 1 weeks
        console.log(weeks(minDay, maxDay, 1))
        console.log(weekdays(minDay, maxDay))
        let xTicksValues = d3.utcMonday.range(minDay, maxDay).map(day => {
            console.log(day)
            // console.log(day.close)
            // console.log(day.priceDate)
            
            let localizedDate = day
            console.log(`${localizedDate} || ${d3.utcFormat(new Date(localizedDate))}`)
            // console.log()
            let formattedDate = d3.utcFormat("%m-%d-%y")
            console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
            // return new Date(day.date)
        })

        console.log(xTicksValues)

        // const xDomain = X
        // console.log(xTicks)
        // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)

        const xRange = [marginLeft, width - marginRight];
        const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        // const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding)
        // const xAxis = d3.axisBottom(xScale).ticks(d3.utcMonday.every(4).range(minDay, maxDay))//.tickValues(d3.utcMonday.every(width > 720 ? 1 : 2).range(xTicks))//.tickFormat(xFormat)
        const xAxis = d3.axisBottom(xScale).tickValues(xTicksValues)//.tickValues(d3.utcMonday.every(width > 720 ? 1 : 2).range(xTicks))//.tickFormat(xFormat)
        console.log(xScale)
        console.log(xDomain)
        // console.log(d3.domain(xDomain))
    
        // console.log(xScale)
        //sets up the y axis line and scale
        const yDomain = [(d3.min(Yl)*.9), (d3.max(Yh)*1.1)];
        // const yDomain = [100,500];
        const yRange = [height - marginBottom, marginTop];
        const yLabel = "Price $";
        const yType = d3.scaleLinear;
        const yScale = yType(yDomain, yRange);
        const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);
    
        // console.log(d3.utcMonday.range(minDay, maxDay))


        console.log(yDomain);
        //sets up the line used for the candlestick
        const stroke = "currentColor";
        const strokeLinecap = "round";
        const colors = ["#9ECD6F", "#49464E", "#F85E84"];
    
    
        // generate the chart using the stated variables to the ref
        const svg = d3.select(svgRef.current)
            // .append("svg")
        // svg.append("g")
            
            .attr("width", width)
            .attr("height", containerSize.height * .95)
            .attr("viewBox", [0, 0, width, (containerSize.height * .95)])
            .attr("class", "svg chart")
            // .attr("viewBox", [0, 0, width, height])
            // .attr("fill", "cream")
            // .attr("fill_opacity", "0")
            // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
            // .style('position', 'relative')
            // .join('path')
        const svgGroup = svg.append("g")

        svgGroup.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "svg main chart")
        
        // .attr("width", "100%")
        // .attr("height", "100%")
        // .attr("fill", "#2D2A2E")
        .attr("fill", "white")
        // .data(I)
        // .attr("x-axis track", i => console.log(i))
        // .on('mouseover', (e,d, i)=> {
        //     // data(I)
        //         // console.log(e)
        //         // console.log(d)
        //         // console.log(i)
                
        //         // console.log(Yl[0][d])
        //         // console.log(Yh[0][d])
        //         // console.log(Yo[0][d])
        //         // console.log(Yc[0][d])
        //     tooltip.style('visibility', 'visible')
        //         .text(`Open: ${Yo[0][d]}
        //         High: ${Yh[0][d]}
        //         Low: ${Yl[0][d]}
        //         Close: ${Yc[0][d]}`)
        //         .attr("disabled", true)
        //         .style("height", "120px")
        //         .style("width", "auto")
        //         .style("resize", "none")
        // })
        
        
        const tooltip = svgGroup.append('g')
        .append('text')
        // .append('rect')
        .attr("class", "tooltip")
        .attr('fill', 'green')
        .attr('transform', `translate(0, ${marginTop})`)
        // .data(I)
        .style('visibility','hidden')
        
        const tooltipText = tooltip.append('g')
            // .text(`Open: test
            // High: test
            // Low: test
            // Close: test`)
        // .on('mouseover', (e,d)=> {
        //     console.log(e)
        //     console.log(d)
        
        //     console.log(Yl[d])
        //     console.log(Yh[d])
        //     console.log(Yo[d])
        //     console.log(Yc[d])
        //     tooltip.style('visibility', 'visible')
        //         .style("opacity", "1")
        //         .text(`Open: ${Yo[d]}
        //         High: ${Yh[d]}
        //         Low: ${Yl[d]}
        //         Close: ${Yc[d]}`)
        //         .attr("disabled", true)
        //         .style("height", "120px")
        //         .style("width", "auto")
        //         .style("resize", "none")
        
        // })
        // .style("z-index", "10")
        // .style('position','relative')
        // .style('background-color','red')
        // .append("text")
        //     .text(`Open: ${Yo[I]}`)
        // .append("text")
        //     .text(`High: ${Yh[I]}`)
        // .append("text")
        //     .text(`Low: ${Yl[I]}`)
        // .append("text")
        //     .text(`Close: ${Yc[I]}`)
        // .append("g")
        //     .append("textArea")
        //     .style('position','absolute')
        //     .attr("disabled", true)
        //                 .text(`Open: ${Yo[0][1]}
        // High: ${Yh[0 ][1]}
        // Low: ${Yl[0][1]}
        // Close: ${Yc[0][1]}`)
            // .style("height", "200px")
            // .style("width", "auto")
            // .style("resize", "none")
        
        //X Axis Date Scale
        console.log(containerSize.height * (.95 - (.15 * activeTACharts.length)))
        svgGroup.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        // .attr("transform", "translate(0," + (containerSize.height * (.95-(.15*activeTACharts.length))) + " )")
        //containerSize.height * (.95 - (.15 * activeTACharts.length)
        .style("font-size", "12px")
        .call(xAxis)
        .call(g => g.select(".domain").remove());

        // svg.append("g")
        //     .attr("width","10%")
        //     .attr("height","10%")
        //     .attr("transform", `translate(${width/2})`)

        //     .call(g => g.append("text")
        //         .attr("text-anchor", "start")
        //         .style("font-size", "64px")
        //         .style("font-color", "black")
        //         .text(symbol)
                
        //     )

        //Title
        d3.select("svg")
        // .append("rect")
        // .attr("fill", "yellow")
        .append("text")
        .attr("transform", `translate(${width/2}, ${marginTop})`)
        .style("font-size", "64px")
        .style("font-color", "black")
        .text(symbol)
            

        //Y Axis Price Scale Label
        svgGroup.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .style("font-size", "18px")
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("stroke-opacity", 0.2)
                .attr("x2", width - marginLeft - marginRight))
                
            //Y Axis Label    
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", marginTop)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .style("font-size", "28px")
                .text(yLabel));
        
        //X Axis for candlesticks
        const g = svgGroup.append("g")
            // .attr("transform", `translate(${marginLeft}, ${marginBottom})`)
            .attr("transform", `translate(6, ${marginBottom})`)
            .attr("stroke", stroke)
            // .attr("font-color", "red")
            .attr("stroke-linecap", strokeLinecap)
        .selectAll("g")
        .data(I)
        .join("g")
            .attr("transform", i => `translate(${xScale(X[i])},0)`)

            console.log(I)

        // const xScaleArr = [xScaleComplete]
        const xScaleComplete = X.map(x => {
            console.log(x)
            return xScale(X[x])
        })
        // console.log(xScaleArr)

        console.log(xScale(X))
        console.log(xScale(X[2]))
        console.log(xScale(X[3]))
        console.log(xScale(X[4]))
        console.log(X)
        console.log(X[1])
        // console.log(X[0][1])
        console.log(Yl[1])
        // console.log(Yl[0][1])
        
        //Y Axis Candlesticks: Low High Stick
        g.append("line")
        .attr("y1", i => yScale(Yl[i]))
        .attr("y2", i => yScale(Yh[i]));
        
        //Y Axis Candlesticks: Open Close Candle
        g.append("line")
        .attr("y1", i => yScale(Yo[i]))
        .attr("y2", i => yScale(Yc[i]))
        .attr("stroke-width", (xScale.bandwidth()/2))
        .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);

        // console.log(rsiHelper1(chartObject, 0))
        // let rsi = rsiHelper1(chartObject, 0);
        console.log(rsiValues)
        console.log(rsiValues.rsi_value_arr)
        console.log(macdValues.macd_value_arr)
        
        //X Axis Line interface()
        g.append("line")
        .attr("class", "chartCursor")
        .attr("y1", i => yScale(marginBottom))
        .attr("y2", i => yScale(height))
        .attr("stroke-width", xScale.bandwidth())
        // .style("visibility", "hidden")
        .style("opacity", "0")
        .on('mouseover', (e,d)=> {
            console.log(e)
            console.log(d)
        
            console.log(Yl[d])
            console.log(Yh[d])
            console.log(Yo[d])
            console.log(Yc[d])
            // tooltip.append("rect")
            //     .attr('fill', 'green')

            tooltip.style('visibility', 'visible')
                .style("opacity", "1")
                // .style('background', 'yellow')
                // .style("fill", "green")
                // .text(`Open: ${Yo[d]}
                // High: ${Yh[d]}
                // Low: ${Yl[d]}
                // Close: ${Yc[d]}`)
                .attr("disabled", true)
                .style("height", "120px")
                .style("width", "120px")
                .style("resize", "none")
            // tooltip.append('text')
                .text(`Open: ${Yo[d]}
                High: ${Yh[d]}
                Low: ${Yl[d]}
                Close: ${Yc[d]}`)

            d3.select('.rsi-tooltip')
                .attr('transform', `translate(0, ${height+50})`)
                .style('visibility', 'visible')
                .style('z-index', '10')
                .text(`RSI Value: ${rsiValues.rsi_value_arr[d]}`)
            d3.select('.macd-tooltip')
                .attr('transform', `translate(0, ${height+250})`)
                .style('visibility', 'visible')
                .style('z-index', '11')
                .text(`MACD Value: ${macdValues.macd_value_arr[d]}`)

        
        })

        // console.log(rsiHelper1(chartObject, 0))

        // console.log(d3.select('.rsi-tooltip'))


        
        console.log(svg.node())

        return svg.node();
    }

    // uses longestPeriod & selectedPeriod to decide what range of the historicalPrice to use
    //ignores data since we will reference the state

    //ie: 29 days (longestPeriod) aka (days before markedDate)
    //14 day rsi is the selectedPeriod
    // 29 - 14 = 15 days | longestPeriod - selectedPeriod
    //historicalPrice.slice(15 days)
    const chartObjectHelper2 = async(longestPeriod, selectedPeriod) => {
        console.log(longestPeriod)
        console.log(selectedPeriod)
        let startPeriod = longestPeriod - selectedPeriod
        console.log(historicalPrice[0])
        let chartData = historicalPrice[0].slice(startPeriod)
        console.log(chartData)



        // console.log(chartData.slice(0,13))
        // console.log(chartData.slice(14, chartData.length))


        // core.historicalPrice.map(index => {
        // let chartDate = [chartData.map(day => {
        //     let temp_date = new Date(day.date).toISOString()
        //     return temp_date
        // })]
        let chartDate = [chartData.map(day => {
            console.log(day)
            console.log(day.close)
            console.log(day.priceDate)
            
            let localizedDate = day.priceDate + ' PDT'
            console.log(`${localizedDate} || ${d3.utcFormat(new Date(localizedDate))}`)
            // console.log()
            let formattedDate = d3.utcFormat("%m-%d-%y")
            console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
            // return new Date(day.date)
        })]
        console.log(chartDate)
        let chartOpen = [chartData.map(day => {return day.open})]
        console.log(chartOpen)
        let chartClose = [chartData.map(day => {return day.close})]
        console.log(chartClose)
        let chartHigh = [chartData.map(day => {return day.low})]
        console.log(chartHigh)
        let chartLow = [chartData.map(day => {return day.high})]
        console.log(chartLow)
        let chartSymbol = [chartData.map(day => {return day.symbol})]
        // console.log(chartLow)
        let chartObject = {
            chartDate,
            chartOpen,
            chartClose,
            chartHigh,
            chartLow,
            chartSymbol
        }
        console.log(chartObject)
        // console.log(chartObjectData)

        // chartObjectData.push({chartObject})
        return chartObject


    }



    //allows use to pass a different data to it, which allows us to create a different chart based on the data
    const chartObjectHelper1 = async(data) => {
        //generate the tickerList's historical data for each ticker using listData and historicalTickerPrice.
        

        // let taData = historicalData.splice(0,13)
        // let chartData = historicalData.slice(13, historicalData.length)
        let chartData = data[0]
        console.log(chartData)



        // console.log(chartData.slice(0,13))
        // console.log(chartData.slice(14, chartData.length))


        // core.historicalPrice.map(index => {
        // let chartDate = [chartData.map(day => {
        //     let temp_date = new Date(day.date).toISOString()
        //     return temp_date
        // })]
        let chartDate = [chartData.map(day => {
            console.log(day)
            console.log(day.close)
            console.log(day.priceDate)
            
            let localizedDate = day.priceDate + ' PDT'
            console.log(`${localizedDate} || ${d3.utcFormat(new Date(localizedDate))}`)
            // console.log()
            let formattedDate = d3.utcFormat("%m-%d-%y")
            console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
            // return new Date(day.date)
        })]
        console.log(chartDate)
        let chartOpen = [chartData.map(day => {return day.open})]
        console.log(chartOpen)
        let chartClose = [chartData.map(day => {return day.close})]
        console.log(chartClose)
        let chartHigh = [chartData.map(day => {return day.low})]
        console.log(chartHigh)
        let chartLow = [chartData.map(day => {return day.high})]
        console.log(chartLow)
        let chartSymbol = [chartData.map(day => {return day.symbol})]
        // console.log(chartLow)
        let chartObject = {
            chartDate,
            chartOpen,
            chartClose,
            chartHigh,
            chartLow,
            chartSymbol
        }
        console.log(chartObject)
        // console.log(chartObjectData)

        // chartObjectData.push({chartObject})
        return chartObject

        // chartDataArray.push({chartObject})
        // return chartObjectData

        
        
        // returns or runs the CandlestickChart function to generate the svg image for the div
    }


    //how to refactor it?
    //we want to compare the longest period and add that to the starting position

    const chartObjectHelper = async() => {
        //generate the tickerList's historical data for each ticker using listData and historicalTickerPrice.
        

        // let taData = historicalData.splice(0,13)
        // let chartData = historicalData.slice(13, historicalData.length)
        let chartData = historicalPrice[0]
        console.log(chartData)



        // console.log(chartData.slice(0,13))
        // console.log(chartData.slice(14, chartData.length))


        // core.historicalPrice.map(index => {
        // let chartDate = [chartData.map(day => {
        //     let temp_date = new Date(day.date).toISOString()
        //     return temp_date
        // })]
        let chartDate = [chartData.map(day => {
            console.log(day)
            console.log(day.close)
            let localizedDate = day.priceDate + ' PDT'
            console.log(`${localizedDate} || ${d3.utcFormat(new Date(localizedDate))}`)
            // console.log()
            let formattedDate = d3.utcFormat("%m-%d-%y")
            console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
            // return new Date(day.date)
        })]
        console.log(chartDate)
        let chartOpen = [chartData.map(day => {return day.open})]
        console.log(chartOpen)
        let chartClose = [chartData.map(day => {return day.close})]
        console.log(chartClose)
        let chartHigh = [chartData.map(day => {return day.low})]
        console.log(chartHigh)
        let chartLow = [chartData.map(day => {return day.high})]
        console.log(chartLow)
        let chartSymbol = [chartData.map(day => {return day.symbol})]
        // console.log(chartLow)
        let chartObject = {
            chartDate,
            chartOpen,
            chartClose,
            chartHigh,
            chartLow,
            chartSymbol
        }
        console.log(chartObject)
        // console.log(chartObjectData)

        // chartObjectData.push({chartObject})
        return chartObject

        // chartDataArray.push({chartObject})
        // return chartObjectData

        
        
        // returns or runs the CandlestickChart function to generate the svg image for the div
    }

    //helper functions calls the function that creates the charts
    const svgHelper = async(viewSelector, index, longestPeriod) => {
        // chartObjectHelper(index)
        console.log(historicalPrice)
        console.log(activeTACharts.length)
        console.log(longestPeriod)
        if(historicalPrice.length > 0){
            let temp = await chartObjectHelper2(longestPeriod, 0)
            console.log(temp)

            // let svgObject
            console.log(viewSelector)
            if(viewSelector === "candlestick"){
                console.log(viewSelector)
                return CandlestickChart(temp, activeTACharts.length);
            }
            else if(viewSelector === "line"){
                console.log(viewSelector)
                return LineChart(temp)
            }
            else{
                return CandlestickChart(temp, activeTACharts.length)
            }
        }


        //Create a function to clear our the svg

        //Create a function to package together the chartObjects

    }

    //helper functions calls the function that creates the charts
    const svgTAHelper = (type, index) => {
        // let temp = await taHelper(historicalPrice[0])
        // console.log(temp)
        console.log(historicalPrice)
        if(historicalPrice[0] !== undefined){
            let temp = chartObjectHelper(historicalPrice[0]).then((object) => {
                console.log(object)
                if(type === "RSI"){
                    // console.log(viewSelector)
                    // console.log(rsiHelper1(object, 0))
                    return rsiHelper1(object, 0).then(rsi_values => {
                        console.log(rsi_values)
                        rsiChartHelper(rsi_values).then((svg) => {
                            console.log(svg)
                            activeTARefs.current.push(svg)
                            console.log(activeTARefs)
                            console.log(activeTARefs.current)
                            setIsChartLoading(false)
                            // setActiveTACharts([
                            //     ...activeTACharts,
                            //     'RSI'
                            // ])
                            // setActiveTACharts(['RSI'])
                            console.log(activeTACharts)
                            return svg
                        })
                        // .then((res) => {
                        //     console.log(res)
                        //     console.log(activeTARefs.current)
                        //     setIsChartLoading(false)
                        //     setActiveTACharts([
                        //         ...activeTACharts,
                        //         "RSI"
                        //     ])
                        //     console.log(activeTACharts)
                        //     return activeTACharts
                        // })
                    })
                }
                if(type === "MACD"){
                    // console.log(viewSelector)
                    return macdHelper1(object, 0).then(macd_values => {
                        console.log(macd_values)
                        macdChartHelper(macd_values).then((svg) => {
                            console.log(svg)
                            activeTARefs.current.push(svg)
                            console.log(activeTARefs)
                            console.log(activeTARefs.current)
                            setIsChartLoading(false)
                            // setActiveTACharts([
                            //     ...activeTACharts,
                            //     'MACD'
                            // ])
                            // setActiveTACharts(['macd'])
                            console.log(activeTACharts)
                            return svg
                        })
                        // .then((res) => {
                        //     console.log(res)
                        //     console.log(activeTARefs.current)
                        //     setIsChartLoading(false)
                        //     setActiveTACharts([
                        //         ...activeTACharts,
                        //         "MACD"
                        //     ])
                        //     console.log(activeTACharts)
                        //     return activeTACharts
                        // })
                    })
                }
            })
            console.log(temp)
            console.log(activeTACharts)

            // let svgObject
            // console.log(viewSelector)

        }

    }
    const svgTAHelper1 = (data, type, index) => {
        // let temp = await taHelper(historicalPrice[0])
        // console.log(temp)
        console.log(data)
        console.log(activeTACharts.length)
        if(data !== undefined){
            let temp = chartObjectHelper1(data).then((object) => {
                console.log(object)
                if(type === "RSI"){
                    // console.log(viewSelector)
                    // console.log(rsiHelper1(object, 0))
                    return rsiHelper1(object, 0).then(rsi_values => {
                        console.log(rsi_values)
                        rsiChartHelper(rsi_values).then((svg) => {
                            console.log(svg)
                            activeTARefs.current.push(svg)
                            console.log(activeTARefs)
                            console.log(activeTARefs.current)
                            setIsChartLoading(false)
                            // setActiveTACharts([
                            //     ...activeTACharts,
                            //     'RSI'
                            // ])
                            // setActiveTACharts(['RSI'])
                            console.log(activeTACharts)
                            return svg
                        })
                        // .then((res) => {
                        //     console.log(res)
                        //     console.log(activeTARefs.current)
                        //     setIsChartLoading(false)
                        //     setActiveTACharts([
                        //         ...activeTACharts,
                        //         "RSI"
                        //     ])
                        //     console.log(activeTACharts)
                        //     return activeTACharts
                        // })
                    })
                }
                if(type === "MACD"){
                    // console.log(viewSelector)
                    return macdHelper1(object, 0).then(macd_values => {
                        console.log(macd_values)
                        macdChartHelper(macd_values).then((svg) => {
                            console.log(svg)
                            activeTARefs.current.push(svg)
                            console.log(activeTARefs)
                            console.log(activeTARefs.current)
                            setIsChartLoading(false)
                            // setActiveTACharts([
                            //     ...activeTACharts,
                            //     'MACD'
                            // ])
                            // setActiveTACharts(['macd'])
                            console.log(activeTACharts)
                            return svg
                        })
                        // .then((res) => {
                        //     console.log(res)
                        //     console.log(activeTARefs.current)
                        //     setIsChartLoading(false)
                        //     setActiveTACharts([
                        //         ...activeTACharts,
                        //         "MACD"
                        //     ])
                        //     console.log(activeTACharts)
                        //     return activeTACharts
                        // })
                    })
                }
            })
            console.log(temp)
            console.log(activeTACharts)

            // let svgObject
            // console.log(viewSelector)

        }

    }
    // rsiHelper/macdHelper returns the svg of the type of chart
    // let svgTaRef = useRef(null)
    // // const activeTACharts
    // let svgTA1;
    // let svgTARef1 = useRef(null)
    // let taRef1 = useRef(null);
    // let activeTARefs = useRef([]);

    //callback function for the button to load the data
    const svgTAHelperCallback = useCallback((type) => {
        // let temp = await taHelper(historicalPrice[0])
        // console.log(temp)
        console.log(historicalPrice)
        if(historicalPrice[0] !== undefined){
            let temp = chartObjectHelper(historicalPrice[0]).then((object) => {
                if(type === "RSI"){
                    // console.log(viewSelector)
                    // console.log(rsiHelper1(object, 0))
                    return rsiHelper1(object, 0).then(rsi_values => {
                        console.log(rsi_values)
                        rsiChartHelper(rsi_values).then((svg) => {
                            console.log(svg)
                            activeTARefs.current.push(svg)
                            console.log(activeTARefs.current)
                            console.log(activeTARefs.current)
                            setIsChartLoading(false)
                            // setActiveTACharts([
                            //     ...activeTACharts,
                            //     'RSI'
                            // ])
                            // setActiveTACharts(['RSI'])
                            console.log(activeTACharts)
                            return activeTACharts
                        })
                        // .then((res) => {
                        //     console.log(res)
                        //     console.log(activeTARefs.current)
                        //     setIsChartLoading(false)
                        //     setActiveTACharts([
                        //         ...activeTACharts,
                        //         "RSI"
                        //     ])
                        //     console.log(activeTACharts)
                        //     return activeTACharts
                        // })
                    })
                }
                else if(type === "MACD"){
                    // console.log(viewSelector)
                    return macdHelper1(object, 0)
                }
                else{
                    return CandlestickChart(object)
                }
            })
            console.log(temp)
            console.log(activeTACharts)

            // let svgObject
            // console.log(viewSelector)

        }

    }, [activeTARefs,svgTaRef, svgTARef1, svgTA1, taRef1, historicalPrice])

    const svgHelperCallback = useCallback((view, index) => {
        // setChartDataState((chartData) => [...chartData, "newChartData"])
        // let chartObject = chartObjectHelper(index)

        //removes the current view of the svg image
        d3.selectAll('line').remove();
        d3.selectAll('g').remove();
        d3.selectAll('path').remove();

        setViewSelector(view)
        console.log('svgHelper')

        //returns a svg.node
        const chartSvg = async(viewSelector, index) => {
            console.log(viewSelector)
            // let chartData = await chartObjectHelper(stateHistoricalPrice[index])

            // console.log(chartData)
            console.log(activeTACharts.length)
            console.log(stateHistoricalPrice[0])
            if(stateHistoricalPrice){
                console.log(stateHistoricalPrice[0])
                // console.log(chartObjectHelper(stateHistoricalPrice[0]))
                chartObjectHelper2(longestPeriod, 0).then((res) => {
                    console.log(res)
                    console.log(viewSelector)
                    if(viewSelector === "candlestick"){
                        console.log(viewSelector)
                        
        
                        //sets svgNode.current to the svg.node provided by the function
                        return CandlestickChart(res)
                        // return svgRef;
                    }
                    else if(viewSelector === "line"){
                        console.log(viewSelector)
                        //sets svgNode to the svg.node provided by the function
                        return LineChart(res)
                        // return svgRef;
                    }
                    else{
                        //sets svgNode to the svg.node provided by the function
                        return CandlestickChart(res)
                        // return svgRef;
                    }                
                }) 
            }
        
        }

        const currentSvg = async(view, index) => {
            return chartSvg(view, index)
        }
        
        // currentSvg(view, index)

        //generate the svg the svgRef.current with the selected view

        return currentSvg(view, index)


    }, [svgRef, longestPeriod, svg, viewSelector, activeTACharts])




    const taHelper = async() => {
        let chartData = historicalPrice[0];     
        console.log(chartData)  
        let chartDate = [chartData.map(day => {
            let localizedDate = day.priceDate + ' PDT'
            // format(new Date('yourUnixDateTime'), 'yyyyMMdd')
            console.log(`${localizedDate} || ${new Date(localizedDate)}`)
            // console.log()

            let formattedDate = d3.utcFormat("%m-%d-%y")
            console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
        })]
        // let chartDate = [chartData.map(day => {
        //     let localizedDate = day.date + ' PDT'
        //     console.log(`${localizedDate} || ${new Date(localizedDate)}`)
        //     // console.log()
        //     let formattedDate = d3.utcFormat("%m-%d-%y")
        //     console.log(formattedDate(new Date(localizedDate)))
        //     return formattedDate(new Date(localizedDate))
        // })]
        console.log(chartDate)
        let chartClose = [chartData.map(day => {return day.close})]
        let chartSymbol = [chartData.map(day => {return day.symbol})]
        let chartObject = {
            chartDate,
            chartClose,
            chartSymbol
        }
        return chartObject
    }


    const taHelperCallback = useCallback((index, type) =>  {
        console.log(svgRef)
        console.log(stateHistoricalPrice)

        // let taData = stateHistoricalPrice[index].splice(0,13)
        let chartData = stateHistoricalPrice[index]

        // console.log(taData)
        console.log(chartData)

        const taChartSVG = async() => {

            // let chartData = await taHelper(stateHistoricalPrice.payload);  

            taHelper(stateHistoricalPrice[index]).then((res) => {
                
                rsiHelper1(res, 0)
                // macdHelper(res)
                // smaHelper(res)
                // emaHelper(res)
            })

        }
        // taChartSVG

        // stateHistoricalPrice[index].map((index) => {
        //     console.log(stateHistoricalPrice)
        //     taHelper(index).then((res) => {
        //         console.log(res)
        //         rsiHelper(res)
        //         // macdHelper(res)
        //         // smaHelper(res)
        //         // emaHelper(res)
        //     })
        //     // taChartSVG(index)
        // })

        return taChartSVG()

    }, [svgTaRef, svgTA, stateHistoricalPrice])




    //need to add a chartObjectHelper
    // let previous_dates_array = [];
    //return
    const previousDatesHelper = (dates) => {
        console.log(dates)
        console.log(previousDates)
        
        let previous_dates_array = [];
        dates.map(day => {
            console.log(day)
            console.log(previous_dates_array)
            

            if(previousDates && previousDates.includes(day)) {
                //do nothing
                console.log(`${day} is in the array already`)
            }
            else{
                previous_dates_array.push(day)

            }
            
            

            // return previous_dates_array;
            // console.log(day)
        })

        //returns a blank array to not fetch any data
        if(previous_dates_array.length === 0){
            console.log(previous_dates_array)
            console.log(previousDates)
            return previous_dates_array;
        }

        //return the dates that are not  in the previousDates state
        //also changes the state to include the new dates that aren't in the previousDates state
        if(previous_dates_array.length > 0){
            // setPreviousDates([
            //     previous_dates_array,
            //     ...previousDates
            // ])
            let temp = previous_dates_array.concat(previousDates)
            let datesToFetch = temp.filter(x => !previousDates.includes(x))
            console.log(datesToFetch)
            setPreviousDates(temp)
            console.log(temp)

            return datesToFetch;

            
        }

        //previous_dates_array is the new dates to be added
        // return previous_dates_array

        
        
    }

    //when the activeTARefs are updated, rerender the svg associated with it in the specified index
    const taHelperCallback1 = useCallback((index, type) =>  {
        console.log(historicalPrice[0])

        // let previous_dates_array = [];

        const previous_dates = async(date, range) => {
            console.log(date)


            let temp_previous_dates_array = helpers.prevMarketData(historicalPrice[0].symbol, range, date)
            // temp_previous_dates_array.includes((day) => {
            //     console.log(day)
            //     if(previous_dates_array.some(day)){
            //         //the day is in the array so don't add
            //         console.log(`${day} is already in the array`)
            //     }
            //     else{
            //         previous_dates_array.push(day)
            //     }
            // })
            console.log(temp_previous_dates_array)
            let isInArray = (element, element1) => {
                if(element === element1) return true;
                else return false;
            }
            //checks the prevMarketData to see if there are duplicates from previous technical analyses
            // let prevDates = previousDatesHelper(temp_previous_dates_array)

            //if there are new previous dates, update the previousDates state
            // if(prevDates.length > 0){

            // }
            // console.log(prevDates)
            // console.log(temp_previous_dates_array)
            // temp_previous_dates_array.map(day => {
            //     if(previous_dates_array.includes(day)) {
            //         //do nothing
            //         console.log(`${day} is in the array already`)
            //     }
            //     else{
            //         previous_dates_array.push(day)
            //         // setPreviousDates([
            //         //     day,
            //         //     ...previousDates
            //         // ])
            //     }
            //     // console.log(day)
            // })
            // console.log(previous_dates_array)
            return temp_previous_dates_array;
        }


        const addToTARefs = (e) => {
            console.log(e)

            
            if(e && !activeTACharts.includes(e)) {
                
                // activeTARefs.current.push(e)
                // setSelectedTickers([
                //     ...selectedTickers,
                //     priceObject[0][id].list[id1].symbol
                // ])
                setActiveTACharts([
                    ...activeTACharts,
                    e
                ])
                let period;

                if(e === 'RSI'){period = 14}
                if(e === 'MACD'){period = 29};
                if (period > longestPeriod){setLongestPeriod(period)}
                console.log(period)
                previous_dates(markedDate, period)
                .then(res => {

                    //initiate the object to be pushed into the data
                    let specificObject = {
                        ticker: list[0],
                        firstDay: res[0],
                        lastDay: res[res.length - 1],
                        index: 0
                    }
                    console.log(res)
                    console.log(res[0])
                    console.log(res[res.length - 1])
                    console.log(list[0])
                    let dates = previousDatesHelper(res)
                    // .then(dates => {
                    //     console.log(dates)
                    //     tickerHistoricalDataRange(list[0], dates[0], dates[dates.length - 1], 0)
                    // })
                    // .then(newPreviousDates => {
                    //     console.log(newPreviousDates)
                    //     setPreviousDates([
                    //         newPreviousDates,
                    //         ...previousDates
                    //     ])
                    // })
                    console.log(dates)

                    if(dates.length === 0){
                        return previousDates
                    }
                    else{
                        return dates
                    }



                    // return previousDates;
                })
                .then(res1 => {
                    //res1 is the new dates we need to fetch
                    console.log(res1)


                    
    
                    //if conditional to see if we need to fetch more data or not
                    //if we have the data already, do not run tickerHistoricalDataRange again
                    if(res1 === previousDates){
                        console.log(`no new dates`)
                        console.log(res1)
                        console.log(historicalPrice)
                        // let taData = tickerHistoricalData(list[0], res1)

                        //take the e and generate the chart based on the data we have already
                        //since we are referencing the data we already have, we need to look at historicalPrice
                        // let taData = 

                        // case 1: we have more dates than we need (ie: macd pressed and then rsi)

                        //going from the end of the array and then subtract the period from the end

                        // let taData = historicalPrice
                        // .then(res2 => {
                        // console.log(res2)
                        // console.log(chartObjectHelper1(taData))


                        // return chartObjectHelper1(taData)
                        // .then(chartData => {
                        // // .then(chartData => {
                        //     console.log(e)
                        //     console.log(chartData)
                        //     if(e === "RSI"){
                        //         return rsiHelper1(chartData, 0).then(rsi_values => {
                        //             console.log(rsi_values)
                        //             rsiChartHelper(rsi_values).then((svg) => {
                        //                 console.log(svg)
                        //                 activeTARefs.current.push(svg)
                        //                 console.log(activeTARefs)
                        //                 console.log(activeTARefs.current)
                        //                 setIsChartLoading(false)
                        //                 // setActiveTACharts([
                        //                 //     ...activeTACharts,
                        //                 //     'RSI'
                        //                 // ])
                        //                 // setActiveTACharts(['RSI'])
                        //                 console.log(activeTACharts)
                        //                 return svg
                        //             })
                        //         })
                        //     }
                        //     if(e === "MACD"){
                        //         return macdHelper1(chartData, 0).then(macd_values => {
                        //             console.log(macd_values)
                        //             macdChartHelper(macd_values).then((svg) => {
                        //                 console.log(svg)
                        //                 activeTARefs.current.push(svg)
                        //                 console.log(activeTARefs)
                        //                 console.log(activeTARefs.current)
                        //                 setIsChartLoading(false)
                        //                 // setActiveTACharts([
                        //                 //     ...activeTACharts,
                        //                 //     'MACD'
                        //                 // ])
                        //                 // setActiveTACharts(['macd'])
                        //                 console.log(activeTACharts)
                        //                 return svg
                        //             })
                        //         })
                        //     }
                        // })
                        // return chartObjectHelper1(taData)
                        // .then(chartData => {
                        // .then(chartData => {
                        console.log(e)
                        console.log(historicalPrice[0].length)
                        console.log(period)
                        
                        if(e === "RSI"){
                            console.log(longestPeriod)
                            
                            return chartObjectHelper2(longestPeriod, period).then(chartData => {
                                console.log(chartData)
                                return rsiHelper1(chartData, 0).then(rsi_values => {
                                    console.log(rsi_values)
                                    rsiChartHelper(rsi_values).then((svg) => {
                                        console.log(svg)
                                        activeTARefs.current.push(svg)
                                        console.log(activeTARefs)
                                        console.log(activeTARefs.current)
                                        setIsChartLoading(false)
                                        // setActiveTACharts([
                                        //     ...activeTACharts,
                                        //     'RSI'
                                        // ])
                                        // setActiveTACharts(['RSI'])
                                        console.log(activeTACharts)
                                        return svg
                                    })
                                })
                            })

                        }
                        if(e === "MACD"){
                            return chartObjectHelper2(longestPeriod, period + 2).then(chartData => {
                                console.log(chartData)
                                return macdHelper1(chartData, 0).then(macd_values => {
                                    console.log(macd_values)
                                    macdChartHelper(macd_values).then((svg) => {
                                        console.log(svg)
                                        activeTARefs.current.push(svg)
                                        console.log(activeTARefs)
                                        console.log(activeTARefs.current)
                                        setIsChartLoading(false)
                                        // setActiveTACharts([
                                        //     ...activeTACharts,
                                        //     'MACD'
                                        // ])
                                        // setActiveTACharts(['macd'])
                                        console.log(activeTACharts)
                                        return svg
                                    })
                                })
                            })

                        }
                        // })


                        //we can compare the method's time period to the length of the previousDates or the length of the longest period for the method(rsi, macd, stoch rsi, etc)
                        if(e === 'RSI'){
                            
                            //ie: macd has 29 periods & rsi has 14
                            //get the data points from 15 to 29
                            //res.length - 1 - 14 to res.length - 1

                            //set the variable to taData[x to y]

                        }
                        if(e === 'MACD'){

                        }

                        //case 2: we have the same amount of data (ie: 14 days for 14 days)
                        //  0 to res.length - 1


                        // return res1;
                    }

                    //if we don't have the data, run tickerHIstoricalDataRange

                    //we need to grab the data of the new dates
                    if(res1 !== previousDates){
                        console.log(`new dates to fetch`)
                        console.log(res1)
                        // tickerHistoricalDataRange(list[0], res1[0], res1[res1.length - 1], 0)
                        console.log(previousDates)

                        // fetch the data neccessary for the chart
                        return tickerHistoricalDataRange(list[0], res1[0], res1[res1.length - 1], 0)
                        .then(res => {
                            console.log(res)
                            console.log(historicalPrice)
                            let tempArr = [
                                historicalPrice[0]
                            ]
                            console.log(tempArr[0])
                            res.map((day) => {
                                console.log(day)
                                tempArr[0] = [
                                    day,
                                    ...tempArr[0]
                                ]
                            })
                            console.log(tempArr)
                            return tempArr;
                            
                        })
                        .then(res2 => {
                            return chartObjectHelper1(res2).then(chartData => {
                                // .then(chartData => {
                                console.log(e)
                                console.log(chartData)
                                if(e === "RSI"){
                                    return rsiHelper1(chartData, 0).then(rsi_values => {
                                        console.log(rsi_values)
                                        rsiChartHelper(rsi_values).then((svg) => {
                                            console.log(svg)
                                            activeTARefs.current.push(svg)
                                            console.log(activeTARefs)
                                            console.log(activeTARefs.current)
                                            setIsChartLoading(false)
                                            // setActiveTACharts([
                                            //     ...activeTACharts,
                                            //     'RSI'
                                            // ])
                                            // setActiveTACharts(['RSI'])
                                            console.log(activeTACharts)
                                            return svg
                                        })
                                    })
                                }
                                if(e === "MACD"){
                                    return macdHelper1(chartData, 0).then(macd_values => {
                                        console.log(macd_values)
                                        let temp = macd_values
                                        temp.macd_date_arr = macd_values.macd_date_arr.slice(2)
                                        temp.macd_value_arr = macd_values.macd_value_arr.slice(2)
                                        macdChartHelper(temp).then((svg) => {
                                            console.log(svg)
                                            activeTARefs.current.push(svg)
                                            console.log(activeTARefs)
                                            console.log(activeTARefs.current)
                                            setIsChartLoading(false)
                                            // setActiveTACharts([
                                            //     ...activeTACharts,
                                            //     'MACD'
                                            // ])
                                            // setActiveTACharts(['macd'])
                                            console.log(activeTACharts)
                                            return svg
                                        })
                                    })
                                }
                        })

                        // return taData;
                        

                        //once we get the data from tickerHistoricalDataRange
                        //then we can make a reference to historicalPrice(or take the outcome of tickerHIstoricalDataRange & concat it to historicalPrice)
                        //then generate the chart

                        //take the e and generate the chart based on the data we need to fetch

                        //

                        // let taData = tickerHistoricalDataRange(list[0], res1[0], res1[res1.length - 1], 0)
                        // .then(res => {
                        //     console.log(res)
                        //     console.log(historicalPrice)
                        //     let tempArr = [
                        //         historicalPrice[0]
                        //     ]
                        //     console.log(tempArr[0])
                        //     res.map((day) => {
                        //         console.log(day)
                        //         tempArr[0] = [
                        //             day,
                        //             ...tempArr[0]
                        //         ]
                        //     })
                        //     console.log(tempArr)
                        //     return tempArr;
                            
                        // })
                        // }
    
                    //fetch the data neccessary for the chart
                    // let taData = tickerHistoricalDataRange(list[0], res1[0], res1[res1.length - 1], 0)
                    // .then(res => {
                    //     console.log(res)
                    //     console.log(historicalPrice)
                    //     let tempArr = [
                    //         historicalPrice[0]
                    //     ]
                    //     console.log(tempArr[0])
                    //     res.map((day) => {
                    //         console.log(day)
                    //         tempArr[0] = [
                    //             day,
                    //             ...tempArr[0]
                    //         ]
                    //     })
                    //     console.log(tempArr)
                    //     return tempArr;
                        
                    // })
                    // .then(res2 => {
                    //     console.log(res2)
                    //     // console.log(chartObjectHelper1)

                        // return chartObjectHelper1(res2).then(chartData => {
                        // .then(chartData => {
                        //     console.log(e)
                        //     console.log(chartData)
                        //     if(e === "RSI"){
                        //         return rsiHelper1(chartData, 0).then(rsi_values => {
                        //             console.log(rsi_values)
                        //             rsiChartHelper(rsi_values).then((svg) => {
                        //                 console.log(svg)
                        //                 activeTARefs.current.push(svg)
                        //                 console.log(activeTARefs)
                        //                 console.log(activeTARefs.current)
                        //                 setIsChartLoading(false)
                        //                 // setActiveTACharts([
                        //                 //     ...activeTACharts,
                        //                 //     'RSI'
                        //                 // ])
                        //                 // setActiveTACharts(['RSI'])
                        //                 console.log(activeTACharts)
                        //                 return svg
                        //             })
                        //         })
                        //     }
                        //     if(e === "MACD"){
                        //         return macdHelper1(chartData, 0).then(macd_values => {
                        //             console.log(macd_values)
                        //             macdChartHelper(macd_values).then((svg) => {
                        //                 console.log(svg)
                        //                 activeTARefs.current.push(svg)
                        //                 console.log(activeTARefs)
                        //                 console.log(activeTARefs.current)
                        //                 setIsChartLoading(false)
                        //                 // setActiveTACharts([
                        //                 //     ...activeTACharts,
                        //                 //     'MACD'
                        //                 // ])
                        //                 // setActiveTACharts(['macd'])
                        //                 console.log(activeTACharts)
                        //                 return svg
                        //             })
                        //         })
                        //     }


                            
                    //     // })
                    //     if(type === "RSI"){
                    //         // console.log(chartObjectHelper1(res))

                    //         return rsiHelper1(chartData, 0).then(rsi_values => {
                    //             console.log(rsi_values)
                    //             rsiChartHelper(rsi_values).then((svg) => {
                    //                 console.log(svg)
                    //                 activeTARefs.current.push(svg)
                    //                 console.log(activeTARefs)
                    //                 console.log(activeTARefs.current)
                    //                 setIsChartLoading(false)
                    //                 // setActiveTACharts([
                    //                 //     ...activeTACharts,
                    //                 //     'RSI'
                    //                 // ])
                    //                 // setActiveTACharts(['RSI'])
                    //                 console.log(activeTACharts)
                    //                 return svg
                    //             })
                    //         })

                    //     }
                    //     if(type === "MACD"){
                    //         // console.log(chartObjectHelper1(res))
                    //         return macdHelper1(chartData, 0).then(macd_values => {
                    //             console.log(macd_values)
                    //             macdChartHelper(macd_values).then((svg) => {
                    //                 console.log(svg)
                    //                 activeTARefs.current.push(svg)
                    //                 console.log(activeTARefs)
                    //                 console.log(activeTARefs.current)
                    //                 setIsChartLoading(false)
                    //                 // setActiveTACharts([
                    //                 //     ...activeTACharts,
                    //                 //     'MACD'
                    //                 // ])
                    //                 // setActiveTACharts(['macd'])
                    //                 console.log(activeTACharts)
                    //                 return svg
                    //             })
                    //         })
                    //     }

                    // })



                
                
                

                    // })
                    // console.log(taData)
                    
                })
            }
            else if(e && activeTACharts.includes(e)) {
                // activeTARefs.current.filter(e => !e)
                console.log(activeTARefs.current.indexOf(e))
                // activeTARefs.current.splice(activeTARefs.current.indexOf(e), 1)
                setActiveTACharts(
                    activeTACharts.filter(word => word !== e)
                )
            }
            console.log(activeTARefs.current)
                })
            }
        }

        console.log(markedDate)
        // console.log(previous_dates_array)
        console.log(type)

        addToTARefs(type)

    }, [list, svgTARef1, longestPeriod, previousDates, activeTARefs, activeTARefs.current, activeTACharts, activeTARefs,svgTaRef, svgTARef1, svgTA1, taRef1, historicalPrice])

    useEffect(() => {
        console.log(activeTARefs.current)
        console.log(activeTARefs)
        console.log(svgTARef1)

        console.log(activeTACharts)
        
        // console.log(svgTA.node())
        if(svgTA){
            console.log(svgTA.node())
        }
        // console.log(activeTARefs.current.push(svgTARef1))
        console.log(activeTARefs.current)
        console.log(activeTACharts.indexOf('RSI'))
        console.log(activeTACharts.indexOf('MACD'))
        //taHelperCallback1 updates the activeTACharts so now we want to generate the svgs

        //to generate the TA svg, we first need to gather the data for the TA
        //macd is 26 period and 12 period
        

        //

        //
    }, [activeTARefs])
    // const taRef1 = useRef(null);
    // const activeTARefs = useRef([]);
    // activeTARefs.current = [];

    // const addToTARefs = (e) => {

    // }


    const rsiHelper = async(chartObject) => {
        console.log(stateHistoricalPrice)
        console.log(chartObject)

        console.log(rsi(chartObject))

        let rsi_values = rsi(chartObject)
        rsi(chartObject).then(res => {

            console.log(res.rsi_date_arr)
            const width = 1400;
            const height = 400;
    
            const marginRight = 50;
            const marginLeft = 50;
            const marginTop = 50;
            const marginBottom = 50;
    
            //We use chartDate to maintain the same X axis as the price point chart
            let X = d3.map(res.rsi_date_arr, x => x)
            console.log(X)
            
    
            const yType = d3.scaleLinear;
            const curve = d3.curveLinear;
            const stroke = "currentColor";
            const strokeLinecap = "round";
            const color = "#a11616";
            const Y = d3.map(res.rsi_value_arr, x => x);
            const I = d3.range(X.length);
    
            console.log(Y)
            console.log(I)
    
            const strokeLinejoin = "round"; // stroke line join of the line
            const strokeWidth = 1.5; // stroke width of line, in pixels
            const strokeOpacity = 1; // stroke opacity of line
    
            let defined = (d, i) =>  !isNaN(X[i]) && !isNaN(Y[i]);
            // const D = res.rsi_date_arr.map((data, index) => defined(data, index));
            // console.log(D)
            const xFormat = "%b %d";
            const yFormat = "f";

            // const xPaddingTA = 0.2;
            // const xDomainTA = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
            // const xRangeTA = [marginLeft, width - marginRight];
            // const xScaleTA = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);


    
            const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
            let weekdays = (start, stop) => {
                d3.utcDays(start, stop)
            }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);
    
            const minDay = new Date(d3.min(res.rsi_date_arr))
            const maxDay = new Date(d3.max(res.rsi_date_arr))

            console.log(minDay)
            console.log(maxDay)
            // const xTicks = weekdays(d3.min(res.rsi_date_arr), d3.max(res.rsi_date_arr), 2);
    
            const xPadding = 0.2;
            const xDomain = X
            // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
            const xRange = [marginLeft, width - marginRight];
    
            const yDomain = [0, 100]
            const yRange = [height - marginBottom, marginTop]
            const yScale = yType(yDomain, yRange);
            const yLabel = "RSI VALUE"
            // const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
            const xScale = d3.scaleBand(xRange).domain(xDomain).range(xRange).padding(xPadding);

            // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
            // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
            const xAxis = d3.axisBottom(xScale)//.tickFormat(xFormat);//.tickValues(xTicks)
            const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);
            let svgTA = d3.select(svgTaRef.current)
                // .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("fill", "cream")
                .attr("fill_opacity", "1")
                // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")

            // .style('position', 'relative')
    
            svgTA.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#2D2A2E")
            // svgTA.append("rect")
            // .attr("width", "100%")
            // .attr("height", "100%")
            // .attr("fill", "white")

            const line = d3.line()
                // .defined(i => D[i])
                .curve(curve)
                .x(i => xScale(X[i]))
                .y(i => yScale(Y[i]));
                // .y(50);

            // console.log(`${D} || ${X} || ${Y}`)
            console.log(line(I))
    
    
            //X Axis Date Scale
            svgTA.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(xAxis);
    
            //Y Axis Scale
            svgTA.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(yLabel));
                    
            // TA LINE 
            svgTA.append("path")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linecap", strokeLinecap)
                .attr("stroke-linejoin", strokeLinejoin)
                .attr("stroke-opacity", strokeOpacity)
                .attr("d", line(I));

            // const g = svg.append("g")
            //     .attr("stroke", stroke)
            //     .attr("stroke-linecap", strokeLinecap)
            // .selectAll("g")
            // .data(I)
            // .join("g")
            //         .attr("transform", i => `translate(${xScale(X[0][i])},0)`)

            //         g.append("line")
            // .attr("y1", i => yScale(marginBottom))
            // .attr("y2", i => yScale(height))
            // .attr("stroke-width", strokeWidth)
            // // .style("visibility", "hidden")
            // .style("opacity", "0")
        })
        // console.log(svgTA)
        // console.log(svgTA.node())
        
        // activeTARefs.current.push(svgTARef1.current)
        console.log(activeTARefs.current)
        console.log(svgTaRef)
        // return svgTA.node();
        return svgTaRef.current

        // return rsi(chartObject)
    }
    const rsiHelper1 = (chartObject, index) => {
        console.log(stateHistoricalPrice)
        console.log(chartObject)
        console.log(historicalPrice)
        console.log(index)
        console.log(activeTARefs.current)

        // console.log(rsi(chartObject))

        let rsi_values = rsi(chartObject).then(res => {
            console.log(res)
            setRsiValues(res)
            return res
        })
        //returns svg.node()

        console.log(rsi_values)
        // setRsiValues(rsi_values)


        // console.log(rsi(chartObject))
        // console.log(rsi_values)
        // return rsi_values

        return rsi_values
    }
        // let svgTaRef = useRef(null)
    // // const activeTACharts
    // let svgTA1;
    // let svgTARef1 = useRef(null)
    // let taRef1 = useRef(null);
    // let activeTARefs = useRef([]);


    const rsiChartHelper = async(rsi_values) => {
        console.log(rsi_values)
        const containerSize = document.querySelector(".ChartContainer").getBoundingClientRect()
        const width = containerSize.width * .95;
        const height = containerSize.height * .15;

        const marginRight = 50;
        const marginLeft = 50;
        const marginTop = height * .10;
        const marginBottom = height* .10;

        //We use chartDate to maintain the same X axis as the price point chart
        let X = d3.map(rsi_values.rsi_date_arr, x => x)
        console.log(X)
        

        const yType = d3.scaleLinear;
        const curve = d3.curveLinear;
        const stroke = "currentColor";
        const strokeLinecap = "round";
        const color = "#a11616";
        const Y = d3.map(rsi_values.rsi_value_arr, x => x);
        const yScaleRange = Math.max(Math.abs(d3.min(Y)), Math.abs(d3.max(Y)));
        const I = d3.range(X.length);

        console.log(Y)
        console.log(d3.min(Y))
        console.log(d3.max(Y))
        console.log(I)

        const strokeLinejoin = "round"; // stroke line join of the line
        const strokeWidth = 1.5; // stroke width of line, in pixels
        const strokeOpacity = 1; // stroke opacity of line

        let defined = (d, i) =>  !isNaN(X[i]) && !isNaN(Y[i]);
        // const D = rsi_values.rsi_date_arr.map((data, index) => defined(data, index));
        // console.log(D)
        const xFormat = "%b %d";
        const yFormat = "f";

        // const xPaddingTA = 0.2;
        // const xDomainTA = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        // const xRangeTA = [marginLeft, width - marginRight];
        // const xScaleTA = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);



        const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
        let weekdays = (start, stop) => {
            d3.utcDays(start, stop)
        }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

        const minDay = new Date(d3.min(rsi_values.rsi_date_arr))
        const maxDay = new Date(d3.max(rsi_values.rsi_date_arr))

        console.log(minDay)
        console.log(maxDay)
        // const xTicks = weekdays(d3.min(rsi_values.rsi_date_arr), d3.max(rsi_values.rsi_date_arr), 2);

        const xPadding = 0.2;
        const xDomain = X
        // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        const xRange = [marginLeft, width - marginRight];

        // const yDomain = [-yScaleRange, yScaleRange]
        const yDomain = [0, 100]
        const yRange = [height - marginBottom, marginTop]
        const yScale = yType(yDomain, yRange);
        const yLabel = "RSI"
        // const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        const xScale = d3.scaleBand(xRange).domain(xDomain).range(xRange).padding(xPadding);

        // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
        // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
        const xAxis = d3.axisBottom(xScale)//.tickFormat(xFormat);//.tickValues(xTicks)
        const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);

        // console.log(xAxis)
        // console.log(yAxis)
        
        // let svg = d3.create("svg")
        // let svg = d3.select(svgTA1)
            // .append("svg")
            // .attr("width", width)
            // .attr("height", height)
            // .attr("viewBox", [0, 0, width, height])
            // .attr("fill", "cream")
            // .attr("fill_opacity", "1")
        let svg = d3.select(svgRef.current)
            .append("g")
            .attr("class", "svg rsi chart")

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(0," + (containerSize.height * (.95-(.15*2))) + " )")
            // .attr("viewBox", [0, 0, width, height])
            // .attr("fill", "#2D2A2E")
            .attr("fill", "pink")
            .attr("fill_opacity", "1")
            // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")

        // .style('position', 'relative')

        const tooltip = svg.append('g')
        .append('text')
        // .append('rect')
        .attr("class", "rsi-tooltip")
        // .attr('fill', 'green')
        // .attr('transform', `translate(0, ${marginTop})`)
        // // .data(I)
        // .style('visibility','hidden')
        // .text(`RSI Value: `)

        
        // TAsvg.append("rect")
        // .attr("width", "100%")
        // .attr("height", "100%")
        // .attr("fill", "white")

        const line = d3.line()
            // .defined(i => D[i])
            .curve(curve)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));
            // .y(50);

        // console.log(`${D} || ${X} || ${Y}`)
        console.log(line(I))


        //X Axis Date Scale
        // svg.append("g")
        //     .attr("transform", `translate(0,${height - marginBottom})`)
        //     .attr("transform", "translate(0," + (containerSize.height * (.95-(.15*2))) + " )")
        //     .call(xAxis);

        //Y Axis Scale
        svg.append("g")
            // .attr("transform", `translate(${marginLeft},0)`)
            .attr("transform", `translate(${marginLeft},` + (containerSize.height * (.95-(.15*2))) + " )")
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(yLabel));
                
        // TA LINE 
        svg.append("path")
            .attr("transform", "translate(10," + (containerSize.height * (.95-(.15*2))) + " )")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .attr("d", line(I));


        //X Axis Line interface()
        // svg.select(".chartCursor")
        // // .attr("y1", i => yScale(marginBottom))
        // // .attr("y2", i => yScale(height))
        // // .attr("stroke-width", xScale.bandwidth())
        // // // .style("visibility", "hidden")
        // // .style("opacity", "0")
        // .on('mouseover', (e,d)=> {
        //     console.log(e)
        //     console.log(d)
        
        //     console.log(Y[d])
        //     // tooltip.append("rect")
        //     //     .attr('fill', 'green')

        //     tooltip.style('visibility', 'visible')
        //         .style("opacity", "1")
        //         // .style('background', 'yellow')
        //         // .style("fill", "green")
        //         // .text(`Open: ${Yo[d]}
        //         // High: ${Yh[d]}
        //         // Low: ${Yl[d]}
        //         // Close: ${Yc[d]}`)
        //         .attr("disabled", true)
        //         .style("height", "120px")
        //         .style("width", "120px")
        //         .style("resize", "none")
        //     // tooltip.append('text')
        //         .text(`RSI Value: ${Y[d]}`)
        
        // })

        // const g = svg.append("g")
        //     .attr("stroke", stroke)
        //     .attr("stroke-linecap", strokeLinecap)
        // .selectAll("g")
        // .data(I)
        // .join("g")
        //         .attr("transform", i => `translate(${xScale(X[0][i])},0)`)

        //         g.append("line")
        // .attr("y1", i => yScale(marginBottom))
        // .attr("y2", i => yScale(height))
        // .attr("stroke-width", strokeWidth)
        // // .style("visibility", "hidden")
        // .style("opacity", "0")
        // console.log(svg)
        console.log(svg.node())
        // console.log(svg.node())
        activeTARefs.current.push(svg.node())
        // activeTARefs.current.push(svg.node())
        // activeTARefs.current.push(svgRef1)
        // activeTARefs.current.push(svg)
        console.log(activeTARefs.current[0])
        setActiveTACharts([
            ...activeTACharts,
            'RSI'
        ]);
        // setIsChartLoading(false);
        console.log(activeTACharts)

        // console.log(activeTARefs)
        return svg.node();
    }

    const macdHelper = async(chartObject) => {
        // console.log('hi')
        // console.log(stateHistoricalPrice)
        // console.log(macd(chartObject))
        // return macd(chartObject)
        console.log(stateHistoricalPrice)
        console.log(chartObject)

        console.log(macd(chartObject))

        let macd_values = macd(chartObject)
        macd(chartObject).then(res => {

            console.log(res.rsi_date_arr)
            const width = 1400;
            const height = 400;
    
            const marginRight = 50;
            const marginLeft = 50;
            const marginTop = 50;
            const marginBottom = 50;
    
            //We use chartDate to maintain the same X axis as the price point chart
            let X = d3.map(res.rsi_date_arr, x => x)
            console.log(X)
            
    
            const yType = d3.scaleLinear;
            const curve = d3.curveLinear;
            const stroke = "currentColor";
            const strokeLinecap = "round";
            const color = "#a11616";
            const Y = d3.map(res.rsi_value_arr, x => x);
            const I = d3.range(X.length);
    
            console.log(Y)
            console.log(I)
    
            const strokeLinejoin = "round"; // stroke line join of the line
            const strokeWidth = 1.5; // stroke width of line, in pixels
            const strokeOpacity = 1; // stroke opacity of line
    
            let defined = (d, i) =>  !isNaN(X[i]) && !isNaN(Y[i]);
            // const D = res.rsi_date_arr.map((data, index) => defined(data, index));
            // console.log(D)
            const xFormat = "%b %d";
            const yFormat = "f";

            // const xPaddingTA = 0.2;
            // const xDomainTA = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
            // const xRangeTA = [marginLeft, width - marginRight];
            // const xScaleTA = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);


    
            const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
            let weekdays = (start, stop) => {
                d3.utcDays(start, stop)
            }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);
    
            const minDay = new Date(d3.min(res.rsi_date_arr))
            const maxDay = new Date(d3.max(res.rsi_date_arr))

            console.log(minDay)
            console.log(maxDay)
            // const xTicks = weekdays(d3.min(res.rsi_date_arr), d3.max(res.rsi_date_arr), 2);
    
            const xPadding = 0.2;
            const xDomain = X
            // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
            const xRange = [marginLeft, width - marginRight];
    
            const yDomain = [0, 100]
            const yRange = [height - marginBottom, marginTop]
            const yScale = yType(yDomain, yRange);
            const yLabel = "RSI VALUE"
            // const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
            const xScale = d3.scaleBand(xRange).domain(xDomain).range(xRange).padding(xPadding);

            // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
            // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
            const xAxis = d3.axisBottom(xScale)//.tickFormat(xFormat);//.tickValues(xTicks)
            const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);
            let svgTA = d3.select(svgTaRef.current)
                // .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("fill", "cream")
                .attr("fill_opacity", "1")
                // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")

            // .style('position', 'relative')
    
            svgTA.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#2D2A2E")
            // svgTA.append("rect")
            // .attr("width", "100%")
            // .attr("height", "100%")
            // .attr("fill", "white")

            const line = d3.line()
                // .defined(i => D[i])
                .curve(curve)
                .x(i => xScale(X[i]))
                .y(i => yScale(Y[i]));
                // .y(50);

            // console.log(`${D} || ${X} || ${Y}`)
            console.log(line(I))
    
    
            //X Axis Date Scale
            svgTA.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(xAxis);
    
            //Y Axis Scale
            svgTA.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(yLabel));
                    
            // TA LINE 
            svgTA.append("path")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linecap", strokeLinecap)
                .attr("stroke-linejoin", strokeLinejoin)
                .attr("stroke-opacity", strokeOpacity)
                .attr("d", line(I));

            // const g = svg.append("g")
            //     .attr("stroke", stroke)
            //     .attr("stroke-linecap", strokeLinecap)
            // .selectAll("g")
            // .data(I)
            // .join("g")
            //         .attr("transform", i => `translate(${xScale(X[0][i])},0)`)

            //         g.append("line")
            // .attr("y1", i => yScale(marginBottom))
            // .attr("y2", i => yScale(height))
            // .attr("stroke-width", strokeWidth)
            // // .style("visibility", "hidden")
            // .style("opacity", "0")
        })
        // activeTARefs.current.push(svgTaRef)
        console.log(activeTARefs.current)
        return svgTA.node();

        // return rsi(chartObject)

    }

    const macdHelper1 = async(chartObject, index) => {
        // console.log('hi')
        // console.log(stateHistoricalPrice)
        // console.log(macd(chartObject))
        // return macd(chartObject)
        console.log(stateHistoricalPrice)
        console.log(chartObject)
        console.log(index)
        console.log(activeTARefs.current[index])
        console.log(macd(chartObject))

        let macd_values = macd(chartObject)
        console.log(macd_values)
        setMacdValues(macd_values)

        return macd_values;
        
    }

    const macdChartHelper = (macd_values) => {
        console.log(macd_values.macd_date_arr)
        const containerSize = document.querySelector(".ChartContainer").getBoundingClientRect()
        const width = containerSize.width * .95;
        const height = containerSize.height * .15;
        console.log(height)
        console.log(containerSize.height)

        const marginRight = 50;
        const marginLeft = 50;
        const marginTop = height * .10;
        const marginBottom = height* .10;

        //We use chartDate to maintain the same X axis as the price point chart
        let X = d3.map(macd_values.macd_date_arr, x => x)
        console.log(X)
        

        const yType = d3.scaleLinear;
        const curve = d3.curveLinear;
        const stroke = "currentColor";
        const strokeLinecap = "round";
        const color = "#a11616";
        const Y = d3.map(macd_values.macd_value_arr, x => x);
        const I = d3.range(X.length);
        
        const yScaleRange = Math.max(Math.abs(d3.min(Y)), Math.abs(d3.max(Y)));
        console.log(yScaleRange)
        console.log(Y)
        console.log(yScaleRange)
        console.log(d3.min(Y))
        console.log(d3.max(Y))
        console.log(I)

        const strokeLinejoin = "round"; // stroke line join of the line
        const strokeWidth = 1.5; // stroke width of line, in pixels
        const strokeOpacity = 1; // stroke opacity of line

        let defined = (d, i) =>  !isNaN(X[i]) && !isNaN(Y[i]);
        // const D = macd_values.macd_date_arr.map((data, index) => defined(data, index));
        // console.log(D)
        const xFormat = "%b %d";
        const yFormat = "f";

        // const xPaddingTA = 0.2;
        // const xDomainTA = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        // const xRangeTA = [marginLeft, width - marginRight];
        // const xScaleTA = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);



        const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
        let weekdays = (start, stop) => {
            d3.utcDays(start, stop)
        }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

        const minDay = new Date(d3.min(macd_values.macd_date_arr))
        const maxDay = new Date(d3.max(macd_values.macd_date_arr))

        console.log(minDay)
        console.log(maxDay)
        // const xTicks = weekdays(d3.min(macd_values.macd_date_arr), d3.max(macd_values.macd_date_arr), 2);

        const xPadding = 0.2;
        const xDomain = X
        // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        const xRange = [marginLeft, width - marginRight];

        const yDomain = [-yScaleRange, yScaleRange]
        const yRange = [height - marginBottom, marginTop]
        const yScale = yType(yDomain, yRange);
        const yLabel = "MACD"
        // const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        const xScale = d3.scaleBand(xRange).domain(xDomain).range(xRange).padding(xPadding);

        // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
        // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
        const xAxis = d3.axisBottom(xScale)//.tickFormat(xFormat);//.tickValues(xTicks)
        const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);

        // const svg = d3.select(svgRef.current)
        const svg = d3.select(svgRef.current)
            .append("g")
            .attr("class", "svg macd chart")
        
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(0," + (containerSize.height * (.95-(.15*1))) + " )")
            // .attr("viewBox", [500, 500, width, height])
            // .attr("fill", "#2D2A2E")
            .attr("fill", "green")
            // .attr("fill_opacity", "1")
        // .append("svg")
    // svg.append("g")
        
        // .attr("width", width)
        // .attr("height", height)
        // .attr("viewBox", [0, 0, width, height])
        // .attr("fill", "cream")
        // .attr("fill_opacity", "1")
            // .append("svg")
        // svg.append("g")
            
            // .attr("width", width)
            // .attr("height", height)
            // .attr("viewBox", [0, 0, width, height])
            // .attr("fill", "cream")
            // .attr("fill_opacity", "1")
            // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
            // .style('position', 'relative')
            // .join('path')
        // const svgGroup = svg.append("g")

        // svg.append("rect")
        // .attr("width", "100%")
        // .attr("height", "100%")
        // .attr("fill", "#2D2A2E")
        // let svgTA = d3.select(svgRef.current)
        // const svg = svg.append("g")
        //     // .append("svg")

        // // svg.append
        // //     .attr("width", width)
        // //     .attr("height", height)
        // //     .attr("viewBox", [0, 0, width, height])
        // //     .attr("fill", "cream")
        // //     .attr("fill_opacity", "1")
        //     // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")

        // // .style('position', 'relative')

        // svg.append("rect")
        // .attr("width", "100%")
        // .attr("height", "100%")
        // .attr("viewBox", [0, 0, width, height])
        // .attr("fill", "#2D2A2E")
        // svgTA.append("rect")
        // .attr("width", "100%")
        // .attr("height", "100%")
        // .attr("fill", "white")
        
        const tooltip = svg.append('g')
        .append('text')
        // .append('rect')
        .attr("class", "macd-tooltip")
        // .attr('fill', 'green')
        // .attr('transform', `translate(0, ${marginTop})`)
        // // .data(I)
        // .style('visibility','hidden')
        // .text(`macd Value: `)

        const line = d3.line()
            // .defined(i => D[i])
            .curve(curve)

            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));
            // .y(50);

        // console.log(`${D} || ${X} || ${Y}`)
        console.log(line(I))


        //X Axis Date Scale
        // svg.append("g")
        //     .attr("transform", `translate(0,${containerSize.height * .8})`)
        //     .call(xAxis);

        //Y Axis Scale
        svg.append("g")
            .attr("transform", `translate(${marginLeft},${containerSize.height * .8})`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(yLabel));
                
        // TA LINE 
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .attr("transform", `translate(10,${containerSize.height * .8})`)
            .attr("d", line(I));

        // const g = svg.append("g")
        //     .attr("stroke", stroke)
        //     .attr("stroke-linecap", strokeLinecap)
        // .selectAll("g")
        // .data(I)
        // .join("g")
        //         .attr("transform", i => `translate(${xScale(X[0][i])},0)`)

        //         g.append("line")
        // .attr("y1", i => yScale(marginBottom))
        // .attr("y2", i => yScale(height))
        // .attr("stroke-width", strokeWidth)
        // // .style("visibility", "hidden")
        // .style("opacity", "0")
    // })
    // activeTARefs.current.push(svgTaRef.current)
    console.log(activeTARefs.current)
    console.log(svg.node())

    activeTARefs.current.push(svg.node())
    // activeTARefs.current.push(svg.node())
    // activeTARefs.current.push(svgRef1)
    // activeTARefs.current.push(svg)
    console.log(activeTARefs.current[0])
    setActiveTACharts([
        ...activeTACharts,
        'MACD'
    ]);

    return svg.node();

    // return rsi(chartObject)

    }

    const smaHelper = async(chartObject) => {
        console.log(rolling_sma(chartObject))
        return rolling_sma(chartObject)

    }

    const emaHelper = async(chartObject) => {
        console.log(rolling_ema(chartObject))
        return rolling_ema(chartObject)

    }
    const stochrsiHelper = async(chartObject) => {
        // console.log(rolling_ema(chartObject))
        // return rolling_ema(chartObject)

    }

    // useEffect will generate the historicalPrices whenever there is a change in the list object(tickers added/removed)
    useEffect(() => {
        // setStateHistoricalPrice(historicalPrice)
        listData1(rangeSelector).then(res => {
            setStateHistoricalPrice(historicalPrice)
            console.log(res)
        })
        if(isLoading === false){
            setIsLoading(true)
        }
        // if(isChartLoading === false){
        //     setIsChartLoading(true)
        // }
        
    }, [list])

    useEffect(() => {
        console.log(previousDates)
    }, [previousDates])

    useEffect(() => {
        console.log(stateHistoricalPrice)
        console.log(activeTARefs)
        console.log(svgTaRef)
        console.log(svgRef)

        svgHelper()
    },[svgRef])
    useEffect(() => {
        // console.log(stateHistoricalPrice)
        console.log(activeTARefs)
        console.log(svgTaRef)
        // console.log(svgRef)

        // svgHelper()
    },[activeTARefs])
    // const svgHelperCallback = useCallback((view, index) => {


    // }, [svgRef, svg, viewSelector])

    useEffect(() => {
        console.log(stateHistoricalPrice)
        console.log(historicalPrice)
        console.log(isChartLoading)
        console.log(activeTACharts)
        console.log(activeTARefs)
        console.log(svgRef)
        console.log(longestPeriod)

        //start the data loading procress
        if(stateHistoricalPrice && stateHistoricalPrice.length > 0 && stateHistoricalPrice[0][0] && !markedDate){
            let temp = new Date(stateHistoricalPrice[0][0].date)
            setMarkedDate(temp)
            svgHelper("candlestick", 0, longestPeriod)
            // svgTAHelperCallback("RSI")
            
        }

        if(isChartLoading === true){
            console.log(activeTARefs)
            // svgTAHelper("RSI", 0)
            // svgTAHelper("MACD", 0)
        }



        

        if(currentDateCounter.length === 0){
            console.log(stateHistoricalPrice)
            // svgHelper("candlestick", 0)
        }
    }, [stateHistoricalPrice, historicalPrice, longestPeriod, isChartLoading])

    useEffect(() => {
        // console.log(isChartLoading)
        // console.log(historicalPrice)
        // if(isChartLoading === true){
        //     // setStateHistoricalPrice(historicalPrice)
        //     svgTAHelperCallback("RSI")
        // }
        // console.log(isChartLoading)
        

    }, [historicalPrice, isChartLoading])

    //rerender the chart to scale with the amount of activeTACharts
    useEffect(() => {
        svgHelper("candlestick", 0, longestPeriod)
        // svgTAHelper1(data, type, index)


    }, [activeTACharts, longestPeriod])

    //grabs all the data needed for the technical analysis one by one
    const dataHelper = () => {
        let copyDCLastEle = currentDateCounter[currentDateCounter.length - 1] //create a shallow copy of the state

        let firstDay = currentDateCounter[0]
        let lastDay = currentDateCounter[currentDateCounter.length - 1]
        console.log(`${firstDay} | ${lastDay}`)
        if(currentDateCounter.length > 0){
            //the object is formatted for d3
            let specificObject = {
                ticker: list[0],
                day: copyDCLastEle,
                index: 0
            }
            console.log(specificObject)

            //format the date object to fit the iex format for the api call
            dispatch(getSpecificHistoricalData(specificObject)).then(res => {
                let data = res.payload
                console.log(data)
                
                // setStateHistoricalPrice[0]([
                //     data,
                //     ...stateHistoricalPrice,
                // ])

                
                setCurrentDateCounter(currentDateCounter.slice(0, -1))
                
            }).then(console.log(stateHistoricalPrice))

        }
        return currentDateCounter
        
    }

    // const listNameRef = useRef(null); 
    // const{ ref, ...rest} = register('listName')


    // const schema = yup.object().shape({
    //     listName: yup.string().required()
    // })

    const [rangeSelector, setRangeSelector] = useState({
        fixedRange: "",
        firstDay: "",
        lastDay: "",
        currentSelector: ""
    })


    // const { dateRangeForm, handleSubmit, formState: { errors} } = useForm({
    //     resolver: yupResolver(schema),
    // })

    const handleChange = (e) => {
        e.preventDefault();
        // const fixedRange = e.target.name;
        // const firstDay = e.target.name;
        // const lastDay = e.target.name;
        // const currentSelector = e.target.name;
        const {name, value} = e.target;
        setRangeSelector((prev) => {
            return {...prev, [name]: value}
        });
    }



    const handleRangeSubmit = (e) => {
        e.preventDefault();
        dateCustomRangeSelectorCallback()
    };

    const dateRangeCallback = useCallback((range) => {
        console.log(range)
        const temp = rangeSelector
        temp.fixedRange = range
        temp.currentSelector = "fixedRange"

        setRangeSelector(temp)
        
        // console.log(rangeSelector)
    }, [rangeSelector])

    const dateCustomRangeCallback = useCallback((firstDay, lastDay) => {
        // console.log(firstDay)
        // console.log(lastDay)
        const temp = rangeSelector
        temp.firstDay = firstDay
        temp.lastDay = lastDay

        let formatDate = format(
            firstDay,
            'MM-DD-YYYY'
        )
        // temp.currentSelector = "customDate"

        setRangeSelector(temp)
        // console.log(rangeSelector)
    }, [rangeSelector])

    const dateCustomRangeSelectorCallback = useCallback(() => {

        const temp = rangeSelector
        temp.currentSelector = "customRange"

        setRangeSelector(temp)
        
        console.log(rangeSelector)
    }, [rangeSelector])

    useEffect(() => {
        console.log(rangeSelector)
        // if(stateHistoricalPrice[0].length > 0){
        //     console.log(stateHistoricalPrice[0][0].priceDate)
        // }
        // 

        //create 


        //go fetch the price (Maybe memoized it save on api calling?)
        listData1(rangeSelector).then(res => {
            console.log(res)
        })
        
        // listData1(rangeSelector)
        //if we change the historical price, and set the value, it would recall the useEffect that renders based on stateHistoricalPrice
        //then that useEffect should generate the new svgObject

        //go create the object using the chartObjectHelper

        //then go call the svgHelper or svgHelperCallback

            //call svgHelper()

            //call svgTAHelperCallback() if needed


    }, [rangeSelector])

    const SVGEle = useCallback((data, index) => {
        console.log(data.data)
        console.log(index)
        console.log("hi")
        console.log(activeTARefs.current[index])
        // svgTAHelperCallback(data.data)

        return(
            // <h3>svg element goes here</h3>
            // <svg
            //     ref = {activeTARefs.current[index]}
            // />
            <>
                <svg
                    className = {'test'}
                    ref = {activeTARefs.current[index]}
                />
            </>
        )
    }, [activeTACharts])

    


    return (
        <>
            <Home.Wrapper>
                <Home.ChartControllerWrapper>
                    <Form.Wrapper>
                        <button onClick={() => svgHelperCallback("candlestick")}>Candlestick</button>
                        <button onClick={() => svgHelperCallback("line")}>Line</button>
                        <button onClick={() => taHelperCallback(0, 'all')}>Technical Analysis</button>
                        <button onClick={() => taHelperCallback1(0, 'RSI')}>RSI</button>
                        <button onClick={() => taHelperCallback1(0, 'MACD')}>MACD</button>
                        <button onClick={() => taHelperCallback1(0, 'SRSI')}>Stochastic RSI</button>

                        <button onClick = {() => dateRangeCallback("1d")}>1d</button>
                        <button onClick = {() => dateRangeCallback("5d")}>5d</button>
                        <button onClick = {() => dateRangeCallback("1m")}>1m</button>
                        <button onClick = {() => dateRangeCallback("3m")}>3m</button>
                        <button onClick = {() => dateRangeCallback("6m")}>6m</button>
                        <button onClick = {() => dateRangeCallback("ytd")}>ytd</button>
                        <button onClick = {() => dateRangeCallback("1y")}>1y</button>
                        <button onClick = {() => dateRangeCallback("5y")}>5y</button>
                    
                        <Form.TextInput onSubmit={handleRangeSubmit}>
                            <Form.Wrapper1>
                                First Day
                                <Form.StyledInput type = 'date' name = 'firstDay' onChange = {handleChange}></Form.StyledInput>
                                Last Day
                                <Form.StyledInput type = 'date' name = 'lastDay' onChange = {handleChange}></Form.StyledInput>
                            </Form.Wrapper1>
                            
                            <Form.StyledButton type = 'submit'>
                                Range
                            </Form.StyledButton>
                        </Form.TextInput>
                    </Form.Wrapper>
                </Home.ChartControllerWrapper>

                <Home.ChartWrapper
                    className = "ChartContainer"
                >

                {/* <Home.Wrapper1></Home.Wrapper1> */}
                    {/* <div 
                        id = "svgEle" 
                        style={{backgroundColor: "cream"}}
                        width = "100%"
                        height = "100%"
                    > */}
                        <svg className = "svgEle"
                            ref = {svgRef}
                        />



                </Home.ChartWrapper>
            </Home.Wrapper>


        </>
    )

    // return (
    //     <>
    //         <Home.Container  >
    //             <Home.Wrapper>
    //                 <div id = "svgEle" style={{backgroundColor: "cream"}}>
    //                     <svg className = "svgEle"
    //                         ref = {svgRef}
    //                     />
    //                 </div>
    //             </Home.Wrapper>
    //             <Home.Wrapper>
    //                 <div id = "svgEle1" style={{backgroundColor: "cream"}}>
    //                     <svg className = "svgEle1"
    //                         ref = {svgTaRef}
    //                     />
    //                 </div>
    //             </Home.Wrapper>
    //             {/* <button onClick={() => svgHelperCallback("candlestick")}>Candlestick</button>
    //             <button onClick={() => svgHelperCallback("line")}>Line</button>
    //             <button onClick={() => taHelperCallback(0)}>Technical Analysis</button> */}
    //         </Home.Container>
    //     </>
    // )
}

export {CandlestickChartContainer}