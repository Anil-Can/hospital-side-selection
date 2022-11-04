import React,{ useContext,useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { MdOutlineMoving,MdOutlineMap } from "react-icons/md";
import "./Sidebar.css"
import { AppContext } from "../../context/AppContext";

export default function Sidebar(){
    const[mode,setMode] = useState("")
    return(
        <div className="cbs-sidebar">
            <div className="cbs-siderbar-icon">
                <VscSearch/>
                <span>Sorgu</span>
            </div>
            <div className="cbs-siderbar-icon">
                <MdOutlineMoving/>
                <span>Analiz</span>
            </div>
            <div className="cbs-siderbar-icon">
                <MdOutlineMap/>
                <span>Harita</span>
            </div>
        </div>
    )
}
