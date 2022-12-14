import styled, {keyframes, css, ThemeContect} from "styled-components";

// StyledButton.defaultProps = {
//     theme: {
//         main: "palevioletred"
//     }
// }

const Container = styled.div`
    /* border: .25em solid black; */
    /* height: 300px; */
`;

const Wrapper = styled.div`
    display: flex;
    height: 100%;
`;

const StyledButton = styled.button`
    font-size: 1em;
    /* margin: 1em; */
    /* padding: 0.25em 1em; */
    /* border-radius: 3px; */
    /* background: ${props => props.primary ? "palevioletred" : "white"};
    color: ${props => props.primary ? "white" : "palevioletred"}; */

    /* color: ${props => props.theme.main}; */
    /* border: 2px solid ${props => props.theme.main}; */
`;

export {
    Container,
    Wrapper,
    StyledButton
}