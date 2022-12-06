import React,{useContext, useEffect,useState} from 'react';
import { AppContext } from "../../../context/AppContext";
import Select from '../../Select/Select';
import { removeSourceandLayers,whereSQL } from '../../../utils';
import "./Analysis.css";

export default function Analysis()
{
    return(
        <div className='cbs-menu-analysis'></div>
    )
}