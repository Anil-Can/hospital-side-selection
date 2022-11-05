import React,{useState,useEffect,useRef, useContext} from "react";
import ReactDOM from "react-dom";
import maplibregl from 'maplibre-gl';
import { AppContext } from "../../context/AppContext";
import "./Map.css";

export default function Map() {
    const {mode,instance,setMap} = useContext(AppContext);
    const isMobile = document.body.offsetWidth > 600 ? false : true;
    const mapStyle = {
        id: "O_SM",
        version: 8,
        name: "OSM Street",
        glyphs: "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
        sources: {
            "oda-street": {
                minzoom: 0,
                maxzoom: 18,
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
            },
        },
        layers: [
            {
                id: "O_SM",
                source: "oda-street",
                type: "raster",
                layout: {
                    visibility: "visible",
                }
            }
        ]
        
    }
    const mapContainer = useRef(null);
    const map = useRef(null);
    const popupRef = useRef(new maplibregl.Popup({closeButton:false,closeOnClick:false}));
    const [center] = useState([29,41.12]);
    const [zoom] = useState(15);

    useEffect(() => {
        if(map.current) return;
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style:mapStyle,
            center: center,
            zoom: zoom,
        });
        setMap(map.current);
        var hoveredStateId = null;
        map.current.on('load', ()=> {
        });
    });
    return (
        <>
          <div ref={mapContainer} className="map" />
        </>
      );
}

