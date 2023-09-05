import helpers from './iex_helpers/prevDataGetter.js'
// import { useSelector, useDispatch } from 'react-redux'


const prices1 = [283.46, 280.69, 285.48, 294.08, 293.90, 299.92, 301.15, 284.45, 294.09, 302.77, 301.97, 306.85, 305.05, 301.06, 291.97, 284.18, 286.48, 284.54, 276.82, 284.49, 275.01, 279.07, 277.85, 278.85, 283.76, 291.72, 284.73, 291.82, 296.74, 291.13]

const rsi = async(data) => {
    console.log(data)

    let rsi_value_arr = []
    let rsi_date_arr = []

    let gain_arr = [];
    let loss_arr = [];
    let gain_sum = 0;
    let loss_sum = 0;

    let prev_rs = 0
    // let chartDate = [data.chartData.map(day => {
    //     let temp_date = new Date(day.date) 
    //     return temp_date.toISOString()
    // })]

    //using the first data point, get the previous 14 data points
    let first_date = data.chartDate[0][0]
    console.log(first_date)
    // const previous_data = async(date) => {
    //     return await helpers.prevMarketData(data.chartSymbol[0][0], 14, date)

    // }

    // let init_rsi = previous_data(first_date)
    
    // console.log(init_rsi)

    let init_gain_arr = [];
    let init_loss_arr = [];
    let init_gain_sum = 0;
    let init_loss_sum = 0;
    

    // for(let i = 0; i <= previous_data.length; i++){
    //     // console.log(data.chartClose[0][i])
        
    //     let difference = (data.chartClose[0][i] - data.chartClose[0][i-1]);
        
    //     if(difference >= 0){
    //         init_gain_arr.push(difference);
    //         console.log(difference)
    //         init_gain_sum += difference;
    //     }
    //     else {
    //         init_loss_arr.push(difference);
    //         init_loss_sum += difference;
    //     }
    // }
    

    

    //first step to gather the first 14 sampling
    for(let i = 1; i <= 13; i++){
        // console.log(data.chartClose[0][i])
        console.log(data.chartDate[0][i])
        
        let difference = (data.chartClose[0][i] - data.chartClose[0][i-1]);
        if(difference >= 0){
            init_gain_arr.push(difference);
            // console.log(difference)
            init_gain_sum += difference;
        }
        else {
            difference = Math.abs(difference)
            // console.log(difference)
            init_loss_arr.push(difference);
            init_loss_sum += difference;
        }
    }
    // console.log(init_loss_arr.length)
    // console.log(init_gain_arr.length)
    // console.log(init_gain_sum)
    // console.log(init_loss_sum)
    
    // console.log(gain_sum)
    // console.log(loss_sum)
    let avg_gain = init_gain_sum/14
    let avg_loss = (init_loss_sum/14)
    // console.log(avg_gain)
    // console.log(avg_loss)
    let prev_avg_gain = avg_gain;
    let prev_avg_loss = avg_loss;

    let rs = init_gain_sum/init_loss_sum

    // console.log(avg_gain)
    // console.log(avg_loss)
    // console.log(difference)

    let rsi_value = 100 - (100/(1+rs))
    // let rsi_value = 100 - (100/(1+(avg_gain/avg_loss)))
    // console.log(rsi_value)
    // let rsi_object = {
    //     rsi: rsi_value,
    //     date: data.chartDate[0][14]
    // }
    // rsi_arr.push
    // rsi_value_arr.push(rsi_value)
    // rsi_date_arr.push(data.chartDate[0][14])

    for(let i = 14; i <= data.chartClose[0].length - 1; i++){   
        let difference = (data.chartClose[0][i] - data.chartClose[0][i-1]);
        console.log(data.chartDate[0][i])
        // console.log(difference)
        
        if(difference >= 0){
            prev_avg_gain = ((prev_avg_gain * 13) + difference) / 14
            prev_avg_loss = ((prev_avg_loss * 13) + 0) / 14
            // console.log(`avg gain = ${prev_avg_gain}`)
            // console.log(`avg loss = ${prev_avg_loss}`)
            // gain_sum += difference;
        }
        else {
            prev_avg_gain = ((prev_avg_gain * 13) + 0) / 14
            prev_avg_loss = ((prev_avg_loss * 13) + (difference * -1)) / 14
            // console.log(`avg gain = ${prev_avg_gain}`)
            // console.log(`avg loss = ${prev_avg_loss}`)         
            // loss_sum += difference;
        }
        rsi_value = 100 - (100/(1+(prev_avg_gain/prev_avg_loss)))
        // rsi_object = {
        //     rsi: rsi_value,
        //     date: data.chartDate[0][i]
        // }
        // console.log(data.chartDate[0][i])

        rsi_value_arr.push(rsi_value)
        rsi_date_arr.push(data.chartDate[0][i])
        // console.log(rsi_object)
    }

    
    
    // console.log(avg_gain)
    // console.log(avg_loss)
    // console.log(rsi_arr)
    let rsi_object = {
        rsi_date_arr,
        rsi_value_arr
    }
    console.log(rsi_object)

    return rsi_object


    
}

//step 2 goes here

export { rsi }
// export const rsiService = {
//     rsi
// }

// export default rsiService

// rsi(prices1)