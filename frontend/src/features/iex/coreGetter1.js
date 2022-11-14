import { response } from "express"
import axios from 'axios'

let IEX_URI = 'https://cloud.iexapis.com/stable/'

let token = process.env.IEX_TOKEN

export const priceGetter = () => {
    axios.get(`https://cloud.iexapis.com/stable/stock/aapl/quote?token=pk_f2b12e738efc48ffbac89e2a756fb545`)
    .then(res => {
        if(!res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(res)
        return res
    })

    .catch(error => console.log(error))

}

export const historicalPriceGetter = () => {

}

//https://iexcloud.io/docs/api/#ohlc
export const ohlcGetter = () => {

}

export const newsGetter = () => {

}

