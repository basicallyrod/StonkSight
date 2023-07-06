//uses the getSpecificHistoricalData function from the coreServices to get the X amount of data points before the initial date
import { eachDayOfInterval } from 'date-fns'
import { getSpecificHistoricalData, reset } from '../../iex/core/historicalPriceSlice'
import { useSelector, useDispatch } from 'react-redux'

import parseJSON from 'date-fns/parseJSON'
import addBusinessDays from 'date-fns/addBusinessDays'
import subBusinessDays from 'date-fns/subBusinessDays'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'
import parse from 'date-fns/parse'
import isSunday from 'date-fns/isSunday'
import isSaturday from 'date-fns/isSaturday'
import { filter } from 'd3'




/**
 * 
 * @param {*} period, the amount of days needed to go back and get
 * @param {*} date the initial ending date
 * @returns {*} JSON object with dates and prices
 */
//returns an array of period amount of dates before the date given with 
const prevMarketData = (ticker, period, date) => {

    //go back the amount of day to get the start date
    let startDate = subBusinessDays(date, period) //Mon Aug 18 2014 00:00:00


    //an array of dates to map through
    let datesArr = eachDayOfInterval({
        start: startDate,
        end: date
    })

    console.log(datesArr)
    let priceObj = datesArr.map(date => {
        console.log(date)
        if(isSaturday(date) || isSunday(date)){
            return null
        }
        else{
            let parsedDate = format(date, 'yyyyMMdd')
            return (parsedDate)
        }
    })

    console.log(priceObj)

    let filteredDates = priceObj.filter((day) => {
        return day !== null
    })
    console.log(filteredDates)
    //return JSON object with an array of price & an array of dates
    return filteredDates
}

export const helpers = {
    prevMarketData
} 

export default helpers
