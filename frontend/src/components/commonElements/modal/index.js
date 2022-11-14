import {StyledModal} from "./styles/modal"



const Modal = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>;
};



// Modal.Wrapper = ({children, ...restProps}) => {
//     return <Wrapper {...restProps}>{children}</Wrapper>;
// };

// Modal.Model = ({children, ...restProps}) => {
//     return <Model {...restProps}>{children}</Model>;
// };

// Modal.Item = ({children, ...restProps}) => {
//     return <Item {...restProps}>{children}</Item>;
// };


export {
    Modal
}