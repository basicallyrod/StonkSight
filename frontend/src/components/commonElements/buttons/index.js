import { Container, Wrapper, StyledButton } from "./styles/buttons"



const Button = ({children, ...restProp}) => {
    return<Container {...restProp} >{children} </Container>
}

Button.Wrapper = ({children, ...restProp}) => {
    return<Wrapper {...restProp} >{children} </Wrapper>
}

Button.StyledButton = ({children, ...restProp}) => {
    return<StyledButton {...restProp} >{children} </StyledButton>
}

export {
    Button
}