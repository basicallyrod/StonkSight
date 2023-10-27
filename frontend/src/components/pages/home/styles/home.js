// import React from 'react';
// import {Route, Link} from 'react-router-dom';
import image from '../images/GMEChart.PNG'
import texture from '../images/MaisonMargielaPaperTexture4.jpg'
import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    background: #354157;
    height: 100vh;
    width: 100vw;
    /* perspective: 1500px; */
    /* margin: 5vh 5vw; */
    display: flex;
    flex-direction: row;
    
    // min-height: 1000px;
`;

const Wrapper = styled.div`
    /* width: 25vw; */
    /* background: #1A3947; */
    /* background: #242424; */
    /* height: 200px; */
    /* height: 100px; */
    /* width: auto; */
    /* display: table;  */
    /* padding: 2vh 2vw; */
    /* margin: 50px 50px; */
    flex-direction: column;
    
    
    /* border: solid; */
    /* border-radius: 10px; */
    /* border-width: .25vh .25vw; */
    /* border-color: #AB9DF2; */

    /* display: inline-block; */
    /* flex-direction: column; */
    /* border: 5em; */
    /* border-color: red; */
    /* justify-content: space-evenly; */
    /* align-content: center; */
    /* margin-left: 20% auto; */
    /* margin-right: 20% auto; */
    /* &::-webkit-scrollbar {
        width: 10px;
        background: red;
    } */
`;

const CenterWrapper = styled.div`
    background: #242424;
    padding: 25vh 25vw;
    border: solid;
    border-radius: 10px;
    border-width: .25vh .25vw;
    border-color: #AB9DF2;
`

const BalanceWrapper = styled.div`
    /* background: #1A3947; */
    background: #242424;
    /* height: 200px; */
    /* height: 100px; */
    /* width: 20vw; */
    height: 10vh;
    /* display: table; */
    /* padding: 2vh 2vw; */
    /* margin: 20vh 0px; */
    /* margin-bottom: 10vh; */
    border: solid;
    border-radius: 10px;
    border-width: .25vh .25vw;
    border-color: #AB9DF2;
    box-shadow: 5px 10px 15px #333
      ,6px 12px 15px #222;

    /* display: inline-block; */
    /* flex-direction: column; */
    /* border: 5em; */
    /* border-color: red; */
    /* justify-content: space-evenly; */
    /* align-content: center; */
    /* margin-left: 20% auto; */
    /* margin-right: 20% auto; */
    &::-webkit-scrollbar {
        width: 10px;
        background: red;
    }
`;



const Wrapper1 = styled.div`
    background: #1A3947;
    /* background: #242424; */
    display: table;
    /* padding: 2vh 2vw; */
    /* margin: 0 50px; */
    border: solid;
    border-radius: 10px;
    border-width: .25vh .25vw;
    border-color: #AB9DF2;

    /* width: 20vw; */
    &::-webkit-scrollbar {
        width: 10px;
        background: red;
    }

`;

const ChartWrapper = styled.div`
    background: #49464E;
    /* background: #242424; */
    height: 75vh;
    /* height: 1400px; */
    width: 75vw;
    top: 50%;
    left: 50%;

    /* margin: 0 50px; */
    border: solid;
    /* border-radius: 10px; */
    /* border-width: .25vh .25vw; */
    /* padding */
    /* padding: 10% 10%; */
    border-color: #222222;
    border-radius: 10px;
    display: inline-block;
    flex-direction: column;
    box-shadow: 5px 10px 15px #333
      ,6px 12px 15px #222;
    /* border: 5em; */
    /* border-color: red; */
    /* justify-content: space-evenly; */
    /* align-content: center; */
    /* margin-left: 20% auto; */
    /* margin-right: 20% auto; */
    &::-webkit-scrollbar {
        width: 10px;
        background: red;
    }
`;


const ChartControllerWrapper = styled.div`
    margin: 2vh;
    /* height:10vh; */
    width: 55vw;
    box-shadow: 5px 10px 15px #333
      ,6px 12px 15px #222;
    background: #49464E;
