// import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { devices } from '../../constants';

const Container = styled.div`
    width: 100%;
    &:hover {
        background: #dddddd;
    }  
`;

const Wrapper = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-content: center;
    // margin: 0 auto;
    width: 100%;
    &:hover {
        background: #dddddd;
    }  
`;


const Row = styled.div`
    // position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-content: center;
    // margin: 10px;
    max-width: 100%;
    &:hover {
        background: #dddddd;
    } 
`;



const StyledLink = styled(Link)`
    color: #242424;
    font-size: 18px;
    text-decoration: none;

    &:hover {
        color: #5F021F;
        text-decoration: underline;
        text-decoration-thickness: 4px;
        
        text-underline-offset: 16px;
        transition: 200ms ease-in;
    }
`;

const Title = styled.p`
    font-size: 20px;
    color: #242424;
    margin-left: 20px;
    margin-right: 20px;
    font-weight: bold;
`;

export {
    Container,
    Wrapper,
    Row,
    Link, 
    StyledLink,
    Title,
};

