import React,{useContext, useEffect} from 'react';
import { AppContext } from "../../../context/AppContext";
import { VscSync } from "react-icons/vsc";
import { FaDrawPolygon } from "react-icons/fa";
import "./Query.css";

export default function Query(){
    useEffect(()=>{
        const fetchData = async () => {
            let tableNames = await Axiosinstance().get("/getSpatialTables");
            console.log(tableNames)
            setTables(tableNames)
        }
        if(tables === null )fetchData();
    },[])
    const {tables,setTables,Axiosinstance} = useContext(AppContext);
    const click = e => {
        let target = e.target.localName === 'span' || e.target.localName === 'svg' ? e.target.parentNode: e.target.localName === 'path' ? e.target.parentNode.parentNode : e.target;
        let active = document.querySelector('.cbs-menu-query-tab div.active');
        if(active !== null && active !== target) active.classList.toggle('active');
        if(!target.classList.contains('active')) {
            target.classList.toggle('active');
        }
    }
    return (
        <div className='cbs-menu-query'>
            <div className='cbs-menu-query-tab'>
                <div className='active' id="query-normal" onClick={e => click(e)}>
                    <VscSync/>
                    <span>Normal</span>
                </div>
                <div id="query-spatial" onClick={e => click(e)}>
                    <FaDrawPolygon/>
                    <span>Mekansal</span>
                </div>
            </div>
            <hr/>
        </div>
    )
}