`

const NewsfeedWrapper = styled.div`
    /* margin: 0 50px; */
    height: 60vh;
    /* padding: 2vh 2vw; */
    border: solid;
    border-radius: 10px;
    /* border-width: .25vh .25vw; */
    border-color: #AB9DF2;

    /* width: 20vw; */
    height: relative;
    background: #37343A;
    overflow-y: scroll;
    /* overflow:hidden; */
`

// const Scrollbar = styled.div``

const Background = styled.div`
    min-height: 1000px;
    background-image: url(${image});
    background-repeat: no-repeat;
    background-size: cover;

`;

const BackgroundContent = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
    margin: 45px 60px;
    border: 15px;
    padding: 15px;
`;

const Picture = styled.img`
    float: left;
    position:relative;
    // right:100px;
    margin: .5em;
    padding: 19px;
    width: 350px;
    height: 350px;
    background: #4D021A;
    box-shadow: inset 5px 5px 5px 5px #032535, 
    inset -5px -5px 5px 5px #032535, 
    inset -5px 5px 5px 5px #032535, 
    inset 5px -5px 5px 5px #032535;
    
    /* background: #4D021A; */
    /* border-radius: 100%; */
`;

const Logo = styled.img`
    /* display: flex; */
    float: center;
    position: absolute;
    opacity: .4;
    /* margin-top: 25%; */
    margin-left: 25%;
    margin-right: 25%;
    // right:100px;
    width: 15em;
    height: 15em;
`;

const Body = styled.div`
    background: #FFFFF0;
    /* background-image: url(${texture});
    background-repeat: repeat; */
    
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-content: center;
    // max-width: 1000px;
    /* border: 20px solid #252525; */
    padding: 10px;
    /* margin: 10px; */
    border: 5px solid #71706E;
    box-shadow: inset 0 0 0 1000px rgba(250,250,225,.2);
    /* inset 5px 5px 5px 5px rgba(250,250,225,.2), 
    inset -5px -5px 5px 5px rgba(250,250,225,.2), 
    inset -5px 5px 5px 5px rgba(250,250,225,.2), 
    inset 5px -5px 5px 5px rgba(250,250,225,.2); */
    /* box-shadow: inset 0 0 1em #252525; */
    /* box-shadow: 120px 80px 40px 20px #032535; */
    /* &:hover{
        
        transition: 1s;
    } */
`;

const TexturedBody = styled.div`
    /* background: #9E9A9A; */
    /* background-image: url(${texture});
    background-repeat: repeat; */
    min-height: 533px;
    max-height: 709px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-content: center;
    // max-width: 1000px;
    /* border: 20px solid #252525; */
    padding: 5px;
    /* margin: 10px; */
    border: 5px solid #252525;
    box-shadow: inset 0 0 0 1000px rgba(250,250,225,.2);
    box-shadow: inset 0 0 1em #252525;
    /* box-shadow: 120px 80px 40px 20px #032535; */
    /* &:hover{
        
        transition: 1s;
    } */

`;
const OuterBody = styled.div`
    display: flex;
    flex-direction: column;
    /* background: #4A001A; */
    background: #032535;
    padding-bottom: 3em;
    /* min-height: 65vh; */
    box-shadow: inset 10px 10px 1000px -10px #242424;
    box-shadow: inset 10px -10px 1000px -10px #242424; 
    /* background-image: url(${texture}); 
    background-repeat: repeat;
    
    display: flex; 
    flex-direction: column;
    justify-content: space-evenly;
    align-content: center; 
    // max-width: 1000px;
    border: 20px solid #252525; 
    width: 2em; 
    height: 2em; 
    padding: 2em; 
    margin: 10px; 
    border: 5px solid #252525; 
    
    &:hover{
        
        transition: 1s;
    } */
`;

