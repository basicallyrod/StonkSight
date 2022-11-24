import * as d3 from "d3"
import { useState, useEffect, useRef, forwardRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'

//this function takes in data from the container/candlestickchart.js and renders a chart

/**
 * 
 * @param {*} chartData {
 *  chartDate,
 *  chartOpen,
 *  chartClose,
 *  chartHigh,
 *  chartLow
 * 
 * }
 * @returns svg div
 */
const CandlestickChart = ({chartData}) => {


    //use the index passed to get the ticker's historicalPrice from the state
    const {core, isLoading, isError, message} = useSelector((state) => state.core)


    //creates an empty ref for the svg to be generated to
    const svgRef = useRef(null)
    // console.log(index)

    // console.log(core.historicalPrice[index])


    // sets the chartData for the svg to the array 


    // sets all the variables needed to generate the chart
    // const chartData = core.historicalPrice[index];
    // console.log(props)
    // console.log(props.props.key)
    // console.log(props.key)
    console.log(chartData)

    //creates the parameters for generating the svg image of the chart
          
    const xFormat = "%b %d";
    const yFormat = "~f";

    // const chartDate = [chartData.map(day => {return new Date(day.Date.slice(0,10))})];
    // const chartOpen = [chartData.map(day => {return day.Open})];
    // const chartClose = [chartData.map(day => {return day.Close})];
    // const chartHigh = [chartData.map(day => {return day.Low})];
    // const chartLow = [chartData.map(day => {return day.High})];
    const title = 'AAPL';


    //sets up the image h, w, and margins
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
    const width = 1400;
    const height = 800;


    //generates the OHLC 
    const X = d3.map(chartData.chartDate, x => x);
    const Yo = d3.map(chartData.chartOpen, x => x);
    const Yc = d3.map(chartData.chartClose, x => x);
    const Yh = d3.map(chartData.chartHigh, x => x);
    const Yl = d3.map(chartData.chartLow, x => x);

    //I is the index we are using for the chart object
    const I = d3.range(X[0].length);




    //sets up the domain of the chart 

    const minDay = new Date(d3.min(chartData.chartDate[0]));
    const maxDay = new Date(d3.max(chartData.chartDate[0]));

    // this is the sets the domain in terms of days
    const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
    const weekdays = (start, stop) => {
        d3.utcDays(start, stop)
    };//.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)


    //sets up the x axis line and scale
    const xTicks = weeks(d3.min(chartData.chartDate[0]), d3.max(chartData.chartDate[0]), 2);
    const xPadding = 0.2;
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
    // })
    return svg.node;
}

export {CandlestickChart}