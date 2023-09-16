import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import listService from './listService'

const initialState = {
    lists: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}


export const createList = createAsyncThunk('lists/create', 
    async (listData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            const uid = thunkAPI.getState().auth.user._id;
            console.log(`uid: ${uid}`)
            console.log(`listSlice createList: ${listData}`)
            return await listService.createList(listData, token, uid)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
        }
    }
)


export const getLists = createAsyncThunk('lists/getAll',
    async (_, thunkAPI) => {
        try {
            const listIndex = thunkAPI.getState().lists;
            const token = thunkAPI.getState().auth.user.token
            console.log(`FrontEnd getLists: ${token}`)
            return await listService.getLists(token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
        }
    }
)


export const deleteList = createAsyncThunk('lists/delete', 
    async (id, thunkAPI) => {
        console.log(id)
        try {
            const token = thunkAPI.getState().auth.user.token
            const uid = thunkAPI.getState().auth.user._id;
            console.log(`listSlice deleteList: ${id}`)
            return await listService.deleteList(id, token, uid)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateList = createAsyncThunk('lists/update', 
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.list.token
            return await listService.updateList(id, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
        }
    }
)

export const addTicker = createAsyncThunk('lists/addTicker',
    async (listData, thunkAPI) => {
        try{

            const token = thunkAPI.getState().auth.user.token
            console.log(`listSlice addTicker: ${listData.listName} | ${listData.tickerName} | ${token}`)
            return await listService.addTicker(listData, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteTicker = createAsyncThunk('lists/deleteTicker',
    async (listData, thunkAPI) => {
        try{
            const token = thunkAPI.getState().auth.user.token
            return await listService.deleteTicker(listData, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
        }
    }
)

export const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createList.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createList.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists[0].push(action.payload)
        })
        .addCase(createList.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // state.lists.push(action.payload)
        })

        
        .addCase(getLists.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getLists.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists.push(action.payload)
        })
        .addCase(getLists.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists.push(action.payload)
        })


        .addCase(deleteList.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteList.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists = state.lists.filter((list) => list._id !== action.payload.id)
        })
        .addCase(deleteList.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists.push(action.payload)
        })


        .addCase(updateList.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateList.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists = state.lists.filter((list) => list._id !== action.payload.id)
        })
        .addCase(updateList.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists.push(action.payload)
        })

        
        .addCase(addTicker.pending, (state) => {
            state.isLoading = true
        })
        .addCase(addTicker.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // console.log(action)
            // state.lists.filter((list) => list.listName === action.meta.arg.listName).
        })
        .addCase(addTicker.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // state.lists.push(action.payload)
        })


        .addCase(deleteTicker.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteTicker.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists = state.lists.filter((list) => list._id !== action.payload.id)
        })
        .addCase(deleteTicker.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lists.push(action.payload)
        })
    }
})

export const {reset} = listSlice.actions
// export default listSlice.reducer

const listReducer =  listSlice.reducer

export default listReducer