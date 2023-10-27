import styled from 'styled-components';
import { gsap } from "gsap";
import { Link } from 'react-router-dom';
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";




const Container = styled.div`
    background: slateblue;
    /* width: 90vw; */
    
    /* width: 15vw; */
    border: solid;
    border-color: #222;
    border-radius: 5px;
    /* height: 66%; */
    height: 33vh;
    overflow-y: scroll;
    box-shadow: 5px 10px 15px #333
      ,6px 12px 15px #222;
      /* 10px 20px #222; */
    /* height: 200px; */
    /* display: table;
    &::table {
      table-layout:fixed;
      width:20%;
    } */
`


const Wrapper = styled.div`
  /* background: slateblue;  */
  /* height: relative; */
  
  border: solid;
  /* border-color: green; */
  border-radius: 5px;
  padding: 25px 0;
  
  /* width: 77%; */
`
const Wrapper1 = styled.div`
  background-color: pink; 
  height: 10%;
  
  border: solid;
  border-color: red;
  border-radius: 5px;
  border-spacing: 20px;
  /* padding: 25px 50px; */
  /* width: 77%; */
`

const TextInput = styled.form`
  height: auto;
  flex-direction: row;
  /* background: slateblue;  */
  /* border: solid; */
  /* border-radius: 5px; */
  /* padding: 25px 50px; */
  /* width: 77%; */
`

const Label = styled.button`
  /* background-color: rgb(208,29,155); */
  border: 5px;
  width:100%;
  height:50px;
`

const Text = styled.p`
  margin:0px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* vertical-align: middle; */
  top: 50%;
  left: 50%;
  /* transform: translate(50%, -50%); */
  margin-block: 0px;
  margin-inline: 0px;
  /* margin: 8px auto; */
`

const Error = styled(Text)`
  font-size: 12px;     
  color: red;
`

// const _StyledInput = React.forwardRef(({className}))

const StyledInput = styled.input`
  /* width: 100%; */
  font-size: 10px;
  padding: 6px 8px;
  /* border-width: 1px; */
  /* border-style: solid; */
  /* border-color: ${props => props.error ? 'red' : 'black'}; */
  margin: 0;
  ::placeholder {
    color: palevioletred;
  }
`
const StyledButton = styled.button`

  /* padding: 25px 50px; */
  margin: 5px 0;
  color: ${props => props.theme.color ? props.theme.color: "grey"};
  /* background: ${(props) => (props.isOn === true) ? 'red' : props.theme.background}; */
  /* background: ${(props) => (props.isOn === true) ? '#848089' : '#695D68'}; */
  background: linear-gradient(-90deg, #848089 80%, green 20%);
  background: ${(props) => (props.changePercent >= 0) ? 'linear-gradient(-90deg, #848089 80%, green 20%)' : 'linear-gradient(-90deg, #848089 80%, red 20%)'};
  height: ${props => props.theme.height};
  width: ${props => props.theme.width};
  border: solid;
  border-radius: 10px;
  border-color: ${(props) => (props.isOn === true) ? 'white' : "#211F21"};
  /* background-color: ${(props) => (props.isOn === true) ? 'red' : props.theme.main}; */
`;

// const StyledButton = styled.button`
//   background-color: blanchedalmond;
//   border:5 px;
//   width:100%;
//   height:50px;
// `

const StyledTable = styled.table`
  background: ${props => props.theme.background ? "#605D68" : props.theme.background};
  /* border-color: white; */
  /* border: solid yellow; */
  border-radius: 10px;
  border-spacing: 0px;
  /* padding: 25px 50px; */
  /* margin: 25px 50px; */
  height: 10vh;
  /* height: 100%; */
  display: table;

  /* height: 100%; */
  /* width: 50px; */
  /* width: 100%; */
  /* width: 20vw; */
  /* width: relative; */
  /* width: 15vw; */
  border-collapse: separate;
  /* border-spacing: 50px 25px; */
  

`

const StyledTBody1 = styled.tbody`
background: hsl(52 78% 40%);
/* background: ${props => props.watchlistChange ? "red" : "green"};; */
border: solid;
border-radius: 10px;
/* padding-right: 25%; */
height: 18vh;
width: 100%;
display: block;
  overflow-y: scroll;
  scroll-snap-type:y mandatory;
  scroll-snap-points-y: repeat(80%);

  &::-webkit-scrollbar {
        width: 10px;
        border: 1px solid white;
    }
  &::-webkit-scrollbar-thumb {
    border: 1px solid blue;
    width: 10px;
    background-color: teal;

  }
`

const StyledTHead = styled.thead`
`

const StyledTR = styled.tr`
  background-color: grey;
  border: 3em;
  border-color: black;
  outline: 3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80%;
  scroll-snap-align: start;
  position: relative;
`
const StyledTD = styled.td`
  background-color: #3B383E;
  /* outline: 1em solid green; */
  /* outline-color: red; */
  /* border-top: 1em solid grey; */
  /* border-bottom: 1em solid grey; */
  border-collapse: separate;
  border-spacing: 0 0px;
  padding: 0px;
  /* border-color: red; */
  display: flex;
  flex-direction: column;
  justify-content: normal;
  align-items: center;
  /* height: vh; */
  /* width: 100%; */
  scroll-snap-align: start;
  position: relative;
`

const StyledTBody = styled.tbody`
  /* height: 100%; */
  /* height: 50%; */
  /* padding: 25px 50px; */
  /* background-color: white; */
  display: block;
  border-radius: 10px;
  border-color: red;
  /* width: relative; */
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-snap-type:y mandatory;
  scroll-snap-points-y: repeat(100%);
  &::-webkit-scrollbar {
        width: 10px;
        border: 1px solid white;
    }
  /* &::-webkit-scrollbar-thumb {
    border: 1px solid blue;
    width: 10px;
    background-color: teal;

  } */

                            
`


// const TextField = styled(({
//     type,
//     id,
//     name,
//     value,
//     placeholder,
//     hasError,
//     isTouched,
//     hintText,
//     onChange,
//     disabled,
//     className
//   }) => {
//     const error = isTouched && hasError;
  
//     return (
//       <div className={className}>
//         <StyledInput
//           id={id}
//           name={name}
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           error={error}
//         />
//         {hintText && <Text>{hintText}</Text>}
//         {error && <Error>{error}</Error>}
//       </div>
//     )
//   })``


// const StyledTextField = styled(TextField)`
//   border-width: 2px;
//   border-style: dashed;
//   border-color: #1166ff;
//   box-shadow: 0 4px 4px #1166ff;
//   outline: none;
// `

const FormRow = styled.div`
  display: flex;
  background: #333;
  border: thin solid #777;
  height: 8vh;
  width: 100%;
  font-size: 30px;
  color: #777;
  text-align: center;
  vertical-align: middle;
  /* align-items: center; */
  justify-content: center;
  /* margin: 20px auto; */

`
const StyledLink = styled(Link)`
    color: #242424;
    font-size: 18px;
    text-decoration: none;

    &:hover {
        color: #5F021F;
        text-decoration: underline;
        text-decoration-thickness: 4px;
        
        text-underline-offset: 16px;
        transition: 200ms ease-in;
    }
`;



export {
    Container, Wrapper, Wrapper1, TextInput, Label, Text, Error, StyledInput, StyledButton, StyledTable, StyledTBody1, StyledTHead, StyledTR, StyledTD, StyledTBody, FormRow, StyledLink
}

