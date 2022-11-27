import React,{useContext, useEffect} from "react";
import "./BottomRight.css";
import { AppContext } from "../../context/AppContext";
import { VscAdd,VscChromeMinimize } from "react-icons/vsc";
import { BsInfoLg,BsTrash } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { removeSourceandLayers } from "../../utils";


export default function BottomRight() {
    const {map,selectedTables,setSelectedTables,setInfo} = useContext(AppContext);

    const homeClicked = () => {
        var bbox = [
            [27.89383217177013,40.95678768206383], 
            [29.213763247167492,41.55740488524586]
        ];
        map.fitBounds(bbox, {
        padding: {top: 10, bottom:25, left: 15, right: 5}
        });
    };

    // Info açıkken başka sorgu yapılırsa click eventini güncelle
    useEffect(()=>{
        if(map !== null && map.getCanvas().onclick !== null) map.getCanvas().onclick = featureClicked;
    },[selectedTables])
    const featureClicked = (e) => {
        let layers = selectedTables.map(j => {
            return map.getStyle().layers.filter((layer) => layer.id.includes(j))[0].id
        })
        const features = map.queryRenderedFeatures([e.x, e.y], {
            layers: [...layers],
        });
        console.log(features);
    }
    const trashClicked = () => {
        let infoElem = document.querySelector('#cbs-info')
        if(infoElem.classList.contains('enable'))infoElem.classList.remove('enable');
        map.getCanvas().style.cursor = "default";
        setSelectedTables([]);
        removeSourceandLayers(map);
        setInfo(false);
    };
    const infoClicked = () => {
        document.querySelector('#cbs-info').classList.toggle('enable');
        if(document.querySelector('#cbs-info').classList.contains('enable'))
        {
            map.getCanvas().style.cursor = "crosshair";
            map.getCanvas().onclick = featureClicked;
            setInfo(true);
        }
        else
        {
            map.getCanvas().style.cursor = "default";
            map.getCanvas().onclick = null;
            setInfo(false);
        }
    }
    return (
        <div className="cbs-bottom-right">
            <div className="cbs-bottom">
                <div id="cbs-zoom-out" onClick={()=> map.zoomIn({duration: 1000})}>
                    <VscAdd/>
                </div>
                <div id="cbs-zoom-in" onClick={()=> map.zoomOut({duration: 1000})}>
                    <VscChromeMinimize/>
                </div>
            </div>
            <div className="cbs-right">
                <div>
                    <BsTrash onClick={trashClicked}/>
                </div>
                <div>
                    <AiOutlineHome onClick={homeClicked}/>
                </div>
                <div id="cbs-info" onClick={infoClicked}>
                    <BsInfoLg/>
                </div>
            </div>
        </div>
    )
}
