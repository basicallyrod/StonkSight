import { useState, useEffect, useCallback, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify' 
import { useForm } from 'react-hook-form';
import {ListForm} from './ListForm'
import {TickerListForm} from './TickerListForm'
// import {ListItem} from './ListItem'
import {TickerItem} from '../components/commonElements/list/TickerItem'
import { ModalProvider } from 'styled-react-modal';
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {createList, getLists, deleteList, addTicker, deleteTicker} from '../features/lists/listSlice'
import {getPrice, reset} from '../features/iex/core/latestPriceSlice'
import Home from "../components/pages/home/index.js"
import {Button} from "../components/commonElements/buttons/index.js"
import Form from '../components/commonElements/list'
import {getHistoricalData, getSpecificHistoricalData} from '../features/iex/core/historicalPriceSlice'
import {ChartDiv} from "../components/chart/chartDiv"
import {CandlestickChartContainer} from './candlestickchart'
import { Toggle, ToggleRow } from '../components/commonElements/buttons/styles/buttons';
import { StyledButton } from '../components/commonElements/list/styles/form';
import { ThemeProvider } from 'styled-components';
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function WatchlistContainer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth);
    const {lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists)
    const {latestPrice} = useSelector ((state) => state.latestPrice.latestPrice )
    const {historicalPrice} = useSelector((state) => state.historicalPrice)//react redux state
    let [selectedTickers, setSelectedTickers] = useState([])
    let [watchlistArray, setWatchlistArray] = useState([])
    let [watchlistDataArray, setWatchlistDataArray] = useState([])
    let [tickerPriceArray,setTickerPriceArray] = useState([])
    let [tnaCounter, setTnaCounter] = useState(0)
    let [priceObject, setPriceObject] = useState([])
    let [isOn, setIsOn] = useState([])
    
    const list = useRef();

    let tempSelectedTickers = []
    let tickerHistoricalPrices = []
    let [stateHistoricalPrice, setStateHistoricalPrice] = useState([]) //react state
    
    
    const watchlistRefs = useRef([]);
    const watchlists = [
        {
            watchlist: true,
        },
        {
            watchlist: true,
        },

    ]

    let watchlistsStateContent = [];

    const watchlistsStateContentMap = watchlists.map((watchlist) => {
        watchlistsStateContent.push({
            disabled: false,
            value: "",
        });
    });

    const [watchlistsState, setWatchlistsState] = useState(watchlistsStateContent);

    function handleWatchlist(i) {
        const updateWatchlistInState = watchlistsState.map((watchliststate, index) => {
            if ( i === index) {
                const newwatchliststate = {
                    ...watchliststate,
                    disabled: !watchliststate.disabled,
                };
                return newwatchliststate;
                
            } else {
                return watchliststate;

            }

        });
        setWatchlistsState(updateWatchlistInState)
    }

    function handleScrollSnap(i, value) {
        const updateWatchlistInState = watchlistsState.map((watchliststate, index) => {
            if ( i === index) {
                const newwatchliststate = {
                    ...watchliststate,
                    value: value,
                };
                return newwatchliststate;
                
            } else {
                return watchliststate;

            }

        });
        setWatchlistsState(updateWatchlistInState)
    }

    useEffect(() => {
        console.log(watchlistsState);
    }, [watchlistsState]);
    
    //update chartData so that it can be used by the function outside of this scope
    const tickerHistoricalData = async (ticker, range, index) => {
        const historicalData = await dispatch(getHistoricalData({ticker, range, index}))

        tickerHistoricalPrices.push(historicalData)
        
        return tickerHistoricalPrices
    }    
    // fetches the tickers in the list
    const historicalDataHelper = async (data, index) => {
        let range = '1m'
        //this will grab the historical data of each ticker in the first list
        data.map((ticker, index) => {
            tickerHistoricalData(ticker, range, index)
        })
        setStateHistoricalPrice([tickerHistoricalPrices])
    }
    //change the state of isOn at a specific index
    const handleToggle = (e, id , id1) => {
        const updatedIsOn = {...watchlistArray[id].tickerList[id1], isOn: !watchlistArray[id].tickerList[id1].isOn}
        
        
        let listObject = {...watchlistArray[id]}

        // //Slice the list & ticker out of the button pressed
        const newwatchlistArray = [
            ...watchlistArray[id].tickerList.filter(a => a.index !== id1)
        ]

        // //Update the tickerList Array with the new info
        const slicedTNATicker = [
            ...newwatchlistArray.slice(0, id1), //items before the insertion point
            updatedIsOn, //updated isOn at the index
            ...newwatchlistArray.slice(id1) //items after the insertion point
        ]

        //shove the slicedTNATicker 
        listObject = {
            ...watchlistArray[id], tickerList: slicedTNATicker
        }

        //filter using the id as the key
        const newwatchlistArray1 = [
            ...watchlistArray.filter(a => a.key !== id)
        ]
        const slicedTNAList = [
            ...newwatchlistArray1.slice(0,id),
            listObject,
            ...newwatchlistArray1.slice(id)
        ]
        setWatchlistArray(slicedTNAList)
        //remove the ticker if it is in the array
        if(selectedTickers.includes(watchlistArray[id].tickerList[id1].symbol)){
            setSelectedTickers(
                selectedTickers.filter(t =>
                    t !== watchlistArray[id].tickerList[id1].symbol  
                )
            )
        }
        //add the ticker if not in the array
        else {
            setSelectedTickers([
                ...selectedTickers,
                watchlistArray[id].tickerList[id1].symbol
            ])
        }
    }

    const [seconds, setSeconds] = useState(0);





    const tickerPrice = (ticker) => {
        const price = dispatch(getPrice(ticker))
        return price
    }

    const priceStateHelper = async() => {
        let prices = listData().then(async (res) => {
            console.log(res)
            let tempTickerNames = []
            let initialState = res.map(async(list,key) => {
                let tickerList = list.tickerList.map((element, index) => {
                    let price = tickerPrice(element).then((res) => {
                        return ({
                            index: index,
                            symbol: element,
                            price: res.payload.latestPrice,
                            changePercent: res.payload.changePercent,
                            isOn: false,
                        }
                    )})
                    return price
                })

                let tempObject = {
                    key: key,
                    id: list._id,
                    listName:list.listName,
                    tickerList: tickerList
                    // isOn: false
                }
                tempTickerNames.push(tempObject)
                return await tempObject
            })
            return Promise.all(initialState).then((value) => {
                let tempObjectArr = []
                console.log(value)
                let nextState = value.map((res) => {
                    let tempObjectArr1 = Array(res.tickerList.length)

                    //DO NOT DELETE!!! WILL MAKE BUTTONS DISAPPEAR
                    let tickerList = res.tickerList.map(async (ticker,index)=> {
                        console.log(ticker)
                        return await ticker.then(async(res) => {
                            console.log(res)
                            tempObjectArr1.splice(index, 1, res)
                            return await res
                        })                        
                    })
                    let tempObject = {
                        key: res.key,
                        id: res.id,
                        listName: res.listName,
                        tickerList: tempObjectArr1.sort(),
                    }
                    tempObjectArr.push(tempObject)                   
                })
                setWatchlistArray(
                    tempObjectArr
                )
            })
        }) 
        return Promise.all(prices).then((res) => {
            console.log(res)
            return res
        })
    }

    //useEffect time intervals, 5s, 10s, 30s, 1 min, 5 min, 15 min, 30 min, 

    //change this to take in an index and change the tickerList
    // const listData = async () => {
    //     const data = await dispatch(getLists())
    //     return data.payload
    // }

    //initial loading of the user's lists
    // useEffect(() => {
    //     priceStateHelper().then((res) => {
    //         console.log(res)
    //     })

    // }, [])

    const section1 = useRef();
    const section2 = useRef();
    const container = useRef();

    // useEffect(() => {
    //     gsap.to(section1.current, {
    //         scrollTrigger: {
    //             scroller: container.current,
    //             trigger: section2.current,
    //             start: "center 55%",
    //             markers: true,
    //             toggleActions: "play complete",
    //             scrub: true
    //         },
    //         duration: 2,
    //         ease: "back"
    //     })
    // }, [])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         priceStateHelper().then((res) => {
    //             console.log(res)
    //         })
    //     }, 10000)

    //     return () => clearInterval(interval)

    // }, [])


    useEffect(() => {
        if(isError) {
            console.log(message)
        }
        if(!user) {
            navigate('/login')
        }
        return () => {
            dispatch(reset());
        }
    }, [watchlistArray, priceObject])
    //tickerPriceArray should refresh every couple seconds incase the user decides to update the list
   
    // Create this object and use this push it into setWatchlist
    // {
    //     index: index,
    //     symbol: element,
    //     price: res.payload.latestPrice,
    //     changePercent: res.payload.changePercent,
    //     isOn: false,
    // }

    //chose one of the three states: priceObject, watchlistDataArray, tickerPriceArray

    const listData = async () => {
        const  data = dispatch(getLists())
        console.log(data)
        // const data = res.payload;
        // .then(res => {
        //     console.log(res)
        //     const data = res.payload
        //     // console.log(data)
        //     // setWatchlistArray(res.payload)
        //     // setWatchlistArray([...watchlistArray,data])

        //     return Promise.all(data).then(data => {
        //         console.log(data)
        //         setWatchlistArray(data)
        //     })
        // }).then(console.log(watchlistArray))
        return data.payload
    }

    //once we update the watchlist, then we update the latestPrice
    useEffect(() => {
        // tickerPrice
        //this will give an array of the user's watchlists and then set the watchlist to the array of tickerlist of each watchlist
        // const watchlistData = listData()
        listData().then(res => console.log(res))
        // setWatchlistArray
        // console.log(watchlistData)
    }, [])
    

    //get the price of the lists
    useEffect(() => {
        
        if(watchlistArray !==  void(0) && watchlistArray.length > 0 && watchlistArray[0][0]) {
            console.log(watchlistArray)
            watchlistArray.tickerList.map((ticker) => {
                console.log(ticker)
                // tickerPrice(ticker).then(res => console.log(res));
            })
        }

    }, [watchlistArray])

    const toggleButtonHelper = (element) => {
        return (
                    
            <>
                <ToggleRow>
                    {/* <tr> */}
                        {element.symbol}
                        <th>{element.price}</th>    
                        <button element = {element} isOn = {isOn} onClick = {(e) => {handleToggle(e)}}> button</button>
                    {/* </tr>    */}
                </ToggleRow>         
            </>
            
        )
    }
    
    // const ev
    const ToggleButton = useCallback(({list, list_key}) => {
        // let listElements = []
        const listItems = list.tickerList.map((ticker, key)=> {
            console.log(ticker.changePercent)
            
            return(                
                <>
                        <Form.StyledButton list_key = {list_key} key = {ticker.index} changePercent = {ticker.changePercent} element = {ticker} isOn = {ticker.isOn} onClick = {(e) => {handleToggle(e, list_key, ticker.index)}}>
                                {/* <ToggleRow list_key = {list_key} key = {ticker.index} element = {ticker} isOn = {ticker.isOn} onClick = {(e) => {handleToggle(e, list_key, ticker.index)}}> */}
                                    
                                    <>{ticker.symbol} {ticker.price}</>    
                                {/* </ToggleRow>          */}

                        </Form.StyledButton> 
                </>
            )
        })
        return (
            <>{listItems}</>
        )
   
        
    })

    //takes in the ticker that is toggled on as add it to the list/remove it from the list
    // const handleClick = ({isOn, handle}) => {
        
    //     return (
    //         <Button>
    //             <Button.Toggle isOn = {isOn} handle = {handleToggle}>
    //                 test
    //             </Button.Toggle>
    //         </Button>
    //     )
    // }

    // const handleAddTicker = (e, listId, tickerName) => {
    //     //call addTicker api
    //     console.log(listId)
    //     console.log(tickerName)
    //     return dispatch(addTicker(listId, tickerName))
    // }

    // const delTickerDiv = (e, listId, tickerName) => {
    //     console.log(listId)
    //     console.log(tickerName)
    //     return dispatch(deleteTicker(listId, tickerName))
    // }

    const handleDelList = (e, listId) => {
        //call deleteList api
        console.log(e)
        console.log(listId)
        return dispatch(deleteList(listId))
        
    }



    const tickerButton = {
        color: "black",
        height: "5vh",
        width: "100%",
        background: "limegreen",
    }


    return (
        <>
            <Home>
                {/**Wrapper holds the chart part(in home.js) */}
                <Home.Wrapper className = "leftColumn">
                    {/* Function: Creates a new watchlist */}
                    
                    {/**Form controls the watchlist part */}
                    <Form className = "leftColumn Wrapper">
                        
                        <Form.StyledTable className = "WatchlistTable">
                            {/* <Form> */}
                            
                            {/* <Form.StyledTable theme = {table}> */}

                                
                                <Form.StyledTHead>
                                    {/* <Form.StyledTR> */}
                                        <th>Watchlist</th>
                                    {/* </Form.StyledTR> */}
                                </Form.StyledTHead>
                                {/* <Form.StyledTR> */}

                                {/* <Form.Wrapper1> */}
                                    <ListForm/>
                                {/* </Form.Wrapper1> */}

                                    
                                <Form.StyledTBody>
                                    {watchlistArray.length !== 0 &&
                                        watchlistArray.map((list, key) => {
                                            return(
                                                <>
                                                    <Form.StyledTD>
                                                    {/* <Form> */}
                                                        
                                                        {/* <Form.StyledTBody> */}
                                                            <h3>{list.listName}</h3>


                                                            {/**
                                                             * Delete Button
                                                             */}                                                   
                                                            <StyledButton
                                                                listId = {list.id}
                                                                onClick = {(e) => {handleDelList(e, list.id)}}
                                                            >
                                                                Delete List
                                                            </StyledButton>

                                                            {/**
                                                             * Add ticker section
                                                             */}
                                                            <TickerListForm 
                                                                listId = {list.id}
                                                            />

                                                            {/* <Form.StyledTR> */}
                                                            <Form.StyledTBody1>
                                                                
                                                                    <ThemeProvider theme={tickerButton}>
                                                                        <ToggleButton
                                                                                list = {list}
                                                                                list_key = {key}
                                                                            /> 
                                                                    </ThemeProvider>
                                                                

                                                                {/* <Form.StyledButton> */}

                                                                {/* </Form.StyledButton> */}

                                                            </Form.StyledTBody1>
                                                            {/* </Form.StyledTR> */}
                                                            {/* </div> */}
                                                            {/* </Home> */}

                                                        
                                                        {/* </Form.StyledTBody> */}
                                                        {/* <Home> */}
                                                    {/* </Form> */}
                                                    </Form.StyledTD>
                                                </>
                                            )
                                        })
                                        // <tr>priceObject[0]</tr>
                                    } 
                                </Form.StyledTBody>

                                {/* </Form.StyledTR> */}
                            {/* </Form.StyledTable> */}
                            {/* </Form> */}
                        </Form.StyledTable>
                    </Form>

                </Home.Wrapper>

                <Home.ChartWrapper
                    className = "ChartContainer"
                >
                    <CandlestickChartContainer
                        list = {selectedTickers}
                    />
                </Home.ChartWrapper>


                <Home.NewsfeedWrapper
                    className = "NewsfeedContainer"
                >

                </Home.NewsfeedWrapper>
            </Home>
        </>
    )
}

export {WatchlistContainer}