import { useEffect} from 'react'
import {useNavigate, useDispatch} from 'react-router-dom'
import {useSelector} from'react-redux'
import {ListForm} from '../components/list/ListForm'
import {ListItem} from '../components/list/ListItem'
import Spinner from '../components/commonElements/spinner'
import {getLists, reset} from '../features/lists/listSlice'

function Dashboard () {
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

        dispatch(getLists)

        // return () => {
        //     dispatch(reset())
        // }
    }, [user, navigate, isError, message, dispatch])

    if(isLoading) {
        return <Spinner />
    }

    return (
        <>
            <section className = 'heading'>
                <h1>Welcome {user && user.name}</h1>
                <p>Watchlist Dashboard</p>
            </section>

            <ListForm/>

            <section className = " content">
                {lists.length > 0 ? (<div className = "lists">
                    {lists.map((list) => (
                        <ListItem key={list._id} list={list} />
                    ))}
                </div>) : (<h3> You have not set any lists </h3>)}
            </section>
        </>
    )
}

export default Dashboard