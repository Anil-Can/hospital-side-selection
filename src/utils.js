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
    //             let lastIndex = k.length - 1;
    //             if(index === 0) geomText +=  "(";
    //             geomText +=  `${k[0]} ${k[1]},`
    //             if(index === lastIndex) geomText +=  `${j[0][0]} ${j[0][1]},`
    //         });
    //         let lastIndex = e.geometry.coordinates[0].length - 1;
    //         if(lastIndex !== indexJ)geomText +=  "),";
    //         else {
    //             geomText = geomText.slice(0, -1)
    //         }
    //     });
    //     //geomText = geomText.slice(0, -1)
    //     let geom = `ST_GeomFromEWKT('SRID=4326;MULTIPOLYGON((${geomText})))')`;
    //     return {
    //         "name": e.properties.IlceAdi,
    //         "area": e.properties.Shape_Area,
    //         "geom": geom,
    //         "population": e.properties.population
    //     }
    // });
    // xyz.forEach(e => {
    //     instance.post("/createDistrict",e);
    // })

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