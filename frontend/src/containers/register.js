import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify' 
import {register, reset } from '../features/auth/authSlice.js'
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'

function RegisterContainer() {
    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: '',
        password1: '',
    }) 

    const { name, email, password, password1} = formData;

    const navigate  = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth)


    useEffect(() => {
        if(isError) {
            toast.error(message)
            console.log('error')
            navigate('/')
        }
        if(isSuccess || user) {
            navigate('/dashboard')
            console.log('success')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])
    const onChange = (err) => {
        setFormData((prevState) => ({
            ...prevState,
            [err.target.name]: err.target.value,
        }))
        console.log('success')

    };

    const onSubmit = (err) => {
        err.preventDefault()
        console.log('success')

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
            <section className = "heading">
                <h1>Register</h1>
                <p> Please create an account</p>
            </section>
            <section className = "form">
                <form onSubmit = {onSubmit}>

                    <div className = "form-group">
                        <input 
                            type = 'text'
                            className = 'form-control'
                            id='name'
                            name = 'name'
                            value={name}
                            placeholder= 'Enter your name'
                            onChange = {onChange}
                        />
                        <input 
                            type = 'email'
                            className = 'form-control'
                            id='email'
                            name = 'email'
                            value={email}
                            placeholder= 'Enter your email'
                            onChange = {onChange}
                        />
                        <input 
                            type = 'password'
                            className = 'form-control'
                            id='password'
                            name = 'password'
                            value={password}
                            placeholder= 'Enter your password'
                            onChange = {onChange}
                        />
                        <input 
                            type = 'password'
                            className = 'form-control'
                            id='password1'
                            name = 'password1'
                            value={password1}
                            placeholder= 'Confirm your password1'
                            onChange = {onChange}
                        />

                    </div>
                    <div className = 'form-group'>
                        <button type = 'submit' className = 'btn btn-block'>
                            Submit
                        </button>
                    </div>
                    



                </form>

            </section>

           


        </>
        
    )
}

export {RegisterContainer};