import React, { useState} from "react";
import axios from "axios";
import Map from "../Map/Map";
import { AppContext } from "../../context/AppContext";
import "./App.css";
import Hamburger from "../Hamburger/Hamburger";
import Sidebar from "../Sidebar/Sidebar";
import Menu from "../Menu/Menu";
import BottomRight from "../BottomRight/BottomRight";
import "../../i18"
import Info from "../Info/Info";
import Legend from "../Legend/Legend";

export default function App() {
    const [mode,setMode] = useState("");
    const [map,setMap] = useState(null);
    const [tables,setTables] = useState(null);
    const [analysis,setAnalysis] = useState(null);
    const [analysisDynamicTable,setAnalysisDynamicTable]  = useState(null);
    const [info,setInfo] = useState(false)
    const [selectedTables,setSelectedTables] = useState([]);
    const [queryDynamicTable,setQueryDynamicTable] = useState(null);
    const [properties,setProperties] = useState({})
    const [legend,setLegend] = useState(null);
    const Axiosinstance = () => {
        let controller = new AbortController();
        const instance = axios.create({
            baseURL: '//gis.project.test/api/',
            signal: controller.signal,
        })
        const get = (url = "", params = {}) => {
            return new Promise((resolve, reject) => {
                controller = new AbortController();
                instance.defaults.signal = controller.signal;
                instance.get(url, params).then(({ data }) => {
                    if (data.result)
                        resolve(data.result);
                    else
                        resolve(data);
                })
            });
        };
        const post = (url = "", params = {}, currHeaders = {}) => {
            return new Promise((resolve, reject) => {
                instance.post(url, params, { headers: currHeaders }).then(({ data }) => {
                    if (data.result)
                        resolve(data.result);
                    else
                        resolve(data);
                });
            });
        }
        return {
            instance,get,post
        }
    }
    return(
        <React.StrictMode>
            <AppContext.Provider value={{
            mode,setMode,Axiosinstance,map,setMap,info,setInfo,
            tables,setTables,selectedTables,setSelectedTables,legend,setLegend,
            queryDynamicTable,setQueryDynamicTable,properties,setProperties,
            analysis,setAnalysis,analysisDynamicTable,setAnalysisDynamicTable
            }}>
                <Hamburger/>
                <Sidebar/>
                <Map/>
                <Menu/>
                <BottomRight/>
                <Info/>
                {legend && legend.show && <Legend/>}
            </AppContext.Provider>
        </React.StrictMode>
    )
}
