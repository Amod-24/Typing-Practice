import "./App.css";
import { useContext, useState } from "react";
import Header from "./Components/Header";
import Task from "./Components/Task";
import apiContext from "./Components/Context";
import Result from "./Components/result";
function App() {
  const valueFromContext = useContext(apiContext);
  if(!localStorage.getItem("dark_mode")){
    localStorage.setItem("dark_mode","true");
  }
  return (
    <div>
      <div style={{
        height:"100vh",
        width:"100vw",
        backgroundColor: valueFromContext.dark_mode ? "rgb(4,4,4)" : "rgb(255,255,255)",
      }}>
        <Header/>
        {!valueFromContext.result && <Task/>}
        {valueFromContext.result && <Result/>}
      </div>
    </div>

  );
}

export default App;
