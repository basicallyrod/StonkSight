import {Container, HiddenSideContainer, HiddenSideText, Title, Wrapper, Item, Input, Button, StyledArrowContainer, StyledIndicatorContainer, StyledIndicator, Main} from "./styles/carousel"

const Carousel = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>;
};

Carousel.HiddenSideContainer = ({children, ...restProps}) => {
    return <HiddenSideContainer {...restProps}>{children}</HiddenSideContainer>;
};

Carousel.HiddenSideText = ({children, ...restProps}) => {
    return <HiddenSideText {...restProps}>{children}</HiddenSideText>;
};

Carousel.Title = ({children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>;
};

Carousel.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>;
};

Carousel.Item = ({children, ...restProps}) => {
    return <Item {...restProps}>{children}</Item>;
};

Carousel.Input = ({children, ...restProps}) => {
    return <Input {...restProps}>{children}</Input>;
};

Carousel.Button = ({children, ...restProps}) => {
    return <Button {...restProps}>{children}</Button>;
}

Carousel.StyledArrowContainer = ({children, ...restProps}) => {
    return <StyledArrowContainer {...restProps}>{children}</StyledArrowContainer>;
};

Carousel.StyledIndicatorContainer = ({children, ...restProps}) => {
    return <StyledIndicatorContainer {...restProps}>{children}</StyledIndicatorContainer>;
};

Carousel.StyledIndicator = ({children, ...restProps}) => {
    return <StyledIndicator {...restProps}>{children}</StyledIndicator>;
};

Carousel.Main = ({children, ...restProps}) => {
    return <Main {...restProps}>{children}</Main>;
};

export {
    Carousel
}