import axios from 'axios'

const API_URL = '/api/lists/'


//Create new list
const createList = async (listData, token, uid) => {
    console.log(`uid: ${uid}`)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }


    console.log(`listService createLists: ${token}  | ${listData} | ${uid}`)
    console.log(API_URL + 'user/' + uid + '/list')
    const response = await axios.post(API_URL + uid, listData, config)
    return response.data


}

const getLists = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    console.log(`listService getLists ${token}`)
    const response = await axios.get(API_URL, config)
    return response.data
}
const deleteList = async (listId, token, uid) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    // const data = {
    //     "listId": listId
    // }
    // console.log(data)
    const response = await axios.delete(API_URL + uid + '/' + listId, config)
    
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
    console.log(listData)
    console.log(`listService addTicker: ${token}  | ${listData.listName} | ${listData.tickerName}`)
    const response = () =>{ 
        return axios.put(
        API_URL + listData.listName + '/' + listData.tickerName, 
        {
            tickerName: listData.tickerName
        }, 
        config
        )
    }
    response()
    const updatedList = await axios.get(API_URL, config)

    

    console.log(updatedList.data)
    return updatedList.data
    
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


