// import styled, { keyframes, css } from "styled-components";
import Modal from 'styled-react-modal'

const Container = Modal.styled`
`

const StyledModal = Modal.styled`
  width: 20rem;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.white};
`

// const Container = styled.div`
//     position:fixed;
//     background: antiquewhite;
//     width: 33%;
//     height: auto;
     
//     top: ${({openPos}) => (
//     {
//         [CM_CENTER_CENTER]: '50%',
//         [CM_TOP_LEFT]: '10%',
//         [CM_TOP_CENTER]: '10%',
//         [CM_TOP_RIGHT]: '10%'
//     }[openPos])};
     
//     left: ${({openPos}) => (
//     {
//         [CM_CENTER_CENTER]: '50%',
//         [CM_TOP_LEFT]: '5%',
//         [CM_TOP_CENTER]: '50%',
//         [CM_TOP_RIGHT]: '95%'
//     }[openPos])};
  
//     transform: ${({openPos}) => (
//     {
//         [CM_CENTER_CENTER]: 'translate(-50%,-50%)',
//         [CM_TOP_LEFT]: 'translate(0,0)',
//         [CM_TOP_CENTER]: 'translate(-50%,0)',
//         [CM_TOP_RIGHT]: 'translate(-100%,0)'
//     }[openPos])};
 
//     border-radius: 10px;
//     padding: 0.75rem;
//     color: rgba(0,0,139, 0.7);
// `;

// const Model = styled.div`
//     z-index: auto;
//     display: ${({show}) => (show ? 'block' : 'none')};
//     position: fixed;
//     top: 0;
//     left: 0;
//     height: 100vh;
//     width:100vw;
//     background: rgba(0,0,0,0.5);
// `;

export{
  StyledModal
}