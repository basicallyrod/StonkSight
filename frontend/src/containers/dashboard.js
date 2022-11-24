import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify' 

import { useForm } from 'react-hook-form';
// import {useSelector} from 'react-redux'
// import {useSelector} from 'react-redux'
import {ListForm} from '../components/commonElements/list/ListForm'
import {ListItem} from '../components/commonElements/list/ListItem'

import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {createList, getLists, deleteList, reset} from '../features/lists/listSlice'
import {getPrice} from '../features/iex/core/coreSlice'


import Home from "../components/pages/home/index.js"
import {Button} from "../components/commonElements/buttons/index.js"
import Form from '../components/commonElements/list'

import {ChartDiv} from "../components/chart/chartDiv"

function WatchlistContainer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth);
    const {lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists)
    const {core} = useSelector ((state) => state.core )

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
            console.log(data.payload[0].tickerList)

            const tickerList = data.payload[0].tickerList
            tickerList.map((ticker) => {
                const price = tickerPrice(ticker)
                console.log(price)
                return price


            })
            return data.payload[0].tickerList

        }

        const tickerPrice = async (ticker) => {
            const price = await dispatch(getPrice(ticker))
            console.log(`Price: ${price}`)
            return price
        }
        
        listData()

        return () => {
            // console.log(lists)
            dispatch(reset())
            // console.log(lists)
            // dispatch(getLists())
        }
    }, [user, navigate, isError, message, dispatch])


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
                    {lists.length > 0 ? (
                    <div className='lists'>
                        {/* {lists.map((lists) => (
                            lists.map((list) => (
                                <ListItem key = {list._id} list = {list} />
                            )) 
                        ))} */}
                        {/* <h1>ListName : {lists[0].listName}</h1> */}
                        {lists[0].map((list) => (
                            // <h3>List</h3>
                            <ListItem key = {list._id} list = {list} />
                        ))} 
                    </div>
                    ) : (
                    <h3>You have not set any lists</h3>
                    )}
                </section>


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
                <section>
                    this is for the charts
                </section>
                    <ChartDiv/>
                </Home.Wrapper>

            </Home>


        </>
    )
}

export {WatchlistContainer}