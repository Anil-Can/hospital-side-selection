import React,{useContext} from "react";
import { VscChromeClose } from "react-icons/vsc";
import { AppContext } from "../../context/AppContext";
import "./Header.css";

export default function Header({text}){
    const {setMode} = useContext(AppContext);
    
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