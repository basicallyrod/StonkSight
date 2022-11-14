import { useDispatch } from 'react-redux'
import { deleteList } from '../../../features/lists/listSlice'
import Form from './index'

//create a helper function to get the data from iex


{/* <div className ="list">
<div>{new Date(list.createdAt).toLocaleString('en-US')}</div>
<h2>{list.text}</h2>
<button onClick = {() => dispatch(deleteList(list._id))}
className = 'close'>
    X
</button>
</div> */}

//the function will take in the name of a ticker and grab the data from iex
function ListItem2({list}) {
    const dispatch = useDispatch()
    console.log(`ListItem ${list}`)
    return (
      <div className='list'>
        {/* <div>{new Date(list.createdAt).toLocaleString('en-US')}</div> */}
        {/* <div className='lists'> */}
        {/* </div> */}
        <h2>{list.listName}</h2>
        <button onClick={() => dispatch(deleteList(list._id))} className='close'>
          X
        </button>
      </div>

    )
}

export {ListItem2}