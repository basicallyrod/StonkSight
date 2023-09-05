import { useState, useEffect, useCallback, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify' 

import { useForm } from 'react-hook-form';
// import {useSelector} from 'react-redux'
// import {useSelector} from 'react-redux'
import {ListForm} from '../components/commonElements/list/ListForm'
import {ListItem} from '../components/commonElements/list/ListItem'
import {TickerItem} from '../components/commonElements/list/TickerItem'

import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {createList, getLists, deleteList, reset} from '../features/lists/listSlice'
import {getPrice} from '../features/iex/core/coreSlice'


import Home from "../components/pages/home/index.js"
import {Button} from "../components/commonElements/buttons/index.js"
import Form from '../components/commonElements/list'

import {ChartDiv} from "../components/chart/chartDiv"

import {CandlestickChartContainer} from './candlestickchart'

function WatchlistContainer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth);
    const {lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists)
    const {core} = useSelector ((state) => state.core )

    let selectedTickers = ['GME']

    let [tickerNameArray, setTickerNameArray] = useState(null)
    let [tickerPriceArray,setTickerPriceArray] = useState(null)

    let chartHelper = useCallback((index) => {



    })

    useEffect(() => {
        if(isError) {
            console.log(message)
        }
        if(!user) {
            navigate('/login')
        }
        console.log(`dispatching getLists()`)

        const listData = async () => {
            const data = await dispatch(getLists())
            // console.log(data.payload[0].tickerList)
            // tickerListArray = data.payload[0].tickerList
            const tickerList = data.payload[0].tickerList
            setTickerNameArray(tickerList)
            let tempPrice = []
            tickerList.map(async(ticker) => {
                // console.log(tickerListArray)
                if(ticker === null){

                }
                else {
                    const price = await tickerPrice(ticker)
                    // console.log(price)
                    tempPrice.push(price)
                    setTickerPriceArray(tempPrice)
                    // console.log(tempPrice)
                    return price
                }

                


            })
            
            return tickerList

        }

        const tickerPrice = async (ticker) => {
            const price = await dispatch(getPrice(ticker))
            // console.log(`Price: ${price}`)
            return price
        }
        
        
        listData()

        return () => {
            // console.log(lists)
            reset()
            // console.log(lists)
            // dispatch(getLists())
        }
    }, [user, navigate, isError, message, dispatch])

    // console.log({lists[0]})
    // const onSubmit = (err) => {
    //     err.preventDefault()
    //     // console.log('success')
    //     if(!listName) {
    //         toast.error('Please enter a name for the list')
    //     } else {
    //         console.log(`watchList onSubmit`)

    //         const listData = {
    //             listName
    //         }

            
    //         dispatch(createList(listData));
    //         // reset();
    //         dispatch(getLists());
            
    //     }
         
    // };

    // if(isLoading) {
    //     return <Spinner />
    // }

    const handleClick = () => {

    }


    //need to use useCallback so we can update it with the lists state?
    //the promise makes the code read it undef and never rerender it?
    const tickerList = useCallback() => {

        //takes in the element from tickerNameArray and returns the matching ticker symbols and prices from tickerPriceArray
        const listHelper = async(tickerPriceArray, tickerNameArray) => {

            //create a temp value to hold the list to return
            let tempArr = []

            // let tickerSymbol = tickerPriceArray.payload.Symbol
            // console.log(tickerSymbol)

            let tickerPrices = []

            //possibly create an array using tickerPriceArray.map and use "then" to manipulate the res without the race condition
            
            //iterate through the tickerNameArray
            tickerNameArray.filter(ele => ele !== '').forEach((tnaSymbol) => {
                // if(tnaSymbol === '') { continue }
                //iterate through the tickerPriceArray until we find a matching name
                tickerPriceArray.map((tpaSymbol, price, payload) => {
                    //if there is a matching symbol between the tna & tpa, store the symbol & price in the temp array as an object return the tpa symbol & price
                    console.log(tpaSymbol)
                    // console.log(tpaSymbol[0].payload.price)
                    console.log(tnaSymbol) 
                    // console.log(payload['price'])
                    // console.log(price)

                    if(tnaSymbol === tpaSymbol){

                        // let object = {tpaSymbol, price}
                        // tempArr.push(object)
                        console.log(tempArr)
                        // return object
                    }
                    //else iterate to the next element
                    else{
                        //leaving blank to iterate
                    }
                    return tempArr
                })
                return tempArr
            })
                

                    

            //return the new array



        }

        //will print out the elements and use another function to generate the list
        //takes in the tickerPriceArray and tickerNameArray to confirm the tickerNameArray to match with the correct index of tickerPriceArray
        const elementHelper = (tickerPriceArray, tickerNameArray) => {



            //
            console.log(tickerPriceArray)
            console.log(tickerNameArray)
            
            // if(tickerPriceArray != null && tickerNameArray !=null) {
            //     //run listHelper to generate the values
            //     // let tempArr = await listHelper(tickerPriceArray, tickerNameArray);

            //     // console.log(tickerPriceArray)
            //     // console.log(tickerNameArray)
            //     // console.log(tempArr)
            //     return (
            //         <>
            //             {/*map through the array given from listHelper*/}
            //             {/* {tempArr.map((symbol, price) => {
            //                 <h2>${symbol}: ${price}</h2>
            //             })} */}
            //             {/* <h2></h2> */}
            //             <h2>helper</h2>
            //             <h3>Not empty</h3>                    
                        
                        
            //         </>
            //     )
            // }
            // else {
            //     <>
            //         <h3> empty</h3>
            //     </>
            // }
        }

        return (
            <>   
                {/* <h3>{lists[0][0].tickerList.length}</h3>
                <h3>{lists[0][0].tickerList.length}</h3> */}
                {/* {render()} */}

                {/* <h3>{tickerListArray}</h3> */}

                {/* {tickerNameArray != null ? (
                    {tickerPriceArray != null ? (
                        // tickerPriceArray.payload.map(())
                        <h3>not empty</h3>
                    ) : (<h3>empty</h3>)}
                    <h3>not empty</h3>

                ) : (
                    <h3> empty</h3>
                )} */}
{/* {                {if ( tickerNameArray != null && tickerPriceArray != null) {
                    <h3>not empty</h3>
                }}
                else {
                    <h3> empty </h3>}
                } */}
                {/* {tickerListArray.map((ticker) => (
                    <h3>{ticker}</h3>
                ))} */}
                <h3>Ticker List</h3>    
                {/* {elementHelper(tickerPriceArray, tickerNameArray)}   */}
            </>
        )
    }
    // console.log(tickerListArray)

    
    // <h3>Ticker List</h3>  
    // <section className='content'>
    //     {lists.length > 0 ? (
    //     <div className='lists'>

    //          <h3>{lists[0].tickerList[0]}</h3>

    //     </div>
    //     ) : (
    //     <h3>You have not set any lists</h3>
    //     )}
    // </section>      
    return (
        <>
            <Home>
                <Home.Wrapper className = "heading">
                    {/* <Home.Title>Welcome {user && user.username} </Home.Title> */}
                    {/* <Home.Text>Watchlist Dashboard</Home.Text> */}

                

                {/* <ListForm onSubmit={this.props.lists} formData = {formData}/> */}
                <ListForm/>
                {/* <h1>ListName: {lists}</h1> */}

                <section className='content'>
                    <h3>List:</h3>
                    {/* {lists.length > 0 ? ( */}
                    <div className='lists'>
                    {/* {tickerList()} */}
                    
                        {/* <h3>{lists[0]}</h3> */}
                        {/* {lists[0].map((list) => (
                            <h3>{list}</h3>
                        ))} */}
                        {/* {lists[0].map((list) => (
                            <h3></h3>
                        ))} */}

                        
                        {/* {lists.map((list) => (
                            <h3>{list.lists[0].tickerList[0]}</h3>
                        ))} */}

                            
                             
                    </div>
                    {/* ) : (
                    <h3>You have not set any lists</h3>
                    )} */}
                </section>      
                {/* <h3>Ticker List</h3>       */}
                {/* uncomment above */}



                
            

                {/* <Form>
                    <Form.Wrapper>

                    </Form.Wrapper>
                </Form> */}
                {/* <Home.Wrapper className = "Content">
                    {lists.length > 0 ? (<Home.TexturedBody className = "lists">
                        {lists.map((list) => (
                            <>
                                <ListItem key={list._id} list={list} />
                            </>
                        ))}
                    </Home.TexturedBody>) : 
                    (<Home.Subtitle> You have not set any lists </Home.Subtitle>)}
                </Home.Wrapper> */}
                </Home.Wrapper>
                <Home.Wrapper>
                <CandlestickChartContainer
                    tickers = {selectedTickers}
                />
                    {/* <ChartDiv/> */}
                </Home.Wrapper>

            </Home>


        </>
    )
}

export {WatchlistContainer}