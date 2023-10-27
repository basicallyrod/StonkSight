// import { response } from "express"
import axios from 'axios'

let IEX_URI = 'https://cloud.iexapis.com/stable/'

let token = process.env.IEX_TOKEN

const getPrice = async (ticker) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }
    // console.log(ticker)

    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(`coreService getPrice ${ticker}: ${res.data.latestPrice}`)
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

// const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_f2b12e738efc48ffbac89e2a756fb546`)

const getBulkLatestPrice = (list) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }

    console.log('getBulkLatestPrice')
    console.log(list)
    
    // const tickerList = (list) => {
    //     const tickersStr = ''

    //     // for(let ticker of list){
    //     //     tickersStr.concat(ticker+',')
    //     // }

    //     for(let i  = 0; i < list.length - 1; i++){
    //         if(i === 0){
    //             tickersStr.concat(list[0]);
    //         } else {
    //             tickersStr.concat(',' + list[i]);
    //         }
    //     }
    //     return tickersStr;
    // } 
    // tickerList(list)
    // console.log(list)
    console.log(`https://cloud.iexapis.com/v1/stock/market/batch?symbols=${list}&types=quote&token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    const response = axios.get(`https://cloud.iexapis.com/v1/stock/market/batch?symbols=${list}&types=quote&token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        console.log(`coreService getBatchLatestPrice ${res}`)

        const data = res.data;
        return data
    })

    return response
}

const getHistoricalData = (ticker, range) => {
    // console.log(`getHistoricalData`)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }

    // console.log(`${listData}`)
    console.log(range)
    // const respo

    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/chart/${range}?token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    .then(res => {
        //  const{}
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // console.log(res)
        // return response.json()
        console.log(`coreService getHistoricalPrice ${ticker} ${range}: ${res.data}`)
        const data = res.data
        return data
    })
    // console.log(`coreService getPriceHistorical: ${response.data}`)
    // // console.log(`coreService getPrice  ${response.data}`)
    // // // console.log(response.data.latestPrice)
    // return response.data.payload[0]
    return response
}

const getSpecificHistoricalDataRange = (ticker, firstDay, lastDay) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },         
    }

    console.log((`https://cloud.iexapis.com/stable/time-series/HISTORICAL_PRICES/${ticker}/?from=${firstDay}&to=${lastDay}&token=pk_f2b12e738efc48ffbac89e2a756fb546`))
    const response = axios.get(`https://cloud.iexapis.com/stable/time-series/HISTORICAL_PRICES/${ticker}/?from=${firstDay}&to=${lastDay}&token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    .then(res => {
        // console.log(res)
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }

        console.log(`coreService getSpecificHistoricalData ${ticker} ${firstDay} - ${lastDay}`)
        const data = res.data
        console.log(data)
        return data
    })

    return response;


    //https://cloud.iexapis.com/stable/time-series/HISTORICAL_PRICES/AAPL/?from=2018-01-01&to=2019-06-01&token=pk_f2b12e738efc48ffbac89e2a756fb546
}

const getSpecificHistoricalData = (ticker, day) => {

    // console.log(`getSpecificHistoricalData`)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },         
    }
    console.log(`https://cloud.iexapis.com/stable/stock/${ticker}/chart/date/${day}?chartByDay=true&token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/chart/date/${day}?chartByDay=true&token=pk_f2b12e738efc48ffbac89e2a756fb546`)
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
const getOHLC = (ticker) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }
    // console.log(ticker)

    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(`coreService getPrice ${ticker}: ${res.data.latestPrice}`)
        const value = res.data.latestPrice
        return value
    })
    // console.log(`coreService getPrice  ${response}`)
    // console.log(`coreService getPrice  ${response.data}`)
    // // console.log(response.data.latestPrice)

    return response


    // .catch(error => console.log(error))

}

const getArticles = (ticker) => {
    console.log(`https://cloud.iexapis.com/stable/stock/${ticker}/news?token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }
    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/news?token=pk_f2b12e738efc48ffbac89e2a756fb546`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(res.data)
        return res.data
    })

    return response

}

export const coreService = {
    getPrice,
    getBulkLatestPrice,
    getOHLC,
    getHistoricalData,
    getSpecificHistoricalDataRange,
    getSpecificHistoricalData,
    getArticles
    
}

export default coreService

