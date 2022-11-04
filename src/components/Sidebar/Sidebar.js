import React,{ useContext,useEffect,useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { MdOutlineMoving,MdOutlineMap } from "react-icons/md";
import "./Sidebar.css"
import { AppContext } from "../../context/AppContext";

export default function Sidebar(){
    const {setMode} = useContext(AppContext);
    const items = [{icon:<VscSearch/>,text:"Sorgu"},{icon:<MdOutlineMoving/>,text:"Analiz"},{icon:<MdOutlineMap/>,text:"Harita"}]
    const click = e => {
        let target = e.target.localName === 'span' || e.target.localName === 'svg' ? e.target.parentNode: e.target.localName === 'path' ? e.target.parentNode.parentNode : e.target;
        let active = document.querySelector('.cbs-siderbar-icon.active');
        if(active !== null && active !== target) active.classList.toggle('active');
        target.classList.toggle('active');
        
        let menuItem = document.querySelector('.cbs-menu');
        if(target.classList.contains('active'))
        {
            if(!menuItem.classList.contains('active')) document.querySelector('.cbs-menu').classList.toggle('active');
            setMode(target.children[1].textContent)
        }
        else
        {
            if(menuItem.classList.contains('active')) document.querySelector('.cbs-menu').classList.toggle('active');
            setMode('')
        }
        
    }
    
    return(
        
        <div className="cbs-sidebar">
            {items.map(e => {
                return (
                    <div className="cbs-siderbar-icon" onClick={e => click(e)}>
                        {e.icon}
                        <span>{e.text}</span>
                    </div>
                )
            })}
        </div>
    )
}
