
let prices = [12, 14, 15, 16, 20, 25, 18];
const prices1 = [
    {
        priceDate: "2023-02-14",
        close: 16,
    },
    {
        priceDate: "2023-02-15",
        close: 15,
    },
    {
        priceDate: "2023-02-16",
        close: 16,
    },
    {
        priceDate: "2023-02-17",
        close: 17,
    },
    {
        priceDate: "2023-02-20",
        close: 18,
    },
    {
        priceDate: "2023-02-21",
        close: 19,
    },
    {
        priceDate: "2023-02-22",
        close: 16,
    },
    {
        priceDate: "2023-02-23",
        close: 17,
    },
    {
        priceDate: "2023-02-24",
        close: 16,
    },
    {
        priceDate: "2023-02-27",
        close: 21,
    },
    {
        priceDate: "2023-02-28",
        close: 24,
    },
    {
        priceDate: "2023-03-01",
        close: 27,
    },
    {
        priceDate: "2023-03-02",
        close: 29,
    },
    {
        priceDate: "2023-03-03",
        close: 26,
    },
    {
        priceDate: "2023-03-06",
        close: 27,
    },
]

// let window = 7;
let rolling_period = 3;
const rolling_sma = (prices, rolling_period) => {
    if(!prices || prices.length < rolling_period){
        return [];
    }

    // let index = window - 1;
    let sum = 0;
    prices.map(x => sum += x)

    let rolling_array = []

    for(let i = rolling_period - 1; i <= prices.length - 1; i++){

        let rolling_sum = 0
        // console.log(i)

        //gets the rolling_window for i
        for(let j = i - 2; j <= i; j++){
            // console.log(j)
            // console.log(j - rolling_period + 1)
            rolling_sum += prices[j].close
            
        }
        // console.log(`rolling_sum = ${rolling_sum}`)
        // console.log(`rolling_ma = ${rolling_sum/rolling_period}`)
        rolling_array.push(rolling_sum/rolling_period)


    }

    // let sma_value = sum/window;

    // console.log(sma_value)
    // console.log(rolling_array)

    return rolling_array


}


const rolling_ema = (prices, rolling_period) => {
    if(!prices || prices.length < rolling_period){
        return [];
    }
    // let smoothing_period = 2;
    // for(let i = 0; i <= prices.length - 1; i++){

    //     let current_ema;
    //     for(let j = i - smoothing_period; j <= i; j++){
    //         current_ema = (prices[i].close * (smoothing_period/rolling_period+1))
    //     }
    // }

    // let smoothing = (2/rolling_period + 1)

    //calculates the first sma to be used by ema
    let first_ema_data = 0
    for(let i = 0; i < rolling_period; i++){
        first_ema_data += prices[i].close;
    } 
    let first_ema_value = first_ema_data/rolling_period;

    let multipler = 2/(rolling_period + 1);
    console.log(multipler)

    const ema = (current_price, prev_ema) => {
        let ema_value = (current_price * multipler) + (prev_ema * (1-multipler))
        return ema_value
    }

    let prev_ema = 0;
    //start the rolling ema calculations
    let rolling_ema_value = []
    for(let i = rolling_period; i < prices.length; i++) {
        //current closing price iteration
        // let closing_price = prices[i].close;


        

        if (i === rolling_period){
            // ema(prices[i].close, first_ema_value)
            prev_ema = ema(prices[i].close, first_ema_value)
            rolling_ema_value.push(prev_ema)
        }
        else {
            // ema(prices[i].close, prev_ema)
            prev_ema = ema(prices[i].close, prev_ema)
            rolling_ema_value.push(prev_ema)
        }
    }
    // console.log(rolling_ema_value)
    return rolling_ema_value;
}

export { rolling_sma, rolling_ema}

// export const maService = {
//     rolling_sma, rolling_ema
// }

// export default maService
// const message = 'hello world';

// export {message}
console.log(rolling_sma(prices, rolling_period))
console.log(rolling_ema(prices, rolling_period))