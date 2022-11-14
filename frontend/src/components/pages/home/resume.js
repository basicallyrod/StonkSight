import { Container, Wrapper, Background, 
    BackgroundContent, Row, Body, 
    Link, StyledLink, Title, 
    List, UList } 
    from "./styles/home";

const Resume = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>;
};

Resume.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>;
};

Resume.Background = ({children, ...restProps}) => {
    return <Background {...restProps}>{children}</Background>;
};

Resume.BackgroundContent = ({children, ...restProps}) => {
    return <BackgroundContent {...restProps}>{children}</BackgroundContent>;
};

Resume.Row = ({ children, ...restProps}) => {
    return <Row {...restProps}>{children}</Row>;
};

Resume.Body = ({ children, ...restProps }) => {
    return <Body {...restProps}> {children} </Body>;
};

Resume.StyledLink = ({ children, ...restProps }) => {
    return <StyledLink {...restProps}> {children} </StyledLink>;
};

Resume.Link = ({ children, ...restProps }) => {
    return <Link {...restProps}> {children} </Link>;
};

Resume.Title = ({ children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>;
};

Resume.List = ({ children, ...restProps}) => {
    return <List {...restProps}>{children}</List>;
};

Resume.UList = ({ children, ...restProps}) => {
    return <UList {...restProps}>{children}</UList>;
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
    Resume
};