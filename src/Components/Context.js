import { createContext, useState } from "react";
const apiContext = createContext({
    dark_mode:localStorage.getItem("dark_mode")=="true" ? true : false,
    test:"new test",
    result:false,
    final:{wpm:0},
    timer:localStorage.getItem("time") || "60",
    displayTimeSlots:true,
    words:[],
    typedLetters:"",
    initialPositionOfCursor:0,
    nextLine:true,
});
function apiContextProvider({children}){
    return (
        <apiContext.Provider value={{
            dark_mode:localStorage.getItem("dark_mode")=="true" ? true : false,
            test:"new test",
            result:false,
            final:{wpm:0},
            timer:localStorage.getItem("time") || "60",
            displayTimeSlots:true,
            words:[],
            typedLetters:"",
            initialPositionOfCursor:0,
            nextLine:true,
        }}>
            {children}
        </apiContext.Provider>
    )
}
export default apiContext;
export { apiContextProvider };