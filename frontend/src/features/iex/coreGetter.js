// import { response } from "express"
import axios from 'axios'
// import {getPrice} from '../features/iex/'

let IEX_URI = 'https://cloud.iexapis.com/stable/'

let token = process.env.IEX_TOKEN

export const getPrice = (ticker) => {
    axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${token}`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(res.data.latestPrice)
        return res.data.latestPrice
    })

    .catch(error => console.log(error))

}

export const getHistoricalPrice = () => {

}

//https://iexcloud.io/docs/api/#ohlc
export const getOHLC = () => {

}

export const getNews = () => {

}

