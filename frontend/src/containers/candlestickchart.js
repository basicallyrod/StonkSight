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
    let chartData = []


    const {user} = useSelector((state) => state.auth);
    const {core} = useSelector((state) => state.core)
    
    const svgRef = useRef(null)
    let tickerHistoricalPrices = []
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

         //we might not even need the push since we have access to it by the state
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
        
        const listData = async (ticker) => {

            //grab the 
            const data = await dispatch(getLists())
            // console.log(`chartDiv listData${data.payload[0].tickerList}`)

            const tickerList = data.payload[0].tickerList
            
            // console
            let range = '1m'
            

            // const tickerHistoricalPrices = tickerHistoricalData(tickerList[0], range)

            
            //this will grab the historical data of each ticker
            tickerList.map((ticker) => {
                return tickerHistoricalData(ticker, range)
                // tickerHistoricalPrices.push(data)
                // return tickerHistoricalPrices
            })
                // tickerHistoricalPrices.push(tickerHistoricalData(ticker, range, index))
                // tickerHistoricalPrices.push(tickerHistoricalData(ticker, range, index))
            console.log(`chart chartDiv listData: ${chartData}`)
            console.log(chartData)
            return chartData
        }

        listData('GME')
        

            // })

        const xFormat = "%b %d";
        const yFormat = "~f";

        let chartDate = [chartData[0].map(day => {return new Date(day.Date)})]
        let chartOpen = [chartData[0].map(day => {return day.Open})]
        let chartClose = [chartData[0].map(day => {return day.Close})]
        let chartHigh = [chartData[0].map(day => {return day.Low})]
        let chartLow = [chartData[0].map(day => {return day.High})]
        let title = 'AAPL'
        let X = d3.map(chartDate, x => x)
        let Yo = d3.map(chartOpen, x => x);
        const Yc = d3.map(chartClose, x => x);
        const Yh = d3.map(chartHigh, x => x);
        const Yl = d3.map(chartLow, x => x);
        const I = d3.range(X[0].length);
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

        console.log(xScale)

        const yDomain = [0, d3.max(Yh[0])];
        const yRange = [height - marginBottom, marginTop];
        const yLabel = "Price $";
        const yType = d3.scaleLinear;
        const yScale = yType(yDomain, yRange)
        const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);

        const stroke = "currentColor";
        const strokeLinecap = "round";
        const colors = ["$4daf4a", "#999999", "#e41a1c"];

        if(title === undefined) {
            const formatData = d3.utcFormat("%B %-d, %Y");
            const formatValue = d3.format(".2f");
            const formatChange = (f => (y0, y1) => f((y1 - y0) / y0))(d3.format("+.2%"));
            title = i => `${formatData(X[i])}
        Open: ${formatValue(Yo[i])}
        Close: ${formatValue(Yc[i])} (${formatChange(Yo[i], Yc[i])})
        Low: ${formatValue(Yl[i])}
        High: ${formatValue(Yh[i])}`;
        } else if (title !== null) {
            const T = d3.map(title, title => title);
            title = i => T[i];
        }


        const svg = d3.select(svgRef.current)
            // .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("fill", "#69a3b2")
            .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
            .style('position', 'relative')
            .join('path')



        const tooltip = d3.select('#svgEle')
            .append('g')
            .data(I)
            .style('visibility','hidden')
            .style("z-index", "10")
            .style('position','absolute')
            .style('background-color','red')
            .append("g")
                .append("textArea")
                .style('position','absolute')
                .attr("disabled", true)

        
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

        // d3.select("body")
        //     .selectAll("div")
        //         .data(Yo[0])
        //     .enter().append("div")
        //         .style("width", function(d) { return g(d) + "px"})
        //         .text(function(d) { return d;})
        //         .on("mouseover", function(d) {tooltip.text(d); return tooltip.style("visibility", "visible");})
        //             .on("mousemove", function() {return tooltip.style("top", (d3.scaleDivergingSqrt.pageY-10) + "px").style("left",(d3.scaleDivergingSqrt.pageX+10) + "px");})
        //             .on("mouseout", function(){return tooltip.style("visibility", "hidden");})





            
            
        




        console.log(`svgRef`)
        console.log(svgRef.current)
        // svgRef.current = 
        
    


        
        return () => {
            dispatch(reset())
        }
        
    }, [user,svgRef, navigate, isError, message, dispatch])



    return (
        <>
            <div id = "svgEle">
                <svg className = "svgEle"
                    ref = {svgRef.current}
                />
            </div>



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