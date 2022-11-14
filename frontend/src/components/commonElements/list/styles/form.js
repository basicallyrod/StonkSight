import styled from 'styled-components';



const Container = styled.div`
    background: red;
    width: 50%;
    height: 33%;
`

const Wrapper = styled.form`
  padding-top: 0;
  width: 77%;
`

const Label = styled.label`
  display: inline-block;
  font-size: 0.8em;
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
  font-size: 14px;
  padding: 6px 8px;
  border-width: 1px;
  border-style: solid;
  /* border-color: ${props => props.error ? 'red' : 'black'}; */
  margin: 0;
  ::placeholder {
    color: palevioletred;
  }
`

const StyledButton = styled.button`
  width:50px;
  height:50px;
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
    Container, Wrapper, Label, Text, Error, StyledInput, StyledButton, FormRow
}

