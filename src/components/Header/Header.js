import React,{useContext} from "react";
import { VscChromeClose } from "react-icons/vsc";
import { AppContext } from "../../context/AppContext";
import "./Header.css";
import { default as intersect } from "@turf/intersect"
// import short from "../../../data/short.json";
import { pointOnTheFeature } from "../../utils";
export default function Header({text}){
    const {setMode,map,Axiosinstance} = useContext(AppContext);
    
    const close = async () => {
        document.querySelector('.cbs-menu').classList.toggle('active');
        setMode('');
        
    }
    return (
        <div className="cbs-menu-header" >
            <span>{text}</span>
            <VscChromeClose onClick={close}/>
        </div>
    )
}