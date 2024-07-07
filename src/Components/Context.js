import { createContext, useRef, useState } from "react";
const apiContext = createContext();
function ApiContextProvider({children}){
    const [final,setFinal] = useState({wpm:0});
    const [dark_mode,setDarkMode] = useState(localStorage.getItem("dark_mode")==="true" ? true : false);
    const [test,setTest] = useState("new test");
    const [result,setResult] = useState(false);
    const [words,setWords] = useState([]);
    const nextLine = useRef(true);
    return (
        <apiContext.Provider value={{
            final,setFinal,
            dark_mode,setDarkMode,
            test,setTest,
            result,setResult,
            words,setWords,
            nextLine
        }}>
            {children}
        </apiContext.Provider>
    )
}
export default apiContext;
export { ApiContextProvider };