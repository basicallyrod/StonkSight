import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import coreService from './coreService'

const initialState = {
    historicalPrice: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

//specificHistoricalData can be inserted into historicalPrice as a copy of the data from getHistoricalData, to ensure immutablity and no bugs

export const getSpecificHistoricalData = createAsyncThunk('lists/getSpecificHistorialData',
    async({ticker, day, index}, thunkAPI) => {
        console.log(ticker)
        // console.log(symbol)
        console.log(day)
        try{
            if(ticker == null ){
                //do not run coreService
                return
            }
            else {
                console.log(`coreSlice getSpecificHistoricalData: ${ticker} | ${day}`)
                // const token = thunkAPI.getState().auth.user.token
                return coreService.getSpecificHistoricalData(ticker, day);
        }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)        
        }
    }
)

export const getHistoricalData = createAsyncThunk('lists/getHistorialData',
    async({ticker, range, index}, thunkAPI) => {
        try{
            if(ticker == null ){
                //do not run coreService
                return
            }
            else {
                // console.log(`coreSlice getHistoricalData: ${ticker} | ${range}`)
                // const token = thunkAPI.getState().auth.user.token
                return coreService.getHistoricalData(ticker, range);
        }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)        
        }
    }
)

export const getSpecificHistoricalDataRange = createAsyncThunk('lists/getSpecificHistoricalDataRange',
    async({ticker, firstDay, lastDay, index}, thunkAPI) => {
        try{
            if(ticker == null ){
                //do not run coreService
                return
            }
            else {
                // let firstDay = 
                console.log((`https://cloud.iexapis.com/stable/time-series/HISTORICAL_PRICES/${ticker}/?from=${firstDay}&to=${lastDay}&token=pk_f2b12e738efc48ffbac89e2a756fb546`))

                console.log(`coreSlice getHistoricalData: ${ticker} | ${firstDay} | ${lastDay}`)
                // const token = thunkAPI.getState().auth.user.token
                return coreService.getSpecificHistoricalDataRange(ticker, firstDay, lastDay);
        }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)        
        }
    }
)

export const historicalPriceSlice = createSlice({
    name: 'historicalPrice',
    initialState, 
    reducers: {
        reset: (state) => {return initialState},
    },
    extraReducers: (builder) => {
        builder
        .addCase(getHistoricalData.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getHistoricalData.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // action.payload.map((index) => (
            //     state.historicalPrice.push(index)
            // ))
            // if(state.historicalPrice.includes)
            // state.historicalPrice[0].map(e => {
            //     console.log(e)
            // })
            // if(state.historicalPrice[0]){
            //     console.log(state)
            // }
            //initial load
            if(!state.historicalPrice[0]){
                state.historicalPrice.push(action.payload)
                console.log(state.historicalPrice)
            }
            else{
                console.log('post load')
                //action.meta.arg.index
                console.log(state.historicalPrice[0][0].symbol)
                if(!state.historicalPrice.find((element) => {
                    console.log(element[0].symbol)
                    let found = element.find((data) => data.symbol === action.meta.arg.ticker)
                    console.log(found)
                    return found;
                })){
                    if(undefined){
                        console.log('the element doesnt exists')
                    }
                    else{
                        console.log('the element exists')
                        state.historicalPrice.unshift(action.payload)
                    }
                    
                    
                }
                console.log(state.historicalPrice[0][0].symbol)

            }

            console.log(action.payload)
            // console.log(state.)
            // state.historicalPrice.push(action.payload)
        })
        .addCase(getHistoricalData.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // state.historicalPrice.push(action.payload)
        })
        .addCase(getSpecificHistoricalData.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getSpecificHistoricalData.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.historicalPrice[action.meta.arg.index].unshift(action.payload)
            // console.log(state.historicalPrice[action.meta.arg.index])
            // state.historicalPrice.unshift(action.payload)
        })
        .addCase(getSpecificHistoricalData.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // state.historicalPrice.push(action.payload)
        })
        .addCase(getSpecificHistoricalDataRange.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getSpecificHistoricalDataRange.fulfilled, (state, action) => {
            console.log(action.payload)
            // console.log(action.arg.ticker)
            let data = action.payload
            console.log(data)

            let index = state.historicalPrice.findIndex((element) => {
                // element
                let found = element.find((data) => {
                    return data.symbol === action.meta.arg.ticker
                })
                console.log(found)
                return found
            })
            console.log(index)

            state.isLoading = false
            state.isSuccess = true
            // data.map((day) => {
            //     console.log(day.priceDate)
            //     if(state.historicalPrice.includes(day.priceDate)){
            //         console.log('exists')
            //     }
            //     else{
            //         state.historicalPrice[action.meta.arg.index].unshift(day)
            //     }
                
            // })

            //check if the earliest date(last element) is already in the historicalPrice array

            //look at each index of the historicalPrice array
            //if we don't find earlist date in the state, update the state
            if(!state.historicalPrice[index].find((element) => {
                console.log(element)
                console.log(data[data.length - 1].priceDate)
                console.log(element.priceDate)
                //look at each index for the index of the historicalPrice array(the day of X stock) and see if we can find the earlist date
                // let found = element.find((data) => {
                //     console.log(data.priceDate)
                //     return (data.priceDate === action.payload[action.payload.length - 1].priceDate)
                // })
                // console.log(found)
                // console.log(found.priceDate)
                // return found;
                return (element.priceDate === action.payload[action.payload.length - 1].priceDate)
            })){
                //if not found, return undefined
                if(undefined){
                    console.log('the element exists')

                }
                //if found return the first element
                else{
                    console.log('the element doesnt exists')
                    data.map((day) => {
                        console.log(day.priceDate)
                        if(state.historicalPrice[index].includes(day.priceDate)){
                            console.log('exists')
                        }
                        else{
                            state.historicalPrice[index].unshift(day)
                        }
                        
                    })
                    // state.historicalPrice.unshift(action.payload)
                }
                
                
            }
            // for(let day of data){
            //     console.log(day)
            //     if(data.includes(day)){
            //         continue;
            //     }
            //     else{
            //         state.historicalPrice[action.meta.arg.index].unshift(day)
            //     }
            // }

            // state.historicalPrice[action.meta.arg.index].unshift(data)
            // state.historicalPrice[action.meta.arg.index].unshift(action.payload)
            
            // console.log(state.historicalPrice[action.meta.arg.index])
            // state.historicalPrice.unshift(action.payload)
        })
        .addCase(getSpecificHistoricalDataRange.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // state.historicalPrice.push(action.payload)
        })
        
    }
})

export const {reset} = historicalPriceSlice.actions

const historicalPriceReducer = historicalPriceSlice.reducer

export default historicalPriceReducer