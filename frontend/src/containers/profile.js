import { useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import {useSelector} from 'react-redux'
// import {useSelector} from 'react-redux'
import {ListForm} from '../components/commonElements/list/ListForm'
import {ListItem} from '../components/commonElements/list/ListItem'
import Form from '../components/commonElements/list/index'

import {Spinner} from '../components/commonElements/spinner/spinner.jsx'
import {getLists, reset} from '../features/lists/listSlice'

import Home from "../components/pages/home/index.js"
import {Button} from "../components/commonElements/buttons/index.js"

function ProfileContainer () {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth);
    const {lists, isLoading, isError, message} = useSelector ((state) =>
    state.lists)


    useEffect(() => {
        if(isError) {
            console.log(message)
        }
        if(!user) {
            navigate('/login')
        }

        dispatch(getLists())

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, message, dispatch])

    if(isLoading) {
        return <Spinner />
    }

    return (
        <>
            <Home>
                <Home.Wrapper>
                    <Home.TexturedBody>
                    <Form>
                        <Form.Wrapper>
                            <Form.Label>Username</Form.Label>
                            <Form.StyledInput
                            type = 'text'
                            className = 'form-control'
                            id='name'
                            name = 'name'
                            placeholder= 'Enter your name'
                            />
                            <Button className = 'form-group'>
                                <Button.StyledButton type = 'submit' className = 'btn btn-block'>
                                    Submit
                                </Button.StyledButton>
                            </Button>
                        </Form.Wrapper>

                    </Form>
                    </Home.TexturedBody>
                </Home.Wrapper>
            </Home>
        </>
    )
}

export {ProfileContainer}