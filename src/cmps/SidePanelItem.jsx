/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export function SidePanelItem({Icon, text, onClickItem, currentId}) {

    return (
        <Link to={`/email/${text}`}>
            <section id={text} onClick={onClickItem} className={`side-panel-item ${text===currentId ? 'panel-item-selected' : ''}`}>
                <Icon id={text} className="icon-style"/>
                <a id={text} className="side-panel-filter-name">
                    {text}
                </a>
            </section>
        </Link>
    );
}
