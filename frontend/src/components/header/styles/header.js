// import React from 'react';
import {Route, Link} from 'react-router-dom';
import styled from 'styled-components';
// import { devices } from '../../constants';

const Container = styled.div`
    position: relative;
    background: #000;
    width: 100%;
    &:hover {
        background: #FFF;
    }
    z-index: 5;
`;

const Wrapper = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: flex-start;
    background: #000;
    &:hover {
        background: #dddddd;
    } 


`;

const MiddleContent = styled.div`
    min-width: 768px;
`


const Row = styled.div`
    // margin-top: 2px;
    // margin-bottom: 2px;
    display: flex;
    flex-direction: row;
    &:hover {
        background: #dddddd;
    }
`;

// const Link = styled.div`
//     color: #004242;
//     font-size: 50px;
//     text-decoration: none;

//     &:hover {
//         color: #004242;
//         transition: 200ms ease-in;
//     }
// `;

const StyledLink = styled(Link)`
    color: #424242;
    font-weight: bold;
`;

// const Button = styled.button`
//     background-color: #980f61;
// `

// const StyledButton = styled(Button)`
//     background-color: #980f61;
// `

const Title = styled.h1`
    font-size: 32px;
    color: #FF10F0;
    margin-left: 20px;
    /* margin-right: 20px; */
    font-weight: bold;
    z-index: 0;
`;

const StyledButton = styled.button`
    
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 50px;
    background: ${props => props.primary ? "palevioletred" : "white"};
    color: ${props => props.primary ? "white" : "palevioletred"};

    /* color: ${props => props.theme.main}; */
    /* border: 2px solid ${props => props.theme.main}; */
`;

export {
    Container,
    Wrapper,
    MiddleContent,
    Row,
    Link, 
    StyledLink,
    Title,
    StyledButton
};

