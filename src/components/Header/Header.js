import React from "react";
import { VscChromeClose } from "react-icons/vsc";
import "./Header.css"

export default function Header({text}){
    const close = () => {
    }
    return (
        <div className="cbs-menu-header" >
            <span>{text}</span>
            <VscChromeClose/>
        </div>
    )
}