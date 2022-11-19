import React,{useContext} from "react";
import { VscChromeClose } from "react-icons/vsc";
import { AppContext } from "../../context/AppContext";
import "./Header.css";
// import { pointOnTheFeature,toFeature } from "../../utils";
// import { default as intersect }  from '@turf/intersect';
// import { default as lineIntersect }  from '@turf/line-intersect';
// import waters from "data/water_bodies.json";

export default function Header({text}){
    const {setMode,/*map,Axiosinstance*/} = useContext(AppContext);
    
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