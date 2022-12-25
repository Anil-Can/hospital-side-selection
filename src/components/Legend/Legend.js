import React,{ useContext } from 'react';
import { AppContext } from "../../context/AppContext";
import { useTranslation } from 'react-i18next';
import "./Legend.css"

export default function Legend(){
    const { legend } = useContext(AppContext);
    const { t } = useTranslation();

    const colorSet = ['#d7191c','#fdae61','#ffffbf','#abdda4','#2b83ba']
    return (
        <div className='cbs-legend'>
            <header>
                <span>{t(legend.title)}</span>
            </header>
            <div>
                {legend.items.map((e,i)=>{
                    return (
                        <div key ={`legend${i}`}>
                            <div style={{backgroundColor:colorSet[i]}}></div>
                            <span>{t(e)}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}