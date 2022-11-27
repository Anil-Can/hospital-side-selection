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

export default function App() {
    const[mode,setMode] = useState("");
    const[map,setMap] = useState(null);
    const[tables,setTables] = useState(null);
    const[info,setInfo] = useState(false)
    const[selectedTables,setSelectedTables] = useState([]);
    const[properties,setProperties] = useState({})
    const Axiosinstance = () => {
        let controller = new AbortController();
        const instance = axios.create({
            baseURL: '//localhost:3001/',
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
                tables,setTables,selectedTables,setSelectedTables,
                properties,setProperties
                }}>
                <Hamburger/>
                <Sidebar/>
                <Map/>
                <Menu/>
                <BottomRight/>
                <Info/>
            </AppContext.Provider>
        </React.StrictMode>
    )
}
