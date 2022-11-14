import { useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {addTicker, getLists, reset} from '../../../features/lists/listSlice'
import {toast} from 'react-toastify' 
import Form from './index'
import listService from '../../../features/lists/listService'
import {getPrice} from '../../../features/iex/core/coreSlice'


function ListItemTicker(ticker) {
    const dispatch = useDispatch
    console.log(`ListItemTicker: ${ticker.ticker}`)
    console.log(`ticker: ${ticker} | ${ticker.ticker}`)

    
    // const [tickerPrice, setTickerPrice] = useState({
    //     tickerPrice:''
    // })

    const {tickerPrice, isLoading, isError, message} = useSelector ((state) =>
    state.tickerPrice)
    // useEffect(() => {
    //     if(isError) {
    //         console.log(message)
    //     }

    //     console.log(`dispatching getLists()`)
    //     dispatch(getPrice(ticker))

        
    //     // dispatch(getLists())
    //     console.log()
    //     // console.log(`watchlist lists: ${lists}`)

    //     return () => {
    //         // value
    //         dispatch(reset())
    //         // dispatch(getLists())
    //     }
    // }, [tickerPrice, isError, message])
    let value = ''
    const price = (ticker) => {
        console.log(`ListItem price: ${ticker}`)
  
        value = dispatch(getPrice(ticker))
        // useEffect(ticker)
        return value;
      };



    // const priceHelper = (ticker) =>{
    //     console.log(`ListItemTicker ${ticker}: ${tickerPrice}`)
    //     setTickerPrice(dispatch(getPrice(ticker)))
        
    //     return tickerPrice
    // }
    // dispatch(getPrice(ticker.ticker)).then((data)=>{
    //     console.log(`ListItemTicker ${ticker}: ${data}`)
    // })
    // console.log(value)
    // setTickerPrice(value)


    



    //use onChange when the value of price changes according to stock market updates
    //   const onChange = (err) => {
    //     setTickerName((prevState) => ({
    //         ...prevState,
    //         [err.target.name]: err.target.value,
    //     }))
    //     console.log('success')
  
    //   };

    return (
        <>
            <div>
                {/* <h2>Ticker: {ticker}</h2> */}
                {/* <h3>Ticker Price: {tickerPrice}</h3> */}
                <h3>Ticker Price: {price}</h3>

            </div>
        
        </>
    )
}

export {ListItemTicker}