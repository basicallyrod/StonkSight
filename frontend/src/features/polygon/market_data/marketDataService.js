// import { response } from "express"
import axios from 'axios'
const { restClient } = require('@polygon.io/client-js');
const rest = restClient(apiKey);

let Polygon_URI = 'https://api.polygon.io/v2'

let apiKey='8VOAwdnWsAb2MW5VzKuL0nqlxSKRcHxf'

let token = process.env.IEX_TOKEN

const getPrice = async (data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }
    // console.log(ticker)

    const response = axios.get(`${Polygon_URI}/aggs/ticker/${data.ticker}/range/${data.multiplier}/${data.timespan}/${data.day1}/${data.day2}?adjusted=${data.splitAdjust}&sort=${data.sortDir}&limit=${data.limit}&apiKey=${data.apiKey}`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(`coreService getPrice ${res.ticker}: ${res.c}`)
        const latestPrice = res.data.latestPrice
        const changePercent = res.data.changePercent;
        let data = {
            latestPrice,
            changePercent
            
        }
        // return data;
        return data
    })
    // console.log(`coreService getPrice  ${response}`)
    // console.log(`coreService getPrice  ${response.data}`)
    // // console.log(response.data.latestPrice)
    return response


    // .catch(error => console.log(error))

}

const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_f2b12e738efc48ffbac89e2a756fb545`)

const getBulkLatestPrice = (list) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }
}

// const getHistoricalData = ({data}) => {
//     // console.log(`getHistoricalData`)
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }, 
//     }

//     // console.log(`${listData}`)
//     // const respo

//     const response = axios.get(`${Polygon_URI}/aggs/ticker/${data.ticker}/range/${data.multiplier}/${data.timespan}/${data.day1}/${data.day2}?adjusted=${data.splitAdjust}&sort=${data.sortDir}&limit=${data.limit}&apiKey=${data.apiKey}`)
//     .then(res => {
//         //  const{}
//         if(res.ok){
//             throw new Error(`Request failed with status ${res.status}`)
//         }
//         // console.log(res)
//         // return response.json()
//         let first_element = res.results.slice(1);
//         let last_element = res.results.slice(-1);
//         console.log(`coreService getHistoricalPrice ${res.ticker} ${first_element.t}: ${last_element.t}`)
//         const data = res.
//         return data
//     })
//     // console.log(`coreService getPriceHistorical: ${response.data}`)
//     // // console.log(`coreService getPrice  ${response.data}`)
//     // // // console.log(response.data.latestPrice)
//     // return response.data.payload[0]
//     return response
// }

const getHistorialData =  ({data}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    rest.stocks.aggregates(data.ticker, data.multiplier, data.timespan, data.day1, data.day2).then((data) => {
        console.log(data);
        return data;
    }).catch(e => {
        console.error('An error happened:', e);
    });
}

const getSpecificHistoricalData = (ticker, day) => {

    // console.log(`getSpecificHistoricalData`)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },         
    }
    // console.log(`https://cloud.iexapis.com/stable/stock/${ticker}/chart/date/${day}?chartByDay=true&token=pk_f2b12e738efc48ffbac89e2a756fb545`)
    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/chart/date/${day}?chartByDay=true&token=pk_f2b12e738efc48ffbac89e2a756fb545`)
    .then(res => {
        // console.log(res)
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }

        console.log(`coreService getSpecificHistoricalData ${ticker} ${day}: ${res.data}`)
        const data = res.data[0]
        console.log(data)
        return data
    })

    return response;
}

//https://iexcloud.io/docs/api/#ohlc
const getOHLC = (data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }
    // console.log(ticker)

    const response = axios.get(`${Polygon_URI}/aggs/ticker/${data.ticker}/range/${data.multiplier}/${data.timespan}/${data.day1}/${data.day2}?adjusted=${data.splitAdjust}&sort=${data.sortDir}&limit=${data.limit}&apiKey=${data.apiKey}`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(`coreService getPrice ${res.ticker}: ${res.data.latestPrice}`)
        const value = res.data.latestPrice
        return value
    })
    // console.log(`coreService getPrice  ${response}`)
    // console.log(`coreService getPrice  ${response.data}`)
    // // console.log(response.data.latestPrice)

    return response


    // .catch(error => console.log(error))

}

const getNews = () => {

}

export const coreService = {
    getPrice,
    getOHLC,
    getHistoricalData,
    getSpecificHistoricalData,
    getNews
    
}

export default coreService

