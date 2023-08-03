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
import {getHistoricalData, getSpecificHistoricalData, getSpecificHistorialDataRange, reset} from '../features/iex/core/historicalPriceSlice'
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
    let [earliestDate, setEarliestDate] = useState();//initialize the earliest date that we need to generate the chart(specifically ta data)
    let [markedDate, setMarkedDate] = useState();//inititalize the earliest date on the chart (14 periods after the earliestDate)
    let [stateHistoricalPrice, setStateHistoricalPrice] = useState() //react state
    let [updatedDates, setUpdatedDates] = useState(false);

    let [activeTACharts, setActiveTACharts] = useState([])
    let svgArr = []
    let svgNode
    let svg;
    let svgRef = useRef(null)
    let svgTA;
    let svgTaRef = useRef(null)
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

    // const svgTaRef1 = useRef()
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
    const tickerHistoricalDataRange = async(ticker, firstDay, lastDay) => {
        const historicalData = await dispatch(getSpecificHistorialDataRange({ticker, firstDay, lastDay})).then(res => {
            console.log(res)
            // let data = res.payload.reverse();
            setStateHistoricalPrice([
                res.payload,
                ...stateHistoricalPrice
            ])
            // let data = res.payload.reverse().map((data, key) => {
            //     console.log(data)
            //     console.log(data.priceDate)
            //     setStateHistoricalPrice([
            //         data,
            //         ...stateHistoricalPrice
            //     ])
                
            // })
            return res.payload

        })
        console.log(historicalData)
        console.log(stateHistoricalPrice)

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
                tickerHistoricalData(ticker, rangeSelector.fixedRange)
    
            })
            console.log(data)
            return data

        }

        //call getSpecificHistorialDataRange
        else if(rangeSelector.currentSelector === 'customRange'){
            console.log(rangeSelector)
            const data = list.map((ticker) => {
                console.log(ticker)
                tickerHistoricalDataRange(ticker, rangeSelector.firstDay, rangeSelector.lastDay)
            })
            console.log(data)
            return data
            // const data = dispatch(getSpecificHistorialDataRange(selector.firstDay, selector.lastDay))

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
            
        return svg.node;
            // svgRef.current = svg;
            // return svgRef.current;
    }

    const CandlestickChart = async(chartObject) => {
        
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
        const containerSize = document.querySelector(".ChartContainer").getBoundingClientRect()
        console.log(containerSize.height)
        console.log(containerSize.width)
        //sets up the image h, w, and margins
        const marginTop = 50;
        const marginRight = 50;
        const marginBottom = 50;
        const marginLeft = 50;
        const width = containerSize.width * .95;
        const height = containerSize.height * .95;
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
        const weekdays = (start, stop) => {
            d3.utcDays(start, stop).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        }
    
        // if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
        // if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
        // if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);

        //sets up the x axis line and scale
        // const xTicks = weekdays(d3.min(X), d3.max(X), 2);
        // const xTicks = X
        
        const xPadding = 0.2;
        // const xDomain = weekdays(minDay, maxDay)
        // const xDomain = weeks(minDay, maxDay, 4)
        const xDomain = X
        //this is the monthly/every 4 weeks
        console.log(weeks(minDay, maxDay, 4))

        //this is the weekly/every 1 weeks
        console.log(weeks(minDay, maxDay, 1))
        console.log(weekdays(minDay, maxDay))

        // const xDomain = X
        // console.log(xTicks)
        // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)

        const xRange = [marginLeft, width - marginRight];
        const xScale = d3.scaleBand(xRange).domain(xDomain).range(xRange).padding(xPadding);
        // const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding)
        const xAxis = d3.axisBottom(xScale)//.tickFormat(xFormat);//.tickValues(xTicks)
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
    

        console.log(yDomain);
        //sets up the line used for the candlestick
        const stroke = "currentColor";
        const strokeLinecap = "round";
        const colors = ["#9ECD6F", "#49464E", "#F85E84"];
    
    
        // generate the chart using the stated variables to the ref
        const svg = d3.select(svgRef.current)
            // .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("fill", "cream")
            .attr("fill_opacity", "1")
            // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
            // .style('position', 'relative')
            // .join('path')

        svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#2D2A2E")
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
        
        
        const tooltip = d3.select('#svgEle')
        .append('g')
        .data(I)
        .style('visibility','hidden')
        .style("z-index", "10")
        // .style('position','relative')
        .style('background-color','red')
        // .append("text")
        //     .text(`Open: ${Yo[0][1]}`)
        // .append("text")
        //     .text(`High: ${Yh[0][1]}`)
        // .append("text")
        //     .text(`Low: ${Yl[0][1]}`)
        // .append("text")
        //     .text(`Close: ${Yc[0][1]}`)
        .append("g")
            .append("textArea")
            .style('position','absolute')
            .attr("disabled", true)
        //                 .text(`Open: ${Yo[0][1]}
        // High: ${Yh[0 ][1]}
        // Low: ${Yl[0][1]}
        // Close: ${Yc[0][1]}`)
            // .style("height", "200px")
            // .style("width", "auto")
            // .style("resize", "none")
        
        //X Axis Date Scale
        svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
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
        
        //X Axis for candlesticks
        const g = svg.append("g")
            .attr("transform", `translate(${marginLeft}, ${marginBottom})`)
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
        
        //X Axis Line interface()
        // g.append("line")
        // .attr("y1", i => yScale(marginBottom))
        // .attr("y2", i => yScale(height))
        // .attr("stroke-width", xScale.bandwidth())
        // // .style("visibility", "hidden")
        // .style("opacity", "0")
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
        
        

        return svg.node;
    }



    const chartObjectHelper = async(historicalData) => {
        //generate the tickerList's historical data for each ticker using listData and historicalTickerPrice.
        

        // let taData = historicalData.splice(0,13)
        let chartData = historicalData.slice(13, historicalData.length)
        // console.log(chartData)



        console.log(chartData.slice(0,13))
        console.log(chartData.slice(14, chartData.length))


        // core.historicalPrice.map(index => {
        // let chartDate = [chartData.map(day => {
        //     let temp_date = new Date(day.date).toISOString()
        //     return temp_date
        // })]
        let chartDate = [chartData.map(day => {
            let localizedDate = day.date + ' PDT'
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

    const svgHelper = async(viewSelector) => {
        // chartObjectHelper(index)
        let temp = await chartObjectHelper(stateHistoricalPrice[0])

        // let svgObject
        console.log(viewSelector)
        if(viewSelector === "candlestick"){
            console.log(viewSelector)
            return CandlestickChart(temp);
        }
        else if(viewSelector === "line"){
            console.log(viewSelector)
            return LineChart(temp)
        }
        else{
            return CandlestickChart(temp)
        }

        //Create a function to clear our the svg

        //Create a function to package together the chartObjects

    }

    const svgTAHelper = async() => {
        let temp = await taHelper(stateHistoricalPrice[0])

    }

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
            console.log(stateHistoricalPrice[0])
            if(stateHistoricalPrice){
                console.log(stateHistoricalPrice[0])
                console.log(chartObjectHelper(stateHistoricalPrice[0]))
                chartObjectHelper(stateHistoricalPrice[0]).then((res) => {
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


    }, [svgRef, svg, viewSelector])




    const taHelper = async() => {
        let chartData = stateHistoricalPrice[0];       
        let chartDate = [chartData.map(day => {
            let localizedDate = day.date + ' PDT'
            console.log(`${localizedDate} || ${new Date(localizedDate)}`)
            // console.log()
            let formattedDate = d3.utcFormat("%m-%d-%y")
            console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
        })]
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
                
                rsiHelper(res)
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


    // const activeTACharts
    const svgTaRef1 = useRef()
    const taRef1 = useRef(null);
    const activeTARefs = useRef([]);
    activeTARefs.current = [];




    //when the activeTARefs are updated, rerender the svg associated with it in the specified index
    const taHelperCallback1 = useCallback((index, type) =>  {
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
        }

        const taChartSVG = async() => {

            // let chartData = await taHelper(stateHistoricalPrice.payload);  

            taHelper(stateHistoricalPrice[index]).then((res) => {
                
                rsiHelper(res)
                macdHelper(res)
                // smaHelper(res)
                // emaHelper(res)
            })

        }

        console.log(svgRef)
        console.log(index)
        console.log(type)

        addToTARefs(type)


        // console.log(stateHistoricalPrice)

        // let taData = stateHistoricalPrice[index].splice(0,13)
        // let chartData = stateHistoricalPrice[index]

        // if(activeTARefs.current.includes('RSI')){
        //     taHelper(stateHistoricalPrice[index]).then((res) => {
                
        //         rsiHelper(res)
        //     })
        // }
        // if(activeTARefs.current.includes('MACD')){
        //     taHelper(stateHistoricalPrice[index]).then((res) => {
                
        //         macdHelper(res)
        //     })
        // }

        // // ...priceObject[0].slice(0,id),
        // // listObject,
        // // ...priceObject[0].slice(id+1)
        // if(activeTARefs.current.includes('SRSI')){
        //     taHelper(stateHistoricalPrice[index]).then((res) => {
                
        //         stochrsiHelper(res)
        //     })
        // }

        // console.log(activeTARefs.current.length)
        // setActiveTACharts([activeTARefs.current])




        // const taChartSVG = async() => {

        //     // let chartData = await taHelper(stateHistoricalPrice.payload);  

        //     taHelper(stateHistoricalPrice[index]).then((res) => {
                
        //         rsiHelper(res)
        //     })

        // }

        // return taChartSVG()

    }, [svgTaRef1,activeTARefs, activeTACharts, taRef1, stateHistoricalPrice])

    useEffect(() => {
        console.log(activeTARefs.current)

        console.log(activeTACharts)
        //taHelperCallback1 updates the activeTACharts so now we want to generate the svgs

        //to generate the TA svg, we first need to gather the data for the TA
        //macd is 26 period and 12 period

        //

        //
    }, [activeTACharts])
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
        return svgTA.node;

        // return rsi(chartObject)
    }

    const macdHelper = async(chartObject) => {
        console.log(macd(chartObject))
        return macd(chartObject)

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
        setStateHistoricalPrice(historicalPrice)
        listData1(rangeSelector).then(res => console.log(res))
        if(isLoading === false){
            setIsLoading(true)
        }
        
    }, [list])

    useEffect(() => {

        svgHelper()
    },[svgRef])
    // const svgHelperCallback = useCallback((view, index) => {


    // }, [svgRef, svg, viewSelector])

    useEffect(() => {
        console.log(stateHistoricalPrice)

        //start the data loading procress
        if(stateHistoricalPrice && stateHistoricalPrice.length > 0 && stateHistoricalPrice[0][0] && !markedDate){
            let temp = new Date(stateHistoricalPrice[0][0].date)
            setMarkedDate(temp)
        }

        if(currentDateCounter.length === 0){
            console.log(stateHistoricalPrice)
            svgHelper("candlestick", 0)
        }
    }, [stateHistoricalPrice])

    useEffect(() => {
        console.log(markedDate)
        const previous_dates = async(date) => {
            console.log(date)
            return await helpers.prevMarketData(stateHistoricalPrice[0][0].symbol, 14, date)
        }

        if(!earliestDate){
            console.log('earliestDate hlper')
            previous_dates(markedDate).then(res => {
                console.log('here')
                console.log(res)
                let temp = res[0]
                console.log(temp)
                setEarliestDate(temp)
                console.log(earliestDate)
    
                setCurrentDateCounter(res)
            })
            
        }
    }, [markedDate])

    //grabs all the data needed for the technical analysis one by one
    const dataHelper = () => {
        let copyDCLastEle = currentDateCounter[currentDateCounter.length - 1] //create a shallow copy of the state

        if(currentDateCounter.length > 0){
            let specificObject = {
                ticker: list[0],
                day: copyDCLastEle,
                index: 0
            }
            console.log(specificObject)

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

    useEffect(() => {
        console.log(currentDateCounter)
        
        //load data
        if(currentDateCounter.length >= 0){
            dataHelper()
            
            
            // console.log(stateHistoricalPrice)
            
            
        }

        
        setStateHistoricalPrice(historicalPrice)
        if(isLoading === true){
            setIsLoading(false)
        }


        
    }, [currentDateCounter])

    useEffect(() => {
        svgTAHelper()
    }, [svgTaRef])




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

        //create 


        //go fetch the price (Maybe memoized it save on api calling?)
        listData1(rangeSelector)
        
        // listData1(rangeSelector)
        //if we change the historical price, and set the value, it would recall the useEffect that renders based on stateHistoricalPrice
        //then that useEffect should generate the new svgObject

        //go create the object using the chartObjectHelper

        //then go call the svgHelper or svgHelperCallback

            //call svgHelper()

            //call svgTAHelper() if needed


    }, [rangeSelector])

    


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
                    {/* </div> */}
                        <svg className = "svgEle1"
                            ref = {svgTaRef}
                        />


                    {activeTARefs.current.length !== 0 && activeTARefs.current.map((data, key) => {
                        let tempName = 'svgElement'.concat(key)
                        return (
                            <svg className = {tempName}
                                ref = {data}
                            />
                        )
                    })}
                    {/* <div id = "svgEle1" style={{backgroundColor: "cream"}}>
                        <svg className = "svgEle1"
                            ref = {svgTaRef}
                        />
                    </div> */}

                    {/* </Form> */}

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