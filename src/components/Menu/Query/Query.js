import React,{useContext, useEffect,useState} from 'react';
import { AppContext } from "../../../context/AppContext";
import { VscFilter,VscChecklist } from "react-icons/vsc";
import { useTranslation } from 'react-i18next';
import "./Query.css";
import Select from '../../Select/Select';
import { removeSourceandLayers,whereSQL,fetchData } from '../../../utils';
export default function Query(){
    const { t } = useTranslation();
    const {tables,setTables,map,Axiosinstance,setSelectedTables,queryDynamicTable,setQueryDynamicTable} = useContext(AppContext);
    const [queryMode,setQuerymode] = useState("query-dynamic");
    const [districts,setDistricts] = useState([])
    const [classes,setClasses] = useState([]);
    
    useEffect(()=>{
        if(tables === null )
        {
            fetchData("query",Axiosinstance,t).then(e =>{
                setTables(e);
            })
        }
    },[])
    const click = e => {
        let target = e.target.localName === 'span' || e.target.localName === 'svg' ? e.target.parentNode: e.target.localName === 'path' ? e.target.parentNode.parentNode : e.target;
        let active = document.querySelector('.cbs-menu-query-tab div.active');
        if(active !== null && active !== target) active.classList.toggle('active');
        if(!target.classList.contains('active')) {
            setQuerymode(target.id)
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
    
    const selectedItem = async (id,name) => {
        if(queryDynamicTable === null || (queryDynamicTable.name !== name && isNaN(name) && !id.includes('class')) )
        {
            setQueryDynamicTable(null)
            const {source,attributes} = await Axiosinstance().get(`/getFeatures?tableName=${name}`);
            let index = tables.findIndex(e => e.id === name);
            
            setQueryDynamicTable({
                name:name,
                count:source.features.length,
                source:{...source},
                attributes:attributes,
                type:tables[index].geom,
                ...(tables[index].geom !== 'Point',{joinAtt:tables[index].relation.field})
            });
            if(name !== 'districts')
            {
                let result = await Axiosinstance().get("/getDistricts");
                let classes = await Axiosinstance().get(`/getCategories?name=class&tableName=${name}`);
                setClasses(()=>{
                    return classes.map(e => {
                        return{
                            id:e.class,
                            item:<span>{e.class}</span>
                        }
                    })
                })
                setDistricts(()=>{
                    return result.map(e => {
                        return{
                            id:e.id,
                            item:<span>{e.name}</span>
                        }
                    })
                });
            }
        }
        else if(queryDynamicTable !== null && queryDynamicTable.name !== 'districts')
        {
            let attribute = id.split('-')[1];
            let newwhere = attribute === 'districts' ? whereSQL(queryDynamicTable.where,"district_id",name):
            whereSQL(queryDynamicTable.where,"class",name);
            let sqlWhere = "";
            let wherelist = [...newwhere.split("|")].slice(0, -1);
            let lastIndex = wherelist.length -1;
            wherelist.forEach((e,i)=>{
                sqlWhere += i === lastIndex ? `${e}`:`${e} AND `;
            })
            const {source} = await Axiosinstance().get(`/getFeatures?tableName=${queryDynamicTable.name}&where=${sqlWhere}&joinAtt=${queryDynamicTable.joinAtt}`);
            setQueryDynamicTable({...queryDynamicTable,  
                count:source.features === null ? 0:source.features.length,source:{...source},where:newwhere})
        }
    }
    const renderLayer = () => {
        removeSourceandLayers(map);
        setSelectedTables([queryDynamicTable.name]);
        addSource(queryDynamicTable.source,queryDynamicTable.type);
        addLayers(queryDynamicTable.type,queryDynamicTable.name);
    }
    return (
        <div className='cbs-menu-query'>
            <div className='cbs-menu-query-tab'>
                {/* <div id="query-ready" onClick={e => click(e)}>
                    <VscCheck/>
                    <span>Hazır</span>
                </div> */}
                <div className='active' id="query-dynamic" onClick={e => click(e)}>
                    <VscChecklist/>
                    <span>Dinamik</span>
                </div>
            </div>
            <hr/>
            {tables !== null && 
                <>
                {queryMode === 'query-ready' ?
                    <Select id={"test"} options={tables} selectedItem={selectedItem}/>:
                    <>
                        <Select id={"test2"} options={tables} selectedItem={selectedItem}/>
                        {queryDynamicTable !== null &&
                            <>
                            {queryDynamicTable.name !== 'districts' && 
                            <>
                            <Select id={`filter-districts`} options={districts} selectedItem={selectedItem}/>
                            <Select id={`filter-class`} options={classes} selectedItem={selectedItem}/>
                            </>
                            }
                            <div className='query-count'>
                                {queryDynamicTable.count > 0 &&
                                <button onClick={renderLayer}>Haritaya Ekle</button>
                                }
                                <VscFilter/>
                                <span>{queryDynamicTable.count}</span>
                            </div>
                            </>
                        }
                    </>
                }
                </>
            }
        </div>
    )
}