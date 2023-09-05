import styled from 'styled-components';
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";




const Container = styled.div`
    background: slateblue;
    /* width: 90vw; */
    
    /* width: 15vw; */
    border: solid;
    border-color: red;
    border-radius: 5px;
    height: 66%;
    overflow-y: hidden;
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
  border-color: green;
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
  margin: 8px auto;
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
  background: ${(props) => (props.isOn === true) ? '#848089' : '#695D68'};
  height: ${props => props.theme.height};
  width: ${props => props.theme.width};
  border: solid;
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
  /* border: solid yellow; */
  border-radius: 5px;
  /* padding: 25px 50px; */
  /* margin: 25px 50px; */
  height: 100%;
  display: table;

  /* height: 100%; */
  /* width: 50px; */
  width: 100%;
  /* width: relative; */
  /* width: 15vw; */
  border-collapse: separate;
  /* border-spacing: 50px 25px; */
  

`

const StyledTBody1 = styled.tbody`
/* background: hsl(52 78% 40%); */
background: ${props => props.watchlistChange ? "red" : "green"};;
border: solid;
border-radius: 5px;
/* padding-right: 25%; */
height: 40vh;
width: 80%;
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
  border-spacing: 0 50px;
  padding: 10px 0px;
  /* border-color: red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  scroll-snap-align: start;
  position: relative;
`

const StyledTBody = styled.tbody`
  height: 100%;
  /* height: 50%; */
  /* padding: 25px 50px; */
  display: block;
  /* width: relative; */
  overflow-y: scroll;
  scroll-snap-type:y mandatory;
  scroll-snap-points-y: repeat(100%);
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
  width: 300px;
  margin: 20px auto;
`




export {
    Container, Wrapper, Wrapper1, TextInput, Label, Text, Error, StyledInput, StyledButton, StyledTable, StyledTBody1, StyledTHead, StyledTR, StyledTD, StyledTBody, FormRow
}

