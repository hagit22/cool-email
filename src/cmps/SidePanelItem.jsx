import { useState, useEffect, useRef } from "react"

export function SidePanelItem({Icon, text, onClickItem, currentId}) {

    return (
        <section className={`side-panel-item ${text==currentId ? 'panel-item-selected' : ''}`}>
            <Icon className="icon-style" id={text} onClick={onClickItem}/>
            <a className="side-panel-filter-name"  id={text} onClick={onClickItem}>
                {text}
            </a>
        </section>
    );
}
