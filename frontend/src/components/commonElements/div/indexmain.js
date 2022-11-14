import {Global, Wrapper, Container, Card, CardContent, CardContentH2, CardContentH3, CardContentP, CardContentA, CardSpan, CardSpan1, CardSpan2} from "./styles/animations"

const Animation = ({children,...restProp}) => {
    return <Global {...restProp}>{children}</Global>
};

Animation.Wrapper = ({children,...restProp}) => {
    return <Wrapper {...restProp}>{children}</Wrapper>
};

Animation.Container = ({children,...restProp}) => {
    return <Container {...restProp}>{children}</Container>
};

Animation.Card = ({children,...restProp}) => {
    return <Card {...restProp}>{children}</Card>
};

Animation.CardContent = ({children,...restProp}) => {
    return <CardContent {...restProp}>{children}</CardContent>
};

Animation.CardContentH2 = ({children,...restProp}) => {
    return <CardContentH2 {...restProp}>{children}</CardContentH2>
};

Animation.CardContentH3 = ({children,...restProp}) => {
    return <CardContentH3 {...restProp}>{children}</CardContentH3>
};

Animation.CardContentA = ({children,...restProp}) => {
    return <CardContentA {...restProp}>{children}</CardContentA>
};

Animation.CardContentP = ({children,...restProp}) => {
    return <CardContentP {...restProp}>{children}</CardContentP>
};

Animation.CardSpan = ({children,...restProp}) => {
    return <CardSpan {...restProp}>{children}</CardSpan>
};


export {
    Animation
};