import { useState, useEffect, useCallback, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch, connect} from 'react-redux'
import {toast} from 'react-toastify' 
import { useForm } from 'react-hook-form';
import {ListForm} from './ListForm'
import {TickerListForm} from './TickerListForm'
// import {ListItem} from './ListItem'
import {TickerItem} from '../components/commonElements/list/TickerItem'
import { ModalProvider } from 'styled-react-modal';
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {createList, getLists, deleteList, addTicker, deleteTicker} from '../features/lists/listSlice'
import {getPrice, getBulkLatestPrice, reset} from '../features/iex/core/latestPriceSlice'
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
    let [selectedTickers, setSelectedTickers] = useState()
    let [watchlistArray, setWatchlistArray] = useState([])
    let [priceStack, setPriceStack] = useState([]);
    let [tickerQueue, setTickerQueue] = useState([]);

    let [watchlistDataArray, setWatchlistDataArray] = useState([])
    let [tickerPriceArray,setTickerPriceArray] = useState([])
    let [tnaCounter, setTnaCounter] = useState(0)
    let [priceObject, setPriceObject] = useState([])
    let [isOn, setIsOn] = useState([])
    
    const list = useRef();

    let tempSelectedTickers = []
    let tickerHistoricalPrices = []
    let [stateHistoricalPrice, setStateHistoricalPrice] = useState([]) //react state
    

    const [chartParameters, setChartParameters] = useState({
        ticker: "",
        fixedRange: "1m",
        firstDay: "",
        lastDay: "",
        currentSelector: "fixedRange",
        view: "candlestick",
        taMethods: []
    })
    
    const watchlistRefs = useRef([]);
    const watchlists = [
        {
            watchlist: true,
        },
        {
            watchlist: true,
        },

    ]

    //watchlistStates aren't being used for handling current watchlist being watched so delete later

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
        // console.log(watchlistsState);
    }, [watchlistsState]);

    //sets the chartParameters with a new value according to the type
    const chartParametersHelper = useCallback((type, value) => {
        let newChartParameters = chartParameters
        if(type === "ta"){
            if(newChartParameters.taMethods.includes(value)){
                console.log(newChartParameters.taMethods)
                newChartParameters.taMethods = newChartParameters.taMethods.filter(x => x !== value);
            }
            else{
                newChartParameters.taMethods.push(value);
            }
            
            
        }
        if(type === "fixedRange"){
            //if 
            newChartParameters.fixedRange = value;
        }
        if(type === "customRange"){
            newChartParameters.firstDay = value;
            newChartParameters.lastDay = value
        }
        if(type === "view"){
            newChartParameters.view = value;
            // if(value == "candlestick"){
            //     newChartParameters.view = value;
            // }
            // if(value == "line"){
            //     newChartParameters.view = value;
            // }
        }
        console.log(newChartParameters)
        setChartParameters(newChartParameters)
        
        

    }, [chartParameters])
    //Delete from above

    const mapDispatchToProps = (dispatch) => ({

        fetchAllData: () => {
            priceStack.map((ticker) => dispatch(getPrice(ticker)))
        }
        
        }
    )

    
    
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
        console.log(e)
        console.log(id)
        console.log(id1)
        console.log(priceObject)
        console.log(priceObject[0][id])
        console.log(priceObject[0][id].list[id1])
        setSelectedTickers(priceObject[0][id].list[id1].symbol)
        let newChartParameters = chartParameters
        newChartParameters.ticker = setChartParameters(priceObject[0][id].list[id1].symbol)
        // const updatedIsOn = {...priceObject[0][id].list[id1], isOn: !priceObject[0][id].list[id1].isOn}
        // console.log(updatedIsOn)

        // let listObject = {...priceObject[0][id]}
        
        // // //filter using the id as the key
        // const newPriceObject = [
        //     ...priceObject[0].filter(a => a.listId !== id)
        // ]
        // // console.log(newPriceObject)

        // const slicedTNAList = [
        //     ...priceObject[0].slice(0,id),
        //     listObject,
        //     ...priceObject[0].slice(id+1)
        // ]


        // setPriceObject([
        //     slicedTNAList,
        //     ...priceObject
        // ])
        // //remove the ticker if it is in the array
        // if(selectedTickers.includes(priceObject[0][id].list[id1].symbol)){
        //     setSelectedTickers(
        //         selectedTickers.filter(t =>
        //             t !== priceObject[0][id].list[id1].symbol
        //         )
        //     )
        // }
        // //add the ticker if not in the array
        // else {
        //     setSelectedTickers([
        //         ...selectedTickers,
        //         priceObject[0][id].list[id1].symbol
        //     ])
        // }
    }

    const [seconds, setSeconds] = useState(0);





    const tickerPrice = (ticker) => {
        const price = dispatch(getPrice(ticker))
        return price
    }

    const bulkLatestTickerPrice = (list) => {
        // console.log(list);
        const prices = dispatch(getBulkLatestPrice(list))
        return prices;

    }

    const priceStateHelper = async() => {
        let prices = listData().then(async (res) => {
            // console.log(res)
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

    const listData = () => {
        const  data = dispatch(getLists()).then(res => {
            setWatchlistArray(res.payload)
            // setSelectedTickers(res.payload[0].tickerList[0])
            if(res.payload[0].tickerList[0]){
                console.log(res.payload[0].tickerList[0])
                setSelectedTickers(res.payload[0].tickerList[0])
                let newChartParameters = chartParameters
                console.log(newChartParameters)
                newChartParameters.ticker = res.payload[0].tickerList[0]
                setChartParameters(newChartParameters)
                console.log(selectedTickers)
            }
            return res.payload;
            
            // setSelectedTickers(res.payload.tickerList[0])
            
        })
        // console.log(Promise.all(data))

        return Promise.all(data)
    }




    //once we update the watchlist, then we update the latestPrice
    useEffect(() => {
        // tickerPrice
        //this will give an array of the user's watchlists and then set the watchlist to the array of tickerlist of each watchlist
        listData().then(res => {
            console.log(res)
        })
        
        // setSelectedTickers()

    }, [])

    useEffect(() => {
        // listData()
        setWatchlistArray(lists[0])
        console.log(lists)

    }, [lists])

    useEffect(() => {
        console.log(selectedTickers)
    }, [selectedTickers])

    // useEffect(() => {
    //     // getBulkLatestPrice
    //     console.log(watchlistArray)

    // }, [watchlistArray])
    

    //get the price of the lists
    useEffect(() => {
        console.log(watchlistArray)
        let userTickerStack = []// this is to manage the state
        let tickerQueue1 = [] //this is manage the queue
        
        if(watchlistArray !== void(0) && watchlistArray.length !== 0){
            console.log(watchlistArray)
            watchlistArray.map((data, key) => {
                console.log(data)
                // console.log(data.listName)
                // console.log(key)
                let watchlistObject = {
                    listName: data.listName,
                    listId: key,
                    list: []
                }
                let listTickerStack = []//use this to generate the array of array of objects for the state
                data.tickerList.map((ticker, index) => {
                    // console.log(key)
                    // console.log(index)
                    const object = {
                        listId: key,
                        itemId: index,
                        symbol: ticker,
                        latestPrice: "",
                        changePercent: "",
                        isOn:false,
                    }
                    watchlistObject.list.push(object)
                    tickerQueue1.push(ticker)
                })
                // console.log(watchlistObject)
                // console.log(listTickerStack)
                // console.log(tickerQueue)
                userTickerStack.push(watchlistObject)
            })
            // console.log(userTickerStack)
            setPriceStack([
                userTickerStack,
                ...priceStack
            ])
            setTickerQueue(tickerQueue1)
        }
        console.log(lists)
        // console.log(watchlistArray[0].tickerList)
        
        // if(watchlistArray.length > 0 && watchlistArray[0][0]) {
        //     console.log(watchlistArray)
        //     // watchlistArray.tickerList.map((ticker) => {
        //     //     console.log(ticker)
        //     //     // tickerPrice(ticker).then(res => console.log(res));
        //     // })
        // }

    }, [watchlistArray])

    useEffect(() => {
        if(priceStack !== void(0) && priceStack.length !== 0){

            //runs into the issues of once the first array (meta, aapl, nflx, goog) is empty then it would try to tickerPrice(undefined)

            // console.log(priceStack)
            // console.log(tickerQueue)
            let data = bulkLatestTickerPrice(tickerQueue).then(res => {
                // let data = res.payload
                // console.log(data)

                // priceStack[0].map((watchlist,key1) => {
                //     console.log(watchlist)
                //     watchlist.map((ticker, key2) => {
                //         console.log(ticker)
                //         for(let key in data){
                //             if(key === ticker.symbol){
                //                 console.log(ticker.symbol)
                //                 console.log(key)
                //                 console.log(data[key])
                //                 console.log(data[key].quote.latestPrice)
                //                 let temp = ticker;
                //                 temp.latestPrice = data[key].quote.latestPrice
                //                 temp.changePercent = data[key].quote.extendedChangePercent
                //                 console.log(temp)
                                
                //                 setPriceObject([
                //                     ...priceObject,
                //                     temp

                //                 ])

                //             }

                //         }

                //     })

                // })
                let temp = res.payload
                // console.log(temp)

                let tempPriceStackObject = []
                // console.log(priceStack[0][0].list)
                // console.log(priceStack[0])
                console.log(priceStack)
               
                for(let watchlist in priceStack[0]){
                    let tickerPriceObject = []
                    let tempWatchlistObject = priceStack[0][watchlist]
                    // console.log(tempWatchlistObject)
                    // console.log(priceStack[0][watchlist])
                    // console.log(priceStack[0][watchlist].list)
                    for(let ticker in priceStack[0][watchlist].list){
                        // console.log(priceStack[0][watchlist].list[ticker])
                        for(let key in temp){
                            if(priceStack[0][watchlist].list[ticker].symbol === temp[key].quote.symbol){
                                let tempObject = priceStack[0][watchlist].list[ticker];
                                tempObject.latestPrice = temp[key].quote.latestPrice
                                tempObject.changePercent = temp[key].quote.extendedChangePercent

                                // console.log(tempObject)
                                // console.log(temp[key])
                                tickerPriceObject.push(tempObject)
                            }
                        }

                    }

                    tempWatchlistObject.list = tickerPriceObject

                    // console.log(tempWatchlistObject)
                    // console.log
                    // let tickerPriceObject = []
                    // for(let ticker in priceStack[0][watchlist]){
                    //     // console.log()
                        
                    //     console.log(priceStack[0][watchlist].list)
                    //     // console.log(watchlist[ticker].list)
                    //     console.log(priceStack[0][watchlist][ticker])

                    //     for(let key in temp){
                            
                    //         if(priceStack[0][watchlist].list[ticker].symbol === temp[key].quote.symbol){
                                // let tempObject = priceStack[0][watchlist][ticker];
                                // tempObject.latestPrice = temp[key].quote.latestPrice
                                // tempObject.changePercent = temp[key].quote.extendedChangePercent

                                // console.log(tempObject)
                                // console.log(temp[key])
                                // tickerPriceObject.push(tempObject)


                    //         }

                            
                            
                    //         // console.log(priceStack[0][data][data1][key])
                    //     }
                        
                    // }
                    tempPriceStackObject.push(tempWatchlistObject)
                }
                setPriceObject([
                    tempPriceStackObject,
                    ...priceObject
                ])
                // setPriceObject([
                //     ...priceObject,
                //     tempPriceStackObject
                // ])
                // console.log(tempPriceStackObject)


                

                // priceStack.map((watchlist) => {
                //     console.log(watchlist)
                //     watchlist.map((ticker) => {
                //         let test = res.payload;
                //         console.log(test)
                //         // console.log(test.filter(ticker.symbol))
                //         console.log(ticker.symbol)
                //         // console.log(res.payload.filter(ticker))
    
                //     })
                // })


                return res.payload
            });

            // console.log(data)

            //iterate through the priceStack array of arrays and fill in the changePercent & latestPrice



            //dispatch the getBulkLatestPrice
            



            // console.log(priceStack[0])
            // console.log(priceStack[0][0])
            // console.log(priceStack[0][0][0])
            
            // priceStack[0][0].map(data,)
            // tickerPrice(priceStack[0][0][0].symbol)
            // .then(data => {
            //     console.log(priceStack[0][0][0])
            //     console.log(data.payload)
            //     let tempObject = priceStack[0][0][0]
            //     tempObject.latestPrice = data.payload.latestPrice
            //     tempObject.changePercent = data.payload.changePercent
            //     console.log(tempObject)
            //     // priceObject()

            //     return tempObject;

            // }) 
            // .then(res => {
            //     console.log(res)
            //     setPriceObject([
            //         ...priceObject,
            //         res
            //     ])   
            // })

            //example of what not to do; will cause batch requests instead of pending/fulfilling one by one
            // priceStack[0].map((data, index) => {
            //     console.log(data)
            //     data.map((data1, key) => {
            //         console.log(data1)
            //         tickerPrice(data1.symbol)
            //     })
            // })
        }


            // })

            // .then(setPriceStack(priceStack.slice(1)))
        


    }, [priceStack, tickerQueue])

    //decrement the priceStack
    useEffect(() => {
        if(priceStack !== void(0) && priceStack.length !== 0){
            console.log(priceObject)
            // fetchAllData()
            // console.log(priceObject)
            // console.log(priceStack)
            // console.log(priceStack[0][0])
            // setPriceStack(priceStack.slice(1))
            // console.log(priceStack[0][0].slice(1))
            // console.log(priceStack[0][0].slice(1))
            // setPriceStack([
            //     priceStack[0][0].slice(1),
            //     ...priceStack
            // ])
        }
        // console.log(priceObject)
    
    }, [priceObject])

    useEffect(() => {
        console.log(chartParameters)
    }, [chartParameters])

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
    const ToggleButton = useCallback((list) => {
        // console.log(list)
        // console.log(list.list_key)
        // console.log(list_key)
        // let listElements = []
        const listItems = list.list.map((ticker, itemId)=> {
            // console.log(ticker)
            // console.log(itemId)
            // console.log(list.list_key)

            // console.log(ticker.symbol)
            // console.log(ticker.latestPrice)

            return(
                <>
                    <Form.StyledButton list_key = {list.list_key} itemId = {itemId} changePercent = {ticker.changePercent} element = {ticker} isOn = {ticker.isOn} onClick = {(e) => {handleToggle(e, list.list_key, itemId)}}>
                        <>{ticker.symbol} : {ticker.latestPrice}</>
                    </Form.StyledButton>
                </>
            )
            
            // return(                
            //     <>
            //             <Form.StyledButton list_key = {list_key} key = {ticker.index} changePercent = {ticker.changePercent} element = {ticker} isOn = {ticker.isOn} onClick = {(e) => {handleToggle(e, list_key, ticker.index)}}>
            //                     {/* <ToggleRow list_key = {list_key} key = {ticker.index} element = {ticker} isOn = {ticker.isOn} onClick = {(e) => {handleToggle(e, list_key, ticker.index)}}> */}
                                    
            //                         <>{ticker.symbol} {ticker.price}</>    
            //                     {/* </ToggleRow>          */}

            //             </Form.StyledButton> 
            //     </>
            // )
        })
        // return listItems
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
        // border:,
        // border-color: "red"
    }

    const tickerList = (watchlist) => {
        watchlist.map((item) => {
            console.log(item.symbol)
        })
        return(
            <>

            </>
        )
    }

    //chartController Section



    return (
        <>
            <Home>
                {/**Wrapper holds the chart part(in home.js) */}

                <Home.Wrapper className = "leftColumn">
                    {/* Function: Creates a new watchlist */}
                    {/* <ThemeProvider theme = {}> */}
                        <Home.BalanceWrapper>

                            <Home.Title>
                                Create a watchlist:  
                            </Home.Title>
                                    
                            <Form.StyledTHead>
                                {/* <Form.StyledTR> */}
                                    <th>Watchlist</th>
                                {/* </Form.StyledTR> */}
                                <ListForm/>
                            </Form.StyledTHead>
                        </Home.BalanceWrapper>
                    {/* </ThemeProvider> */}

                    {/* <Form></Form> */}
                    
                    {/**Form controls the watchlist part */}
                    <Form className = "leftColumn Wrapper">
                        
                        <Form.StyledTable className = "WatchlistTable">
                            {/* <Form> */}
                            
                            {/* <Form.StyledTable theme = {table}> */}


                                {/* <Form.StyledTR> */}

                                {/* <Form.Wrapper1> */}
                                    
                                {/* </Form.Wrapper1> */}

                                    
                                <Form.StyledTBody>
                                    {priceObject[0] && priceObject[0].length !== 0 &&


                                        //use this loop to manage the multiple watchlists of the user
                                        priceObject[0].map((list, key) => {
                                            console.log(list)
                                            console.log(key)
                                            return(
                                                <>
                                                    <Form.StyledTD>
                                                        <h3>{list.listName}</h3>

                                                        <StyledButton
                                                                listId = {list.id}
                                                                onClick = {(e) => {handleDelList(e, list.id)}}
                                                        >
                                                            Delete List
                                                        </StyledButton>

                                                        <TickerListForm 
                                                            listId = {list}
                                                        />                                                        
                                                        <Form.StyledTBody1>
                                                                <ThemeProvider theme={tickerButton}>
                                                                    <ToggleButton
                                                                        list = {list.list}
                                                                        list_key = {key}
                                                                    />
                                                                </ThemeProvider>                                                           
                                                        </Form.StyledTBody1>
                                                    </Form.StyledTD>
                                                </>
                                            )
         
                                            // watchlist.map((item) => {
                                            //     console.log(item)

                                            // })
                                            // return(
                                            //     <>
                                            //         <Form.StyledTD>

                                            //                 <h3>{list.listName}</h3>
                                     
                                            //                 <StyledButton
                                            //                     listId = {list.id}
                                            //                     onClick = {(e) => {handleDelList(e, list.id)}}
                                            //                 >
                                            //                     Delete List
                                            //                 </StyledButton>

                                            //                 <TickerListForm 
                                            //                     listId = {list.id}
                                            //                 />

                                            //                 <Form.StyledTBody1>
                                                                
                                                                    // <ThemeProvider theme={tickerButton}>
                                                                    //     <ToggleButton
                                                                    //         list = {list}
                                                                    //         list_key = {key}
                                                                    //     />

                                                                    //     <ToggleButton
                                                                    //             list = {list}
                                                                    //             list_key = {key}
                                                                    //         /> 
                                                                    // </ThemeProvider>
                                                                



                                            //                 </Form.StyledTBody1>

                                            //         </Form.StyledTD>
                                            //     </>
                                            // )
                                            
                                            //use this to create the div of the list in the watchlist div
                                            // watchlist.map((list) => {
                                            //     console.log(list)


                                            //     //Create multiple buttons in the list with this function
                                            //     // list.map((ticker) => {
                                            //     //     console.log(ticker)
                                            //     // })

                                            //     // console.log(ticker)
                                            // })
                                        })
                                        // <tr>priceObject[0]</tr>
                                    } 
                                </Form.StyledTBody>
                                {/* <Form.StyledTBody>
                                    {watchlistArray.length !== 0 &&
                                        watchlistArray.map((list, key) => {
                                            return(
                                                <>
                                                    <Form.StyledTD>

                                                            <h3>{list.listName}</h3>
                                     
                                                            <StyledButton
                                                                listId = {list.id}
                                                                onClick = {(e) => {handleDelList(e, list.id)}}
                                                            >
                                                                Delete List
                                                            </StyledButton>

                                                            <TickerListForm 
                                                                listId = {list.id}
                                                            />

                                                            <Form.StyledTBody1>
                                                                
                                                                    <ThemeProvider theme={tickerButton}>
                                                                        <ToggleButton
                                                                                list = {list}
                                                                                list_key = {key}
                                                                            /> 
                                                                    </ThemeProvider>
                                                                



                                                            </Form.StyledTBody1>

                                                    </Form.StyledTD>
                                                </>
                                            )
                                        })
                                    } 
                                </Form.StyledTBody> */}

                                {/* </Form.StyledTR> */}
                            {/* </Form.StyledTable> */}
                            {/* </Form> */}
                        </Form.StyledTable>
                    </Form>

                </Home.Wrapper>
                <Home.Wrapper>
                    <Home.ChartControllerWrapper>
                        <Form.Wrapper>
                            <button onClick={() => chartParametersHelper("view", "candlestick")}>Candlestick</button>
                            <button onClick={() => chartParametersHelper("view", "line")}>Line</button>
                            {/* <button onClick={() => chartParametersHelper(0, 'all')}>Technical Analysis</button> */}
                            <button onClick={() => chartParametersHelper("ta", 'RSI')}>RSI</button>
                            <button onClick={() => chartParametersHelper("ta", 'MACD')}>MACD</button>
                            <button onClick={() => chartParametersHelper("ta", 'SRSI')}>Stochastic RSI</button>

                            <button onClick = {() => chartParametersHelper("fixedRange", "1d")}>1d</button>
                            <button onClick = {() => chartParametersHelper("fixedRange", "5d")}>5d</button>
                            <button onClick = {() => chartParametersHelper("fixedRange", "1m")}>1m</button>
                            <button onClick = {() => chartParametersHelper("fixedRange", "3m")}>3m</button>
                            <button onClick = {() => chartParametersHelper("fixedRange", "6m")}>6m</button>
                            <button onClick = {() => chartParametersHelper("fixedRange", "ytd")}>ytd</button>
                            <button onClick = {() => chartParametersHelper("fixedRange", "1y")}>1y</button>
                            <button onClick = {() => chartParametersHelper("fixedRange", "5y")}>5y</button>


                            <Form.TextInput>
                            <Form.Wrapper1>
                                First Day
                                <Form.StyledInput type = 'date' name = 'firstDay'></Form.StyledInput>
                                Last Day
                                <Form.StyledInput type = 'date' name = 'lastDay'></Form.StyledInput>
                            </Form.Wrapper1>
                            
                            <Form.StyledButton type = 'submit'>
                                Range
                            </Form.StyledButton>
                        </Form.TextInput>
                        </Form.Wrapper>
                    </Home.ChartControllerWrapper>
                    <CandlestickChartContainer
                        list = {selectedTickers}
                        chartParameters = {chartParameters}
                    />
                </Home.Wrapper>


                {/* <Home.ChartWrapper
                    className = "ChartContainer"
                > */}

                    
                {/* </Home.ChartWrapper> */}



                {/* <Home.NewsfeedWrapper
                    className = "NewsfeedContainer"
                >

                </Home.NewsfeedWrapper> */}
            </Home>
        </>
    )
}



// connect(null, mapDispatchToProps)
export {WatchlistContainer}
