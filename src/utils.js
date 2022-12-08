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
        
    map.getStyle().layers.filter((layer) => layer.id.startsWith('cbs-query')).forEach(layer =>{
        map.removeLayer(layer.id)
    });
    map.getStyle().layers.filter((layer) => layer.id.startsWith('cbs-analysis')).forEach(layer =>{
        map.removeLayer(layer.id)
    });
    if(map.getSource('cbs-query-source')) map.removeSource('cbs-query-source');
    if(map.getSource('cbs-analysis-source')) map.removeSource('cbs-analysis-source');
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
export {toFeature,pointOnTheFeature,removeSourceandLayers,whereSQL,fetchData}
// TODO Mahalle Kaydı
// let xyz = ilce.features.map(e => {
//     let geomText = "";
//     e.geometry.coordinates[0].forEach((j,indexJ) => {
//         j.forEach((k,index) => {
//             let lastIndex = j.length - 1;
//             if(index === 0)  geomText +=  "(";
//             geomText +=  index === lastIndex ? `${k[0]} ${k[1]}`:`${k[0]} ${k[1]},`
//         });
//         let lastIndex = e.geometry.coordinates[0].length - 1;
//         if(lastIndex !== indexJ)geomText +=  "),";
//     });
//     let geom = `ST_GeomFromEWKT('SRID=4326;MULTIPOLYGON((${geomText})))')`;
//     return {
//         key: `name,area,population,geom`,
//         id:true,
//         table: "districts",
//         values: `'${e.properties.IlceAdi}', ${e.properties.Shape_Area},${e.properties.population},${geom}`
//     }
// })
// console.log(xyz);
// xyz.forEach(async e => {
//     await Axiosinstance().post("/createRecords",e);
// });
// console.log("Verileri Kaydedildi...")

// TODO Mahalle poligonun a göre nokta tip kaydı
// let result = await Axiosinstance().get("/getDistricts");
//         let xyz = saglik.features.map(e => {
//             let district_id = -1;
//             let geom = `ST_GeomFromEWKT('SRID=4326;POINT(${e.geometry.coordinates[0][0]} ${e.geometry.coordinates[0][1]})')`;
//             for(const district of result.features)
//             {
//                 let polygon = toFeature(district.geometry.coordinates[0],district.properties,"Polygon");
//                 if(pointOnTheFeature(e.geometry.coordinates[0],polygon,map))
//                 {
//                     district_id = district.properties.id;
//                     break;
//                 }
//             }
//             return {
//                 key: `name,district_id,class,geom`,
//                 table: "health_institutions",
//                 values: `'${e.properties.ADI}', ${district_id},'${e.properties.KATEGORI_A}',${geom}`
//             }
//         });
//         console.log("Veriler kaydediliyor...");
//         await xyz.forEach(e => {
//             Axiosinstance().post("/createRecords",e);
//         })
//         console.log("Veriler kaydedildi...");
// TODO land use
// let result = await Axiosinstance().get("/getDistricts");
//         let xyz = landuse.features.map(e => {
//             let geomText = "";
//             e.geometry.coordinates[0].forEach((j,indexJ) => {
//                 j.forEach((k,index) => {
//                     let lastIndex = j.length - 1;
//                     if(index === 0)  geomText +=  "(";
//                     geomText +=  index === lastIndex ? `${k[0]} ${k[1]}`:`${k[0]} ${k[1]},`
//                 });
//                 let lastIndex = e.geometry.coordinates[0].length - 1;
//                 if(lastIndex !== indexJ)geomText +=  "),";
//             });
//             if(e.properties.name !== null)
//             {
//                 e.properties.name = e.properties.name.replace("'","''");
//             }
//             let geom = `ST_GeomFromEWKT('SRID=4326;MULTIPOLYGON((${geomText})))')`;
//             let district_ids = [];
//             result.features.forEach(j => {
//                 let polyIntersect = intersect(e,j);
//                 if(polyIntersect !==null ) district_ids.push(j.properties.id);
//             })
//             return {
//                 district_ids : district_ids,
//                 key: e.properties.name === null ? `class,geom`:`name,class,geom`,
//                 id:true,
//                 table: "land_use",
//                 values: e.properties.name === null ? `'${e.properties.fclass}',${geom}`:
//                 `'${e.properties.name}', '${e.properties.fclass}',${geom}`
//             }
//         })
//         console.log("Verileri Kaydediliyor...");
//         xyz.forEach(async e => {
//             let land_use_id =  await Axiosinstance().post("/createRecords",e);
//             for await (const district_id of  e.district_ids) {
//                 const injData = {
//                     key: `district_id,land_use_id`,
//                     table: "districts_land_use",
//                     values: `${district_id}, ${parseInt(land_use_id)}`
//                 };
//                 await Axiosinstance().post("/createRecords",injData);
//             }
//         });
//         console.log("Verileri Kaydedildi...")

