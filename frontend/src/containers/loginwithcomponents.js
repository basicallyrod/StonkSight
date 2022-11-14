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
            navigate('/dashboard')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onSubmit = (err) => {
        err.preventDefault()

        const userData = {
            email,
            password
        }
        dispatch(login(userData))
    };

    if(isLoading) {
        return <Spinner />

    }

    return (
        <>
            <Home className = "Login">
                <Home.Wrapper>
                    
                    <Home.Title>Login Page</Home.Title>
                    <Home.Text>Please create an account</Home.Text>
                    
                    <Form onSubmit = {onSubmit}>
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
                            <Button className = 'form-group'>
                                <Button.StyledButton type = 'submit' className = 'btn btn-block'>
                                    Submit
                                </Button.StyledButton>
                            </Button>
                        </Form.Wrapper>
                    </Form>
                </Home.Wrapper>
            </Home>

        </>
    )
}

export {
    LoginContainer
};