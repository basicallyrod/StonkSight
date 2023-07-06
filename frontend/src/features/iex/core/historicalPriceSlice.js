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
            state.isSucess = true
            // action.payload.map((index) => (
            //     state.historicalPrice.push(index)
            // ))
            state.historicalPrice.push(action.payload)
        })
        .addCase(getHistoricalData.rejected, (state, action) => {
            state.isLoading = false
            state.isSucess = true
            // state.historicalPrice.push(action.payload)
        })
        .addCase(getSpecificHistoricalData.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getSpecificHistoricalData.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSucess = true
            state.historicalPrice[action.meta.arg.index].unshift(action.payload)
            // console.log(state.historicalPrice[action.meta.arg.index])
            // state.historicalPrice.unshift(action.payload)
        })
        .addCase(getSpecificHistoricalData.rejected, (state, action) => {
            state.isLoading = false
            state.isSucess = true
            // state.historicalPrice.push(action.payload)
        })
        
    }
})

export const {reset} = historicalPriceSlice.actions

const historicalPriceReducer = historicalPriceSlice.reducer

export default historicalPriceReducer