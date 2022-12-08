import React,{useContext, useEffect,useState} from 'react';
import { AppContext } from "../../../context/AppContext";
import { useTranslation } from 'react-i18next';
import Select from '../../Select/Select';
import { VscFilter } from "react-icons/vsc";
import { removeSourceandLayers,whereSQL,fetchData } from '../../../utils';
import { default as intersect } from "@turf/intersect";
import "./Analysis.css";

export default function Analysis()
{
    const { t } = useTranslation();
    const {analysis,setAnalysis,map,Axiosinstance,setSelectedTables,analysisDynamicTable,setAnalysisDynamicTable} = useContext(AppContext);
    const [isSelect,setIsSelect] = useState(false);
    const [districts,setDistricts] = useState({
        value:-1,
        list:[]
    });
    const [values,setValues] = useState([]);

    useEffect(()=>{
        if(analysis === null )
        {
            fetchData("analysis",Axiosinstance,t).then(e =>{
                setAnalysis(e);
            })
        }
    },[]);
    const addSource = async (source,type) => {
        let feature = await Axiosinstance().get(`/getDistrict?id=${districts.value}`);
        let filterSource = {
            "type": "FeatureCollection", 
            "features": []
        }
        source.features.forEach(e =>{
            let clipped = intersect(feature,e);
            if(e) filterSource.features.push({
                geometry:clipped.geometry,
                properties:e.properties
            })
        })
        console.log(filterSource);
        map.addSource('cbs-analysis-source', {
            type: 'geojson',
            data:filterSource,
            tolerance: 0,
            ...(type === 'Point' && {
                cluster: true,
                clusterMaxZoom: 22,
                clusterRadius: 50
            })
        });
    }
    const addLayers = (type,tableName) => {
        if(type === 'Polygon')
        {
            map.addLayer({
                'id': `cbs-analysis-${tableName}`,
                'source': 'cbs-analysis-source',
                'type': 'fill',
                'paint': {
                    'fill-color': 'red',
                    
                },
            });
            map.addLayer({
                'id': 'cbs-analysis-polygon-outline',
                'source': 'cbs-analysis-source',
                'type': 'line',
                'paint': {
                    'line-color': 'black',
                },
            });
        }
        else
        {
            map.addLayer({
                'id': `cbs-analysis-${tableName}`,
                'source': 'cbs-analysis-source',
                'type': 'line',
                'paint': {
                    'line-color': 'blue',
                },
            });
        }
            
    }
    const renderLayer = async () => {
        removeSourceandLayers(map);
        setSelectedTables([analysisDynamicTable.name]);
        await addSource(analysisDynamicTable.source,analysisDynamicTable.type);
        addLayers(analysisDynamicTable.type,analysisDynamicTable.name);
    }
    const selectedItem = async (id,value) => {
        let index = analysis.findIndex(e => e.id === value);
        if(index !== -1)
        {
            const {source,attributes} = await Axiosinstance().get(`/getFeatures?tableName=${value}`);
            let results = await Axiosinstance().get(`/getCategories?name=${attributes[1]}&tableName=${value}`);
            setIsSelect(true);
            let result = await Axiosinstance().get("/getDistricts");
            setAnalysisDynamicTable({
                name:value,
                count:source.features.length,
                source:{...source},
                attribute:`${attributes[1]}`,
                type:analysis[index].geom,
                ...(analysis[index].geom !== 'Point',{joinAtt:analysis[index].relation.field})
            });
            setValues(()=>{
                return results.map(e => {
                    return{
                        id:e[`${attributes[1]}`],
                        item:<span>{e[`${attributes[1]}`]}</span>
                    }
                })
            })
            setDistricts( {value:-1,list:result.map(e => {
                    return{
                        id:e.id,
                        item:<span>{e.name}</span>
                    }
                })
            })
        }
        else
        {
            let attribute = id.split('-')[1];
            let newwhere = attribute === 'districts' ? whereSQL(analysisDynamicTable.where,"district_id",value):
            whereSQL(analysisDynamicTable.where,analysisDynamicTable.attribute,value);
            let sqlWhere = "";
            let wherelist = [...newwhere.split("|")].slice(0, -1);
            let lastIndex = wherelist.length -1;
            wherelist.forEach((e,i)=>{
                sqlWhere += i === lastIndex ? `${e}`:`${e} AND `;
            });
            const {source} = await Axiosinstance().get(`/getFeatures?tableName=${analysisDynamicTable.name}&where=${sqlWhere}&joinAtt=${analysisDynamicTable.joinAtt}`);
            if(attribute === 'districts') setDistricts({...districts,value:value});
            setAnalysisDynamicTable({...analysisDynamicTable,
                count:source.features === null ? 0:source.features.length,source:{...source},where:newwhere
            })
        }
    }
    return(
        <div className='cbs-menu-analysis'>
        {analysis !== null &&
            <Select id={"anaylysis-tables"} options={analysis} selectedItem={selectedItem}/>
            
        }
        {isSelect && 
            <>
                <Select id={`filter-districts`} options={districts.list} selectedItem={selectedItem}/>
                <Select id={`filter-values`} options={values} selectedItem={selectedItem}/>
                {analysisDynamicTable !== null && 
                    <div className='query-count'>
                        {analysisDynamicTable.count > 0 &&
                        <button onClick={renderLayer}>Haritaya Ekle</button>
                        }
                        <VscFilter/>
                        <span>{analysisDynamicTable.count}</span>
                    </div>
                }
            </>
        }
        
        </div>
    )
}