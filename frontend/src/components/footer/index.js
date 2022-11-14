// import React from "react"

import { Container, Wrapper, Row, Column, Link, Title } from './styles/footer'

const Footer = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>
}

Footer.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>
}

Footer.Row = ({ children, ...restProps}) => {
    return <Row {...restProps}>{children}</Row>
}

Footer.Column = ({ children, ...restProps }) => {
    return <Column {...restProps}> {children} </Column>
}

Footer.Link = ({ children, ...restProps }) => {
    return <Link {...restProps}> {children} </Link>
}

Footer.Title = ({ children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>
}

// import LILogo from "./logos/LinkedIn/LI-In-Bug.png";
// import GHLogo from "./logos/GitHub-Mark/GitHub-Mark-32px.png"
// import IGLogo from "./logos/'IG Glyph Icon'/glyph-logo_May2016.png"
//const images = ["./logos/LinkedIn/LI-In-Bug.png", "./logos/GitHub-Mark/GitHub-Mark-32px.png", "./logos/'IG Glyph Icon'/glyph-logo_May2016.png"]
//import IMAGES from "./logos/index.js"
// import {
//     // LILogo,
//     // GHLogo,
//     IGLogo
// } from './logos/index'

// const Footer = () => {
//     return(
//         <div>
//             <h1>Roderick Buo</h1>
//             <ul class = "footer__socials-list">
//                 <ul class ="footer__social-item--0">
//                     <a href="https://www.linkedin.com/in/roderickbuo/">
//                         <img src = {IMAGES.LILogo} alt = {"LinkedIn Logo"}/> 
//                     </a>
                        
//                 </ul>
//                 <ul class = "footer__social-item--1">
//                     <a href="https://github.com/basicallyrod">
//                         <picture src = {IMAGES.GHLogo} alt = {"GitHub Logo"}/>
//                     </a>
                        
//                 </ul>
//                 <ul>
//                     <a href="https://www.instagram.com/rbuohism/">
//                         <picture src = {IMAGES.IGLogo} alt = {"Instagram Logo"}/>
//                     </a>
                        
//                 </ul>
//             </ul>
            
//         </div>

//     )
// }

export default Footer