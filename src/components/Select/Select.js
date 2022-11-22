import React, {useState} from 'react';
import { VscChevronDown } from "react-icons/vsc";
import "./Select.css";
export default function Select ({options,selectedItem}){
    const [index,setIndex] = useState(null);
    const toggle = () => {
        document.querySelector('.cbs-select-items').classList.toggle('active');
    }
    const change = e => {
        document.querySelector('.cbs-select-items').classList.toggle('active');
        let target = e.target.localName === 'svg' || e.target.localName === 'span' ? e.target.parentNode: e.target.localName === 'path' ?  e.target.parentNode.parentNode:e.target;
        setIndex(options.findIndex(j => j.id === target.dataset.value));
        selectedItem(target.dataset.value);
    }
    return (
        <div className='cbs-selectbox'>
            <div className='cbs-selected-item' onClick={toggle}>
                {index !== null && options[index].item}
                <VscChevronDown/>
            </div>
            <div className="cbs-select-items">
                {options.map(e => {
                    return (
                        <div key ={e.id} className='cbs-select-option' onClick={j => change(j)} data-value={e.id}>
                            {e.item}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}