import React, {useRef, useState} from 'react'
import Form from '../components/commonElements/list/index'
import {Button} from '../components/commonElements/buttons/index'
import { useDispatch} from 'react-redux'
import { getLists, createList, addTicker, updateList, deleteList, reset } from '../features/lists/listSlice'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

import {toast} from 'react-toastify' 
import { render } from 'react-dom'
// import {createList} from '../features/lists/listSlice'

const schema = yup.object().shape({
    tickerName: yup.string().required()
})


/**
 * 
 * @param {*} listId  - list Id for
 * @returns 
 */
const TickerListForm = (listId) => {
    const { register, handleSubmit, formState: { errors} } = useForm({
        resolver: yupResolver(schema),
    })

    console.log(listId)

    const tickerNameRef = useRef(null); 
    const{ ref, ...rest} = register('tickerName')



    // const ref = {register}


    // const ref = React.useRef<HTMLDivElement>(null);

    // const ref = useRef<input>(null);

    // const testRef = forwardRef(({tickerName}, ref) => {
    //     return (
    //         <Form.StyledInput ref = {{...register("tickerName")}} name="tickerName"/>
    //     )
    // }


    // const [ text, setText] = useState('')
    // const { register, handleSubmit} = useForm({
    //     defaultValues: {
    //         user:'',
    //         tickerName: '',
    //         ticker:[]
    //     }
    // });
    // const {onChange, name, ref} = register('tickerName')
    


    // const [formData, setFormData] = useState({
    //     user:'',
    //     tickerName:'',
    //     ticker:[]
    // })

    // const {tickerName} = register;

    const dispatch = useDispatch()

    // const onChange = (err) => {
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [err.target.name]: err.target.value,
    //     }))
    //     console.log('success')

    // };

    const onSubmit = data => {
        // err.preventDefault()
        // console.log('success')
        // if(!tickerName) {
        //     toast.error('Please enter a name for the list')

        console.log(`ListForm onSubmit: ${listId.listId}`)
        let tickerName = data.tickerName
        let listIdData = listId.listId
        const listData = {
            listId: listIdData,
            tickerName
        }
        console.log(listData)

        
        dispatch(addTicker(listData));
        dispatch(reset());
        dispatch(getLists());
            
         
    };

    

    const onError = (errors) => console.log(errors);

    const inputRef = useRef();

    // React.useEffect(() => {
    //     register('tickerName', {required: true});
    // }, [])
        // if(formaction === 'addList'){
        //     if(!tickerName) {
        //         toast.error('Please enter a name for the list')
        //     } else {
        //         console.log(`watchList onSubmit`)
    
        //         const listData = {
        //             tickerName
        //         }
        //         dispatch(createList(listData))   
        //     }
        // }

        // if(formaction === 'addTicker'){
        //     console.log(`watchList addTicker`)
        // }




    return (
        
        <>
        {/* const ref = {{...register('tickerName')}} */}
            <Form.TextInput onSubmit = {handleSubmit(onSubmit)}>
                {/* <Form.Wrapper> */}
                {/* <Form.Wrapper onSubmit = {handleSubmit(onSubmit)}> */}
                    {/* <Form.Label>Add Ticker</Form.Label> */}
                    {/* <Form.StyledInput
                        type = 'text'
                        className = 'form-control'
                        id = 'tickerName'
                        name = 'tickerName'
                        value = {tickerName}
                        placeholder = "Enter the list's name"
                        onChange = {onChange}
                    /> */}
                    {/* <Form.StyledInput 
                        {...register("tickerName")} 
                        placeholder = "Enter the list's name"
                        // onChange = {onChange}
                    /> */}
                    <Form.StyledInputWRef
                        {...rest}
                        name = 'tickerName'
                        ref={(e)=>{
                            ref(e)
                            tickerNameRef.current = e
                        }}
                        
                        // value = 
                        // type = 'text'
                        // name="tickerName"
                        placeholder = 'Please enter a ticker symbol'
                        // ref = {
                        //     register({
                        //         required: 'tickerName required'
                        //     })
                        // }
                    />
                    {/* <input {...register("tickerName")} /> */}
                    {/* <p>{errors.tickerName?.message}</p> */}
                        
                    {/* <Form.StyledInput
                    type = 'text'
                    className = 'form-control'
                    id='ticker'
                    name = 'ticker'
                    value={formData.ticker}
                    placeholder= 'Enter a ticker symbol or name'
                    onChange = {onChange}
                    /> */}
                    <Form.StyledButton type = 'submit'>
                        Add ticker
                    </Form.StyledButton>
                    {/* <Button className = 'form-group'>
                        <Button.StyledButton type = 'submit' formaction = 'addTicker' className = 'ticker btn btn-block'>
                            Add ticker
                        </Button.StyledButton>
                    </Button> */}

                {/* </Form.Wrapper> */}
            </Form.TextInput>

            {/* <h1>List goes here</h1> */}
            {/* <ListItem/> */}

            {/* <div className ="list">
                <div>{new Date(list.createdAt).toLocaleString('en-US')}</div>
                <h2>{list.text}</h2>
                <button onClick = {() => dispatch(deleteList(list._id))}
                className = 'close'>
                    X
                </button>
            </div> */}
        </>

        
    )
}

/*

            <div className ="list">
                <div>{new Date(list.createdAt).toLocaleString('en-US')}</div>
                <h2>{list.text}</h2>
                <button onClick = {() => dispatch(deleteList(list._id))}
                className = 'close'>
                    X
                </button>
            </div>
*/

export {TickerListForm}