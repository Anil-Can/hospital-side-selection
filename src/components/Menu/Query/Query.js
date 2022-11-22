import React,{useContext, useEffect} from 'react';
import { AppContext } from "../../../context/AppContext";
import { VscSync } from "react-icons/vsc";
import { FiGitCommit } from "react-icons/fi";
import { VscLocation } from "react-icons/vsc";
import { FaDrawPolygon } from "react-icons/fa";
import "./Query.css";
import Select from '../../Select/Select';

export default function Query(){
    
    const {tables,setTables,map,Axiosinstance} = useContext(AppContext);
    useEffect(()=>{
        const fetchData = async () => {
            let tableNames = await Axiosinstance().get("/getSpatialTables");
            tableNames = tableNames.map(e => {
                let item = e.geom_type === 'Polygon' ? 
                <><FaDrawPolygon/><span>{e.display_name}</span></>:
                e.geom_type === 'Point' ?
                <><VscLocation/><span>{e.display_name}</span></>:
                <><FiGitCommit/><span>{e.display_name}</span></>
                return {
                    id: e.name,
                    item: item
                }
            });
            setTables(tableNames)
        }
        if(tables === null )fetchData();
    },[])
    const click = e => {
        let target = e.target.localName === 'span' || e.target.localName === 'svg' ? e.target.parentNode: e.target.localName === 'path' ? e.target.parentNode.parentNode : e.target;
        let active = document.querySelector('.cbs-menu-query-tab div.active');
        if(active !== null && active !== target) active.classList.toggle('active');
        if(!target.classList.contains('active')) {
            target.classList.toggle('active');
        }
    }
    const addSource = source => {
        map.addSource('cbs-query-source', {
            type: 'geojson',
            data:source,
            tolerance: 0
        });
    }
    const addLayers = () => {
        map.addLayer({
            'id': 'cbs-query-polygon',
            'source': 'cbs-query-source',
            'type': 'fill',
            'paint': {
                'fill-color': 'red',
                
            },
        });
        map.addLayer({
            'id': 'cbs-query-polygon-outline',
            'source': 'cbs-query-source',
            'type': 'line',
            'paint': {
                'line-color': 'black',
                
            },
        });
    }
    const selectedItem = async tableName => {
        let source = await Axiosinstance().get("/getDistricts");
        addSource(source);
        addLayers();
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
            {tables !== null && 
                <Select options={tables} selectedItem={selectedItem}/>
            }
        </div>
    )
}