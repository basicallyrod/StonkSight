// const message = require('./moving_average');
import { rolling_ema } from "./moving_average.js";
// console.log(message.message)
// import { message } from "./moving_average.mjs";
// console.log(message)

// need to manage the array of the macd so you can have macd array

let prices = 
    [12, 14, 15, 16, 20, 
    25, 18, 17, 23, 25, 
    28, 29, 30, 26, 31, 
    35, 38, 40, 44, 48, 
    52, 55, 58, 60, 56,
    58, 61, 64, 66, 71,
];

let prices1 = 
    [10.4, 10.5, 10.1, 10.48, 10.51, 
        10.8, 10.8, 10.71, 10.79, 11.21, 
        11.42, 11.84, 11.75, 11.75, 11.81, 
        11.79, 11.7, 11.66, 11.62, 11.58, 
        12.08, 12.21, 12.09, 12.17, 12.43, 
        12.54, 12.47, 12.84, 12.78, 13,
        12.74, 12.25, 12.68, 12.34, 13.64, 
        14.1, 13.93, 14.05, 14.11, 13.98, 
        13.77, 13.85
        
    ]
// let window = 7;
let period = 12;
let period1 = 26;
// rolling_ema(prices1, period)

// const rolling_ema = (prices, rolling_period) => {
//     if(!prices || prices.length < rolling_period){
//         return [];
//     }
//     // let smoothing_period = 2;
//     // for(let i = 0; i <= prices.length - 1; i++){

//     //     let current_ema;
//     //     for(let j = i - smoothing_period; j <= i; j++){
//     //         current_ema = (prices[i].close * (smoothing_period/rolling_period+1))
//     //     }
//     // }

//     // let smoothing = (2/rolling_period + 1)

//     //calculates the first sma to be used by ema
//     let first_ema_data = 0
//     for(let i = 0; i < rolling_period; i++){
//         first_ema_data += prices[i].close;
//     } 
//     let first_ema_value = first_ema_data/rolling_period;
    

//     let multipler = 2/(rolling_period + 1);
//     // console.log(rolling_period)
//     // console.log(multipler)

//     const ema = (current_price, prev_ema) => {
//         // console.log(`current price: ${current_price} \nprev_ema: ${prev_ema} \n multipler: ${multipler}`)
//         let ema_value = (current_price * multipler) + (prev_ema * (1-multipler))
//         return ema_value
//     }

//     let prev_ema = 0;
//     //start the rolling ema calculations
//     let rolling_ema_value = []
//     for(let i = rolling_period - 1;  i < prices.length; i++) {
//         //current closing price iteration
//         // let closing_price = prices[i].close;
//         // console.log(i)


        

//         if (i === rolling_period - 1){
//             // ema(prices[i].close, first_ema_value)
//             // prev_ema = ema(prices[i].close, first_ema_value)
//             // console.log(`ema = ${prices[i].close} - ${first_ema_value}`)
//             // console.log(prev_ema)
//             // console.log(first_ema_value)
//             prev_ema = first_ema_value
//             rolling_ema_value.push(first_ema_value)
//         }
//         else {
//             // console.log(prices[i].close)
//             // console.log(prev_ema)
//             rolling_ema_value.push(ema(prices[i].close, prev_ema))
//             prev_ema = ema(prices[i].close, prev_ema)
//             // // console.log(prev_ema)
            
//         }
//     }
//     // console.log(rolling_ema_value)
//     return rolling_ema_value;
// }

const macd = (data) => {
    console.log(data)
    let macd_value_arr = []
    let macd_date_arr = []

    let prices = data.chartClose[0];
    console.log(prices)

    // let prices = 
    //     [12, 14, 15, 16, 20, 
    //     25, 18, 17, 23, 25, 
    //     28, 29, 30, 26, 31, 
    //     35, 38, 40, 44, 48, 
    //     52, 55, 58, 60, 56,
    //     58, 61, 64, 66, 71,
    //     ];
    let period = 12;
    let period1 = 26;

    // console.log(`rolling_ema(prices, 12) : ${rolling_ema(prices, period)}`)
    // console.log(`rolling_ema(prices, 26) : ${rolling_ema(prices, period1)}`)
    // console.log(rolling_ema(prices, 26))
    // const macd_line = rolling_ema(prices, 12) - rolling_ema(prices, 26)

    // const temp = prices.length - 12 - 1;
    // const ema26_length = prices.length - 26 - 1;

    let ema12 = rolling_ema(prices, period)
    let ema26 = rolling_ema(prices, period1)

    console.log(ema12)
    console.log(ema26)

    let macd_max_length = ema12.length - ema26.length;


    for(let i = 0; i <= ema26.length - 1; i++){
        console.log(i)
        console.log(data.chartDate[0][i + period1 + 1])
        console.log(ema12[i + 13])
        console.log(ema26[i])
        let macd_value = ema12[i + 13] - ema26[i]
        macd_value_arr.push(macd_value)
        macd_date_arr.push(data.chartDate[0][i + period1 + 1])

        //wanna get the starting position of 14(18 elements)
        //18 - 4
        //ema12.length - 1 - ema26.length
        //30 - 4 = 26

    }
    


    // const tempi = temp 

    console.log(macd_value_arr)
    console.log(macd_date_arr)
    let macd_object = {
        macd_date_arr,
        macd_value_arr
    }
    console.log(macd_object)
    return macd_object;
}

//using rolling_ema function, average the macd_value_arr 
const signal = (prices1, period, period1) => {
    let signal_arr = []
    const signal_line = rolling_ema(macd(prices1, period, period1), 9)
    console.log(signal_line)
    for(let i = 0; i < signal_line.length; i++){
        
    }
    return signal_line;
}

// macd(prices1, period, period1)
// signal(prices1, period, period1)

export {macd, signal}

// export const macdService = {
//     signal, macd
// }

// export default macdService

// console.log(rolling_ema(prices, 12))
// console.log(macd())
// console.log(signal())
