import { useState, useEffect, useRef, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as d3 from "d3"

import {getArticles} from '../features/iex/core/newsSlice'
import {helpers} from '../features/technical_analysis_formulas/iex_helpers/prevDataGetter'
import { rolling_ema, rolling_sma } from '../features/technical_analysis_formulas/moving_average.js'
import { macd, signal } from '../features/technical_analysis_formulas/macd.js'
import { rsi } from '../features/technical_analysis_formulas/rsi'
import Home from "../components/pages/home/index.js"

const NewsfeedContainer = ({ticker}) => {
    const dispatch = useDispatch();
    console.log(ticker)
    let [articlesArray, setArticlesArray] = useState([])

    const newsArticleData = async(ticker) => {
        console.log(ticker)
        const news = await dispatch(getArticles({ticker})).then(res => {
            console.log(res.payload)
            return res.payload;
        })
        setArticlesArray(news)
    }

    useEffect(() => {
        newsArticleData(ticker)

    }, [ticker])

    return (
        <Home.NewsfeedWrapper
            className = "NewsfeedContainer"
        >
            <Home.Title>News</Home.Title>
            
            {articlesArray && articlesArray.length !== 0 && 
            articlesArray.map((article, key) => {
                return(
                    <>
                        
                        <Home.Card>

                            <Home.Subtitle>{article.headline}</Home.Subtitle>
                            <Home.Text>{article.source}</Home.Text>
                            {/* <p>{article.summary}</p> */}
                            <a href = {article.url} target = "_blank"> read more</a>
                        </Home.Card>

                    </>
                )

            })
            }

        </Home.NewsfeedWrapper>
    )

}

export {NewsfeedContainer}