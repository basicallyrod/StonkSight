import { useState, useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify' 
import {login, reset} from '../features/auth/authSlice'
import {Spinner} from '../components/commonElements/spinner/spinner.jsx'

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
            password,
        }
        dispatch(login(userData))
    };

    if(isLoading) {
        return <Spinner />

    }


    return (
        <>
            <section className = "heading">            
                <h1>Login</h1>
                <p> Please create an account</p>
            </section>
            <section className = "form">
                <form onSubmit = {onSubmit}>

                    <div className = "form-group">
                        {/* <input 
                            type = 'text'
                            className = 'form-control'
                            id='name'
                            name = 'name'
                            value={name}
                            placeholder= 'Enter your name'
                            onChange = {onChange}
                        /> */}
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
                        {/* <input 
                            type = 'password1'
                            className = 'form-control'
                            id='password1'
                            name = 'email'
                            value={password1}
                            placeholder= 'Enter your password1'
                            onChange = {onChange}
                        /> */}

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

export {LoginContainer}; 