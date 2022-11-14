import styled, {keyframes, css, ThemeContext} from 'styled-components';

const HiddenSideContainer = styled.div`
    /* height: 100%; */
    display: flex;
    border-right: .5em solid #D1C9BE;
    margin-right: 2em;
    flex-direction: column;
    opacity: 0;
    /* padding-right: .1em; */
`
const HiddenSideText = styled.h2`
    position: relative;
    writing-mode: vertical-rl;
    text-orientation: sideways;
    
    /* padding-right: .em; */

    

    /* top: 80%; */
    font-size: 2em;
    /* padding-right: 0.em; */
    font-weight: 800;
    color: ${props=>props.color};
    z-index: 1;
    opacity: 0;
    transition: 0.5s;
    backface-visibility: hidden;

    /* &*{
        border-right: solid;
        opacity: 1;
    } */
    
`;

const Title = styled.h2`
    position: top;
    font-size: 3em;
    font-weight: 1200;
`

const Container = styled.div`
    border: .25em solid black;
    /* height: 1000px; */

    align-items: center;
    display: flex;
    flex-direction: row;
    background: #252222;
    /* background: white; */
    /* padding-left: 2em; */
    /* padding-top: 5em; */
    /* padding-bottom: 5em; */
    /* border-top: ; */

    &:hover ${HiddenSideText} {
        opacity: 1;
        transition: 1s;
        transform: translateX(10%);
    }
    &:hover ${HiddenSideContainer} {
        opacity: 1;
        transition: 1s;
        transform: translateX(10%);
    }

`


const Wrapper = styled.div`
    display: flex;
    /* height: 100%; */
    /* height: 900px; */
    /* grid-template-rows: 500px 100px; */
    /* grid-template-columns: 400px 400px 400px; */
    /* grid-gap: 200px; */
    gap: 10px;
    align-items: center;
    justify-items: center;
`
// rotateY(calc(-10deg * var(--r)))
const Item = styled.div`
    /* width: 100%;
    height: 100%; */
    display: flex;
    width: ${props=>props.width};
    height: ${props=>props.height};
    background-color: red;
    /* height: 900px; */
    /* position: relative;
    z-index: -1;*/
    position: relative;
    /* min-width: 750px; */
    /* height: 500px; */
    /* min-height: 8500px; */
    /* max-height: 850px; */




    
    /* --r: calc(var(--position) - var(--offset));
    --abs: max(calc(var(--r) * -1), var(--r));
    transition: all 0.25s linear;
    transform: 
        translateX(calc(-300px * var(--r)));
    z-index: calc((var(--position) - var(--abs))); */

    /* &:nth-of-type(1) {
        --offset: 1;
        background-color: #90f1ef; 
    }
    &:nth-of-type(2) {
        --offset: 2;
        background-color: #ff70a6;
    }
    &:nth-of-type(3) {
        --offset: 3;
        background-color: #ff9770;
    }
    &:nth-of-type(4) {
        --offset: 4;
        background-color: #ffd670;
    }
    &:nth-of-type(5) {
        --offset: 5;
        background-color: #e9ff70;
    } */
`

const Button = styled.button`
    position: relative;
    z-index: 1;
`

const Input = styled.input.attrs({ type: "image"})`
    background-image:  ${props=>props.arrowImage};
    /* &:nth-of-type(1) {
        grid-column: 2/3;
        grid-row: 2/3;
    }
    &:nth-of-type(2) {
        grid-column: 3/4;
        grid-row: 2/3;
    }
    &:nth-of-type(3) {
        grid-column: 4/5;
        grid-row: 2/3;
    }
    &:nth-of-type(4) {
        grid-column: 5/6;
        grid-row: 2/3;
    }
    &:nth-of-type(5) {
        grid-column: 6/7;
        grid-row: 2/3;
    } */
`


const forwardArrowAnimation = keyframes`
    0%{left: 50%}
    100%{left: 90%}
`
const backwardArrowAnimation = keyframes`
    0%{left: 50%}
    100%{left: 10%}
`

const StyledArrowContainer = styled.div`
    font-size: 40px;
    width: 50px;
    height: 50px;
    background-color: coral;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    left: ${props=>props.leftPosition};
    position: absolute;

    ${props => props.arrowDir === 'forward' ?
        css`
            animation: ${forwardArrowAnimation} 2s ease;
        `:css`
            animation: ${backwardArrowAnimation} 2s ease;
            left: 5%;
        `
    }

    z-index: 1;
    cursor: pointer;
    :hover{
        background-color: #d9d9d9;
    }
`;

const StyledIndicatorContainer = styled.div`
    width: 200px;
    margin: 0 auto;
    display: flex;
`;

const StyledIndicator = styled.div`
    width: 20px;
    height: 10px;
    background-color: ${(props) => props.bgColor};
    border-radius: 20px;
`

const Main = styled.div`
    grid-row: 1/2;
    grid-column: 1/8;
    width: 100vw;
    height: 900px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transform-style: preserve-3d;
    perspective: 600px;
    --items: 5;
    --middle: 3;
    --position: 1;
    pointer-events: none;
    &:nth-of-type(1) ${Item} {
        --position: 1;
    }
    &:nth-of-type(2) ${Item} {
        --position: 2;
    }
    &:nth-of-type(3) ${Item} {
        --position: 3;
    }
    &:nth-of-type(4) ${Item} {
        --position: 4;
    }
    &:nth-of-type(5) ${Item} {
        --position: 5;
    }
`

const RadioButton = styled.input`
    &:hover ~ {}
`



export {
    HiddenSideContainer,
    HiddenSideText,
    Title,
    Container,
    Wrapper,
    Main,
    Item,
    StyledArrowContainer,
    StyledIndicatorContainer,
    StyledIndicator,
    Input,
    Button,
    RadioButton
}