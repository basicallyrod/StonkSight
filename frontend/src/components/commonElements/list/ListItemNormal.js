import { useDispatch } from 'react-redux'
import { deleteList } from '../../../features/lists/listSlice'

//create a helper function to get the data from iex


//the function will take in the name of a ticker and grab the data from iex
function ListItem({list}) {
    const dispatch = useDispatch()

    return (
        <>
            <div className ="list">
                <div>{new Date(list.createdAt).toLocaleString('en-US')}</div>
                <h2>{list.text}</h2>
                <button onClick = {() => dispatch(deleteList(list._id))}
                className = 'close'>
                    X
                </button>
            </div>
        </>
    )
}

export {ListItem}