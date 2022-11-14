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
import {CandlestickChart} from '../features/d3/chart/testCandlestick'

import Home from "../components/pages/home/index.js"
import {Button} from "../components/commonElements/buttons/index.js"
import Form from '../components/commonElements/list'


// date = d => d.date, // given d in data, returns the (temporal) x-value
// open = d => d.open, // given d in data, returns a (quantitative) y-value
// close = d => d.close, // given d in data, returns a (quantitative) y-value
// high = d => d.high, // given d in data, returns a (quantitative) y-value
// low = d => d.low, // given d in data, returns a (quantitative) y-value
// title = d => d.symbol, // given d in data, returns the title text
const chartData = require('./aapl.json')

function LineChartContainer() {

    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth);
    const {core} = useSelector((state) => state.core)
    
    const svgRef = useRef(null)

    const { lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists) 

    // let chart = ''
    useEffect(() => {
        if(isError) {
            console.log(message)
        }
        if(!user) {
            navigate('/login')
        }
        console.log(`dispatching getLists()`)

        // let tooltip = d3.select('#svgEle')
        //     .append('div')
        //         .style('width', 600)
        //         .style('height', 600)
        //         .style("position", "absolute")
        //         .style("z-index", "10")
        //         .style("visibility", "hidden")
        //         .style("background-color", "green")
        //         .text("sample tooltip")
        //         .attr("font-size", "10")
            // .append('g')
            //     .attr('transform','translate(300,300)')

        
        // const tooldiv = d3.select("#svg")
        //     .append('div')
        //     .style("visibility", 'hidden')
        //     .style('position', 'absolute')
        //     .style('background-color', 'red')

        // Copyright 2021 Observable, Inc.
        // Released under the ISC license.
        // https://observablehq.com/@d3/line-chart
        let chartDate = [chartData.map(day => {return new Date(day.Date.slice(0,10))})]
        // let chartOpen = [chartData.map(day => {return day.Open})]
        let chartClose = [chartData.map(day => {return day.Close})]
        // let chartHigh = [chartData.map(day => {return day.Low})]
        // let chartLow = [chartData.map(day => {return day.High})]

        let X = d3.map(chartDate, x => x)
        // let Yo = d3.map(chartOpen, x => x);
        const Y = d3.map(chartClose, x => x);
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
        const D = chartDate[0].map((data, index) => defined(data, index));
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

        const minDay = new Date(d3.min(chartDate[0]))
        const maxDay = new Date(d3.max(chartDate[0]))

        const xTicks = weeks(d3.min(chartDate[0]), d3.max(chartDate[0]), 2);

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


        // d3.select("body")
        //     .selectAll("div")
        //         .data(Yo[0])
        //     .enter().append("div")
        //         .style("width", function(d) { return g(d) + "px"})
        //         .text(function(d) { return d;})
        //         .on("mouseover", function(d) {tooltip.text(d); return tooltip.style("visibility", "visible");})
        //             .on("mousemove", function() {return tooltip.style("top", (d3.scaleDivergingSqrt.pageY-10) + "px").style("left",(d3.scaleDivergingSqrt.pageX+10) + "px");})
        //             .on("mouseout", function(){return tooltip.style("visibility", "hidden");})





            
            
        

        // const tickerHistoricalData = async (ticker, range) => {
        //     const price = await dispatch(getHistoricalData({ticker, range}))
        //     console.log(`Price: ${price}`)
        //     return price
        // }

        // const chart = CandlestickChart(listDa
        
        // const listData = async () => {
        //     const data = await dispatch(getLists())
        //     console.log(`chart listData${data.payload[0].tickerList}`)

        //     const tickerList = data.payload[0].tickerList
        //     let range = '1m'

        //     // const tickerHistoricalPrices = tickerHistoricalData(tickerList[0], range)

        //     tickerList.map((ticker) => {
        //         const tickerHistoricalPrices = tickerHistoricalData(ticker, range)
        //         console.log(`chart listData: ${tickerHistoricalPrices}`)
        //         return tickerHistoricalPrices


        //     })
        //     return data.payload

        // }


        console.log(`svgRef`)
        console.log(svgRef.current)
        
    



        return () => {
            dispatch(reset())
        }
    }, [user,svgRef, navigate, isError, message, dispatch])



    return (
        <>
            <div id = "svgEle">
                <svg className = "svgEle"
                    ref = {svgRef}
                />
            </div>
        </>
    )
}

export {LineChartContainer}