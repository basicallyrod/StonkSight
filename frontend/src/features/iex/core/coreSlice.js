import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import coreService from './coreService'

const initialState = {
    core: {
        latestPrice: [],
        historicalPrice: []
    },
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getPrice = createAsyncThunk('lists/getTickerPrice',
    async(ticker, thunkAPI) => {
        try{
            console.log(`coreSlice getPrice: ${ticker}`)
            // const token = thunkAPI.getState().auth.user.token
            return coreService.getPrice(ticker);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)        
        }
    }
)

export const getOHLC = () => {

}

export const getHistoricalData = createAsyncThunk('lists/getHistorialData',
    async({ticker, range}, thunkAPI) => {
        try{
            console.log(`coreSlice getHistoricalData: ${ticker} | ${range}`)
            // const token = thunkAPI.getState().auth.user.token
            return coreService.getHistoricalData(ticker, range);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)        
        }
    }
)

export const coreSlice = createSlice({
    name: 'core',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPrice.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getPrice.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSucess = true
            state.core.latestPrice.push(action.payload)
        })
        .addCase(getPrice.rejected, (state, action) => {
            state.isLoading = false
            state.isSucess = true
            state.core.latestPrice.push(action.payload)
        })
        .addCase(getHistoricalData.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getHistoricalData.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSucess = true
            state.core.historicalPrice.push(action.payload)
        })
        .addCase(getHistoricalData.rejected, (state, action) => {
            state.isLoading = false
            state.isSucess = true
            state.core.historicalPrice.push(action.payload)
        })
    }
})

export const {reset} = coreSlice.actions

const coreReducer = coreSlice.reducer

export default coreReducer