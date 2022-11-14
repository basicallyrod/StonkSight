import styled, { keyframes, css} from "styled-components";
// import texture from "../../../pictures/MaisonMargielaPaperTexture4.jpg"


//*


//body
const Wrapper = styled.div`
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #252525;
    /* gap: 100px; */
    height: 100%;
    width: 100%;

`;

const Title = styled.h1`
    display: inline;
    color: #FFFFF0;
    font-size: 3.33em;
`



// container card content h2
const CardContentH2 = styled.h2`
    position: absolute;
    top: 80%;
    font-size: 4em;
    font-weight: 800;
    color: #1779ff;
    z-index: 1;
    opacity: 0;
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
        height: 10px;
        background: #5F021F;
        /* background: linear-gradient(to right, transparent, #5F021F); */
        /* animation: ${AnimateRule}; */
    }
    &:nth-child(2) {
        position: absolute;
        top: 0;
        right: 0;
        width: 10px;
        height: 100%;
        background: #5F021F;
        /* background: linear-gradient(to bottom, transparent, #5F021F); */
        /* animation: ${AnimateRule1};
        animation-delay: 1s; */
    }
    &:nth-child(3) {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background: #5F021F;
        /* background: linear-gradient(to left, transparent, #5F021F); */
        /* animation: ${AnimateRule2}; */
    }
    &:nth-child(4) {
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 100%;
        background: #5F021F;
        /* background: linear-gradient(to top, transparent, #5F021F); */
        /* animation: ${AnimateRule3};
        animation-delay: 1s; */
    }
`;

// container card content
const CardContent = styled.div`
    padding: 30px;
    text-align: center;
`;

//container card
const Card = styled.div`
    position: absolute;
    /* background: #0c002b; */
    /* width: 100%;
    height: 100%; */
    min-width: 400px;
    max-width: 533px;
    /* min-height: 615px; */
    max-height: 1215px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 30px;
    border: 2px solid #252525;
    box-shadow: 0 20px 50px red;
    overflow: hidden;
    &::before {
        content: '  ';
        position: absolute;
        top: 2px;
        left: 2px;
        bottom: 2px;
        /* width: 50%; */
        background: rgba(255,255,255,0.1);
        z-index: 1;
        pointer-events: none;
    }
    &:hover{
        opacity: 1;
        /* height: -50px; */
        
    }
    &:hover ${CardContentH2}{
        opacity: 1;
        transform: translateY(10%);
    }
    &:hover ${CardContentH3}{
        opacity: 1;
    }
    &:hover ${CardContentP}{
        opacity: 1;
    }
    &:hover ${CardSpan}{
        opacity:1;
    }


`;
//container card span:nth-child(1)
//container
const Container = styled.div`
    /* width: 1100px; */
    /* margin: 25px; */
    width: 80%;
    gap: 5em;
    /* height: 1000px; */
    /* background: #032535; */
    background: #252525;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`;

const Global = styled.div`
    margin: 0px;
    box-sizing: border-box;
    /* font-family: "Poppins", sans-serif; */
    &:hover ${Title}{
        color: #5F021F;
        transition: 1s;
    }
`;
export {
    Global, 
    Wrapper, 
    Container, 
    Title,
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
