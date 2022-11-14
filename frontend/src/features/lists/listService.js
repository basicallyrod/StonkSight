import axios from 'axios'

const API_URL = '/api/lists/'


//Create new list
const createList = async (listData, token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }


    console.log(`listService createLists: ${token}  | ${listData}`)
    const response = await axios.post(API_URL, listData, config)
    return response.data


}

const getLists = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
    return response.data
}
const deleteList = async (listId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(API_URL + listId, config)
    
    return response.data
}

const updateList = async (listId, listData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(API_URL, {listId: listId,tickerName: listData.tickerName}, config)
    return response.data
    
}

const addTicker = async (listData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    console.log(`listService addTicker: ${token}  | ${listData.listId} | ${listData.tickerName}`)
    const response = await axios.put(
        API_URL + '/' + listData.listId + '/', 
        {
            listId: listData.listId,
            tickerName: listData.tickerName
        }, 
        config
    )
    return response.data
    
}

const deleteTicker = async (listId, listData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + listId, listData, config)
    return response.data
    
}

export const listService = {
    createList,
    getLists,
    deleteList,
    updateList,
    addTicker,
    deleteTicker,
}

export default listService


// const goalService = {
//     createList,
//     getLists,
//     deleteList,
//   }
  
// export default goalService


