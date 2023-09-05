import { Container, Wrapper, StyledButton, Toggle, ToggleRow} from "./styles/buttons"



const Button = ({children, ...restProp}) => {
    return<Container {...restProp} >{children} </Container>
}

Button.Wrapper = ({children, ...restProp}) => {
    return<Wrapper {...restProp} >{children} </Wrapper>
}

Button.StyledButton = ({children, ...restProp}) => {
    return<StyledButton {...restProp} >{children} </StyledButton>
}

Button.Toggle = ({children, ...restProp}) => {
    return<Toggle {...restProp}> {children} </Toggle>
}

Button.ToggleRow = ({children, ...restProp}) => {
    return<ToggleRow {...restProp}> {children} </ToggleRow>
}

export {
    Button
}