import React from "react"
import Footer from '../components/footer'
import Icon from '../components/footer/icons'



function FooterContainer() {
    return (
        <Footer className = "Footer">
            <Footer.Wrapper className = "Footer Wrapper">
                <Footer.Row className = "Footer Row">
                    <Footer.Column className = "Footer Column">
                        <Footer.Title className = "Footer Title Contact Me">Contact Me</Footer.Title>
                            <Footer.Link href ="https://www.linkedin.com/in/roderickbuo/" target= "_blank">
                                <Icon className = "LinkedIn" />
                                {/* <LinkedinIn size="18"/> */}
                                LinkedIn
                            </Footer.Link>
                            <Footer.Link href="https://github.com/basicallyrod" target= "_blank">
                                <Icon className = "Github" />
                                {/* <Github size="18"/> */}
                                GitHub
                            </Footer.Link>
                    </Footer.Column>
                </Footer.Row>
            </Footer.Wrapper>
        </Footer>
    )
};

export {
    FooterContainer
}
// export default FooterContainer;