import styled, {keyframes, css, ThemeContect} from "styled-components";
// import { styled, createTheme, ThemeProvider } from '@mui/system';

// StyledButton.defaultProps = {
//     theme: {
//         main: "palevioletred"
//     }
// }

export const Container = styled.div`
    /* border: .25em solid black; */
    /* height: 300px; */
`;

export const Wrapper = styled.div`
    display: flex;
    height: 100%;
`;

export const StyledButton = styled.button`
    font-size: 1em;
    border-radius: 10px;
    /* margin: 1em; */
    /* padding: 0.25em 1em; */
    /* border-radius: 3px; */
    /* background: ${props => props.primary ? "palevioletred" : "white"};
    color: ${props => props.primary ? "white" : "palevioletred"}; */

    /* color: ${props => props.theme.main}; */
    /* border: 2px solid ${props => props.theme.main}; */
`;

export const Toggle = styled.div`
    font-size: 1em;
    background-color: ${(props) => (props.isOn === true) ? 'red' : 'white'};
    
    /* background: ${props => props.primary ? "palevioletred" : "white"};  */

    /* &:before{
        background-color: white
    } */
`

export const ToggleRow = styled.tr`
    font-size: 1em;
    background-color: ${(props) => (props.isOn === true) ? 'red' : 'white'};
    
    /* background: ${props => props.primary ? "palevioletred" : "white"};  */

    /* &:before{
        background-color: white
    } */
`

export const ChartButton = styled.button`
    font-size: 1em;
    color: #d1d4dc;
    margin: .1em;
    border-radius: 10px;
    background-color: transparent;

`
export const CandlestickChartIcon = styled.button`

`


// export {
//     Container,
//     Wrapper,
//     StyledButton,
//     Toggle,
//     ToggleRow
// }