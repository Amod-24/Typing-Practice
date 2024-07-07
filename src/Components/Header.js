import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard } from "@fortawesome/fontawesome-free-regular";
import { useState, useContext } from "react";
import apiContext from "./Context";

export default function Header(){
  const valueFromContext = useContext(apiContext);
    const[darkMode, setDarkMode] = useState(valueFromContext.dark_mode)
    return(
        <header>
        <div className="logo">
          <FontAwesomeIcon style={{
            margin:"4.5vmin 1vmin auto 5vmin",
            fontSize:"9vmin",
            color:darkMode ? "#FF9900" : "black",
            height:"6.7vmin"
          }} icon={faKeyboard}/>
          <div className="heading">
            <span><h1 style={{
                color:darkMode ? "#FF9900" : "black"
            }}>T</h1></span>
            <h3 style={{
              margin:"auto 0 4.5vmin -1vmin",
              color:darkMode ? "#C6C6C6" : "#FF9900"
              
            }}>yping</h3> 
            <span><h1 style={{
                color:darkMode ? "#FF9900" : "black"
            }}>T</h1></span>
            <h3 style={{
              margin:"auto 2.5vmin 4.5vmin -1vmin",
              color:darkMode ? "#C6C6C6" : "#FF9900"
              
            }}>est</h3> 
          </div>
        </div>
        <div className="darkmode">
          <p style={{
            color:darkMode ? "white" : "black",
          }}>Dark Mode</p>
          <div className="outerBox" style={{
            border:darkMode ? ".5vmin solid #FF9900" : ".5vmin solid black",

          }} onClick={()=>{
            valueFromContext.setDarkMode(!valueFromContext.dark_mode);
            localStorage.setItem("dark_mode",darkMode ? "false" : "true");
            setDarkMode(!darkMode);
            
          }}>
            <div className="filler" style={{
                width:darkMode ? "3.5vmin" : "0px"
            }}></div>
            <div className="switch" style={{
                transform:darkMode ? "translateX(2.55vmin)" : "translateX(0)",

            }}></div>
          </div>
        </div>
      </header>
    )
}