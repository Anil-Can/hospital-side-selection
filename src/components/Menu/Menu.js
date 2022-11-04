import React,{useContext} from 'react';
import Header from '../Header/Header';
import { AppContext } from "../../context/AppContext";
import "./Menu.css";

function Menu() {
    const {mode} = useContext(AppContext);
    return (
        <div className='cbs-menu'>
            <Header text={mode}/>
        </div>
    );
}

export default Menu;