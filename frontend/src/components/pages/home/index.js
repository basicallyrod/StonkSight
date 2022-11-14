import { Container, Wrapper, Background, 
    BackgroundContent, TexturedBody, Picture, Logo, Row, UnderlineRow, Column, Body, InnerBody, OuterBody,
    Link, StyledLink, Title, Subtitle,
    Education, Project, LeftColumn, RightColumn, Text,
    List, UList, CarouselWrapper, Button, Form } 
    from "./styles/home";

const Home = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>;
};

Home.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>;
};

Home.Background = ({children, ...restProps}) => {
    return <Background {...restProps}>{children}</Background>;
};

Home.BackgroundContent = ({children, ...restProps}) => {
    return <BackgroundContent {...restProps}>{children}</BackgroundContent>;
};

Home.Picture = ({children, ...restProps}) => {
    return <Picture {...restProps}>{children}</Picture>;
};

Home.Logo = ({children, ...restProps}) => {
    return <Logo {...restProps}>{children}</Logo>;
};

Home.Row = ({ children, ...restProps}) => {
    return <Row {...restProps}>{children}</Row>;
};

Home.UnderlineRow = ({ children, ...restProps}) => {
    return <UnderlineRow {...restProps}>{children}</UnderlineRow>;
};

Home.Column = ({ children, ...restProps}) => {
    return <Column {...restProps}>{children}</Column>;
};



Home.Body = ({ children, ...restProps }) => {
    return <Body {...restProps}> {children} </Body>;
};

Home.TexturedBody = ({ children, ...restProps }) => {
    return <TexturedBody {...restProps}> {children} </TexturedBody>;
};

Home.OuterBody = ({ children, ...restProps }) => {
    return <OuterBody {...restProps}> {children} </OuterBody>;
};

Home.InnerBody = ({ children, ...restProps }) => {
    return <InnerBody {...restProps}> {children} </InnerBody>;
};

Home.StyledLink = ({ children, ...restProps }) => {
    return <StyledLink {...restProps}> {children} </StyledLink>;
};

Home.Link = ({ children, ...restProps }) => {
    return <Link {...restProps}> {children} </Link>;
};

Home.Title = ({ children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>;
};

Home.Subtitle = ({ children, ...restProps}) => {
    return <Subtitle {...restProps}>{children}</Subtitle>;
};

Home.LeftColumn = ({ children, ...restProps}) => {
    return <LeftColumn {...restProps}>{children}</LeftColumn>;
};

Home.RightColumn = ({ children, ...restProps}) => {
    return <RightColumn {...restProps}>{children}</RightColumn>;
};

Home.Text = ({ children, ...restProps}) => {
    return <Text {...restProps}>{children}</Text>;
};

Home.Education = ({ children, ...restProps}) => {
    return <Education {...restProps}>{children}</Education>;
}
;
Home.Project = ({ children, ...restProps}) => {
    return <Project {...restProps}>{children}</Project>;
};




Home.List = ({ children, ...restProps}) => {
    return <List {...restProps}>{children}</List>;
};

Home.UList = ({ children, ...restProps}) => {
    return <UList {...restProps}>{children}</UList>;
};

Home.CarouselWrapper = ({ children, ...restProps}) => {
    return <CarouselWrapper {...restProps}>{children}</CarouselWrapper>;
};

Home.Button = ({ children, ...restProps}) => {
    return <Button {...restProps}>{children}</Button>;
};

Home.Form = ({ children, ...restProps}) => {
    return <Form {...restProps}>{children}</Form>;
};

export default Home;




// const MainContent = () => {
//     return(
//         <div className = "mainContent">
//             <p>
//                 My name is Roderick Buo and I am an aspiring software engineer. In my free time, I have been learning the web development, MERN/MEAN, and the PyData stack. Outside of programming, I enjoy playing games specifically Teamfight Tactics, Lost Ark, and League of Legends with my friends. I also enjoy collecting vintage and used designer clothing and photography.
//             </p>
//         </div>
//     )
// }

