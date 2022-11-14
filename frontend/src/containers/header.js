import React from "react";
// import { Routes, Route} from "react-router-dom"
import Header from '../components/header';
import Navbar from '../components/navbar';
import { Link, useNavigate} from 'react-router-dom'
import {Button} from '../components/commonElements/buttons'
import { useSelector, useDispatch } from "react-redux";
import {logout, reset} from '../features/auth/authSlice'

 function HeaderContainer() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }


    return (
        <Header>
            <Header.Wrapper>
                <Header.Row>
                    <Header.Title>
                        StonkSight
                        
                    </Header.Title>
                </Header.Row>
            </Header.Wrapper>
            <Header.Wrapper>
                <Header.Row>
                        <Navbar.Wrapper>

                            <Navbar.Row>
                                {user ? (
                                    <>
                                    <Navbar.Title>
                                        <Navbar.StyledLink to = "/">
                                            Home
                                        </Navbar.StyledLink>
                                    </Navbar.Title>
                                    <Navbar.Title>
                                        <Navbar.StyledLink to ="/watchlist">
                                            Watchlist
                                        </Navbar.StyledLink>
                                    </Navbar.Title>
                                    <Navbar.Title>
                                        <Navbar.StyledLink to ="/heatmap">
                                            Heatmap
                                        </Navbar.StyledLink>
                                    </Navbar.Title>
                                    <Navbar.Title>
                                        <Navbar.StyledLink to ="/candlestickchart">
                                            Candlestick Chart
                                        </Navbar.StyledLink>
                                    </Navbar.Title>
                                    <Navbar.Title>
                                        <Navbar.StyledLink to ="/linechart">
                                            Line Chart
                                        </Navbar.StyledLink>
                                    </Navbar.Title>
                                    <Navbar.Title>
                                        <Navbar.StyledLink to ="/profile">
                                            {user.name}
                                        </Navbar.StyledLink>
                                    </Navbar.Title>

                                    <Button className = 'form-group'>
                                        <Button.StyledButton onClick = {onLogout} type = 'reset' className = 'btn btn-block'>
                                            Logout
                                        </Button.StyledButton>
                                    </Button>
                                </>



                                ) : (
                                    <>
                                        <Navbar.Title>
                                            <Navbar.StyledLink to = "/">
                                                Home
                                            </Navbar.StyledLink>
                                        </Navbar.Title>

                                        <Navbar.Title>
                                            <Navbar.StyledLink to = "/login">
                                                Login
                                            </Navbar.StyledLink>
                                        </Navbar.Title>

                                        <Navbar.Title>
                                            <Navbar.StyledLink to ="/register">
                                                Register
                                            </Navbar.StyledLink>
                                        </Navbar.Title>
                                        <Navbar.Title>
                                            <Navbar.StyledLink to ="/dashboard">
                                                Dashboard
                                            </Navbar.StyledLink>
                                        </Navbar.Title>
                                    </>
                                
                                )}

                            </Navbar.Row>
                        </Navbar.Wrapper>
                </Header.Row>
            </Header.Wrapper>
        </Header>
    )
};

export {
    HeaderContainer
};