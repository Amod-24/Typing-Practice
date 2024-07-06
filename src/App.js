import "./App.css";
import { useContext, useState } from "react";
import Header from "./Components/Header";
import Task from "./Components/Task";
import apiContextProvider from "./Components/Context";
import Result from "./Components/result";
function App() {
  const valueFromContext = useContext(apiContextProvider);
  const [result, setResult] = useState(valueFromContext.result);
  const [darkMode, setDarkMode] = useState(true);
  if(!localStorage.getItem("dark_mode")){
    localStorage.setItem("dark_mode","true");
  }
  console.log("di")
  return (
    <apiContextProvider>
      <body style={{
        backgroundColor: localStorage.getItem("dark_mode") === "true" ? "rgb(4,4,4)" : "rgb(255,255,255)",
      }}>
        <Header changeMode={setDarkMode}/>
        {!result && <Task setResult={setResult}/>}
        {result && <Result setResult={setResult}/>}
      </body>
    </apiContextProvider>

  );
}

export default App;
