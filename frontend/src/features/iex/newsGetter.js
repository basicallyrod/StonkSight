// import { response } from "express"
import axios from 'axios'
// import {getPrice} from '../features/iex/'

let IEX_URI = 'https://cloud.iexapis.com/stable/'

let token = process.env.IEX_TOKEN

export const getArticles = (ticker) => {
    axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/news?token=${token}`)
    .then(res => {
        if(res.ok){
            throw new Error(`Request failed with status ${res.status}`)
        }
        // return response.json()
        console.log(res.data)
        return res.data
    })

    .catch(error => console.log(error))

}