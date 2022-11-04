import React, { useRef, useState} from "react";
import Map from "../Map/Map";
import { AppContext } from "../../context/AppContext";
import "./App.css";
import Hamburger from "../Hamburger/Hamburger";
import Sidebar from "../Sidebar/Sidebar";
import Menu from "../Menu/Menu";

export default function App() {
    const[mode,setMode] = useState("")
    return(
        <React.StrictMode>
            <AppContext.Provider value={{mode,setMode}}>
                <Hamburger/>
                <Sidebar/>
                <Map/>
                <Menu/>
            </AppContext.Provider>
        </React.StrictMode>
    )
}
