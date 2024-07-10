import { useState, useContext, useEffect, useRef } from "react";
import data from  "./database.json";
import apiContext from "./Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/fontawesome-free-regular";
import Cursor from "./Cursor";



export default function Task(){
    const valueFromContext = useContext(apiContext);
    const [words, setWords] = useState([]);
    const [typedLetters, setTypedLetters] = useState("");
    const sentence = useRef("");
    const wordLimit = useRef(100);
    const displayTimeSlots = useRef(true);
    const [timer, setTimer] = useState(parseInt(localStorage.getItem("time")) || 60);
    const timeForTest = useRef(timer);
    const [countDown, setCountDown] = useState(parseInt(localStorage.getItem("time")) || 60);
    const [YPositionOfWord, setYPositionOfWord] = useState(0);
    const cursorRef = useRef(null);
    const initialPositionOfCursor = useRef(0);

    function newTest(){
        const totalWords = data.database.toLowerCase().split(" ");
        const wordsForThisTest = []
        for(let i = 0; i < wordLimit.current; i++){
            const idxOfWord = Math.floor(Math.random()*totalWords.length);
            wordsForThisTest.push(totalWords[idxOfWord])
        }
        valueFromContext.setWords([...wordsForThisTest]);
        setWords([...wordsForThisTest]);
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
        valueFromContext.setFinal({wpm:Math.floor((correctLetters.length * 60)/(timeForTest.current * 5))});
    }
    
    useEffect(()=>{
        let startTimer;
        let timeOverTimeInterval;
        function handleKeyPress(event){
            if(displayTimeSlots.current && isValidKey(event)){
                if(cursorRef.current){
                    initialPositionOfCursor.current = cursorRef.current.getBoundingClientRect().y;
                }
                displayTimeSlots.current = false;
                startTimer = setInterval(()=>{
                    setCountDown((prev)=>prev-1);
                },1000)
                timeOverTimeInterval = setTimeout(()=>{
                    clearInterval(startTimer);
                    wpm();
                    displayTimeSlots.current = true;
                    valueFromContext.setResult(true);
                },timeForTest.current*1000)
            }
            if(event.key === "Tab"){
                event.preventDefault();
                if(sentence.current === "" && displayTimeSlots.current){
                    newTest();
                }
                else{
                    clearInterval(startTimer);
                    clearInterval(timeOverTimeInterval);
                    displayTimeSlots.current = true;
                    sentence.current = "";
                    setTypedLetters("");
                    setCountDown(localStorage.getItem("time") || "60");
                    setYPositionOfWord(0);
                }
            }
            if(event.key === "Backspace"){
                setTypedLetters((prev)=>prev.slice(0,prev.length-1));
                sentence.current = sentence.current.slice(0,sentence.current.length-1);
            }
            if(isValidKey(event)){
                if((sentence.current.slice(-1) === " " || sentence.current.length === 0 )&& (event.key === " ") ){
                    setTypedLetters((prev)=>prev)
                }
                else if(sentence.current.split(" ").at(-1).length < 26 || 
                        (sentence.current.split(" ").at(-1).length === 26 && event.key === " ")){
                    setTypedLetters((prev)=>prev+event.key);
                    sentence.current += event.key;
                }
            }
        }

        if(displayTimeSlots.current){
            window.addEventListener("keydown",handleKeyPress);            
        }
        return(()=>{
            window.removeEventListener("keydown",handleKeyPress);
        })
    },[])

    useEffect(()=>{
        const crsr = window.document.querySelector(".cursor");
        if(crsr.getBoundingClientRect().y - initialPositionOfCursor.current > 100 && 
            initialPositionOfCursor.current !== 0 &&
            valueFromContext.nextLine){

            valueFromContext.nextLine = false;
            setTimeout(()=>{
                valueFromContext.nextLine = true;
            },200)
            setYPositionOfWord((prev)=>prev-55);
            const totalWords = data.database.split(" ");
            const newWords = [...words];
            for(let i = 0; i < 30; i++){
                const idxOfWord = Math.floor(Math.random()*totalWords.length);
                newWords.push(totalWords[idxOfWord]);
            }
            valueFromContext.setWords(newWords)
            setWords(newWords);
        }
        if(crsr.getBoundingClientRect().y - initialPositionOfCursor.current < 0){
            setYPositionOfWord((prev)=>prev+55)
        }
    },[typedLetters])
    
    function handleTimerOptions(time){
        timeForTest.current = time;
        setTimer(time);
        setCountDown(time);
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
    const typedWords = typedLetters.split(" ").filter((w)=>w!=="");
    function getCursouIdx(idx,l){
        if(idx === typedWords.length-1 && l === typedWords.at(-1).length-1 && sentence.current.slice(-1) !== " "){
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
                visibility:displayTimeSlots.current ? "visible" : "hidden",
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
            <div className="typingArea" onClick={()=>{
                if(window.innerWidth <= 500 || window.innerHeight <= 600){
                    window.document.querySelector(".inputField").focus();
                }
            }}>
                {typedWords.length === 0 && <div style={{
                    transform:"translate(5px,.4rem)",
                    animation:displayTimeSlots.current && "cursorBlink 1s infinite",
                    backgroundColor : valueFromContext.dark_mode ? "yellow" : "black"
                }} ref={cursorRef} className="cursor"></div>}
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
                                            sentence.current.slice(-1) === " " &&
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
                <input onChange={(e)=>{
                    if((e.target.value.at(-1 )=== " " && e.target.value.at(-2) === " ")||(e.target.value.split(" ").at(-1).length >= 20)){
                        e.target.value = e.target.value.slice(0,-1);
                    }
                    if(e.target.value.at(-2) === "."){
                        e.target.value = e.target.value.slice(0,-2) + " ";
                    }
                    setTypedLetters(e.target.value);
                    sentence.current = e.target.value;
                }} style={{
                    position:"absolute",
                    left:"0",
                    width:"1px",
                    display: window.innerHeight <= 500 || window.innerWidth <= 500 ? "block" : "none",
                    opacity:"0"
                }} className="inputField"/>
            </div>
            <h3 style={{
                display:displayTimeSlots.current ? "none" : "block",
                visibility:window.innerWidth < 600 ? "hidden" : "visible"
            }} className="restartIndicator">press Tab to restart</h3>
        </div>
    )
}
