import React, {useState, useEffect} from "react";
import styled, {keyframes, css } from "styled-components";
import { ArrowBarLeft } from '@styled-icons/bootstrap/ArrowBarLeft';
import { ArrowBarRight } from '@styled-icons/bootstrap/ArrowBarRight';
import AppImage  from "./AppImage";

const images = [];

const forwardArrowAnimation = keyframes`
    0%{left: 50%}
    100%{left: 90%}
`
const backwardArrowAnimation = keyframes`
    0%{left: 50%}
    100%{left: 10%}
`

const StyledCarouselContainer = styled.div`
    width: 90%;
    height: 80vh;
    border: 1px solid black;
    margin: 20px auto;
        /* display: flex;
    justify-content: center;
    align-items: center; */
`;

const StyledArrowContainer = styled.div`
    font-size: 40px;
    width: 50px;
    height: 50px;
    background-color: #d8d8d8;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    left: ${props=>props.leftPosition};
    position: absolute;

    ${props => props.arrowDir === 'forward' ?
        css`
            animation: ${forwardArrowAnimation} 2s ease;
            right: 0;
        `:css`
            animation: ${backwardArrowAnimation} 2s ease;
            left: 0;
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

const CarouselComponent = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState[0];
    const [direction, setDirection] = useState['forward'];

    const nextImage = () => {
        setCurrentImageIndex(prevIndex => prevIndex + 1);
        setDirection("forward");
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => prevIndex - 1);
        setDirection("backward");
    }

    return (
        <>
            <StyledCarouselContainer>

                {currentImageIndex !== images.length - 1 && (
                        <StyledArrowContainer 
                            onClick={prevImage} 
                            leftPosition = "10%" 
                            arrowDir = "backward"
                        >
                        <ArrowBarRight/>
                        </StyledArrowContainer>
                )}

                {/* <StyledImageContainer>
                    <StyledImage src=""/>
                </StyledImageContainer> */}
                <AppImage src = {images[currentImageIndex]} imageDir={direction}/>

                {currentImageIndex !== images.length - 1 && (
                        <StyledArrowContainer onClick={nextImage} leftPosition = "90%" arrowDir = "forward">
                        <ArrowBarRight/>
                        </StyledArrowContainer>
                )}

            </StyledCarouselContainer>

            <StyledIndicatorContainer>
                {images.map((img, index) => {
                    <StyledIndicator key={img} bgColor={index===  currentImageIndex ? '#laffla' : '#ffffff'}/>
                })}
                <StyledIndicator/>
            </StyledIndicatorContainer>
        </>

    
    )
};