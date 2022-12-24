import { default as lineIntersect }  from '@turf/line-intersect';
import { default as destination }  from '@turf/destination';
import React from 'react';
import { FiGitCommit } from "react-icons/fi";
import { FaDrawPolygon } from "react-icons/fa";
import { VscLocation } from "react-icons/vsc";

const toFeature = (coordinates,properties,type) => {
    return {
        "type": "Feature",
        "properties":properties,
        "geometry": {
            "type": type,
            "coordinates": coordinates
        }
    }
}
const pointOnTheFeature = (point,polygon,map) => {
    let turfPoint = toFeature(point,{},"Point")
    let inside = false;
    let controlPoint1 = destination(turfPoint, 35, map.getBearing()-90);
    let controlPoint2 = destination(turfPoint, 35, map.getBearing()+90);
    let line1 =  toFeature([point,controlPoint1.geometry.coordinates],{},"LineString");
    let line2 =  toFeature([point,controlPoint2.geometry.coordinates],{},"LineString");
    let intersection1 = lineIntersect(line1, polygon);
    let intersection2 = lineIntersect(line2, polygon);

    if( intersection1.features.length > 0 && intersection2.features.length > 0)
    {
        inside = true;
    }
    return inside;
}
const removeSourceandLayers = map => {
    
    if(map.getLayer('cbs-query-outline')) map.removeLayer('cbs-query-outline');
    map.getStyle().layers.filter((layer) => layer.id.startsWith('cbs-query')).forEach(layer =>{
        map.removeLayer(layer.id)
    });
    map.getStyle().layers.filter((layer) => layer.id.startsWith('cbs-analysis')).forEach(layer =>{
        map.removeLayer(layer.id)
    });
    if(map.getSource('cbs-query-source')) map.removeSource('cbs-query-source');
    if(map.getSource('cbs-query-outline')) map.removeSource('cbs-query-outline');
    if(map.getSource('cbs-analysis-source')) map.removeSource('cbs-analysis-source');
}
const addOutlineLayer = (map,source) => {
    if(map.getLayer('cbs-query-outline')) map.removeLayer('cbs-query-outline');
    if(map.getSource('cbs-query-outline')) map.removeSource('cbs-query-outline');
    map.addSource('cbs-query-outline', {
        type: 'geojson',
        data:source,
        tolerance: 0
    });
    map.addLayer({
        'id': `cbs-query-outline`,
        'source': 'cbs-query-outline',
        'type': 'line',
        'paint': {
            'line-color': 'green',
            'line-width': 4
        },
    });
}
const whereSQL = (old,attribute,value) =>  {
    let newState = "";
    if(old)
    {
        let states = old.split("|").slice(0, -1);
        let index = states.findIndex(e => e.includes(attribute));
        states.forEach((e,i)=>{
            if(isNaN(value)) newState += i === index ? `${attribute} = '${value}'|`:`${e}|`;
            else  newState += i === index ? `${attribute} = ${value}|`:`${e}|`;
            

        })
        if(index === -1) newState += isNaN(value) ?`${attribute} = '${value}'|`:`${attribute} = ${value}|`;
    }
    else
    {
        newState += isNaN(value) ?`${attribute} = '${value}'|`:`${attribute} = ${value}|`;
    }
    return newState;
}
const fetchData = async (type,Axiosinstance,t) => {
    let tableNames = await Axiosinstance().get(`/getSpatialTables?type=${type}`);
    tableNames = tableNames.map(e => {
        let relation = {}
        if(e.related){
            let list = e.related.split("|");
            relation.table = list[0];
            if( e.geom_type !== 'Point') relation.field = list[1];
        }
        let item = e.geom_type === 'Polygon' ? 
        <><FaDrawPolygon/><span>{ t(`${e.name}`)}</span></>:
        e.geom_type === 'Point' ?
        <><VscLocation/><span>{ t(`${e.name}`)}</span></>:
        <><FiGitCommit/><span>{ t(`${e.name}`)}</span></>
        return {
            id: e.name,
            geom:e.geom_type,
            item: item,
            relation:relation
        }
    });
    return tableNames;
    
}
export {toFeature,pointOnTheFeature,removeSourceandLayers,whereSQL,fetchData,addOutlineLayer}