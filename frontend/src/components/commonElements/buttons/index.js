// import { Container, Wrapper, StyledButton, Toggle, ToggleRow, ChartButton} from "./styles/buttons"
import * as Styled from './styles/buttons'
// import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
// import ShowChartIcon from '@mui/icons-material/ShowChart';


const Button = ({children, ...restProp}) => {
    return<Styled.Container {...restProp} >{children} </Styled.Container>
}

Button.Wrapper = ({children, ...restProp}) => {
    return<Styled.Wrapper {...restProp} >{children} </Styled.Wrapper>
}

Button.StyledButton = ({children, ...restProp}) => {
    return<Styled.StyledButton {...restProp} >{children} </Styled.StyledButton>
}

Button.Toggle = ({children, ...restProp}) => {
    return<Styled.Toggle {...restProp}> {children} </Styled.Toggle>
}

Button.ToggleRow = ({children, ...restProp}) => {
    return<Styled.ToggleRow {...restProp}> {children} </Styled.ToggleRow>
}

Button.ChartButton = ({children, ...restProp}) => {
    return<Styled.ChartButton {...restProp}> {children} </Styled.ChartButton>
}

Button.CandlestickChartIcon = ({children, ...restProps}) => {
    return<Styled.CandlestickChartIcon {...restProps}> {children} </Styled.CandlestickChartIcon>
}

export default Button
export {
    Button
}