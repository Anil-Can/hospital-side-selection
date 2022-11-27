import React,{useState,useEffect,useRef, useContext} from "react";
import maplibregl from 'maplibre-gl';
import { AppContext } from "../../context/AppContext";
import "./Map.css";

export default function Map() {
    const {setMap} = useContext(AppContext);
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
    const [center] = useState([28.7,41.2]);
    const [zoom] = useState(8.5);

    useEffect(() => {
        if(map.current) return;
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style:mapStyle,
            center: center,
            zoom: zoom,
        });
        setMap(map.current);
    });
    return (
        <>
          <div ref={mapContainer} className="map" />
        </>
      );
}

