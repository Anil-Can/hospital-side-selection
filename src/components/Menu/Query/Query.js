import React,{useContext, useEffect} from 'react';
import { AppContext } from "../../../context/AppContext";
import { VscSync } from "react-icons/vsc";
import { FiGitCommit } from "react-icons/fi";
import { VscLocation } from "react-icons/vsc";
import { FaDrawPolygon } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import "./Query.css";
import Select from '../../Select/Select';
import { removeSourceandLayers } from '../../../utils';
export default function Query(){
    const { t } = useTranslation();
    const {tables,setTables,map,Axiosinstance,setSelectedTables} = useContext(AppContext);
    useEffect(()=>{
        const fetchData = async () => {
            let tableNames = await Axiosinstance().get("/getSpatialTables");
            tableNames = tableNames.map(e => {
                let item = e.geom_type === 'Polygon' ? 
                <><FaDrawPolygon/><span>{ t(`${e.name}`)}</span></>:
                e.geom_type === 'Point' ?
                <><VscLocation/><span>{ t(`${e.name}`)}</span></>:
                <><FiGitCommit/><span>{ t(`${e.name}`)}</span></>
                return {
                    id: e.name,
                    geom:e.geom_type,
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
    
    const addSource = (source,type) => {
        map.addSource('cbs-query-source', {
            type: 'geojson',
            data:source,
            tolerance: 0,
            ...(type === 'Point' && {
                cluster: true,
                clusterMaxZoom: 22,
                clusterRadius: 50
            })
        });
    }
    const addLayers = (type,tableName) => {
        switch(type)
        {
            case 'Polygon':
                map.addLayer({
                    'id': `cbs-query-${tableName}`,
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
                break;
            case 'LineString':
                map.addLayer({
                    'id': `cbs-query-${tableName}`,
                    'source': 'cbs-query-source',
                    'type': 'line',
                    'paint': {
                        'line-color': 'blue',
                    },
                });
                break;
            case 'Point':
                map.addLayer({
                    'id': 'cbs-query-point-cluster',
                    'type': 'circle',
                    'source': 'cbs-query-source',
                    'filter': ['has', 'point_count'],
                    'paint': {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#2b83ba',
                            200,
                            '#abdda4',
                            400,
                            '#ffffbf',
                            600,
                            '#fdae61',
                            800,
                            '#d7191c'
                        ],
                        
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            15,
                            200,
                            20,
                            400,
                            25,
                            600,
                            30,
                            800,
                            35
                            ]
                    }
                });
                map.addLayer({
                    'id': 'cbs-query-point-cluster-count',
                    'type': 'symbol',
                    'source': 'cbs-query-source',
                    'filter': ['has', 'point_count'],
                    'layout': {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['Roboto Medium'],
                        'text-size': 12
                    }
                });
                map.addLayer({
                    'id': `cbs-query-${tableName}`,
                    'type': 'circle',
                    'source': 'cbs-query-source',
                    'filter': ['!',['has','point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 6,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });
        }
        
    }
    const selectedItem = async tableName => {
        let source = await Axiosinstance().get(`/getFeatures?tableName=${tableName}`);
        let index = tables.findIndex(e => e.id === tableName);
        removeSourceandLayers(map);
        setSelectedTables([tables[index].id]);
        addSource(source,tables[index].geom);
        addLayers(tables[index].geom,tableName);
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