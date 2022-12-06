import React,{useContext} from 'react';
import Header from '../Header/Header';
import { AppContext } from "../../context/AppContext";
import "./Menu.css";
import Query from './Query/Query';
import { useTranslation } from 'react-i18next';
import Analysis from './Analysis/Analysis';


function Menu() {
    const {mode} = useContext(AppContext);
    const { t } = useTranslation();
    return (
        <div className='cbs-menu'>
            <Header text={mode}/>
            { mode === t('query') &&
                <Query/>
            }
            { mode ===t('analysis') &&
                <Analysis/>
            }   
        </div>
    );
}

export default Menu;


