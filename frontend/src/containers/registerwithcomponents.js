import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify' 
import {register, reset } from '../features/auth/authSlice.js'
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {Button} from "../components/commonElements/buttons/index.js"
import Home from "../components/pages/home/index.js"
import Form from "../components/commonElements/list/index.js"


function RegisterContainer() {

    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: '',
        password1: '',
    }) 

    // const formData = [
    //     {
    //         label: 'name',
    //         value: name,
    //         onChange: (e) => setName(e.target.value),
    //         type:'text',
    //     },
    //     {
    //         label: 'Email',
    //         value: email,
    //         onChange: (e) => setEmail(e.target.value),
    //         type:'email',
    //     },
    //     {
    //         label: 'Password',
    //         value: password,
    //         onChange: (e) => setPassword(e.target.value),
    //         type:'password',
    //     },
    //     {
    //         label: 'Password1',
    //         value: password1,
    //         onChange: (e) => setConfirmPassword(e.target.value),
    //         type:'password',
    //     },
    // ];

    const { name, email, password, password1} = formData;

    const navigate  = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth)


    useEffect(() => {
        if(isError) {
            toast.error(message)
            console.log('error')
            navigate('/login')
        }
        if(isSuccess || user) {
            navigate('/watchlist')
            console.log('success')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onChange = (err) => {
        setFormData((prevState) => ({
            ...prevState,
            [err.target.name]: err.target.value,
        }))
        console.log('field change success')

    };

    const onSubmit = (err) => {
        console.log('onSubmit part')
        err.preventDefault()
        console.log('register success')

        if(password !== password1) {
            toast.error('Passwords do not match')
        } else {
            const userData = {
                name, 
                email, 
                password
            }
            dispatch(register(userData))   
        }
    };

    if(isLoading) {
        return <Spinner />
    }

    return (
        <>
            <Home className = "Register">
                <Home.CenterWrapper>
                    
                    <Home.Title>Registeration Page</Home.Title>
                    <Home.Text>Please create an account</Home.Text>
                    

                    <Form.TextInput onSubmit = {onSubmit}>
                        <Form.Wrapper>
                            {/* <Form.Label>Username</Form.Label> */}
                            <Form.StyledInput
                            type = 'text'
                            className = 'form-control'
                            id='name'
                            name = 'name'
                            value={name}
                            placeholder= 'Enter your name'
                            onChange = {onChange}
                            />
                            <Form.StyledInput
                            type = 'email'
                            className = 'form-control'
                            id='email'
                            name = 'email'
                            value={email}
                            placeholder= 'Enter your email'
                            onChange = {onChange}
                            />
                            <Form.StyledInput
                            type = 'password'
                            className = 'form-control'
                            id='password'
                            name = 'password'
                            value={password}
                            placeholder= 'Enter your password'
                            onChange = {onChange}
                            />
                            <Form.StyledInput
                            type = 'password'
                            className = 'form-control'
                            id='password1'
                            name = 'password1'
                            value={password1}
                            placeholder= 'Confirm your password1'
                            onChange = {onChange}
                            />
                            <Button className = 'form-group'>
                                <Button.StyledButton type = 'submit' className = 'btn btn-block'>
                                    Submit
                                </Button.StyledButton>
                            </Button>
                        </Form.Wrapper>

                    </Form.TextInput>


                </Home.CenterWrapper>
            </Home>

        </>
    )
}

export {
    RegisterContainer
};