// import React from 'react';
// import {Route, Link} from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    // padding: 165px;
    background: #9E9A9A;
    // @media (max-width: 70%) {
    //     padding: 70px 30px;
    // }    
`;

const Wrapper = styled.div`
    
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-content: center;
    // max-width: 1000px;
    margin: 0 auto;
`;

const BackgroundContent = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
    margin: 45px 60px;
    border: 15px;
    padding: 15px;
`;

const Body = styled.div`
    background: #FFFFD9;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-content: center;
    max-width: 1000px;
    margin: 20px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`



const Link = styled.a`
    color: #fff;
    font-size: 18px;
    text-decoration: none;

    &:hover {
        color: #ff9c00;
        transition: 200ms ease-in;
    }
`;

const StyledLink = styled(Link)`
    color: #004242;
    font-weight: bold;
`;

const Content = styled.p`
    // display: flex;
    // flex-direction: column;
    // float: right;
    font-size: 18px;
    // padding-left: 200px;
    color: #242424;
    margin-left: 20px;
    margin-right: 20px;
`;

const Picture = styled.img`
    float: left;
    position:relative;
    // right:100px;
    width: 400px;
    height: 400px;
    border-radius: 100%;
`

export {
    Container,
    Wrapper,
    BackgroundContent,
    Body,
    Row,
    Column,
    Link, 
    StyledLink,
    Content,
    Picture
};

