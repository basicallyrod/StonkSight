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

    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_f2b12e738efc48ffbac89e2a756fb545`)
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

const getHistoricalData = (ticker, range) => {
    // console.log(`getHistoricalData`)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }

    // console.log(`${listData}`)
    // const respo

    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/chart/${range}?token=pk_f2b12e738efc48ffbac89e2a756fb545`)
    .then(res => {
        //  const{}
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
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

//https://iexcloud.io/docs/api/#ohlc
const getOHLC = (ticker) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }, 
    }
    // console.log(ticker)

    const response = axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_f2b12e738efc48ffbac89e2a756fb545`)
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

const getNews = () => {

}

export const coreService = {
    getPrice,
    getOHLC,
    getHistoricalData,
    getNews
    
}

export default coreService

