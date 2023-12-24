/* eslint-disable react/prop-types */
import { utilService } from '../services/util.service'
import { SidePanelItem } from './SidePanelItem'
import { Inbox } from 'react-bootstrap-icons';
import { Star } from 'react-bootstrap-icons';
import { Send } from 'react-bootstrap-icons';
import { Pencil } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';


export function SidePanel({filterBy, onSetFilter, emailTypes, unReadsMap}) {

    let currentFilter = filterBy;

    function onClickFilter({target}) {
        let { id } = target;
        currentFilter = {emailType: id}
        onSetFilter(currentFilter)
    }

    const panelIcons = [Inbox, Star, Send, Pencil, Trash]
    const panelTexts = utilService.alignTexts( Object.values(emailTypes))

    return (
        <section>
            <div className="side-panel">
                {
                    Object.values(emailTypes).map( (type, index) => (
                        <SidePanelItem key={type} onClickItem={onClickFilter} Icon={panelIcons[index]} folder={type} 
                            currentId={currentFilter.emailType} numUnReads={unReadsMap[type]} folderDisplayName={panelTexts[index]}/>
                    ))
                }
           </div>
        </section>
    )
}




