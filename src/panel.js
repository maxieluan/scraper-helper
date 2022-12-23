import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Example from 'components/Example';
import defaultTheme from 'themes/default';
import "./panel.scss"
import { set } from 'lodash';

const Panel = () => {
    // state
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltiptext, setTooltipText] = useState("");
    const [tooltipStyle, setTooltipStyle] = useState({});
    const [sidepanelStyle, setSidepanelStyle] = useState({ position: "abusolute", right: 0, width: 400, top: 0 });
    const [sidepanelWidth, setSidepanelWidth] = useState(400);
    const [listStyle, setListStyle] = useState({ width: "100%", overflow: "hidden" });
    const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {

        chrome.devtools.network.onRequestFinished.addListener((request) => {
            setRequests((prev) => [...prev, request]);
        });

        setWindowDimension({ width: window.innerWidth, height: window.innerHeight });

        setSidepanelStyle((prev) => ({
            ...prev,
            width: isPanelOpen ? sidepanelWidth : 0,
            height: 400,
        }));

        // sidepanel follow scroll
        window.addEventListener("scroll", handleScroll)

        // detect window resize
        window.addEventListener("resize", handlePanelResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handlePanelResize);
        }
    }, [sidepanelStyle, listStyle, windowDimension]);

    function handlePanelResize() {

        // set sidepanel height
        setSidepanelStyle((prev) => ({
            ...prev,
            height: window.innerHeight,
        }));

        setWindowDimension({ width: window.innerWidth, height: window.innerHeight });

        var listWidth = windowDimension.width - sidepanelStyle.width;
        setListStyle({
            width: listWidth,
            overflow: "hidden"
        })
    }

    function handleScroll() {

        setSidepanelStyle((prev) => ({
            ...prev,
            top: window.scrollY,
        }))
    }

    function handleRequestClick(idx) {
        console.log("request clicked", idx);
        setSelectedRequest(requests[idx]);
        handlePanelResize(400)
        setIsPanelOpen(true);
    }

    function handleMouseOver(idx) {
        setShowTooltip(true);
        setTooltipText(requests[idx].request.url);
    }

    function handleMouseMove(e) {
        setTooltipStyle({
            top: e.pageY + 10,
            left: e.pageX + 10,
        });
    }

    return (
        <div>
            <span> {JSON.stringify(listStyle)}</span>
            <span> {JSON.stringify(windowDimension)}</span>
            <span> {JSON.stringify(sidepanelStyle)}</span>

            <div className="list" style={listStyle}>
                <ul >
                    {requests.map((request, idx) => (
                        <li key={idx} onClick={() => handleRequestClick(idx)}
                            onMouseMove={(e) => handleMouseMove(e)}
                            onMouseOver={() => handleMouseOver(idx)}
                            onMouseOut={() => setShowTooltip(false)}
                        >
                            {idx} - {request.request.url}
                        </li>
                    ))}
                </ul>
            </div>
            {isPanelOpen && (
                <div className="side-panel" style={sidepanelStyle} onResize={() => handlePanelResize()}>
 
                </div>
            )}
            {showTooltip && (
                <div className="tooltip" style={tooltipStyle}>
                    {tooltiptext}
                </div>)}
        </div>

    );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Panel />, root);