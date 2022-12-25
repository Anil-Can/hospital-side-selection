import "./Sidebar.css"
import { removeSourceandLayers } from "../../utils";
import React,{ useContext } from "react";
import { VscSearch } from "react-icons/vsc";
import { useTranslation } from 'react-i18next';
import { AppContext } from "../../context/AppContext";
import { MdOutlineMoving,MdOutlineMap } from "react-icons/md";


export default function Sidebar(){
    const {setMode,setLegend,map} = useContext(AppContext);
    const { t } = useTranslation();
    const items = [{icon:<VscSearch/>,text:t('query')},{icon:<MdOutlineMoving/>,text:t('analysis')},{icon:<MdOutlineMap/>,text:t('map')}]
    const click = e => {
        let target = e.target.localName === 'span' || e.target.localName === 'svg' ? e.target.parentNode: e.target.localName === 'path' ? e.target.parentNode.parentNode : e.target;
        let active = document.querySelector('.cbs-siderbar-icon.active');
        if(active !== null && active !== target) active.classList.toggle('active');
        target.classList.toggle('active');
        setLegend(null);
        removeSourceandLayers(map);
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
                    <div key={e.text} className="cbs-siderbar-icon" onClick={e => click(e)}>
                        {e.icon}
                        <span>{e.text}</span>
                    </div>
                )
            })}
        </div>
    )
}
