import { default as lineIntersect }  from '@turf/line-intersect';
import { default as destination }  from '@turf/destination';

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
export {toFeature,pointOnTheFeature}
// Mahalle Kaydı
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

// Mahalle poligonun a göre nokta tip kaydı
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
/*land use*/
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

/*Railway ve road*/ 
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