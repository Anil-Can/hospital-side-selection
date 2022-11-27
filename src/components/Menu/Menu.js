import React,{useContext} from 'react';
import Header from '../Header/Header';
import { AppContext } from "../../context/AppContext";
import "./Menu.css";
import Query from './Query/Query';
import { useTranslation } from 'react-i18next';


function Menu() {
    const {mode} = useContext(AppContext);
    const { t } = useTranslation();
    return (
        <div className='cbs-menu'>
            <Header text={mode}/>
            { mode === t('query') &&
                <Query/>
            }
        </div>
    );
}

export default Menu;


