import React from 'react';
import { Container, Wrapper, MiddleContent, Row, Link, StyledLink, Title, StyledButton } from "./styles/header"

const Header = ({ children, ...restProps }) => {
    return <Container {...restProps}> {children}</Container>
}

Header.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>
}

Header.Row = ({ children, ...restProps}) => {
    return <Row {...restProps}>{children}</Row>
}

Header.MiddleContent = ({ children, ...restProps}) => {
    return <MiddleContent {...restProps}>{children}</MiddleContent>
}


Header.StyledLink = ({ children, ...restProps }) => {
    return <StyledLink {...restProps}> {children} </StyledLink>
}

Header.Link = ({ children, ...restProps }) => {
    return <Link {...restProps}> {children} </Link>
}

Header.Title = ({ children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>
}

Header.StyledButton = ({ children, ...restProps}) => {
    return <StyledButton {...restProps}>{children}</StyledButton>
}

// const Header = () => {
//     return (
//         <div className = "header">
//             <h1>Roderick Buo</h1>
//             <p>Aspiring Software Engineer</p>
//         </div>
//     )
// }

export default Header;