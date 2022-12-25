import React,{useContext} from "react";
import { useTranslation } from 'react-i18next';
import { AppContext } from "../../context/AppContext";
import { AiOutlineClose } from "react-icons/ai";
import "./Info.css";

export default function Info () {
    const { t } = useTranslation();
    const {properties} = useContext(AppContext);
    return (
        <div className="cbs-info">
            <div className="cbs-info-header">
                <span>{ t(`${properties.tableName}`)}</span>
                <AiOutlineClose onClick={()=> document.querySelector('.cbs-info').classList.toggle('active')}/>
            </div>
            <div className="cbs-info-properties">
                {
                    Object.keys(properties).
                        filter((key) => !key.includes('id') && !key.includes('tableName') && !key.includes('district_id')).
                        map((key,i)=>{
                            return (
                                <>
                                <div style={{fontWeight:"bold"}}><span>{ t(`${key}`)}</span></div>
                                <div>{properties[key]}</div>
                                </>
                            )
                    })
                }
            </div>
        </div>
    )
}