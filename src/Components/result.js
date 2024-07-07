import { useContext } from "react";
import apiContext from "./Context";
export default function Result(){
    const valueFromContext = useContext(apiContext);
    function stylesOfButton(){
        return{
            backgroundColor : valueFromContext.dark_mode ? "transparent" : "rgb(170,170,170)",
            color : valueFromContext.dark_mode ? "white" : "black",
            border : valueFromContext.dark_mode ? "2px solid white" : "2px solid black",
        }
    }
    function handleClicksOfButtons(option){
        valueFromContext.setTest(option);
        valueFromContext.setResult(false);
    }
    return(
        <div className="resultBox">
            <div className="resultTitle">WPM</div>  
            <div style={{
                fontSize:"10vw",
                color:valueFromContext.dark_mode ? "white" : "black"
            }} className="wpm">{valueFromContext.final.wpm}</div>
            <div className="buttonsInResult">
                <button style={stylesOfButton()} className="RetryTaskBtn" onClick={()=>handleClicksOfButtons("retry")}>Retry</button>
                <button style={stylesOfButton()} className="nextTaskBtn" onClick={()=>handleClicksOfButtons("new test")}>Next</button>
            </div>
        </div>
    )
}