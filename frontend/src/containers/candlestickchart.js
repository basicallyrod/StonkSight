import { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify' 
import * as d3 from "d3"

import { useForm } from 'react-hook-form';
// import {useSelector} from 'react-redux'
// import {useSelector} from 'react-redux'
import {ListForm} from '../components/commonElements/list/ListForm'
import {ListItem} from '../components/commonElements/list/ListItem'
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {createList, getLists, deleteList, reset} from '../features/lists/listSlice'
import { getOHLC, getHistoricalData} from '../features/iex/core/coreSlice'
// import {CandlestickChart} from '../features/d3/chart/testCandlestick'

import Home from "../components/pages/home/index.js"
import {Button} from "../components/commonElements/buttons/index.js"
import Form from '../components/commonElements/list'
// import { CandlestickChart } from '../components/chart/chartView/views/Candlestick'


// date = d => d.date, // given d in data, returns the (temporal) x-value
// open = d => d.open, // given d in data, returns a (quantitative) y-value
// close = d => d.close, // given d in data, returns a (quantitative) y-value
// high = d => d.high, // given d in data, returns a (quantitative) y-value
// low = d => d.low, // given d in data, returns a (quantitative) y-value
// title = d => d.symbol, // given d in data, returns the title text
// const chartData = require('./aapl.json')

function CandlestickChartContainer() {

    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //use this as the initial unformatted chartData
    let chartData = []

    // use this as the array for the formatted data for d3 manipulation
    let chartObjectData = []

    // use this array for the svg images
    let svgArr = []


    const {user} = useSelector((state) => state.auth);
    const {core} = useSelector((state) => state.core)

    // 0 = candles, 1 = line
    const viewSelector = useState("candlestick")
    
    const svgRef = useRef(null)
    let tickerHistoricalPrices = []
    const { lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists) 
        //update chartData so that it can be used by the function outside of this scope
    const tickerHistoricalData = async (ticker, range) => {
        const historicalData = await dispatch(getHistoricalData({ticker, range}))
        chartData.push(historicalData)
        // tickerHistoricalPrices.push(core.historicalPrice[index])
        
        // let price = core.historicalPrice[0];
        // console.log(`chartDiv Price: ${price}`)
        // console.log(price)
        // chartData.push(historicalData)
        // tickerHistoricalPrices.push(tickerHistoricalData(ticker, range))
        return chartData
    }

    // const chart = CandlestickChart(listDa
    
    // fetches the tickers in the list
    const listData = async () => {

        //grab all the lists and their tickers
        const data = await dispatch(getLists())
        // console.log(`chartDiv listData${data.payload[0].tickerList}`)

        const tickerList = data.payload[0].tickerList
        
        // console
        let range = '1m'
        

        // const tickerHistoricalPrices = tickerHistoricalData(tickerList[0], range)

        
        //this will grab the historical data of each ticker in the first list
        tickerList.map((ticker) => {
            return tickerHistoricalData(ticker, range)
            // tickerHistoricalPrices.push(data)
            // return tickerHistoricalPrices
        })
            // tickerHistoricalPrices.push(tickerHistoricalData(ticker, range, index))
            // tickerHistoricalPrices.push(tickerHistoricalData(ticker, range, index))
        // console.log(`chart chartDiv listData: ${chartData}`)
        // console.log(chartData)


    }
    
    const LineChart = (chartObject) => {
        // let chartDate = [chartObject.chartObject.chartDate]
        // let chartOpen = [chartData.map(day => {return day.Open})]
        // let chartClose = [chartObject.chartObject.chartClose]
        // let chartHigh = [chartData.map(day => {return day.Low})]
        // let chartLow = [chartData.map(day => {return day.High})]

        let X = d3.map(chartObject.chartObject.chartDate, x => x)
        // let Yo = d3.map(chartOpen, x => x);
        const Y = d3.map(chartObject.chartObject.chartClose, x => x);
        // const Yh = d3.map(chartHigh, x => x);
        // const Yl = d3.map(chartLow, x => x);

        const I = d3.range(X[0].length);
        const xFormat = "%b %d";
        const yFormat = "~f";


        const strokeLinejoin = "round"; // stroke line join of the line
        const strokeWidth = 1.5; // stroke width of line, in pixels
        const strokeOpacity = 1; // stroke opacity of line
        let defined = (d, i) =>  !isNaN(X[0][i]) && !isNaN(Y[0][i]);
        
        // const D = d3.map(chartDate, (d, i) => defined(d, i));
        const D = chartObject.chartObject.chartDate[0].map((data, index) => defined(data, index));
        let title = 'AAPL'
        // console.log(chartData)
        // console.log(defined)
        // console.log(defined([0, 1, 2, 3, 4]))
        console.log(D)


        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;
        const width = 1400;
        const height = 800;
        const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
        let weekdays = (start, stop) => {
            d3.utcDays(start, stop)
        }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

        const minDay = new Date(d3.min(chartObject.chartObject.chartDate[0]))
        const maxDay = new Date(d3.max(chartObject.chartObject.chartDate[0]))

        const xTicks = weeks(d3.min(chartObject.chartObject.chartDate[0]), d3.max(chartObject.chartObject.chartDate[0]), 2);

        const xPadding = 0.2;
        const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        const xRange = [marginLeft, width - marginRight];
        const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);

        // console.log(xScale)

        const yDomain = [0, d3.max(Y[0])];

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

    
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const tooltip = d3.select('#svgEle')
            .append('g')
            .data(I)
            .style('visibility','hidden')
            .style("z-index", "10")
            .style('position','absolute')
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

        const line = d3.line()
            .defined(i => D[i])
            .curve(curve)
            .x(i => xScale(X[0][i]))
            .y(i => yScale(Y[0][i]));
    
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
            .attr("stroke", color)
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
                .attr("transform", i => `translate(${xScale(X[0][i])},0)`)
                
        g.append("line")
            .attr("y1", i => yScale(marginBottom))
            .attr("y2", i => yScale(height))
            .attr("stroke-width", strokeWidth)
            // .style("visibility", "hidden")
            .style("opacity", "0")
            .on('mouseover', (e,d)=> {
                console.log(e)
                console.log(d)
                console.log(Y[0][d])
                tooltip.style('visibility', 'visible')
                    .style("opacity", "1")
                    .text(`
                    Price: ${Y[0][d]}`)
                    .attr("disabled", true)
                    .style("height", "120px")
                    .style("width", "auto")
                    .style("resize", "none")
    
            })
    }
    const CandlestickChart = (chartObject) => {
        
        const xFormat = "%b %d";
        const yFormat = "~f";
    
        // const chartDate = [chartData.map(day => {return new Date(day.Date.slice(0,10))})];
        // const chartOpen = [chartData.map(day => {return day.Open})];
        // const chartClose = [chartData.map(day => {return day.Close})];
        // const chartHigh = [chartData.map(day => {return day.Low})];
        // const chartLow = [chartData.map(day => {return day.High})];
        const title = 'AAPL';
        // console.log(index)
        // console.log(chartObjectData[index])
    
        console.log(chartObject)
        console.log(chartObject.chartObject.chartDate)
        console.log(chartObject.chartObject.chartOpen)
        console.log(chartObject.chartObject.chartClose)
        console.log(chartObject.chartObject.chartHigh)
        console.log(chartObject.chartObject.chartLow)
    
        //sets up the image h, w, and margins
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;
        const width = 1400;
        const height = 800;
    
    
        //generates the OHLC 
        const X = d3.map(chartObject.chartObject.chartDate, x => x);
        const Yo = d3.map(chartObject.chartObject.chartOpen, x => x);
        const Yc = d3.map(chartObject.chartObject.chartClose, x => x);
        const Yh = d3.map(chartObject.chartObject.chartHigh, x => x);
        const Yl = d3.map(chartObject.chartObject.chartLow, x => x);
    
        //I is the index we are using for the chart object
        const I = d3.range(X[0].length);
    
    
    
    
        //sets up the domain of the chart 
    
        const minDay = new Date(d3.min(chartObject.chartObject.chartDate[0]));
        const maxDay = new Date(d3.max(chartObject.chartObject.chartDate[0]));
    
        // this is the sets the domain in terms of days
        const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
        const weekdays = (start, stop) => {
            d3.utcDays(start, stop).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
        }
    
    
        //sets up the x axis line and scale
        const xTicks = weeks(d3.min(chartObject.chartObject.chartDate[0]), d3.max(chartObject.chartObject.chartDate[0]), 2);
        const xPadding = 0.2;
        // const xDomain = weekdays(minDay, maxDay)
        const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);
        const xRange = [marginLeft, width - marginRight];
        const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
    
        //sets up the y axis line and scale
        const yDomain = [0, d3.max(Yh[0])];
        const yRange = [height - marginBottom, marginTop];
        const yLabel = "Price $";
        const yType = d3.scaleLinear;
        const yScale = yType(yDomain, yRange);
        const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);
    
    
        //sets up the line used for the candlestick
        const stroke = "currentColor";
        const strokeLinecap = "round";
        const colors = ["$4daf4a", "#999999", "#e41a1c"];
    
    
        // generate the chart using the stated variables to the ref
        const svg = d3.select(svgRef.current)
        // .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("fill", "#69a3b2")
        .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
        .style('position', 'relative')
        .join('path')
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
        .style('position','absolute')
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
        
        
        svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain"))//.remove());
        
        svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain"))
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
        
        const g = svg.append("g")
            .attr("stroke", stroke)
            .attr("stroke-linecap", strokeLinecap)
        .selectAll("g")
        .data(I)
        .join("g")
            .attr("transform", i => `translate(${xScale(X[0][i])},0)`)
            // .on('mouseover', (e,d)=> {
            //     console.log(e)
            //     console.log(d)
            
            //     console.log(Yl[0][d])
            //     console.log(Yh[0][d])
            //     console.log(Yo[0][d])
            //     console.log(Yc[0][d])
            //     tooltip.style('visibility', 'visible')
            //         .text(`Open: ${Yo[0][d]}
            //         High: ${Yh[0][d]}
            //         Low: ${Yl[0][d]}
            //         Close: ${Yc[0][d]}`)
            //         .attr("disabled", true)
            //         .style("height", "120px")
            //         .style("width", "auto")
            //         .style("resize", "none")
        
            // .on('mousemove', (e,d)=>{
            //     tooltip.style('top', (e.pageY-50) + 'px')
            //             .style('left', (e.pageX-50) + 'px')
            // })
            //         .text(`low: ${Yl[0][d]}`)
            //         .text(`high: ${Yh[0][d]}`)
            //         .text(`open: ${Yo[0][d]}`)
            //         .text(`close: ${Yc[0][d]}`)
        
            //     return tooltip.style("visibility", "visible")
            // })
        // .data(Yl[0])
        
        
        
        g.append("line")
        .attr("y1", i => yScale(Yl[0][i]))
        .attr("y2", i => yScale(Yh[0][i]));
        
        g.append("line")
        .attr("y1", i => yScale(Yo[0][i]))
        .attr("y2", i => yScale(Yc[0][i]))
        .attr("stroke-width", xScale.bandwidth())
        .attr("stroke", i => colors[1 + Math.sign(Yo[0][i] - Yc[0][i])]);
        
        // g.selectAll('line')
        //     .data([Yl[0], Yh[0], Yo[0], Yc[0]])
        //     .join('svg')
        //         .on("mouseover", function(d) {tooltip.text(d); return tooltip.style("visibility", "visible");})
        //         .on("mousemove", function() {return tooltip.style("top", (d3.scaleDivergingSqrt.pageY-10) + "px").style("left",(d3.scaleDivergingSqrt.pageX+10) + "px");})
        //         .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        
        g.append("line")
        .attr("y1", i => yScale(marginBottom))
        .attr("y2", i => yScale(height))
        .attr("stroke-width", xScale.bandwidth())
        // .style("visibility", "hidden")
        .style("opacity", "0")
        .on('mouseover', (e,d)=> {
            console.log(e)
            console.log(d)
        
            console.log(Yl[0][d])
            console.log(Yh[0][d])
            console.log(Yo[0][d])
            console.log(Yc[0][d])
            tooltip.style('visibility', 'visible')
                .style("opacity", "1")
                .text(`Open: ${Yo[0][d]}
                High: ${Yh[0][d]}
                Low: ${Yl[0][d]}
                Close: ${Yc[0][d]}`)
                .attr("disabled", true)
                .style("height", "120px")
                .style("width", "auto")
                .style("resize", "none")
        
        // .on('mousemove', (e,d)=>{
        //     tooltip.style('top', (e.pageY-50) + 'px')
        //             .style('left', (e.pageX-50) + 'px')
        // })
                // .text(`low: ${Yl[0][d]}`)
                // .text(`high: ${Yh[0][d]}`)
                // .text(`open: ${Yo[0][d]}`)
                // .text(`close: ${Yc[0][d]}`)
        
            // return tooltip.style("visibility", "visible")
        })
        
        
        svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight))
        
        .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)); 
        // })
        return svg.node;
    }

    const chartObjectHelper = (index) => {
        


        console.log(index)
        console.log(core.historicalPrice[0])
        //generate the tickerList's historical data for each ticker using listData and historicalTickerPrice.
        let chartData = core.historicalPrice[index]
        console.log(chartData)
        // core.historicalPrice.map(index => {
        let chartDate = [chartData.map(day => {return new Date(day.date)})]
        // console.log(chartDate)
        let chartOpen = [chartData.map(day => {return day.open})]
        // console.log(chartOpen)
        let chartClose = [chartData.map(day => {return day.close})]
        // console.log(chartClose)
        let chartHigh = [chartData.map(day => {return day.low})]
        // console.log(chartHigh)
        let chartLow = [chartData.map(day => {return day.high})]
        // console.log(chartLow)
        let chartObject = {
            chartDate,
            chartOpen,
            chartClose,
            chartHigh,
            chartLow,
        }
        console.log(chartObject)
        console.log(chartObjectData)

        chartObjectData.push({chartObject})
        return chartObjectData[index]

        // })

        // chartDataArray.push({chartObject})
        // console.log(chartObjectData)
        // return chartObjectData

        
        
        // returns or runs the CandlestickChart function to generate the svg image for the div
    }

    const svgHelper = async(viewSelector, index) => {
        // chartObjectHelper(index)
        await listData();

        // console.log(chartObjectData[0])
        let chartData = chartObjectHelper(index)
        console.log(chartData)
        console.log(viewSelector)

        let svgObject
        console.log(viewSelector)
        if(viewSelector === "candlestick"){
            console.log(viewSelector)
            svgObject = CandlestickChart(chartData);
        }
        else if(viewSelector === "line"){
            console.log(viewSelector)
            svgObject = LineChart(chartData)
        }
        else{
            svgObject = CandlestickChart(chartData)
        }


        // const chartObject = chartObjectHelper()
        // console.log(chartObject)
        // console.log(chartObjectData)
        // if()
        console.log(svgObject)


        

        // let svgObject = CandlestickChart(chartObjectData[0]);
        svgRef.current = svgObject;

        // chartObjectData.forEach((element, index) => {
        //     let chartObject = chartObjectData[index]
        //     console.log(chartObject);

            
        //     // console.log(index);
        //     // console.log(chartObjectData[index])
        //     // let svgObject = CandlestickChart(chartObject);
        //     // svgRef.current = svgObject;
        //     // svgArr.push(svgObject)
        //     // console.log(svgObject)
        //     return svgArr;
        // })
        // console.log(chartObjectData[0])
        // svgRef.current = svgArr[0]


        //passes the chartObject to the function
        // CandlestickChart({chartObject})
        return svgRef.current;
        // svgArray.push(svgObject)
        
    }
    const viewChange = (viewSelector) => {
        if(viewSelector === "candlestick"){
            svgHelper(viewSelector, 0)
        }
        else(
            svgHelper(viewSelector, 0)
        )
    }


    // useEffect will generate the historicalPrices of the tickers in the list and store them in core.historicalPrices array
    useEffect(() => {
        if(isError) {
            console.log(message)
        }
        if(!user) {
            navigate('/login')
        }
        console.log(`dispatching getLists()`)



        // const firstLoad = async() => {
        //     await listData();
        //     console.log(chartObjectData)
        //     console.log(chartObjectData[0])
        //     const svgObject = 
        //     svgRef.current = svgObject

        // }
        svgHelper("candlestick", 0)

        // firstLoad()



        //load the list data once instead of everytime svgHelper is called
        // listData().then(svgHelper(viewSelector, 0))


        //load the svg with the default view(candlesticks)
        // svgHelper(viewSelector)




        //core.historicalPrice[0] is the chart data we need
        //use the helper function Candlestick.js, that will generate the svg image provided the chartData
        // const svgHelper = 
        //0 gme
        //1 goog
        //2 gme
        //3 goog

        //4 

        


        


        
        

            // })S

        //change the chartData[0] to chartData[i].payload by iterating through each ticker symbol

        //





        // const xFormat = "%b %d";
        // const yFormat = "~f";
        // console.log(core.historicalPrice[0])

        // const svgHelper = async(index) => {

        //     //use the index to return the function of chartData
        //     //and have a svg node be returned
        //     return (
        //         <>
        //             <CandlestickChart 
        //                 ref = {svgRef}
        //                 key = {index}
        //             />
        //         </>
        //     )
        // }




        // let chartDataArray = []


    


        
        return () => {
            dispatch(reset())
        }
        
    }, [user, svgRef, navigate, isError, message, dispatch])



    //the useEffect will load all the data we need, and then create the component containing the svg

    function handleClick() {
        viewChange("candlestick")
        viewChange("line")
    }

    return (
        <>

            {/* 
                lists[0][0].tickerList.map((svgRef, index) => {

                    return (<svg className = "svgElement"
                        ref = {svgRef}
                        index = {index}
                        >)

            }) */}

            {/* <div className = "chart list"> */}
                {/* 
                    Use an index to help sort which watchlist to use in the future

                    Right now, we are only working with first list for simplicity sakes
                

                    lists[][] is used as the website's way of reading the user's tickerList 
                
                */}
                {/* <CandlestickChart 
                    ref = {svgRef.current} 
                    chartData = {chartObjectData[0]}
                /> */}



                {/* {lists[0][0].tickerList.map((index) => (
                    // list.tickerList.map[index]
                    // renders the svg component using the CandlestickChart function
                    //We should have about 2 of these svg Charts
                    <CandlestickChart 
                        ref = {svgRef}
                        key = {index}
                    />
                ))} */}
            {/* </div> */}
            <div id = "svgEle">
                <svg className = "svgEle"
                    ref = {svgRef}
                />
            </div>
            {/* <button onClick={handleClick()}>Candlestick</button> */}
            {/* <button onClick={}>Line</button> */}



            {/* {chartSVG()} */}
            {/* <Home>
                <Home.Wrapper> */}

                    {/* <h1>.Chart</h1> */}
                    

                    
                {/* </Home.Wrapper>
            </Home> */}
        </>
    )
}

