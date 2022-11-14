import React from "react"
import { Container, Wrapper, Row, StyledLink, Title } from "./styles/navbar";

const Navbar = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>
}

Navbar.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>
}

Navbar.Row = ({ children, ...restProps}) => {
    return <Row {...restProps}>{children}</Row>
}


Navbar.StyledLink = ({ children, ...restProps }) => {
    return <StyledLink {...restProps}> {children} </StyledLink>
}

// Navbar.Link = ({ children, ...restProps }) => {
//     return <Link {...restProps}> {children} </Link>
// }

Navbar.Title = ({ children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>
}

// import { Link, Outlet } from "react-router-dom"

// const Navbar = () => {
//     return(
//         <div className = "navbar">
//             <nav>
//                 <ul>
//                     <p>
//                         <Link to = "/">Home</Link>
//                     </p>
//                     <p>
//                         <Link to="/about">About</Link>
//                     </p>
//                     <p>
//                         <Link to="/moodboard">Moodboard</Link>
//                     </p>
//                 </ul>
//             </nav>
//             <hr/>
//             <Outlet/>
//         </div>
//     )
// }

export default Navbar