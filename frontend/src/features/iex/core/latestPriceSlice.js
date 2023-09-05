import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import coreService from './coreService'

const initialState = {
    latestPrice: [],
    historicalData: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// const initialLatestPrice = (state) => {
//     core: {
//         latestPrice: [state.core.latestPrice],
//         historicalPrice: [state.core.historicalPrice];
//     },
//     isError: false,
//     isSuccess: false,
//     isLoading: false,
//     message: ''
// }


export const getPrice = createAsyncThunk('lists/getTickerPrice',
    async(ticker, thunkAPI) => {
        try{
            if(ticker == null ){
                //do not run coreService
                return
            }
            else {
                console.log(`coreSlice getPrice: ${ticker}`)
                // const token = thunkAPI.getState().auth.user.token
                return coreService.getPrice(ticker);

            }

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)        
        }
    }
)

export const getBulkLatestPrice = createAsyncThunk('lists/getBulkLatestPrice',
    async (list, thunkAPI) => {
        try{
            if(list == null) {
                return
            }
            else {
                console.log(list)
                console.log(`coreSlice getBulkLatestPrice: ${list}`)

                return coreService.getBulkLatestPrice(list);
            }
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

export const getHistoricalData = createAsyncThunk('lists/getHistoricalData',
    async({ticker, range}, thunkAPI) => {
        try{
            if(ticker == null ){
                //do not run coreService
                return
            }
            else {
                console.log(`coreSlice getHistoricalData: ${ticker} | ${range}`)
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

export const latestPriceSlice = createSlice({
    name: 'latestPrice',
    initialState,
    reducers: {
        reset: (state) => {return initialState}
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPrice.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getPrice.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.latestPrice.push(action.payload)
        })
        .addCase(getPrice.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.latestPrice.push(action.payload)
        })
        .addCase(getBulkLatestPrice.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getBulkLatestPrice.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.latestPrice.push(action.payload)
        })
        .addCase(getBulkLatestPrice.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.latestPrice.push(action.payload)
        })
        
    }
})

export const {reset} = latestPriceSlice.actions

const latestPriceReducer = latestPriceSlice.reducer

export default latestPriceReducer