import React,{useContext} from "react";
import { VscChromeClose } from "react-icons/vsc";
import { AppContext } from "../../context/AppContext";
import { pointOnTheFeature,toFeature } from "../../utils";
import "./Header.css";
// import stops from "data/stops.json";

export default function Header({text}){
    const {mode,Axiosinstance,map} = useContext(AppContext);
    
    const close = async () => {
        
    }
    return (
        <div className="cbs-menu-header" >
            <span>{text}</span>
            <VscChromeClose onClick={close}/>
        </div>
    )
}