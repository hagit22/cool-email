import { useState, useEffect, useRef } from "react"
import { SidePanelItem } from '../cmps/SidePanelItem'
import { Inbox } from 'react-bootstrap-icons';
import { Star } from 'react-bootstrap-icons';
import { Send } from 'react-bootstrap-icons';
import { Pencil } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';


export function SidePanel({filterBy, onSetFilter, emailTypes}) {

    const [currentFilter, setCurrentFilter] = useState(filterBy)

    useEffect(() => {
        console.log("SidePanel: ",currentFilter)
        onSetFilter(currentFilter)
    }, [currentFilter])


    function onClickFilter({target}) {
        let { id } = target;
        //onSetFilter({ ...filterBy, emailType: id })
        setCurrentFilter(prevFilter => ({ ...prevFilter, emailType: id }))
    }

    console.log("render EmailFilter: ",currentFilter)
    return (
        <section>
            <div className="side-panel">
                <SidePanelItem onClickItem={onClickFilter} Icon={Inbox} text={emailTypes.INBOX} currentId={currentFilter.emailType}/>
                <SidePanelItem onClickItem={onClickFilter} Icon={Star} text={emailTypes.STARRED} currentId={currentFilter.emailType}/>
                <SidePanelItem onClickItem={onClickFilter} Icon={Send} text={emailTypes.SENT} currentId={currentFilter.emailType}/>
                <SidePanelItem onClickItem={onClickFilter} Icon={Pencil} text={emailTypes.DRAFTS} currentId={currentFilter.emailType}/>
                <SidePanelItem onClickItem={onClickFilter} Icon={Trash} text={emailTypes.TRASH} currentId={currentFilter.emailType}/>
           </div>
        </section>
    )
}
