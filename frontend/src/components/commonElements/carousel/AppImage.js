import React, {useState, useEffect} from'react'
import styled, {keyframes, css} from 'styled-components';

const forwardImageAnimation = keyframes`
    0%{
        right: -50%;
    }
    100%{
        right: 0%;
    }
`;

const backwardImageAnimation = keyframes`
    0%{
        left: 50%;
    }
    100%{
        left: 0%;
    }
`;

const StyledImageContainer = styled.div`
    width: 80%;
    height: 80%;
    position: absolute;
    
    
    ${props => props.imageDir === 'forward' ?
        css`
            animation: ${forwardImageAnimation} 2s ease;
            right: 0;
        `:css`
            animation: ${backwardImageAnimation} 2s ease;
            left: 0;
        `
    }
`

const StyledImage = styled.image`
    width: 100%;
    height: 100%;
`

const AppImage = ({ src, direction }) => {
    const {currentImage, setCurrentImage} = useState('');

    useEffect(() => {
        setCurrentImage(src);
    }, [src]);
    return(
        <StyledImageContainer>
            <StyledImage src=""/>
        </StyledImageContainer>
    )
}

export default AppImage;  