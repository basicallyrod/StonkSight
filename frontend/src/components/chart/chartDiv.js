import { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify' 
import * as d3 from "d3"

import { useForm } from 'react-hook-form';

import {createList, getLists, deleteList, reset} from '../../features/lists/listSlice'
import { getOHLC, getHistoricalData} from '../../features/iex/core/latestPriceSlice'
// import {CandlestickChart} from '../features/d3/chart/testCandlestick'

import { CandlestickChart } from './chartView/views/Candlestick'
import { LineChart} from './chartView/views/Line'
import { svg } from 'd3'


// date = d => d.date, // given d in data, returns the (temporal) x-value
// open = d => d.open, // given d in data, returns a (quantitative) y-value
// close = d => d.close, // given d in data, returns a (quantitative) y-value
// high = d => d.high, // given d in data, returns a (quantitative) y-value
// low = d => d.low, // given d in data, returns a (quantitative) y-value
// title = d => d.symbol, // given d in data, returns the title text
// const chartData = require('./aapl.json')

function ChartDiv() {

    let chartData = []
    const [view, setView] = useState(false);


    const changeView = e => {
        e.preventDefault();
        console.log('')

        setView({})
    }
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth);
    const {core} = useSelector((state) => state.core)
    
    const svgRef = useRef(null)

    const { lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists) 

    let tickerHistoricalPrices = []

    // let chart = ''
    useEffect(() => {
        if(isError) {
            console.log(message)
        }
        if(!user) {
            navigate('/login')
        }
        console.log(`dispatching chartDiv getLists()`)


        //we might not even need the push since we have access to it by the state
        const tickerHistoricalData = async (ticker, range, index) => {
            const historicalData = await dispatch(getHistoricalData({ticker, range}))
            // tickerHistoricalPrices.push(core.historicalPrice[index])
            
            let price = core.historicalPrice[index];
            console.log(`chartDiv Price: ${price}`)
            console.log(price)
            // tickerHistoricalPrices.push(tickerHistoricalData(ticker, range))
            return price
        }

        // const chart = CandlestickChart(listDa
        
        const listData = async () => {
            const data = await dispatch(getLists())
            // console.log(`chartDiv listData${data.payload[0].tickerList}`)

            const tickerList = data.payload[0].tickerList
            // console
            let range = '1m'

            // const tickerHistoricalPrices = tickerHistoricalData(tickerList[0], range)

            tickerList.map((ticker, index) => {
                tickerHistoricalPrices.push(tickerHistoricalData(ticker, range, index))
                // tickerHistoricalPrices.push(tickerHistoricalData(ticker, range, index))
                console.log(`chart chartDiv listData: ${tickerHistoricalPrices}`)
                console.log(tickerHistoricalPrices)
                return tickerHistoricalPrices


            })

            // svgHelper(data.payload[0].tickerList[0])
            // console.log(`chartDiv tickerHistoricalPrices: ${tickerHistoricalPrices[0]}`)
            // return data.payload

        }

        const svgHelper = async () => {
            listData()
            if(view === false){
                // console.log(chartData)
                // chartData 

                //CandlestickChart should return a function
                //Other choice would to have the CandlestickChart display the chart
                const svgImage = CandlestickChart({tickerHistoricalPrices, svgRef});
                // svgRef.current = svgImage;

                

            }
            console.log(`listData: ${listData}`)

        
        }

        // const histPriceListHelper = () => {

        // }

        svgHelper()

        //passes the data to another files that will generate the svg image
 

        // const svgImage = CandlestickChart({chartData, svgRef});
        // svgRef.current = some svg node
        // svgRef.current = svgImage;
        // console.log(`svgRef`)
        // console.log(svgRef.current)
        
    



        return () => {
            dispatch(reset())
        }
    }, [user,svgRef, navigate, isError, message, dispatch])


    // Work on this section, once I get the candlestick/line svg ref working properly

    // const onClick = () => {
    //     // change the name of the button

    //     // change the svg image 
    //     if(view === false) {
    //         // generate the svg image for candlestick/false
    //         const svgImage = CandlestickChart(chartData);
    //         // svgRef.current = some svg node
    //         svgRef.current = svgImage;
    //     }
    //     else{
    //         // generate the svg image for line/true
    //         const svgImage =LineChart(chartData);
    //         svgRef.current = svgImage;
    //     }
           

        
    // }



    return (
        <>
            <div id = "svgEle">
                {/* button will trigger onClick and change the view from line to candlestick */}

            
                <svg className = "svgEle"
                    ref = {svgRef}
                />
                {/* <CandlestickChart chartData = {tickerHistoricalPrices} ref = {svgRef}/> */}
                {/* if (view === false)
                <CandlestickChart/> */}
            </div>
        </>
    )
}

export {ChartDiv}