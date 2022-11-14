import React from "react"
import { Container, Wrapper, Background, BackgroundContent, Row, Column, Body, Link, StyledLink, Content, Picture } from "./styles/about";

const About = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>;
};

About.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>;
};


About.BackgroundContent = ({children, ...restProps}) => {
    return <BackgroundContent {...restProps}>{children}</BackgroundContent>;
};

About.Row = ({ children, ...restProps}) => {
    return <Row {...restProps}>{children}</Row>;
};

About.Column = ({ children, ...restProps}) => {
    return <Column {...restProps}>{children}</Column>;
};

About.Body = ({ children, ...restProps }) => {
    return <Body {...restProps}> {children} </Body>;
};

About.StyledLink = ({ children, ...restProps }) => {
    return <StyledLink {...restProps}> {children} </StyledLink>;
};

About.Link = ({ children, ...restProps }) => {
    return <Link {...restProps}> {children} </Link>;
};

About.Content = ({ children, ...restProps}) => {
    return <Content {...restProps}>{children}</Content>;
};

About.Picture = ({ children, ...restProps}) => {
    return <Picture {...restProps}>{children}</Picture>;
};

// const MainContent = () => {
//     return(
//         <div className = "mainContent">
//             <p>
//                 My name is Roderick Buo and I am an aspiring software engineer. In my free time, I have been learning the web development, MERN/MEAN, and the PyData stack. Outside of programming, I enjoy playing games specifically Teamfight Tactics, Lost Ark, and League of Legends with my friends. I also enjoy collecting vintage and used designer clothing and photography.
//             </p>
//         </div>
//     )
// }

export {
    About
};