import { memo } from "react";
import { useContext } from "react";
import apiContext from "./Context";
const Cursor = memo(()=>{
    const valueFromContext = useContext(apiContext);

    return <div style={{
        backgroundColor: valueFromContext.dark_mode ? "yellow" : "black"
    }} className="cursor"></div>
})

export default Cursor;