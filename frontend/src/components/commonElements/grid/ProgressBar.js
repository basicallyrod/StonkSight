/**
 * UploadForm.js passes the selected file to this file
 */
import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';



const ProgressBar = ({file, setFile}) => {
    //ProgressBar passes the selected file from the UploadForm.js to the useStorage.js
    const { url, progress } = useStorage(file);
    console.log("progressBar");

    useEffect(() => {
        if (url) {
            setFile(null);
        }
    }, [url, setFile])
    return (
        <div className = "progress-bar" style = {{width: progress + '%'}}></div>
    )
}

export default ProgressBar