// TODO Railway ve road 
// let result = await Axiosinstance().get("/getDistricts");
//         let xyz = railway.features.map(e => {
//             let geomText = "";
//             let district_ids = [];
//             e.geometry.coordinates.forEach((j,indexJ) => {
//                 j.forEach((k,index) => {
//                     let lastIndex = j.length - 1;
//                     if(index === 0)  geomText +=  "(";
//                     geomText +=  index === lastIndex ? `${k[0]} ${k[1]}`:`${k[0]} ${k[1]},`
//                     result.features.forEach(z => {
//                         if(pointOnTheFeature(k,z,map) && district_ids.indexOf(z.properties.id) === -1) district_ids.push(z.properties.id);
//                     })
//                 });
//                 let lastIndex = e.geometry.coordinates.length - 1;
//                 if(lastIndex !== indexJ)geomText +=  "),";
//             })
//             let geom = `ST_GeomFromEWKT('SRID=4326;MULTILINESTRING(${geomText}))')`;
//             if(e.properties.name !== null)  e.properties.name = e.properties.name.replace("'","''");
//             return {

//                 district_ids:district_ids,
//                 table: "railways",
//                 id:true,
//                 key: e.properties.name === null ? `class,code,geom`:`name,class,code,geom`,
//                 values: e.properties.name === null ? `'${e.properties.fclass}',${e.properties.code},${geom}`:
//                 `'${e.properties.name}', '${e.properties.fclass}',${e.properties.code},${geom}`
//             }
//         })
//         console.log("Verileri Kaydediliyor...");
//         xyz.forEach(async e => {
//             let railway_id =  await Axiosinstance().post("/createRecords",e);
//             for await (const district_id of  e.district_ids) {
//                 const injData = {
//                     key: `district_id,railway_id`,
//                     table: "districts_railways",
//                     id:false,
//                     values: `${district_id}, ${parseInt(railway_id)}`
//                 };
//                 await Axiosinstance().post("/createRecords",injData);
//             }
//         });
//         console.log("Verileri Kaydedildi...");

// TODO Analiz Poligon Ekleme

// let result = await Axiosinstance().get(`/getFeatures?tableName=districts`);
//         let filter = risk.features.slice(2090,);
//         console.log(risk.features.length);
//         let xyz = filter.map(e => {
//             let geomText = "";
//             e.geometry.coordinates[0].forEach(j => {
//                 geomText +=  `${j[0]} ${j[1]},`
//             })
//             geomText = geomText.slice(0, -1)
//             let geom = `ST_GeomFromEWKT('SRID=4326;POLYGON((${geomText}))')`;
//             let district_ids = [];
//             result.source.features.forEach(j => {
//                 let polyIntersect = intersect(e,j);
//                 if(polyIntersect !==null ) district_ids.push(j.properties.id);
//             })
//             return {
//                 district_ids : district_ids,
//                 key: `risk,geom`,
//                 id:true,
//                 table: "flood_risk",
//                 values: `${e.properties.DN},${geom}`
//             }
//         });
//         console.log("Verileri Kaydediliyor...");
//         xyz.forEach(async e => {
//             let flood_risk_id =  await Axiosinstance().post("/createRecords",e);
//             for await (const district_id of  e.district_ids) {
//                 const injData = {
//                     key: `district_id,flood_risk_id`,
//                     table: "districts_flood_risk",
//                     values: `${district_id}, ${parseInt(flood_risk_id)}`
//                 };
//                 await Axiosinstance().post("/createRecords",injData);
//             }
//         });
//         console.log("Verileri Kaydedildi...")
// TODO Analiz Çizgi Ekleme
// let result = await Axiosinstance().get(`/getFeatures?tableName=districts`);
//         let filter = short.features.slice(800,859);
//         console.log(short.features.length);
//         let xyz = filter.map(e => {
//             let geomText = "";
//             let district_ids = [];
//             e.geometry.coordinates.forEach(j => {
//                 geomText +=  `${j[0]} ${j[1]},`
//                 result.source.features.forEach(k => {
//                     if(pointOnTheFeature(j,k,map) && district_ids.indexOf(k.properties.id) === -1) district_ids.push(k.properties.id);
//                 })
//             })
//             geomText = geomText.slice(0, -1)
//             let geom = `ST_GeomFromEWKT('SRID=4326;LINESTRING(${geomText})')`;
            
            
//             return {
//                 district_ids : district_ids,
//                 key: `cost,geom`,
//                 id:true,
//                 table: "shortest_path",
//                 values: `${e.properties.cost},${geom}`
//             }
//         });
//         console.log("Verileri Kaydediliyor...");
//         xyz.forEach(async e => {
//             let shortest_path_id =  await Axiosinstance().post("/createRecords",e);
//             for await (const district_id of  e.district_ids) {
//                 const injData = {
//                     key: `district_id,shortest_path_id`,
//                     table: "districts_shortest_path",
//                     values: `${district_id}, ${parseInt(shortest_path_id)}`
//                 };
//                 await Axiosinstance().post("/createRecords",injData);
//             }
//         });
//         console.log("Verileri Kaydedildi...")