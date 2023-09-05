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
            state.historicalPrice.push(action.payload)
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
            let data = action.payload
            console.log(data)
            state.isLoading = false
            state.isSuccess = true
            data.map((day) => {
                console.log(day.priceDate)
                if(state.historicalPrice.includes(day.priceDate)){
                    console.log('exists')
                }
                else{
                    state.historicalPrice[action.meta.arg.index].unshift(day)
                }
                
            })
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