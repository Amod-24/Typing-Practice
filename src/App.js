import "./App.css";
import { useContext, useState } from "react";
import Header from "./Components/Header";
import Task from "./Components/Task";
import {ApiContextProvider} from "./Components/Context";
import apiContext from "./Components/Context";
import Result from "./Components/result";
function App() {
  const valueFromContext = useContext(apiContext);
  const [result, setResult] = useState(valueFromContext.result);
  const [darkMode, setDarkMode] = useState(true);
  if(!localStorage.getItem("dark_mode")){
    localStorage.setItem("dark_mode","true");
  }
  return (
    <ApiContextProvider>
      <div style={{
        height:"100vh",
        width:"100vw",
        backgroundColor: localStorage.getItem("dark_mode") === "true" ? "rgb(4,4,4)" : "rgb(255,255,255)",
      }}>
        <Header changeMode={setDarkMode}/>
        {!result && <Task setResult={setResult}/>}
        {result && <Result setResult={setResult}/>}
      </div>
    </ApiContextProvider>

  );
}

export default App;
