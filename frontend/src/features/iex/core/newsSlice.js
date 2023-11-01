import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import coreService from './coreService'
import { format, compareAsc } from 'date-fns'

const initialState = {
    articles: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getArticles = createAsyncThunk('articles/getArticles',
    async({ticker}, thunkAPI) => {
        console.log(ticker)
        try {
            if(ticker == null){

            }
            else {
                console.log(newsSlice)
                // const token = thunkAPI.getState().auth.user.token;
                // const uid = thunkAPI.getState().auth.user._id;
    
                let articles = coreService.getArticles(ticker)
                console.log(articles)
                // articles.map((entry,index) => {
                //     console.log(entry)
                //     console.log(index)
                // })
                return articles
            }

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
            return thunkAPI.rejectWithValue(message)    
        }


    }
)

export const newsSlice = createSlice({
    name: 'newsArticles',
    initialState, 
    reducers: {
        reset: (state) => {return initialState},
    },
    extraReducers: (builder) => {
        builder
        .addCase(getArticles.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getArticles.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            console.log(action.payload)
            let articles = action.payload
            articles.map((entry, key) => {
                console.log(entry)
                // console.log(format(articles[key].datetime, "MMM d"))
                articles[key].datetime = format(articles[key].datetime, "MMM d")
            })
            state.articles.push(articles)
        })
        .addCase(getArticles.rejected, (state, action) => {
            state.isLoading = false
            state.isLoading = false
        })
    }
})

export const {reset} = newsSlice.actions

const newsSliceReducer = newsSlice.reducer

export default newsSliceReducer