const InnerBody = styled.div`
    background: #032535;
    /* background-image: url(${texture});
    background-repeat: repeat; */
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-content: center;
    // max-width: 1000px;
    /* border: 20px solid #252525; */
    padding-left: ${props => props.theme.paddingX};
    padding-right: ${props => props.theme.paddingX};
    padding-top: ${props => props.theme.paddingY};
    padding-bottom: ${props => props.theme.paddingY};
    /* margin: 10px; */
    border: 5px solid #252525;
    /* box-shadow: inset 0 0 0 1000px rgba(250,250,225,.2); */
    /* &:hover{
        
        transition: 1s;
    } */
`;



const Row = styled.div`

    /* display: inline; */
    margin-top: 2em;
    /* margin-bottom: 5em; */
    margin-left: 1em;
    margin-right: 1em;
    padding: 3px;
`;

const UnderlineRow = styled.div`
    margin-left: 15%;
    margin-right: 15%;
    border-bottom: 2px dashed #252525;
`

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

const Title = styled.h1`
    /* display: inline-block; */
    font-size: 24px;
    /* color: #FFFDD0; */
    /* color: #242424; */
    color: ${props => props.theme.color};
    margin-left: 20px;
    margin-right: 20px;
    font-weight: bold;
    text-align: center;
    /* align-content: center; */
`;

const Subtitle = styled.h2`
    display: flex;
    font-size: 16px;
    /* color: #242424; */
    color: ${props => props.theme.color};
    /* margin-left: 20%;
    margin-right: 20%; */
    text-align: center;
    /* font-style: italic; */
`;

const Text = styled.p`
    font-size: 1.3em;
    font-weight: bold;
    /* color: #4D021A; */
    color: ${props => props.theme.color};
    margin-left: 1em;
    margin-right: 1em;
`


const List = styled.li`
    
    font-size: 14px;
    /* color: #242424; */
    color: ${props => props.theme.color};
    margin-left: 10px;
    margin-right: 20px;
    font-weight: normal;
`;

const UList = styled.ul`
    /* display: flex;
    flex-direction: row; */
    display: ${props => props.theme.display};
    color: #242424;
    margin-left: 18px;
    margin-right: 20px;
    font-weight: bold;
`;

const Education = styled.div`
    background: #9E9A9A;
    display: flex;
    flex-direction: column;
    padding: 30px;
    margin: 15px;
    border: 5px solid red;
`;

const LeftColumn = styled.a`
    text-align: left;
`

const RightColumn = styled.a`
    padding-left: 40%;
    float: right;
    text-align: right;
`

const Project = styled.div`
    background: purple;
    display: flex;
    flex-direction: row;
    padding: 30px;
    margin: 15px;
    border: 5px solid red;
`

const CarouselWrapper = styled.div`
    display: grid;
    grid-template-rows: 500px 100px;
    grid-template-columns: 1fr 30px 30px 30px 30px 30px 1fr;
    align-items: center;
    justify-items: center;
`

const Button = styled.button`
    width: 5em;
    height: 3em;
    background: #fff;
`

const Form = styled.form`
  width: 100%;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  margin-bottom: 10px;
  font-family: inherit;
`

const Card = styled.div`
  width: 80%;
  height: 25%;
  background: pink;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  margin-bottom: 10px;
  /* fit-content: fit; */
  /* font-family: inherit; */
`

export {
    Container,
    Wrapper,
    CenterWrapper,
    BalanceWrapper,
    Wrapper1,
    ChartWrapper,
    ChartControllerWrapper,
    NewsfeedWrapper,
    Background,
    BackgroundContent,
    Picture,
    Logo,
    Body,
    TexturedBody,
    InnerBody,
    OuterBody,
    Row,
    UnderlineRow,
    Link, 
    StyledLink,
    Title,
    Subtitle,
    Education,
    Project,
    Column,
    LeftColumn,
    RightColumn,
    Text,
    List,
    UList,
    CarouselWrapper,
    Button,
    Form,
    Card
};

