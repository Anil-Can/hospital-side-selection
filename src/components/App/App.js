import React, { useRef, useState} from "react";
import Map from "../Map/Map";
import { AppContext } from "../../context/AppContext";
import "./App.css";
import Hamburger from "../Hamburger/Hamburger";
import Sidebar from "../Sidebar/Sidebar";

export default function App() {
    return(
        <React.StrictMode>
            <AppContext.Provider value={{deneme:"test"}}>
                <Hamburger/>
                <Sidebar/>
                <Map/>
            </AppContext.Provider>
        </React.StrictMode>
    )
}
