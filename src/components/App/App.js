import React, { useRef, useState} from "react";
import axios from "axios";
import Map from "../Map/Map";
import { AppContext } from "../../context/AppContext";
import "./App.css";
import Hamburger from "../Hamburger/Hamburger";
import Sidebar from "../Sidebar/Sidebar";
import Menu from "../Menu/Menu";

export default function App() {
    const[mode,setMode] = useState("");
    const[map,setMap] = useState(null);
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
            <AppContext.Provider value={{mode,setMode,Axiosinstance,map,setMap}}>
                <Hamburger/>
                <Sidebar/>
                <Map/>
                <Menu/>
            </AppContext.Provider>
        </React.StrictMode>
    )
}
