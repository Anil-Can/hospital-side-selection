import React,{ useContext } from "react";
import { VscMenu } from "react-icons/vsc";
import "./Hamburger.css"
import { AppContext } from "../../context/AppContext";

export default function Hamburger(){
    const toggle = () => {
        document.querySelector('.cbs-sidebar').classList.toggle('active');
    }
    return (
        <div className="cbs-hamburger" onClick={toggle}>
            <VscMenu/>
        </div>
    )
}