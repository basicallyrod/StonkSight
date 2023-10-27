import { useState, useEffect } from 'react'
// import Footer from "../components/footer"
import Home from "../components/pages/home/index.js"
import Grid from "../components/commonElements/grid/index.js"
import {toast} from 'react-toastify' 

import {login, reset} from '../features/auth/authSlice'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate} from 'react-router-dom'



function BodyContainer() {
    const {user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth)
        
    const navigate  = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if(isError) {
            toast.error(message)
            console.log('error')
            navigate('/login')
        }
        if(isSuccess || user) {
            navigate('/watchlist')
            console.log('success')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])
    
    return (
        <>
            <Home>
                <Home.Wrapper>
                    <Home.Background/>
                        <Home.OuterBody>
                            <Home.Title>Watchlist Title</Home.Title>
                            <Home.TexturedBody>
                                <Home.Button>Add Stock Button</Home.Button>
                                <Home.Row>
                                    <Home.Column>Stock1</Home.Column>
                                    <Home.Column>Stock2</Home.Column>
                                    <Home.Column>Stock3</Home.Column>
                                    <Home.Column>Stock4</Home.Column>
                                    <Home.Column>Stock5</Home.Column>
                                </Home.Row>
                                <Home.Row>
                                    <Grid>
                                        <Grid.Wrapper>
                                            <Grid.Section>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>

                                                {/* </Grid.Item> */}

                                            </Grid.Section>
                                            <Grid.Section>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>

                                                {/* </Grid.Item> */}

                                            </Grid.Section>
                                            <Grid.Section>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>

                                                {/* </Grid.Item> */}

                                            </Grid.Section>
                                            <Grid.Section>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>
                                                <Grid.Item/>

                                                {/* </Grid.Item> */}

                                            </Grid.Section>
                                        </Grid.Wrapper>
                                    </Grid>
                                </Home.Row>
                            </Home.TexturedBody>
                        </Home.OuterBody>
                        



                </Home.Wrapper>
                
            </Home>
        </>

    )
};

export {
    BodyContainer
};