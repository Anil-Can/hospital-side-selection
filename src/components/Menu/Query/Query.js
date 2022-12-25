import "./Query.css";
import Select from '../../Select/Select';
import { FaDrawPolygon } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { pointOnTheFeature } from "../../../utils";
import { default as intersect } from "@turf/intersect"
import { AppContext } from "../../../context/AppContext";
import { VscFilter,VscChecklist } from "react-icons/vsc";
import { BiShapePolygon,BiUpload } from "react-icons/bi";
import React,{useContext, useEffect,useState,useRef} from 'react';
import { removeSourceandLayers,whereSQL,fetchData,addOutlineLayer,addDrawLayer } from '../../../utils';

export default function Query(){
    const { t } = useTranslation();
    const {tables,setTables,map,Axiosinstance,setSelectedTables,queryDynamicTable,setQueryDynamicTable} = useContext(AppContext);
    const [queryMode,setQuerymode] = useState("query-dynamic");
    const [districts,setDistricts] = useState([])
    const [classes,setClasses] = useState([]);
    const [reset,setReset] = useState(false);
    const [outline,setOutline] = useState(null);
    const draw = useRef({
        click:0,
        point_number: 0,
        moveUpdate: false,
        addpoint: false,
        source: {
            "type": "FeatureCollection", 
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": []
                    }
                }
            ]
        }
    }) 
    useEffect(()=>{
        setQueryDynamicTable(null);
        if(tables === null )
        {
            fetchData("query",Axiosinstance,t).then(e =>{
                setTables(e);
            })
        }
    },[])
    useEffect(()=>{
        setReset(false);
    },[queryMode])
    const click = e => {
        let target = e.target.localName === 'span' || e.target.localName === 'svg' ? e.target.parentNode: e.target.localName === 'path' ? e.target.parentNode.parentNode : e.target;
        let active = document.querySelector('.cbs-menu-query-tab div.active');
        if(active !== null && active !== target) active.classList.toggle('active');
        if(!target.classList.contains('active')) {
            setQuerymode(target.id)
            document.querySelector(".cbs-tab-indicator").dataset.value = target.id
            target.classList.toggle('active');
            setSelectedTables([]);
            setQueryDynamicTable(null);
            setReset(true);
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
        removeSourceandLayers(map);
        if(queryDynamicTable === null || (queryDynamicTable.name !== name && isNaN(name) && !id.includes('class')) )
        {
            setQueryDynamicTable(null)
            const {source,attributes} = await Axiosinstance().get(`/getFeatures?tableName=${name}`);
            let index = tables.findIndex(e => e.id === name);
            
            setQueryDynamicTable({
                name:name,
                count:source.features.length,
                source:{...source},
                allSource:{...source},
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
        if(outline) addOutlineLayer(map,outline)
    }
    const drawMove = e => {
        if(draw.current.moveUpdate)
        {
            if(draw.current.addpoint)
            {
                draw.current.source.features[0].geometry.coordinates[0][draw.current.point_number] = [e.lngLat.lng, e.lngLat.lat];
            }
            else
            {
                draw.current.source.features[0].geometry.coordinates[0].splice(draw.current.point_number,'0',[e.lngLat.lng, e.lngLat.lat]);
                draw.current.addpoint = true;
            }
            map.getSource('cbs-draw').setData(draw.current.source);
        }
    }
    const drawClicked = e => {
        draw.current.click++;
        draw.current.moveUpdate = false;
        setTimeout(() => {
            draw.current.click = 0;
            draw.current.moveUpdate = true;
        },350);
        if(draw.current.click <= 1)
        {
            if(draw.current.source.features[0].geometry.coordinates.length === 0)
            {
                draw.current.source.features[0].geometry.coordinates[0] = [
                    [e.lngLat.lng,e.lngLat.lat],
                    [e.lngLat.lng,e.lngLat.lat]
                ]
                draw.current.point_number = 1;
                map.on('mousemove',drawMove);
            }
            else
            {
                draw.current.source.features[0].geometry.coordinates[0][draw.current.point_number] = [e.lngLat.lng,e.lngLat.lat];
                draw.current.addpoint = false;
                draw.current.point_number++; 
            }
            map.getSource('cbs-draw').setData(draw.current.source);
        }
        else
        {
            resultSource(draw.current.source);
            draw.current = {
                click:0,
                point_number: 0,
                moveUpdate: false,
                addpoint: false,
                source: {
                    "type": "FeatureCollection", 
                    "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": []
                            }
                        }
                    ]
                }
            }
            map.off('click',drawClicked);
            map.off('mousemove',drawMove);
            map.getCanvas().style.cursor = "default";
            map.getSource('cbs-draw').setData(draw.current.source);
        }
    }
    const polygonDraw = () => {
        addDrawLayer(map);
        map.getCanvas().style.cursor = "crosshair";
        map.on('click',drawClicked);
    }
    const resultSource = source => {
        let filterSource = {
            "type": "FeatureCollection", 
            "features": queryDynamicTable.type === 'Point' ? queryDynamicTable.allSource.features.filter(j => pointOnTheFeature(j.geometry.coordinates,source.features[0],map)):
            queryDynamicTable.type === 'Polygon' ? queryDynamicTable.allSource.features.filter(j => intersect(j,source.features[0])):
            queryDynamicTable.allSource.features.filter( j => {
                let inside = false;
                j.geometry.coordinates.forEach(k =>{
                    k.forEach(z => {
                        if(pointOnTheFeature(z,source.features[0],map)) inside = true;
                    })
                })
                return inside;
            })
        }
        addOutlineLayer(map,source)
        setOutline(source);
        setQueryDynamicTable({...queryDynamicTable,  count:filterSource.features.length,source:filterSource})
    }
    const uploadGeom = async e => {
        var file = e.target.files[0];
        let localSource = await readAsDataText(file)
        resultSource(localSource);
    }
    const readAsDataText = (file)=> {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onerror = reject;
            fr.onload = () => {
                resolve(JSON.parse(fr.result));
            }
            fr.readAsText(file, 'UTF-8');
        });
    }
    return (
        <div className='cbs-menu-query'>
            <div className='cbs-menu-query-tab'>
                <div className='active' id="query-dynamic" onClick={e => click(e)}>
                    <VscChecklist/>
                    <span>Dinamik</span>
                </div>
                <div id="query-geom" onClick={e => click(e)}>
                    <FaDrawPolygon/>
                    <span>Mekansal</span>
                </div>
            </div>
            <div className='cbs-tab-indicator' data-value="query-dynamic"></div>
            <hr/>
            {tables !== null && 
                <>
                {!reset && <Select id={"test2"} options={tables} selectedItem={selectedItem}/>}
                {queryMode === 'query-dynamic' ?
                    <>
                        {queryDynamicTable !== null && queryDynamicTable.name !== 'districts' && 
                            <>
                            <Select id={`filter-districts`} options={districts} selectedItem={selectedItem}/>
                            <Select id={`filter-class`} options={classes} selectedItem={selectedItem}/>
                            </>
                        }
                    </>:
                    <div className='cbs-geom-polygon'>{queryDynamicTable && 
                        <>
                        <div onClick={polygonDraw}>
                            <div><BiShapePolygon/></div>
                            <span>Poligon Çiz</span>
                            
                        </div>
                        <div onClick={()=> {document.querySelector('#geom-upload').click();}}>
                            <div><BiUpload/></div>
                            <span>Geometri Yükle</span>
                            <input id="geom-upload" style={{display:"none"}} type="file" accept=".geojson,.json" onChange={e => uploadGeom(e)}/>
                        </div>
                        </>
                    }
                    </div>
                }
                {queryDynamicTable !== null && 
                    <div className='query-count'>
                        {queryDynamicTable.count > 0 &&
                            <button onClick={renderLayer}>Haritaya Ekle</button>
                        }
                        <VscFilter/>
                        <span>{queryDynamicTable.count}</span>
                    </div>
                }
                </>
            }
        </div>
    )
}