import { useSelector, useDispatch } from 'react-redux'
import { useRef} from 'react'
import {addTicker, getLists, reset} from '../features/lists/listSlice'
import {toast} from 'react-toastify' 
// import Form from '../components/commonElements/list/index'
import Form from '../components/commonElements/list/index'
import {useForm} from 'react-hook-form'

//create a helper function to get the data from iex



//the function will take in the name of a ticker and grab the data from iex
function ListItem({list}) {
    const dispatch = useDispatch();
    const { core } = useSelector((state) => state.core)
    
    const { register, handleSubmit} = useForm();
    const tickerNameRef = useRef(null)
    const {ref, ...rest} = register('tickerName')
    
    console.log(`ListItem State.core: ${core[0]}`)
    
    // const [tickerName, setTickerName] = useState({
    //   tickerName:''
    // })

    console.log(list.tickerList)
    
    // const onChange = (err) => {
    //   setTickerName((prevState) => ({
    //       ...prevState,
    //       [err.target.name]: err.target.value,
    //   }))
    // };

    const onSubmit = (data, err) => {
      console.log(data)
      err.preventDefault()
      if(!tickerNameRef) {
          toast.error('Please enter a ticker')
      } else {
          
          const listId = list._id
          const tickerName = tickerNameRef.current.value
          const listData = {
              listId,
              tickerName
          }
          
          console.log(`ListItem onSubmit: ${list._id} | ${listData}`)
          dispatch(addTicker(listData)) 
          dispatch(getLists())  
      }
    }

    // let latestPrice = core.latestPrice.latestPrice

    // console.log(latestPrice)


    return (
      <>


       {/* <form onSubmit={handleSubmit(onSubmit)}>
       <input {...rest} name="tickerName" ref={(e) => {
         ref(e)
         tickerNameRef.current = e  //you can still assign to ref
       }} />

       <button>Submit</button>
     </form> */}
         {/* <Form  onSubmit = {handleSubmit(onSubmit)}> */}
         {/* <Form onSubmit = {handleSubmit(onSubmit)}> */}
           <Form.Wrapper>
            <Form.TextInput onSubmit = {handleSubmit(onSubmit)}>
              <Form.Label>{list.listName}</Form.Label> 

                <Form.StyledInputWRef
                {...rest}
                name = 'tickerName'
                placeholder = "Add a ticker to watch"
                ref = {(e) => {
                  ref(e)
                  tickerNameRef.current = e
                }}
                //  onSubmit = {handleSubmit(onSubmit)}
              />


              <Form.StyledButton type = 'submit' className = 'list btn btn-block'>
                  Add Ticker
              </Form.StyledButton>

              {list.tickerList.length > 0 ? (
                <div className='lists'>
                  {list.tickerList.map((ticker, index) => (
                    <h3>{ticker} Price: ${core.latestPrice[index].latestPrice}</h3>
                        // <ListItem key = {list._id} list = {list} />
                  ))} 
                </div>
                ) : (
                <h3>You have not set any lists</h3>
                )
              }
            </Form.TextInput>
           </Form.Wrapper>
        
         
      
       </>

    )
}

export {ListItem}