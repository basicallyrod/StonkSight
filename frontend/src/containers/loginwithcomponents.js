import { useState, useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify' 
import {login, reset} from '../features/auth/authSlice'
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import Home from "../components/pages/home/index.js"
import Form from "../components/commonElements/list/index.js"
import {Button} from "../components/commonElements/buttons/index.js"


function LoginContainer(){
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password} = formData;

    const onChange = (e) => {
        console.log(e)
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))


    };

    const navigate  = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess || user) {
            navigate('/watchlist')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onSubmit = (err) => {
        
        err.preventDefault()
        console.log(formData)

        const userData = {
            email,
            password
        }
        console.log(userData)
        dispatch(login(userData))
    };

    if(isLoading) {
        return <Spinner />

    }

    return (
        <>
            <Home className = "Login">
                <Home.CenterWrapper>
                    
                    <Home.Title>Login Page</Home.Title>
                    <Home.Text>Please create an account</Home.Text>
                    
                    <Form.TextInput onSubmit = {onSubmit}>
                        <Form.Wrapper>
                            <Form.StyledInput
                                type = 'email'
                                id = 'email'
                                className = 'form-control'
                                placeholder = 'Enter your email'
                                name = 'email'
                                value = {email}
                                onChange = {onChange}
                            />
                            <Form.StyledInput
                                type = 'password'
                                id = 'password'
                                className = 'form-control'
                                placeholder = 'Enter your password'
                                name = 'password'
                                value = {password}
                                onChange = {onChange}
                            />
                            {/* <div className = 'form-group'>
                                <button type = 'submit' className = 'btn btn-block'>
                                    Login
                                </button>
                            </div> */}
                            <Button className = 'form-group'>
                                <Button.StyledButton type = 'submit' className = 'btn btn-block'>
                                    Submit
                                </Button.StyledButton>
                            </Button>

                            {/* <Form className = 'form-group'> */}
                            {/* <Form.StyledButton type = 'submit' className = 'btn btn-block'>
                                Submit
                            </Form.StyledButton> */}
                            {/* </Form> */}
                        </Form.Wrapper>



                    </Form.TextInput>
                    <div className = 'register-div-button'>
                        <button type = 'register-button'>
                            {/* Register */}
                            <Form.StyledLink to ="/register">
                                Register
                            </Form.StyledLink>
                        </button>
                    </div>

                </Home.CenterWrapper>
            </Home>

        </>
    )
}

export {
    LoginContainer
};