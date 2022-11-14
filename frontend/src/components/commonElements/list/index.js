import { forwardRef } from "react";
import * as StyledForm from "./styles/form"


// const Form = ({ children, ... restProps}) => {
//     return <StyledForm.Container {...restProps}> 
//         {children}
//         <StyledInput
//           id={restProps.id}
//           name={restProps.name}
//           type={restProps.type}
//           placeholder={restProps.placeholder}
//           value={restProps.value}
//           onChange={restProps.onChange}
//           disabled={restProps.disabled}
//           error={restProps.error}
//         />
//     </StyledForm.Container>

// };
// const Form = (id: id, ...rest)

const Form = ({ children, ... restProps}) => {
    return <StyledForm.Container {...restProps}> {children}</StyledForm.Container>

};

Form.Wrapper = ({children, ...restProps}) => {
    return <StyledForm.Wrapper {...restProps}>{children}</StyledForm.Wrapper>;
};

Form.Label = ({children, ...restProps}) => {
    return <StyledForm.Label {...restProps}>{children}</StyledForm.Label>;
};

Form.Text = ({children, ...restProps}) => {
    return <StyledForm.Text {...restProps}>{children}</StyledForm.Text>;
};

Form.Error = ({children, ...restProps}) => {
    return <StyledForm.Error {...restProps}>{children}</StyledForm.Error>;
};

Form.StyledInput = ({children, ...restProps}) => {
    return <StyledForm.StyledInput {...restProps}>{children}</StyledForm.StyledInput>;
};

Form.StyledInputWRef = forwardRef(({children, ...restProps}, ref) => {
    return (
        <StyledForm.StyledInput ref={ref} {...restProps}>
            {children}
        </StyledForm.StyledInput>
    );
});

Form.FormRow = ({children, ...restProps}) => {
    return <StyledForm.FormRow {...restProps}>{children}</StyledForm.FormRow>;
};

Form.StyledButton = ({children, ...restProps}) => {
    return <StyledForm.StyledButton {...restProps}>{children}</StyledForm.StyledButton>;
};

export default Form;
