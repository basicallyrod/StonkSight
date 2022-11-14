import { useState, useEffect } from "react"
import { LineChartContainer, CandlestickChartContainer } from "../chartDiv";
import {}

function viewButton(){

    const [view, setView] = useState('candlestick');

    const changeView = e => {
        e.preventDefault();
        console.log('')

        setView({})
    }


    return (
        <>
            <div id = "chart view butto div">
                <button onClick = {()=> setView('line')}/>
                if(view == 'candlestick') ? 

            </div>
        </>
    )
}