import { useContext } from "react";
import apiContext from "./Context";
export default function Result({setResult}){
    const valueFromContext = useContext(apiContext);
    function stylesOfButton(){
        return{
            backgroundColor : valueFromContext.dark_mode ? "transparent" : "rgb(170,170,170)",
            color : valueFromContext.dark_mode ? "white" : "black",
            border : valueFromContext.dark_mode ? "2px solid white" : "2px solid black",
        }
    }
    return(
        <div className="resultBox">
            <div>WPM <div style={{
                color:valueFromContext.dark_mode ? "white" : "black"
            }} className="wpm">{valueFromContext.final.wpm}</div></div>
            <div className="buttonsInResult">
                <button style={stylesOfButton()} className="RetryTaskBtn" onClick={()=>{
                    valueFromContext.test = "retry";
                    valueFromContext.result = false;
                    setResult(false)
                }}>Retry</button>
                <button style={stylesOfButton()} className="nextTaskBtn" onClick={()=>{
                    valueFromContext.test = "new test";
                    valueFromContext.result = false;
                    setResult(false)
                }}>Next</button>
            </div>
        </div>
    )
}