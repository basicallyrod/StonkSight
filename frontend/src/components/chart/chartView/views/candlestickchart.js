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

const CandlestickChartContainer = ({        
    xFormat = "%b %d",
    yFormat = "~f",

    chartDate = [chartData.map(day => {return new Date(day.Date.slice(0,10))})],
    chartOpen = [chartData.map(day => {return day.Open})],
    chartClose = [chartData.map(day => {return day.Close})],
    chartHigh = [chartData.map(day => {return day.Low})],
    chartLow = [chartData.map(day => {return day.High})],
    title = 'AAPL',
    X = d3.map(chartDate, x => x),
    Yo = d3.map(chartOpen, x => x),
    Yc = d3.map(chartClose, x => x),
    Yh = d3.map(chartHigh, x => x),
    Yl = d3.map(chartLow, x => x),
    I = d3.range(X[0].length),
    marginTop = 20,
    marginRight = 30,
    marginBottom = 30,
    marginLeft = 40,
    width = 1400,
    height = 800,
    weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1),
    weekdays = (start, stop) => {
        d3.utcDays(start, stop)
    },//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
    minDay = new Date(d3.min(chartDate[0])),
    maxDay = new Date(d3.max(chartDate[0])),

    xTicks = weeks(d3.min(chartDate[0]), d3.max(chartDate[0]), 2),
    xPadding = 0.2,
    xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6),
    xRange = [marginLeft, width - marginRight],
    xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding),
    xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks),

    yDomain = [0, d3.max(Yh[0])],
    yRange = [height - marginBottom, marginTop],
    yLabel = "Price $",
    yType = d3.scaleLinear,
    yScale = yType(yDomain, yRange),
    yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat),

    stroke = "currentColor",
    strokeLinecap = "round",
    colors = ["$4daf4a", "#999999", "#e41a1c"]
}) => {

    const svgRef = useRef(null)

    //generate the svg image
    useEffect(() => {
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
    // High: ${Yh[0][1]}
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



    })


    return(
        <div id = "svgEle">
            <svg className = "svgEle"
                ref = {svgRef}
            />
        </div>
    )

}