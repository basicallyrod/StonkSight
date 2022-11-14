import {Container, HiddenSideContainer, HiddenSideText, Title, Wrapper, Item, Input, Button, StyledArrowContainer, StyledIndicatorContainer, StyledIndicator, Main} from "./styles/section"

const Section = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>;
};

Section.HiddenSideContainer = ({children, ...restProps}) => {
    return <HiddenSideContainer {...restProps}>{children}</HiddenSideContainer>;
};

Section.HiddenSideText = ({children, ...restProps}) => {
    return <HiddenSideText {...restProps}>{children}</HiddenSideText>;
};

Section.Title = ({children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>;
};

Section.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>;
};

Section.Item = ({children, ...restProps}) => {
    return <Item {...restProps}>{children}</Item>;
};

Section.Input = ({children, ...restProps}) => {
    return <Input {...restProps}>{children}</Input>;
};

Section.Button = ({children, ...restProps}) => {
    return <Button {...restProps}>{children}</Button>;
}

Section.StyledArrowContainer = ({children, ...restProps}) => {
    return <StyledArrowContainer {...restProps}>{children}</StyledArrowContainer>;
};

Section.StyledIndicatorContainer = ({children, ...restProps}) => {
    return <StyledIndicatorContainer {...restProps}>{children}</StyledIndicatorContainer>;
};

Section.StyledIndicator = ({children, ...restProps}) => {
    return <StyledIndicator {...restProps}>{children}</StyledIndicator>;
};

Section.Main = ({children, ...restProps}) => {
    return <Main {...restProps}>{children}</Main>;
};

export {
    Section
}