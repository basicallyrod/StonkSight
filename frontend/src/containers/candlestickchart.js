import { useState, useEffect, useRef, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as d3 from "d3"
import {getHistoricalData, getSpecificHistoricalData, getSpecificHistoricalDataRange, reset} from '../features/iex/core/historicalPriceSlice'
import {helpers} from '../features/technical_analysis_formulas/iex_helpers/prevDataGetter'
import { rolling_ema, rolling_sma } from '../features/technical_analysis_formulas/moving_average.js'
import { macd, signal } from '../features/technical_analysis_formulas/macd.js'
import { rsi } from '../features/technical_analysis_formulas/rsi'
import Home from "../components/pages/home/index.js"
import Button from "../components/commonElements/buttons"
import Form from '../components/commonElements/list'
// function CandlestickChartContainer({list, chartParameters}) 
const CandlestickChartContainer = ({list, chartParameters}) => {
    console.log(list)
    console.log(chartParameters)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {historicalPrice} = useSelector((state) => state.historicalPrice)//react redux state
    const { lists, isError, message} = useSelector ((state) =>
    state.lists)
    const {user} = useSelector((state) => state.auth);

    const [rangeSelector, setRangeSelector] = useState({
        ticker: chartParameters.ticker,
        fixedRange: chartParameters.fixedRange,
        firstDay: chartParameters.firstDay,
        lastDay: chartParameters.lastDay,
        currentSelector: chartParameters.currentSelector
    })

    let [currentDateCounter, setCurrentDateCounter] = useState("")
    let [isLoading, setIsLoading] = useState(false)
    let [isChartLoading, setIsChartLoading] = useState(false)
    let [longestPeriod, setLongestPeriod] = useState(0);
    let [earliestDate, setEarliestDate] = useState();//initialize the earliest date that we need to generate the chart(specifically ta data)
    let [markedDate, setMarkedDate] = useState();//inititalize the earliest date on the chart (14 periods after the earliestDate)
    let [stateHistoricalPrice, setStateHistoricalPrice] = useState() //react state
    let [previousDates, setPreviousDates] = useState([]);

    let [rsiValues, setRsiValues] = useState([]);
    let [macdValues, setMacdValues] = useState([]);

    let svg;
    let svgRef = useRef(null)
    let svgTA;
    let svgTA1;
    let taRef1 = useRef(null);
    let activeTARefs = useRef([]);
    activeTARefs.current = [];

    const previousDatesHelper = (dates) => {
        console.log(dates)
        console.log(previousDates)
        
        let previous_dates_array = [];
        dates.map(day => {
            if(previousDates && previousDates.includes(day)) {
                //do nothing
            }
            else{
                previous_dates_array.push(day)
            }
        })
        //returns a blank array to not fetch any data
        if(previous_dates_array.length === 0){
            return previous_dates_array;
        }
        //return the dates that are not  in the previousDates state
        //also changes the state to include the new dates that aren't in the previousDates state
        if(previous_dates_array.length > 0){
            let temp = previous_dates_array.concat(previousDates)
            let datesToFetch = temp.filter(x => !previousDates.includes(x))
            setPreviousDates(temp)
            return datesToFetch;
        }
    }

    //update chartData so that it can be used by the function outside of this scope
    const tickerHistoricalData = async (ticker, range) => {
        const historicalData = await dispatch(getHistoricalData({ticker, range})).then(res => {
            setStateHistoricalPrice(res.payload)
            return res.payload
        })
        return historicalData
    }
    
    const tickerHistoricalDataRange = async(ticker, firstDay, lastDay, index) => {
        const historicalData = await dispatch(getSpecificHistoricalDataRange({ticker, firstDay, lastDay, index}))
        .then(res => {
            return res.payload
        })
        return historicalData
    }

    //first check if the range is a fixedRange(1d, 1w, 1m, 1y, etc) or custom(user inputted dates)
    //generate data based on the user's selection
    const listData = useCallback((rangeSelector, list) => {
        let index = historicalPrice.findIndex((element) => {
            let found = element.find((data) => {
                return data.symbol === list
            })
            return found
        })

        if(rangeSelector.currentSelector === 'fixedRange' && list !== undefined){
                let temp = tickerHistoricalData(list, rangeSelector.fixedRange)
                .then(res => {
                    if(!markedDate) markedDate = res[0].priceDate;
                        let dates = previousDatesHelper(res)
                        if(dates.length === 0){
                            return previousDates
                        }
                        else{
                            return dates
                        }
                })
                .then(res1 => {
                    tickerHistoricalDataRange(list, res1[0], res1[res1.length - 1], index)
                    return res1
                })
                .then(res => {
                    setCurrentDateCounter(res[0].date)
                    return res
                })
                return Promise.all(temp);
        }
        

        //call getSpecificHistoricalDataRange
        else if(rangeSelector.currentSelector === 'customRange'){
                return tickerHistoricalDataRange(list, rangeSelector.firstDay, rangeSelector.lastDay)
                .then(res => {
                    setCurrentDateCounter(res[0].date)
                })
        }
    }, [longestPeriod])

    //first check if the range is a fixedRange(1d, 1w, 1m, 1y, etc) or custom(user inputted dates)
    //generate data based on the user's selection
    const listDataAndInitLoad = useCallback((rangeSelector, list) => {
        console.log(list)
        console.log(rangeSelector.currentSelector)        
        //call the normal(change to fixed later) getHistoricalData
        let index = historicalPrice.findIndex((element) => {
            // element
            let found = element.find((data) => {
                return data.symbol === list
            })
            console.log(found)
            return found
        })

        if(rangeSelector.currentSelector === 'fixedRange' && list !== undefined){
            // console.log(rangeSelector)
            console.log('hi')
            // const data = list.map((ticker) => {
            //     console.log(ticker)
                

                let temp = tickerHistoricalData(list, rangeSelector.fixedRange)
                .then(res => {
                    console.log(res)
                    if(!markedDate) markedDate = res[0].priceDate;
                    console.log(markedDate)
                    console.log(longestPeriod)

                    // return previous_dates_w_data(markedDate, longestPeriod, res)
                    // .then(res => {
    
                        //initiate the object to be pushed into the data
                        // let specificObject = {
                        //     ticker: list[0],
                        //     firstDay: res[0],
                        //     lastDay: res[res.length - 1],
                        //     index: 0
                        // }
                        console.log(res)
                        console.log(res[0])
                        console.log(res[res.length - 1])
                        // console.log(list[0])
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
                    // if(longestPeriod > 0){
                    //     tickerHistoricalDataRange(list, res1[0], res1[res1.length - 1], index)
                    // }
                })
                // })
                .then(res1 => {
                    console.log(res1)
                    tickerHistoricalDataRange(list, res1[0], res1[res1.length - 1], index)
                    return res1
                })
                .then(res => {
                    console.log(res)
                    setCurrentDateCounter(res[0].date)
                    return res
                })
                .then(res => {
                    svgHelperWithData("candlestick", 0, 0, res)
                })

                return Promise.all(temp);
    
            // })
            // console.log(data)
            // return data

                
        }
        

        //call getSpecificHistoricalDataRange
        else if(rangeSelector.currentSelector === 'customRange'){
            
            // console.log(rangeSelector)
            // const data = list.map((ticker) => {
            //     console.log(ticker)
                return tickerHistoricalDataRange(list, rangeSelector.firstDay, rangeSelector.lastDay)
                .then(res => {
                    console.log(res)
                    setCurrentDateCounter(res[0].date)
                })
            // })
            // console.log(data)
            // return data
            // const data = dispatch(getSpecificHistoricalDataRange(selector.firstDay, selector.lastDay))

        }
    }, [longestPeriod])

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
            .attr("stroke", "#d1d4dc")
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
        const xFormat = "%m-%d-%y";
        
        let s = Object.assign(d3.formatSpecifier("f"), {precision: d3.precisionFixed(0.01)})
        const yFormat = s;
        const title = 'AAPL';
        // console.log(index)
        // console.log(chartObjectData[index])

        let chartData = chartObject
    
        console.log(chartObject)
        console.log(chartObject.chartDate)
        console.log(chartObject.chartSymbol[0])
        
        // console.log(symbol)
        const symbol = chartObject.chartSymbol[0][0]
        console.log(symbol)
        //sets up the image h, w, and margins
        const containerSize = document.querySelector(".ChartContainer").getBoundingClientRect()
        const width = containerSize.width;
        const height = containerSize.height * (1 - (.15 * taCharts));
        const marginTop = 50;
        const marginRight = 0;
        const marginBottom = 50;
        const marginLeft = 0;
    
        //generates the OHLC 
        let X = d3.map(chartObject.chartDate[0], x => x);
        const Yo = d3.map(chartObject.chartOpen[0], x => x);
        const Yc = d3.map(chartObject.chartClose[0], x => x);
        const Yh = d3.map(chartObject.chartHigh[0], x => x);
        const Yl = d3.map(chartObject.chartLow[0], x => x);

    
        //I is the index we are using for the chart object
        const I = d3.range(X.length);
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
        const xPadding = 0.2;
        const xDomain = X
        let xTicksValues = d3.utcMonday.range(minDay, maxDay).map(day => {
            let localizedDate = day
            let formattedDate = d3.utcFormat("%m-%d-%y")
            return formattedDate(new Date(localizedDate))
            // return new Date(day.date)
        })
        const xRange = [marginLeft, width - marginRight];
        const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        const xAxis = d3.axisBottom(xScale).tickValues(xTicksValues)//.tickValues(d3.utcMonday.every(width > 720 ? 1 : 2).range(xTicks))//.tickFormat(xFormat)


        //sets up the y axis line and scale
        const yDomain = [(d3.min(Yl)*.9), (d3.max(Yh)*1.1)];
        const yRange = [height - marginBottom, marginTop];
        const yLabel = "Price $";
        const yType = d3.scaleLinear;
        const yScale = yType(yDomain, yRange);
        const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);
    
        //sets up the line used for the candlestick
        const stroke = "currentColor";
        const strokeLinecap = "round";
        const colors = ["#9ECD6F", "#49464E", "#F85E84"];
    
    
        // generate the chart using the stated variables to the ref
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", (height))
            .attr("viewBox", [0, 0, width, (height)])
            .attr("class", "svg-chart")

        //init load
        if(d3.select(".svg-main-chart")._groups[0][0] == null){
            console.log('empty')
            const svgGroup = svg.append("g")
                .attr("class", "svg-main-chart")

            svgGroup.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "#2a2e39")
                // .attr("style", "outline: thin solid red")
                .attr("rx", "10")
                .attr("ry", "10")
            
            const tooltip = svgGroup.append('g')
                .append('text')
                .attr("class", "tooltip")
                .attr('fill', 'green')
                .attr('transform', `translate(0, ${marginTop})`)
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
            svgGroup.append("g")
                .attr("class", "svg-main-chart-X-Axis")
                .attr("transform", `translate(0,${height - marginBottom})`)
                // .attr("transform", "translate(0," + (containerSize.height * (.95-(.15*chartParameters.taMethods.length))) + " )")
                //containerSize.height * (.95 - (.15 * chartParameters.taMethods.length)
                .style("font-size", "12px")
                .style("color", "#d1d4dc")
                .attr("font-color", "#d1d4dc")
                .call(xAxis)
                .call(g => g.select(".domain").remove());

            //Title
            svgGroup.append("text")
            .attr("class", "svg-main-chart-title")
            .attr("transform", `translate(${width/2}, ${marginTop})`)
            .style("font-size", "64px")
            .attr("fill", "#d1d4dc")
            .text(symbol)
                

            //Y Axis Price Scale Label
            svgGroup.append("g")
                .attr("class", "svg-main-chart-Y-Axis")
                .attr("transform", `translate(${marginLeft},0)`)
                .style("font-size", "12px")
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("fill", "#d1d4dc")
                    .attr("stroke", "#d1d4dc")
                    .attr("stroke-opacity", 0.2))
                    // .attr("x2", width - marginLeft - marginRight))
                    
                //Y Axis Label    
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", marginTop)
                    .attr("fill", "#d1d4dc")
                    .attr("text-anchor", "start")
                    .style("font-size", "28px")
                    .attr("font-color", "#d1d4dc")
                    .text(yLabel));
            
            //X Axis for candlesticks
            const g = svgGroup.append("g")
                .attr("class", "vert-candlestick-across-x-axis")
                .attr("stroke", "#d1d4dc")
                .attr("font-color", "#d1d4dc")
                .attr("stroke-linecap", strokeLinecap)
            .selectAll("g")
            .data(I)
            .join("g")
                .attr("transform", i => `translate(${xScale(X[i])},0)`)

            // const xScaleArr = [xScaleComplete]
            const xScaleComplete = X.map(x => {
                console.log(x)
                return xScale(X[x])
            })
            
            //Y Axis Candlesticks: Low High Stick
            g.append("line")
            .attr("y1", i => yScale(Yl[i]))
            .attr("y2", i => yScale(Yh[i]))
            .attr("y1", i => yScale(height))
            .attr("y2", i => yScale(height))
            .attr("transform", `translate(6, ${height})`);
            
            //Y Axis Candlesticks: Open Close Candle
            g.append("line")
            .attr("y1", i => yScale(Yo[i]))
            .attr("y2", i => yScale(Yc[i]))
            .attr("stroke-width", (xScale.bandwidth()/2))
            .attr("y1", i => yScale(height))
            .attr("y2", i => yScale(height))
            // .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])])
            .attr("transform", `translate(6, ${height})`);

            // console.log(rsiHelper(chartObject, 0))
            // let rsi = rsiHelper(chartObject, 0);
            console.log(rsiValues)
            // console.log(rsiValues.rsi_value_arr)
            // console.log(macdValues.macd_value_arr)
            
            //X Axis Line interface()
            g.append("line")
            .attr("class", "chartCursor")
            .attr("y1", i => yScale(marginBottom))
            .attr("y2", i => yScale(height))
            .attr("stroke-width", xScale.bandwidth())
            // .style("visibility", "hidden")
            .style("opacity", "0")
            .on('mouseover', (e,d)=> {
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

                    return svg.node();
            })
        }
        //for loads after init
        else if(d3.select(".svg-main-chart")._groups[0][0] != null){
            d3.selectAll(".vert-candlestick-across-x-axis").remove()
            d3.selectAll(".svg-main-chart-X-Axis").remove()
            d3.selectAll(".svg-main-chart-Y-Axis").remove()
            d3.selectAll(".svg-main-chart-title").remove()
            //X Axis for candlesticks
            let g = d3.select('.svg-main-chart')
                .append('g')
                .attr("class", "vert-candlestick-across-x-axis")
                .attr("transform", `translate(15, 0)`)
                .attr("stroke", "#d1d4dc")
                .attr("fill", "#d1d4dc")
                .attr("stroke-linecap", strokeLinecap)
                .selectAll("g")
                .data(I)
                .join("g")
                    .attr("transform", i => `translate(${xScale(X[i])},0)`)
                    .attr("fill", "#d1d4dc")
            g.append("line")
                .attr("y1", i => yScale(Yl[i]))
                .attr("y2", i => yScale(Yh[i]))
                .attr("fill", "#d1d4dc")
            g.append("line")
                .attr("y1", i => yScale(Yo[i]))
                .attr("y2", i => yScale(Yc[i]))
                .attr("stroke-width", (xScale.bandwidth()/2))
                .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])])
                // .attr("transform", `translate(6, -${marginBottom})`);
            g.append("line")
                .attr("class", "chartCursor")
                .attr("y1", i => yScale(height))
                .attr("y2", i => yScale(height))
                .attr("stroke-width", xScale.bandwidth())
                .attr("fill", "#d1d4dc")
                // .style("visibility", "hidden")
                .style("opacity", "0")


            let x = d3.select('.svg-main-chart')
                .append("g")
                .attr("class", "svg-main-chart-X-Axis")
                .attr("transform", `translate(0,${height - marginBottom})`)
                // .attr("transform", "translate(0," + (containerSize.height * (.95-(.15*chartParameters.taMethods.length))) + " )")
                //containerSize.height * (.95 - (.15 * chartParameters.taMethods.length)
                .style("font-size", "12px")
                .style("color", "#d1d4dc")
                .call(xAxis)
                .call(g => g.select(".domain").remove());

            let y = d3.select('.svg-main-chart')
                .append("g")
                .attr("class", "svg-main-chart-Y-Axis")
                .attr("transform", `translate(${marginLeft},0)`)
                .style("font-size", "15px")
                .style("color", "#d1d4dc")
                // .text("here")
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("stroke", "#d1d4dc")
                    .attr("stroke-opacity", 0.2)
                    .attr("x2", width - marginLeft - marginRight))
                    .attr("fill", "#d1d4dc")
                    
                //Y Axis Label    
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", marginTop)
                    .attr("stroke", "#d1d4dc")
                    // .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .style("font-size", "28px")
                    .attr("fill", "#d1d4dc")
                    .text(yLabel));

            let title = d3.select('.svg-main-chart')
                .attr("class", "svg-main-chart-title")
                .append("text")
                .attr("transform", `translate(${width/2}, ${marginTop})`)
                .style("font-size", "64px")
                .style("color", "#d1d4dc")
                .attr("fill", "#d1d4dc")
                .text(symbol)

            console.log(d3.select('.svg-main-chart'))
            // console.log(g.node())


            
            // let g = d3.select('.vert-candlestick-across-x-axis')
            // //Y Axis Candlesticks: Low High Stick
            // g.append("line")
            // .attr("y1", i => yScale(Yl[i]))
            // .attr("y2", i => yScale(Yh[i]));
            
            //Y Axis Candlesticks: Open Close Candle
            // g.append("line")
            // .attr("y1", i => yScale(Yo[i]))
            // .attr("y2", i => yScale(Yc[i]))
            // .attr("stroke-width", (xScale.bandwidth()/2))
            // .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);

            // console.log(rsiHelper(chartObject, 0))
            // let rsi = rsiHelper(chartObject, 0);
            console.log(rsiValues)
            // console.log(rsiValues.rsi_value_arr)
            // console.log(macdValues.macd_value_arr)
            
            //X Axis Line interface()
            // g.append("line")
            // .attr("class", "chartCursor")
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
            //         .text(`Open: ${Yo[d]}
            //         High: ${Yh[d]}
            //         Low: ${Yl[d]}
            //         Close: ${Yc[d]}`)

            //     d3.select('.rsi-tooltip')
            //         .attr('transform', `translate(0, ${height+50})`)
            //         .style('visibility', 'visible')
            //         .style('z-index', '10')
            //         .text(`RSI Value: ${rsiValues.rsi_value_arr[d]}`)
            //     d3.select('.macd-tooltip')
            //         .attr('transform', `translate(0, ${height+250})`)
            //         .style('visibility', 'visible')
            //         .style('z-index', '11')
            //         .text(`MACD Value: ${macdValues.macd_value_arr[d]}`)

            
            // })
        // svg.append("g")
        //     .attr("class", "vert-candlestick-across-x-axis")
        //     // .attr("transform", `translate(${marginLeft}, ${marginBottom})`)
        //     .attr("transform", `translate(6, ${marginBottom})`)
        //     .attr("stroke", stroke)
        //     // .attr("font-color", "red")
        //     .attr("stroke-linecap", strokeLinecap)
        // .selectAll("g")
        // .data(I)
        // .join("g")
        //     .attr("transform", i => `translate(${xScale(X[i])},0)`)
                
            console.log(I)

        }

        // console.log(svg.node())

        
    }

    const chartObjectHelperWithPeriod = async(longestPeriod, selectedPeriod, index) => {
        console.log(longestPeriod)
        console.log(selectedPeriod)
        console.log(stateHistoricalPrice)
        // let index = historicalPrice.findIndex((element) => {
        //     let found = element.find((data) => data.symbol === list)
        //     console.log(found.symbol)
        //     return found
        // })
        // // .then(res => {
        // //     console.log(res)
        // // })
        console.log(index)

        let startPeriod = longestPeriod - selectedPeriod
        // console.log(historicalPrice[index])
        let chartData = stateHistoricalPrice.slice(startPeriod)
        console.log(chartData)



        // console.log(chartData.slice(0,13))
        // console.log(chartData.slice(14, chartData.length))


        // core.historicalPrice.map(index => {
        // let chartDate = [chartData.map(day => {
        //     let temp_date = new Date(day.date).toISOString()
        //     return temp_date
        // })]
        let chartDate = [chartData.map(day => {
            // console.log(day)
            // console.log(day.close)
            // console.log(day.priceDate)
            
            let localizedDate = day.priceDate + ' PDT'
            // console.log(`${localizedDate} || ${d3.utcFormat(new Date(localizedDate))}`)
            // console.log()
            let formattedDate = d3.utcFormat("%m-%d-%y")
            // console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
            // return new Date(day.date)
        })]
        // console.log(chartDate)
        let chartOpen = [chartData.map(day => {return day.open})]
        // console.log(chartOpen)
        let chartClose = [chartData.map(day => {return day.close})]
        // console.log(chartClose)
        let chartHigh = [chartData.map(day => {return day.low})]
        // console.log(chartHigh)
        let chartLow = [chartData.map(day => {return day.high})]
        // console.log(chartLow)
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
        // console.log(chartObject)
        // console.log(chartObjectData)

        // chartObjectData.push({chartObject})
        return chartObject


    }

    //allows use to pass a different data to it, which allows us to create a different chart based on the data
    const chartObjectHelperWithData = async(data) => {
        //generate the tickerList's historical data for each ticker using listData and historicalTickerPrice.
        

        // let taData = historicalData.splice(0,13)
        // let chartData = historicalData.slice(13, historicalData.length)
        let chartData = data
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
            // console.log(`${localizedDate} || ${d3.utcFormat(new Date(localizedDate))}`)
            // console.log()
            let formattedDate = d3.utcFormat("%m-%d-%y")
            // console.log(formattedDate(new Date(localizedDate)))
            return formattedDate(new Date(localizedDate))
            // return new Date(day.date)
        })]
        // console.log(chartDate)
        let chartOpen = [chartData.map(day => {return day.open})]
        // console.log(chartOpen)
        let chartClose = [chartData.map(day => {return day.close})]
        // console.log(chartClose)
        let chartHigh = [chartData.map(day => {return day.low})]
        // console.log(chartHigh)
        let chartLow = [chartData.map(day => {return day.high})]
        // console.log(chartLow)
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
    const svgHelper = useCallback((viewSelector, index, longestPeriod) => {
        if(historicalPrice.length > 0){
            let temp = chartObjectHelperWithPeriod(longestPeriod, 0, index).then(res => {
                if(viewSelector === "candlestick"){
                    return CandlestickChart(res, chartParameters.taMethods.length);
                }
                else if(viewSelector === "line"){
                    return LineChart(res)
                }
                else{
                    return CandlestickChart(res, chartParameters.taMethods.length)
                }
            })
            return temp

        }


        //Create a function to clear our the svg

        //Create a function to package together the chartObjects

    }, [stateHistoricalPrice, historicalPrice, svgRef, list, chartParameters.taMethods])

    const svgHelperWithData = useCallback((viewSelector, index, longestPeriod, data) => {
        if(data.length > 0){
            let temp = chartObjectHelperWithData(data).then(res => {
                if(viewSelector === "candlestick"){
                    return CandlestickChart(res, chartParameters.taMethods.length);
                }
                else if(viewSelector === "line"){
                    return LineChart(res)
                }
                else{
                    return CandlestickChart(res, chartParameters.taMethods.length)
                }
            })
            return temp
        }
    }, [historicalPrice, svgRef, list, chartParameters.taMethods])

    //when the activeTARefs are updated, rerender the svg associated with it in the specified index
    const taHelperCallback = useCallback((list, type) =>  {
        console.log(historicalPrice[0])
        let index = historicalPrice.findIndex((element) => {
            // element
            let found = element.find((data) => {
                return data.symbol === list
            })
            return found
        })
        const previous_dates = async(date, range) => {
            let temp_previous_dates_array = helpers.prevMarketData(historicalPrice[index].symbol, range, date)
            let isInArray = (element, element1) => {
                if(element === element1) return true;
                else return false;
            }
            return temp_previous_dates_array;
        }

        const addToTARefs = (e) => {
            //first load
            if(e && !chartParameters.taMethods.includes(e)) {
                let period;

                if(e === 'RSI'){period = 14}
                if(e === 'MACD'){period = 29};
                if (period > longestPeriod){setLongestPeriod(period)}
                console.log(period)
                previous_dates(markedDate, period)
                .then(res => {

                    let dates = previousDatesHelper(res)

                    if(dates.length === 0){
                        return previousDates
                    }
                    else{
                        return dates
                    }
                })
                .then(res1 => {
                    //if conditional to see if we need to fetch more data or not
                    //if we have the data already, do not run tickerHistoricalDataRange again
                    if(res1 === previousDates){
                        if(e === "RSI"){
                            return chartObjectHelperWithPeriod(longestPeriod, period, index)
                            .then(chartData => {
                                console.log(chartData)
                                return rsiHelper(chartData, index)
                            })
                        }
                        if(e === "MACD"){
                            return chartObjectHelperWithPeriod(longestPeriod, period + 2, index)
                            .then(chartData => {
                                console.log(chartData)
                                return macdHelper(chartData, index)
                            })

                        }
                    }

                    //if we don't have the data, run tickerHIstoricalDataRange

                    //we need to grab the data of the new dates
                    if(res1 !== previousDates){
                        return tickerHistoricalDataRange(list, res1[0], res1[res1.length - 1], index)
                        .then(res => {
                            let tempArr = [
                                historicalPrice[index]
                            ]
                            res.map((day) => {
                                console.log(day)
                                tempArr[0] = [
                                    day,
                                    ...tempArr[0]
                                ]
                            })
                            return tempArr;
                        })
                        .then(res2 => {
                            return chartObjectHelperWithData(res2).then(chartData => {
                                // .then(chartData => {
                                console.log(e)
                                console.log(chartData)
                                if(e === "RSI"){
                                    console.log(index)
                                    return rsiHelper(chartData, index)

                                }
                                if(e === "MACD"){
                                    console.log(index)
                                    return macdHelper(chartData, index)
                                        
                                }
                            })
                        })
            }
                })
            }

            if(e && chartParameters.taMethods.includes(e)){
                return chartObjectHelperWithData(historicalPrice[index]).then(chartData => {
                    if(e === "RSI"){
                        return rsiHelper(chartData, index)

                    }
                    if(e === "MACD"){
                        return macdHelper(chartData, index)
                    }
                })
            }
        }

        addToTARefs(type)

    }, [list, longestPeriod, previousDates, chartParameters.taMethods, activeTARefs, svgTA1, taRef1, historicalPrice])

    const rsiHelper = (chartObject, index) => {
        console.log(stateHistoricalPrice)
        console.log(chartObject)
        console.log(historicalPrice)
        console.log(index)
        console.log(activeTARefs.current)

        // console.log(rsi(chartObject))

        let rsi_values = rsi(chartObject)
        setRsiValues(rsi_values)
        // .then(res => {
        //     console.log(res)
        //     setRsiValues(res)
        //     return res
        // })
        //returns svg.node()

        console.log(rsi_values)
        // setRsiValues(rsi_values)


        // console.log(rsi(chartObject))
        // console.log(rsi_values)
        // return rsi_values
        return rsiChartHelper(rsi_values)
        // return rsi_values
    }

    const rsiChartHelper = (rsi_values) => {
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
            .attr("fill", "#2a2e39")
            .attr("fill_opacity", "1")
            .attr("style", "outline: thin solid red")
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
                .attr("fill", "#d1d4dc")
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
        setIsChartLoading(false)
        // setIsChartLoading(false);
        console.log(chartParameters.taMethods)

        // console.log(activeTARefs)
        return svg.node();
    }

    const macdHelper = async(chartObject, index) => {
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
        return macdChartHelper(macd_values)

        // return macd_values;
        
    }

    const macdChartHelper = (macd_values) => {
        macd_values.macd_date_arr.slice(2)
        macd_values.macd_value_arr.slice(2)

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
            .attr("fill", "#2a2e39")
            // .attr("style", "outline: thin solid red")
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
                .attr("fill", "#d1d4dc")
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
        console.log(chartParameters.taMethods)
        setIsChartLoading(false)

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

    useEffect(() => {        
        if(chartParameters.ticker && historicalPrice && historicalPrice.length > 0){
            listData(rangeSelector, chartParameters.ticker).then((res) => {
                console.log(res)
            })
            
            console.log(historicalPrice)
            console.log(chartParameters.ticker)
            let index = historicalPrice.findIndex((element) => {
                // element
                let found = element.find((data) => {
                    return data.symbol === chartParameters.ticker
                })
                console.log(found)
                return found
            })
            console.log(index)
            svgHelper("candlestick", index, longestPeriod)
            if(chartParameters.taMethods && chartParameters.taMethods.length > 0){
                console.log(chartParameters.taMethods)
                if(chartParameters.taMethods.includes('RSI')){
                    console.log('RSI')
                    taHelperCallback(chartParameters.ticker, 'RSI')
                }
                if(chartParameters.taMethods.includes('MACD')){
                    console.log('MACD')
                    taHelperCallback(chartParameters.ticker, 'MACD')
                }
            }
        }
        else{
            if(chartParameters.ticker){
                console.log('listData')
                listDataAndInitLoad(rangeSelector, chartParameters.ticker)
            }
        }

    }, [chartParameters.ticker])

    useEffect(() => {
        if(chartParameters.taMethods && chartParameters.taMethods.length > 0){
            console.log(chartParameters.taMethods)
            if(chartParameters.taMethods.includes('RSI')){
                console.log('RSI')
                taHelperCallback(chartParameters.ticker, 'RSI')
            }
            if(chartParameters.taMethods.includes('MACD')){
                console.log('MACD')
                taHelperCallback(chartParameters.ticker, 'MACD')
            }
            
        }
    }, [chartParameters.taMethods])

    useEffect(() => {
        if(chartParameters.currentSelector === "customRange"){

        }

    }, [chartParameters.currentSelector])

    useEffect(() => {
        console.log(chartParameters.fixedRange)
        listData(chartParameters, chartParameters.ticker)

    }, [chartParameters.fixedRange])

    useEffect(() => {

    }, [chartParameters.firstDay, chartParameters.lastDay])


    useEffect(() => {
        if(chartParameters.view === "candlestick"){
            svgHelper("candlestick", 0, longestPeriod)
        }
        if(chartParameters.view === "line"){
            svgHelper("line", 0, longestPeriod)
        }   

    }, [stateHistoricalPrice, chartParameters.view ])

    return (
        <svg className = "svgEle"
            ref = {svgRef}
        />
    )
}

export {CandlestickChartContainer}