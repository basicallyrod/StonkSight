import React, {useRef, useState} from 'react'
import Form from '../components/commonElements/list/index'
import {Button} from '../components/commonElements/buttons/index'
import { useDispatch} from 'react-redux'

import { ModalProvider } from 'styled-react-modal'
import { Modal } from '../components/commonElements/modal'
import { getLists, createList, updateList, deleteList, reset } from '../features/lists/listSlice'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

import {toast} from 'react-toastify' 
import { render } from 'react-dom'
// import {createList} from '../features/lists/listSlice'

const schema = yup.object().shape({
    listName: yup.string().required()
})



const ListForm = () => {
    const { register, handleSubmit, formState: { errors} } = useForm({
        resolver: yupResolver(schema),
    })

    const listNameRef = useRef(null); 
    const{ ref, ...rest} = register('listName')



    // const FancyModalButton = () => {
    //     const [isOpen, setIsOpen] = useState(false)
      
    //     function toggleModal(e) {
    //       setIsOpen(!isOpen)
    //     }
      
    //     // render () {
    //       return (
    //         <div>
    //           <button onClick={toggleModal}>Click me</button>
    //           <StyledModal
    //             isOpen={isOpen}
    //             onBackgroundClick={toggleModal}
    //             onEscapeKeydown={toggleModal}>
    //             <span>I am a modal!</span>
    //             <button onClick={toggleModal}>Close me</button>
    //           </StyledModal>
    //         </div>
    //       )
    //     // }
    //   }

    // const ref = {register}


    // const ref = React.useRef<HTMLDivElement>(null);

    // const ref = useRef<input>(null);

    // const testRef = forwardRef(({listName}, ref) => {
    //     return (
    //         <Form.StyledInput ref = {{...register("listName")}} name="listName"/>
    //     )
    // }


    // const [ text, setText] = useState('')
    // const { register, handleSubmit} = useForm({
    //     defaultValues: {
    //         user:'',
    //         listName: '',
    //         ticker:[]
    //     }
    // });
    // const {onChange, name, ref} = register('listName')
    


    // const [formData, setFormData] = useState({
    //     user:'',
    //     listName:'',
    //     ticker:[]
    // })

    // const {listName} = register;

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
        // if(!listName) {
        //     toast.error('Please enter a name for the list')

        console.log(`ListForm onSubmit: ${data.listName}`)
        let listName = data.listName
        const listData = {
            listName
        }

        
        dispatch(createList(listData));
        dispatch(reset());
        dispatch(getLists());
            
         
    };

    

    const onError = (errors) => console.log(errors);

    const inputRef = useRef();

    // React.useEffect(() => {
    //     register('listName', {required: true});
    // }, [])
        // if(formaction === 'addList'){
        //     if(!listName) {
        //         toast.error('Please enter a name for the list')
        //     } else {
        //         console.log(`watchList onSubmit`)
    
        //         const listData = {
        //             listName
        //         }
        //         dispatch(createList(listData))   
        //     }
        // }

        // if(formaction === 'addTicker'){
        //     console.log(`watchList addTicker`)
        // }




    return (
        
        <>
        {/* const ref = {{...register('listName')}} */}
            {/* <Form onSubmit = {handleSubmit(onSubmit)}> */}
                <Form.Wrapper1 className = "ListCreator">
                    <Form.TextInput onSubmit = {handleSubmit(onSubmit)}>
                        {/* <Form.Label>List Name</Form.Label> */}
                        {/* <Form.StyledInput
                            type = 'text'
                            className = 'form-control'
                            id = 'listName'
                            name = 'listName'
                            value = {listName}
                            placeholder = "Enter the list's name"
                            onChange = {onChange}
                        /> */}
                        {/* <Form.StyledInput 
                            {...register("listName")} 
                            placeholder = "Enter the list's name"
                            // onChange = {onChange}
                        /> */}
                        <Form.StyledInputWRef
                            {...rest}
                            name = 'listName'
                            ref={(e)=>{
                                ref(e)
                                listNameRef.current = e
                            }}
                            
                            
                            // value = 
                            // type = 'text'
                            // name="listName"
                            placeholder = 'Please enter a name for the list'
                            
                            // ref = {
                            //     register({
                            //         required: 'listName required'
                            //     })
                            // }
                        />
                        {/* <input {...register("listName")} /> */}
                        {/* <p>{errors.listName?.message}</p> */}
                            
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
                            Create a List
                        </Form.StyledButton>
                        {/* <Button className = 'form-group'>
                            <Button.StyledButton type = 'submit' formaction = 'addTicker' className = 'ticker btn btn-block'>
                                Add ticker
                            </Button.StyledButton>
                        </Button> */}
                    </Form.TextInput>
                </Form.Wrapper1>
            {/* </Form> */}

            {/* <FancyModalButton/> */}

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

export {ListForm}