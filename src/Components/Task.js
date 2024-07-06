import { useState, useContext, useEffect, useRef } from "react";
import data from  "./database.json";
import apiContextProvider from "./Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/fontawesome-free-regular";
import Cursor from "./Cursor";



export default function Task({setResult}){
    const valueFromContext = useContext(apiContextProvider);
    const [words, setWords] = useState([]);
    const [typedLetters, setTypedLetters] = useState("");
    const [wordLimit, setWordLimit] = useState(100);
    const [timer, setTimer] = useState(localStorage.getItem("time") || "60");
    const [displayTimeSlots, setDisplayTimeSlots] = useState(true);
    const [countDown, setCountDown] = useState(localStorage.getItem("time") || "60");
    const [YPositionOfWord, setYPositionOfWord] = useState(0);
    const divRef = useRef(null);

    function newTest(){
        const totalWords = data.database.toLowerCase().split(" ");
        const wordsForThisTest = []
        for(let i = 0; i < wordLimit; i++){
            const idxOfWord = Math.floor(Math.random()*totalWords.length);
            wordsForThisTest.push(totalWords[idxOfWord])
        }
        valueFromContext.words = [...wordsForThisTest];
        setWords(valueFromContext.words);
    }
    useEffect(()=>{
        if(valueFromContext.test === "new test"){
            newTest();
        }
        if(valueFromContext.test === "retry"){
            setWords(valueFromContext.words);
        }
    },[])
    

    const isValidKey = (event) => {
        const alphanumericAndSymbolsRegex = /^[a-zA-Z0-9!"#$%&'()*+,-. /:;<=>?@[\\\]^_`{|}~]$/;
        return alphanumericAndSymbolsRegex.test(event.key);
    };

    function wpm(){
        const correctLetters = [...window.document.querySelectorAll(".correct")];
        valueFromContext.final.wpm = Math.floor((correctLetters.length * 60)/(timer * 5));
    }

    useEffect(()=>{
        let startTimer;
        let timeOverTimeInterval;
        function handleKeyPress(event){
            if(valueFromContext.displayTimeSlots && isValidKey(event)){
                if(divRef.current){
                    valueFromContext.initialPositionOfCursor = divRef.current.getBoundingClientRect().y;
                }
                valueFromContext.displayTimeSlots = false;
                setDisplayTimeSlots(false);
                startTimer = setInterval(()=>{
                    setCountDown((prev)=>prev-1);
                },1000)
                timeOverTimeInterval = setTimeout(()=>{
                    clearInterval(startTimer);
                    wpm();
                    valueFromContext.displayTimeSlots = true;
                    setDisplayTimeSlots(true);
                    setResult(true);
                    valueFromContext.result = true;
                },valueFromContext.timer*1000)
            }
            if(event.key === "Tab"){
                event.preventDefault();
                if(valueFromContext.typedLetters === ""){
                    newTest();
                }
                else{
                    clearInterval(startTimer);
                    clearInterval(timeOverTimeInterval);
                    valueFromContext.displayTimeSlots = true;
                    valueFromContext.typedLetters = "";
                    setDisplayTimeSlots(true);
                    setTypedLetters("");
                    setCountDown(localStorage.getItem("time") || "60");
                    setYPositionOfWord(0);
                }
            }
            if(event.key === "Backspace"){
                setTypedLetters((prev)=>prev.slice(0,prev.length-1));
                valueFromContext.typedLetters = valueFromContext.typedLetters.slice(0,valueFromContext.typedLetters.length-1);
            }
            if(isValidKey(event)){
                if((valueFromContext.typedLetters.slice(-1) === " " || valueFromContext.typedLetters.length === 0 )&& event.key === " " ){
                    setTypedLetters((prev)=>prev)
                }
                else if(valueFromContext.typedLetters.split(" ").at(-1).length < 26 || 
                        valueFromContext.typedLetters.split(" ").at(-1).length === 26 && event.key === " "){
                    setTypedLetters((prev)=>prev+event.key);
                    valueFromContext.typedLetters += event.key;
                }
            }
        }

        if(valueFromContext.displayTimeSlots){
            window.addEventListener("keydown",handleKeyPress);            
        }
        return(()=>{
            window.removeEventListener("keydown",handleKeyPress);
        })
    },[])

    useEffect(()=>{
        const crsr = window.document.querySelector(".cursor");
        if(crsr.getBoundingClientRect().y - valueFromContext.initialPositionOfCursor > 100 && 
            valueFromContext.initialPositionOfCursor != 0 &&
            valueFromContext.nextLine){

            valueFromContext.nextLine = false;
            setTimeout(()=>{
                valueFromContext.nextLine = true;
            },200)
            setYPositionOfWord((prev)=>prev-55);
            const totalWords = data.database.split(" ");
            for(let i = 0; i < 30; i++){
                const idxOfWord = Math.floor(Math.random()*totalWords.length);
                valueFromContext.words.push(totalWords[idxOfWord]);
            }
            setWords(valueFromContext.words);
        }
        if(crsr.getBoundingClientRect().y - valueFromContext.initialPositionOfCursor < 0){
            setYPositionOfWord((prev)=>prev+55)
        }
    },[typedLetters])
    
    function handleTimerOptions(time){
        setTimer(time);
        setCountDown(time);
        valueFromContext.timer = time;
        localStorage.setItem("time",`${time}`);
    }
    function timerStyles(time){
        return(
            {
                color:timer===time ? "#FF9900" : "#C6C6C6",
                fontWeight:timer === time ? "800" : "400",
            }
        )
    }
    function getClassName(a,b){
        if(a===b){
            return "letter correct"
        }
        else{
            return "letter incorrect"
        }
    }
    const typedWords = typedLetters.split(" ").filter((w)=>w!="");
    function getCursouIdx(idx,l){
        if(idx === typedWords.length-1 && l === typedWords.at(-1).length-1 && valueFromContext.typedLetters.slice(-1) != " "){
            return true;
        }
        else{
            return false;
        }
    }
    
    function stylesOfWord(){
        return {
            transform:`translateY(${YPositionOfWord}px)`
        }
    }
    return(
        <div className="task">
            <div style={{
                visibility:displayTimeSlots ? "visible" : "hidden",
            }} className="adjustment">
                <div className="timeAndClock">
                    <FontAwesomeIcon className="clock" icon={faClock}/>
                    <h3 className="time">Time</h3>
                </div>
                <hr style={{
                    border:".3vmin solid black",
                    height:"80%",
                    borderRadius:"3vmin",
                    backgroundColor:"black"
                }}/>
                <div className="seconds">
                    <h3 style={timerStyles(15)} onClick={()=>handleTimerOptions(15)}>15</h3>
                    <h3 style={timerStyles(30)} onClick={()=>handleTimerOptions(30)}>30</h3>
                    <h3 style={timerStyles(60)} onClick={()=>handleTimerOptions(60)}>60</h3>
                </div>
            </div>
            <h1 style={{
                color:"#FF9900",
                fontSize:"2vmax",
                marginTop:"4vmin"
            }} className="timer">{countDown}</h1>
            <div style={{
                border:"1px solid #8f8f8f",
                borderRadius:"3vmin",
                padding:"1vmin",
                height:"165px"
            }}>
            <div className="typingArea">
                {typedWords.length === 0 && <div style={{
                    transform:"translate(5px,.4rem)",
                    animation:displayTimeSlots && "cursorBlink 1s infinite",
                    backgroundColor : valueFromContext.dark_mode ? "yellow" : "black"
                }} ref={divRef} className="cursor"></div>}
                {words.map((word,idx)=>{
                    if(idx < typedWords.length){
                        if(word.length === typedWords[idx].length){
                            return(
                                <div style={stylesOfWord()} className="word">
                                    {word.split("").map((letter,l)=>{
                                        return(
                                            <span className={getClassName(letter, typedWords[idx][l])}>{letter}{getCursouIdx(idx,l) && <Cursor/>}</span>
                                        )
                                    })}
                                </div>
                            )
                        }
                        if(word.length > typedWords[idx].length){
                            return(
                                <div style={stylesOfWord()} className="word">
                                    {word.split("").map((letter,l)=>{
                                        if(l < typedWords[idx].length){
                                            return(
                                                <span className={getClassName(letter,typedWords[idx][l])}>{letter}{getCursouIdx(idx,l) && <Cursor/>}</span>
                                            )
                                        }
                                        else{
                                            return(
                                                <span className="letter">{letter}</span>
                                            )
                                        }
                                    })}
                                </div>
                            )
                        }
                        if(word.length < typedWords[idx].length){
                            return(
                                <div style={stylesOfWord()} className="word">
                                    {typedWords[idx].split("").map((letter,l)=>{
                                        if(l < word.length){
                                            return(
                                                <span className={getClassName(letter, word[l])}>{word[l]}{getCursouIdx(idx,l) && <Cursor/>}</span>
                                            )
                                        }
                                        else{
                                            return(
                                                <span className="letter incorrect">{letter}{getCursouIdx(idx,l) && <Cursor/>}</span>
                                            )
                                        }
                                        
                                    })}
                                </div>
                            )
                        }
                    }
                    else{
                        return(
                            <div style={stylesOfWord()} className="word">
                                {word.split("").map((letter,l)=>{
                                    return(
                                        <span className="letter">{
                                            valueFromContext.typedLetters.slice(-1) === " " &&
                                            idx === typedWords.length &&
                                            l === 0 &&
                                            <Cursor/>}{letter}</span>
                                    )
                                })}
                            </div>
                        )
                    }
                })}
            </div>
            </div>
            <h3 style={{
                display:displayTimeSlots ? "none" : "block",
                visibility:window.innerWidth < 600 ? "hidden" : "visible"
            }} className="restartIndicator">press Tab to restart</h3>
        </div>
    )
}