import styled, { keyframes, css } from "styled-components";
//*
const Global = styled.div`
    margin: 0;
    box-sizing: border-box;
    /* font-family: "Poppins", sans-serif; */
`;
//body
const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #08001b;
    min-height: 100px;
    height: 5000px

`;

//container
const Container = styled.div`
    width: 1100px;
    
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    // &:hover{
    //     opacity: 0.2
    // }
`;

// container card content h2
const CardContentH2 = styled.h2`
    position: absolute;
    right: 30px;
    font-size: 4em;
    font-weight: 800;
    color: #1779ff;
    z-index: 1;
    opacity: 0.1;
    transition: 0.5s;
`;

//container .card .content h3
const CardContentH3 = styled.h3`
    position: relative;
    font-size: 1.5em;
    color: #fff;
    z-index: 2;
    opacity: 0.5;
    letter-spacing: 1px;
    transition: 0.5s;
`;

//container .card .content p
const CardContentP = styled.p`
    position: relative;
    font-size: 1.5em;
    color: #fff;
    z-index: 2;
    opacity: 0.5;
    font-weight: 300;
    letter-spacing: 1px;
    transition: 0.5s;
`;

//container card content a
const CardContentA = styled.a`
    display: inline-block;
    margin-top: 15px;
    padding: 8px 15px;
    background: #fff;
    color: #0c002b;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
`;

const Animate = keyframes`
    0%{ transform:translateX(-100%);}
    100%{ transform:translateX(100%);}`;

const Animate1 = keyframes`
    0%{ transform:translateY(-100%);}
    100%{ transform:translateY(100%);}`;

const Animate2 = keyframes`
    0%{ transform:translateX(100%);}
    100%{ transform:translateX(-100%);}`;
const Animate3 = keyframes`
    0%{ transform:translateY(100%);}
    100%{ transform:translateY(-100%);}`;

const AnimateRule = css`
    ${Animate} 2s linear infinite;
`;

const AnimateRule1 = css`
    ${Animate1} 2s linear infinite;
`;

const AnimateRule2 = css`
    ${Animate2} 2s linear infinite;
`;

const AnimateRule3 = css`
    ${Animate3} 2s linear infinite;
`;


//container card span
const CardSpan = styled.span`
    transition: 0.5s;
    opacity: 0;
    &:nth-child(1) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(to right, transparent, #1779ff);
        animation: ${AnimateRule};
    }
    &:nth-child(2) {
        position: absolute;
        top: 0;
        right: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, #1779ff);
        animation: ${AnimateRule1};
        animation-delay: 1s;
    }
    &:nth-child(3) {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(to left, transparent, #1779ff);
        animation: ${AnimateRule2};
    }
    &:nth-child(4) {
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(to top, transparent, #1779ff);
        animation: ${AnimateRule3};
        animation-delay: 1s;
    }
`;

// container card content
const CardContent = styled.div`
    padding: 30px;
    text-align: center;
`;

//container card
const Card = styled.div`
    position: relative;
    background: #0c002b;
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin: 30px; */
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
    overflow: hidden;
    /* &::before {
        content: '  ';
        position: absolute;
        top: 2px;
        left: 2px;
        bottom: 2px;
        width: 50%;
        background: rgba(255,255,255,0.1);
        pointer-events: none;
    } */
    &.flip-card-outer {// div className = "flip-card-outer"
        width: 450px;
        height: 650px;
        
        &:hover{

        }
        

        &.CardFront {

        }
        &.CardBack {
            
        }
        
    }
    /* &:hover{
        border: #1779ff;
        opacity: 1;
    }
    &:hover ${CardContentH2}{
        opacity: 1;
        transform: translateY(-70px);
    }
    &:hover ${CardContentH3}{
        opacity: 1;
    }
    &:hover ${CardContentP}{
        opacity: 1;
    }
    &:hover ${CardSpan}{
        opacity:1;
    } */

`;
//container card span:nth-child(1)

export {
    Global, 
    Wrapper, 
    Container, 
    Card, 
    CardContent, 
    CardContentH2, 
    CardContentH3, 
    CardContentP, 
    CardContentA, 
    CardSpan, 
    Animate,
    Animate1,
    Animate2,
};