export {CandlestickChartContainer}


        // chartObjectHelper(0);

    
    
            // let title = 'AAPL'
            // let X = d3.map(chartDate, x => x)
            // let Yo = d3.map(chartOpen, x => x);
            // const Yc = d3.map(chartClose, x => x);
            // const Yh = d3.map(chartHigh, x => x);
            // const Yl = d3.map(chartLow, x => x);
            // const I = d3.range(X[0].length);
            // const marginTop = 20;
            // const marginRight = 30;
            // const marginBottom = 30;
            // const marginLeft = 40;
            // const width = 1400;
            // const height = 800;
            // const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
            // let weekdays = (start, stop) => {
            //     d3.utcDays(start, stop)
            // }//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);
            // const minDay = new Date(d3.min(core.historicalPrice[index]))
            // const maxDay = new Date(d3.max(core.historicalPrice[index]))
            
            // const xTicks = weeks(d3.min(core.historicalPrice[index]), d3.max(core.historicalPrice[index]), 2);
            // const xPadding = 0.2;
            // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
            // const xRange = [marginLeft, width - marginRight];
            // const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
            // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
    
            // console.log(xScale)
    
            // const yDomain = [0, d3.max(Yh[0])];
            // const yRange = [height - marginBottom, marginTop];
            // const yLabel = "Price $";
            // const yType = d3.scaleLinear;
            // const yScale = yType(yDomain, yRange)
            // const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);
    
            // const stroke = "currentColor";
            // const strokeLinecap = "round";
            // const colors = ["$4daf4a", "#999999", "#e41a1c"];
    
            // if(title === undefined) {
            //     const formatData = d3.utcFormat("%B %-d, %Y");
            //     const formatValue = d3.format(".2f");
            //     const formatChange = (f => (y0, y1) => f((y1 - y0) / y0))(d3.format("+.2%"));
            //     title = i => `${formatData(X[i])}
            // Open: ${formatValue(Yo[i])}
            // Close: ${formatValue(Yc[i])} (${formatChange(Yo[i], Yc[i])})
            // Low: ${formatValue(Yl[i])}
            // High: ${formatValue(Yh[i])}`;
            // } else if (title !== null) {
            //     const T = d3.map(title, title => title);
            //     title = i => T[i];
            // }
    
    
        //     const svg = d3.select(svgRef.current)
        //         // .append("svg")
        //         .attr("width", width)
        //         .attr("height", height)
        //         .attr("viewBox", [0, 0, width, height])
        //         .attr("fill", "#69a3b2")
        //         .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
        //         .style('position', 'relative')
        //         .join('path')
    
    
    
        //     const tooltip = d3.select('#svgEle')
        //         .append('g')
        //         .data(I)
        //         .style('visibility','hidden')
        //         .style("z-index", "10")
        //         .style('position','absolute')
        //         .style('background-color','red')
        //         .append("g")
        //             .append("textArea")
        //             .style('position','absolute')
        //             .attr("disabled", true)
    
            
        //     svg.append("g")
        //         .attr("transform", `translate(0,${height - marginBottom})`)
        //         .call(xAxis)
        //         .call(g => g.select(".domain"))//.remove());
    
        //     svg.append("g")
        //         .attr("transform", `translate(${marginLeft},0)`)
        //         .call(yAxis)
        //         .call(g => g.select(".domain"))
        //         .call(g => g.selectAll(".tick line").clone()
        //             .attr("stroke-opacity", 0.2)
        //             .attr("x2", width - marginLeft - marginRight))
        //         .call(g => g.append("text")
        //             .attr("x", -marginLeft)
        //             .attr("y", 10)
        //             .attr("fill", "currentColor")
        //             .attr("text-anchor", "start")
        //             .text(yLabel));
    
        //     const g = svg.append("g")
        //             .attr("stroke", stroke)
        //             .attr("stroke-linecap", strokeLinecap)
        //         .selectAll("g")
        //         .data(I)
        //         .join("g")
        //             .attr("transform", i => `translate(${xScale(X[0][i])},0)`)
        //             // .on('mouseover', (e,d)=> {
        //             //     console.log(e)
        //             //     console.log(d)
                    
        //             //     console.log(Yl[0][d])
        //             //     console.log(Yh[0][d])
        //             //     console.log(Yo[0][d])
        //             //     console.log(Yc[0][d])
        //             //     tooltip.style('visibility', 'visible')
        //             //         .text(`Open: ${Yo[0][d]}
        //             //         High: ${Yh[0][d]}
        //             //         Low: ${Yl[0][d]}
        //             //         Close: ${Yc[0][d]}`)
        //             //         .attr("disabled", true)
        //             //         .style("height", "120px")
        //             //         .style("width", "auto")
        //             //         .style("resize", "none")
    
        //             // .on('mousemove', (e,d)=>{
        //             //     tooltip.style('top', (e.pageY-50) + 'px')
        //             //             .style('left', (e.pageX-50) + 'px')
        //             // })
        //             //         .text(`low: ${Yl[0][d]}`)
        //             //         .text(`high: ${Yh[0][d]}`)
        //             //         .text(`open: ${Yo[0][d]}`)
        //             //         .text(`close: ${Yc[0][d]}`)
    
        //             //     return tooltip.style("visibility", "visible")
        //             // })
        //         // .data(Yl[0])
    
                
    
        //     g.append("line")
        //         .attr("y1", i => yScale(Yl[0][i]))
        //         .attr("y2", i => yScale(Yh[0][i]));
            
        //     g.append("line")
        //         .attr("y1", i => yScale(Yo[0][i]))
        //         .attr("y2", i => yScale(Yc[0][i]))
        //         .attr("stroke-width", xScale.bandwidth())
        //         .attr("stroke", i => colors[1 + Math.sign(Yo[0][i] - Yc[0][i])]);
                
        //     // g.selectAll('line')
        //     //     .data([Yl[0], Yh[0], Yo[0], Yc[0]])
        //     //     .join('svg')
        //     //         .on("mouseover", function(d) {tooltip.text(d); return tooltip.style("visibility", "visible");})
        //     //         .on("mousemove", function() {return tooltip.style("top", (d3.scaleDivergingSqrt.pageY-10) + "px").style("left",(d3.scaleDivergingSqrt.pageX+10) + "px");})
        //     //         .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
    
        //     g.append("line")
        //         .attr("y1", i => yScale(marginBottom))
        //         .attr("y2", i => yScale(height))
        //         .attr("stroke-width", xScale.bandwidth())
        //         // .style("visibility", "hidden")
        //         .style("opacity", "0")
        //         .on('mouseover', (e,d)=> {
        //             console.log(e)
        //             console.log(d)
                
        //             console.log(Yl[0][d])
        //             console.log(Yh[0][d])
        //             console.log(Yo[0][d])
        //             console.log(Yc[0][d])
        //             tooltip.style('visibility', 'visible')
        //                 .style("opacity", "1")
        //                 .text(`Open: ${Yo[0][d]}
        //                 High: ${Yh[0][d]}
        //                 Low: ${Yl[0][d]}
        //                 Close: ${Yc[0][d]}`)
        //                 .attr("disabled", true)
        //                 .style("height", "120px")
        //                 .style("width", "auto")
        //                 .style("resize", "none")
    
        //         // .on('mousemove', (e,d)=>{
        //         //     tooltip.style('top', (e.pageY-50) + 'px')
        //         //             .style('left', (e.pageX-50) + 'px')
        //         // })
        //                 // .text(`low: ${Yl[0][d]}`)
        //                 // .text(`high: ${Yh[0][d]}`)
        //                 // .text(`open: ${Yo[0][d]}`)
        //                 // .text(`close: ${Yc[0][d]}`)
    
        //             // return tooltip.style("visibility", "visible")
        //         })
    
            
        //     svg.append("g")
        //         .attr("transform", `translate(${marginLeft},0)`)
        //         .call(yAxis)
        //         .call(g => g.select(".domain").remove())
        //         .call(g => g.selectAll(".tick line").clone()
        //             .attr("stroke-opacity", 0.2)
        //             .attr("x2", width - marginLeft - marginRight))
    
        //     .call(g => g.append("text")
        //         .attr("x", -marginLeft)
        //         .attr("y", 10)
        //         .attr("fill", "currentColor")
        //         .attr("text-anchor", "start")
        //         .text(yLabel));    

        // }



   

        // // d3.select("body")
        // //     .selectAll("div")
        // //         .data(Yo[0])
        // //     .enter().append("div")
        // //         .style("width", function(d) { return g(d) + "px"})
        // //         .text(function(d) { return d;})
        // //         .on("mouseover", function(d) {tooltip.text(d); return tooltip.style("visibility", "visible");})
        // //             .on("mousemove", function() {return tooltip.style("top", (d3.scaleDivergingSqrt.pageY-10) + "px").style("left",(d3.scaleDivergingSqrt.pageX+10) + "px");})
        // //             .on("mouseout", function(){return tooltip.style("visibility", "hidden");})


        // console.log(`svgRef`)
        // console.log(svgRef.current)
        // svgRef.current = 
        