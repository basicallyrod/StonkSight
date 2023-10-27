import { useState, useEffect, useCallback, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch, connect} from 'react-redux'
import {ListForm} from './ListForm'
import {TickerListForm} from './TickerListForm'
import {createList, getLists, deleteList, addTicker, deleteTicker} from '../features/lists/listSlice'
import {getPrice, getBulkLatestPrice, reset} from '../features/iex/core/latestPriceSlice'
import Home from "../components/pages/home/index.js"
import Form from '../components/commonElements/list'
import {getHistoricalData, getSpecificHistoricalData} from '../features/iex/core/historicalPriceSlice'
import {CandlestickChartContainer} from './candlestickchart'
import {NewsfeedContainer} from './newsfeed'
// import { StyledButton } from '../components/commonElements/list/styles/form';
import { ThemeProvider } from 'styled-components';

function WatchlistContainer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth);
    const {lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists)
    let [watchlistArray, setWatchlistArray] = useState([])
    let [priceStack, setPriceStack] = useState([]);
    let [tickerQueue, setTickerQueue] = useState([]);
    let [priceObject, setPriceObject] = useState([])
    let [isOn, setIsOn] = useState([])
    let tickerHistoricalPrices = []

    const [chartParameters, setChartParameters] = useState({
        ticker: "",
        fixedRange: "1m",
        firstDay: "",
        lastDay: "",
        currentSelector: "fixedRange",
        view: "candlestick",
        taMethods: []
    })
    

    //sets the chartParameters with a new value according to the type
    const chartParametersHelper = (type, value) => {
        let newChartParameters = chartParameters
        if(type === "ticker"){
            newChartParameters.ticker = value;
            setChartParameters({
                ...chartParameters,
                ticker: value
            })
        }
        if(type === "ta"){
            if(newChartParameters.taMethods.includes(value)){
                setChartParameters({
                    ...chartParameters,
                    taMethods: chartParameters.taMethods.filter(x => x !== value)
                })
            }
            else{
                setChartParameters({
                    ...chartParameters,
                    taMethods: [
                        ...chartParameters.taMethods,
                        value
                    ]
                })
            }
        }
        if(type === "fixedRange"){
            setChartParameters({
                ...chartParameters,
                fixedRange: value
            })
        }
        if(type === "customRange"){

        }
        if(type === "view"){
            setChartParameters({
                ...chartParameters,
                view: value
            })
        }
    }
    
    //change the state of isOn at a specific index
    const handleToggle = (e, id , id1) => {
        chartParametersHelper("ticker", priceObject[0][id].list[id1].symbol)
    }

    const bulkLatestTickerPrice = (list) => {
        const prices = dispatch(getBulkLatestPrice(list))
        return prices;
    }

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

    const listData = () => {
        const  data = dispatch(getLists()).then(res => {
            setWatchlistArray(res.payload)
            // setSelectedTickers(res.payload[0].tickerList[0])
            if(res.payload[0].tickerList[0]){
                let newChartParameters = chartParameters
                newChartParameters.ticker = res.payload[0].tickerList[0]
                setChartParameters(newChartParameters)
            }
            return res.payload;            
        })
        return Promise.all(data)
    }

    //once we update the watchlist, then we update the latestPrice
    useEffect(() => {
        //this will give an array of the user's watchlists and then set the watchlist to the array of tickerlist of each watchlist
        listData()
    }, [])

    useEffect(() => {
        setWatchlistArray(lists[0])
    }, [lists])


    useEffect(() => {
        let userTickerStack = []// this is to manage the state
        let tickerQueue1 = [] //this is manage the queue
        
        if(watchlistArray !== void(0) && watchlistArray.length !== 0){
            watchlistArray.map((data, key) => {
                let watchlistObject = {
                    listName: data.listName,
                    listId: key,
                    list: []
                }
                data.tickerList.map((ticker, index) => {
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

                userTickerStack.push(watchlistObject)
            })
            setPriceStack([
                userTickerStack,
                ...priceStack
            ])
            setTickerQueue(tickerQueue1)
        }
    }, [watchlistArray])

    useEffect(() => {
        if(priceStack !== void(0) && priceStack.length !== 0){
            bulkLatestTickerPrice(tickerQueue).then(res => {
                let temp = res.payload
                let tempPriceStackObject = []
                console.log(temp)

                for(let watchlist in priceStack[0]){
                    let tickerPriceObject = []
                    let tempWatchlistObject = priceStack[0][watchlist]
                    for(let ticker in priceStack[0][watchlist].list){
                        for(let key in temp){
                            if(priceStack[0][watchlist].list[ticker].symbol === temp[key].quote.symbol){
                                let tempObject = priceStack[0][watchlist].list[ticker];
                                tempObject.latestPrice = temp[key].quote.latestPrice
                                tempObject.changePercent = temp[key].quote.changePercent

                                tickerPriceObject.push(tempObject)
                            }
                        }
                    }
                    tempWatchlistObject.list = tickerPriceObject
                    tempPriceStackObject.push(tempWatchlistObject)
                }
                setPriceObject([
                    tempPriceStackObject,
                    ...priceObject
                ])
                return res.payload
            });
        }

    }, [priceStack, tickerQueue])

    // const ev
    const ToggleButton = (list) => {
        console.log(list)
        
        const listItems = list.list.map((ticker, itemId)=> {
            let percentage = ticker.changePercent * 100 + '%'
            return(
                <>
                    <Form.StyledButton list_key = {list.list_key} itemId = {itemId} changePercent = {ticker.changePercent} element = {ticker} isOn = {ticker.isOn} onClick = {(e) => {handleToggle(e, list.list_key, itemId)}}>
                        {ticker.symbol} : {ticker.latestPrice} : {percentage}
                        {/* <p></p> */}
                    </Form.StyledButton>
                </>
            )
        })
        return (
            <>{listItems}</>
        )
    }


    const handleDelList = (e, listId) => {
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


                </Home.Wrapper>

                <Home.Wrapper className = "middleColumn">
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
                        list = {chartParameters.ticker}
                        chartParameters = {chartParameters}
                    />
                </Home.Wrapper>


                {/* <Home.ChartWrapper
                    className = "ChartContainer"
                > */}

                    
                {/* </Home.ChartWrapper> */}


                <Home.Wrapper className = "rightColumn">
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
                                <Form.StyledTBody>
                                    {priceObject[0] && priceObject[0].length !== 0 &&
                                        //use this loop to manage the multiple watchlists of the user
                                        priceObject[0].map((list, key) => {
                                            console.log(list)
                                            console.log(key)
                                            return(
                                                <>
                                                    <Form.StyledTD>
                                                        <Form.FormRow>
                                                            <Form.Text>{list.listName}</Form.Text>
                                                            <Form.StyledButton
                                                                listId = {list.id}
                                                                onClick = {(e) => {handleDelList(e, list.id)}}
                                                            >
                                                                Delete List
                                                            </Form.StyledButton>
                                                        </Form.FormRow>
                                                        

   

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
                                        })
                                    } 
                                </Form.StyledTBody>
                        </Form.StyledTable>
                    </Form>
                    <NewsfeedContainer
                    ticker = {chartParameters.ticker}
                    />
                </Home.Wrapper>

            </Home>
        </>
    )
}

export {WatchlistContainer}
