import React,{useContext} from 'react';
import Header from '../Header/Header';
import { AppContext } from "../../context/AppContext";
import "./Menu.css";
import Query from './Query/Query';


function Menu() {
    const {mode} = useContext(AppContext);
    return (
        <div className='cbs-menu'>
            <Header text={mode}/>
            { mode === 'Sorgu' &&
                <Query/>
            }
        </div>
    );
}

export default Menu;


