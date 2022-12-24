import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Example from 'components/Example';
import defaultTheme from 'themes/default';
import "./panel.scss"
import { set } from 'lodash';
import Parser from './logic/parser';
import Scrapy from './logic/langs/scrapy';

const Panel = () => {
    // state
    const [requests, setRequests] = useState({});
    const [selectedRequest, setSelectedRequest] = useState({});
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltiptext, setTooltipText] = useState("");
    const [tooltipStyle, setTooltipStyle] = useState({});
    const [sidepanelStyle, setSidepanelStyle] = useState({ position: "abusolute", width: 400 });
    const [sidepanelWidth, setSidepanelWidth] = useState(400);
    const [sidepanelHeight, setSidepanelHeight] = useState(400);
    const [filter, setFilter] = useState("")
    const [parsed, setParsed] = useState({ url: "", header: [], cookie: { present: false, value: [] }, token: { present: false, value: "", refresh: 30 } })
    const langs = ["scrapy"]
    const [lang, setLang] = useState("scrapy")
    const [isShowGeneratedCode, setIsShowGeneratedCode] = useState(false)
    const [generatedCode, setGeneratedCode] = useState("")

    useEffect(() => {
        function processRequest(request) {
            // if request is empty
            if (Object.keys(requests).length === 0) {
                setRequests({ 0: request });
            } else {
                // if request is not empty
                const newRequests = { ...requests };
                const newRequestIndex = Object.keys(newRequests).length;
                newRequests[newRequestIndex] = request;
                setRequests(newRequests);
            }
        }

        chrome.devtools.network.onRequestFinished.addListener(processRequest);

        setSidepanelStyle((prev) => ({
            ...prev,
            width: isPanelOpen ? sidepanelWidth : 0,
            height: 400,
        }));

        return () => {
            chrome.devtools.network.onRequestFinished.removeListener(processRequest);
        }
    }, [isPanelOpen, requests, selectedRequest]);

    function handleMouseClick(idx, e) {
        setSelectedRequest(requests[idx]);

        // make use it does not go over screeen
        var x = e.clientX
        if (x + sidepanelWidth > window.innerWidth) {
            x = window.innerWidth - sidepanelWidth
        }

        var y = e.clientY
        if (y + sidepanelHeight > window.innerHeight) {
            y = window.innerHeight - sidepanelHeight
        }

        // add scroll offset
        x += window.scrollX
        y += window.scrollY

        var parser = new Parser()
        var parsed = parser.parse(requests[idx])
        setParsed(parsed)
        setSidepanelStyle((prev) => ({
            ...prev,
            left: x,
            top: y,
        }));
        setIsPanelOpen(true);
        setIsShowGeneratedCode(false)
        // set sidepanel to open at mouse position

        // supress type error
        try {
            window.getComputedStyle(document.querySelector(".side-panel"))
        } catch (e) {
            console.log(e)
        }

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

    function handleDetailMouseMover(text) {
        setTooltipText(text);
        setShowTooltip(true);
    }

    function generateCode() {
        switch (lang) {
            case "scrapy":
                var scrapy = new Scrapy()
                var code = scrapy.process(parsed)
                setGeneratedCode(code)
                break;
            default:
                break;
        }

        setIsShowGeneratedCode(true)
    }

    return (
        <div>
            <input className='filter' onInput={(e) => { setFilter(e.target.value) }}></input>
            <button className='clear' onClick={() => setRequests([])}>Clear</button>
            <select className='langs' onChange={(e) => setLang(e.target.options.value)}>
                {langs.map((lang) => {
                    return <option value={lang}>{lang}</option>
                })}
            </select>
            <div className="list">
                <ul style="list-style-type: none" >
                    {Object.keys(requests).map((idx) => {
                        if (filter == "") {
                            return (
                                <li key={idx} onClick={(e) => handleMouseClick(idx, e)}
                                    onMouseMove={(e) => handleMouseMove(e)}
                                    onMouseOver={() => handleMouseOver(idx)}
                                    onMouseOut={() => setShowTooltip(false)}
                                >
                                    {idx} - {requests[idx].request.url}
                                </li>)
                        }

                        else if (requests[idx].request.url.includes(filter)) {
                            return (
                                <li key={idx} onClick={(e) => handleMouseClick(idx, e)}
                                    onMouseMove={(e) => handleMouseMove(e)}
                                    onMouseOver={() => handleMouseOver(idx)}
                                    onMouseOut={() => setShowTooltip(false)}
                                >
                                    {idx} - {requests[idx].request.url}
                                </li>)
                        }
                    })}
                </ul>
            </div>
            {isPanelOpen && (
                <div className="side-panel" style={sidepanelStyle} onResize={() => handlePanelResize()}>
                    <button className='generate' onClick={() => { generateCode() }}>Generate for {lang}</button>
                    <button class="close" onClick={() => setIsPanelOpen(false)}>x</button>
                    <ui style="list-style-type: none">
                        <li
                            onMouseMove={(e) => handleMouseMove(e)}
                            onMouseOver={() => handleDetailMouseMover(parsed.url)}
                            onMouseOut={() => setShowTooltip(false)}
                        ><b>url:</b> {parsed.url}</li>
                        ----
                        {
                            parsed.header.map((header) => {
                                return <li
                                    onMouseMove={(e) => handleMouseMove(e)}
                                    onMouseOver={() => handleDetailMouseMover(header?.name + ": " + header?.value)}
                                    onMouseOut={() => setShowTooltip(false)}
                                ><b>{header?.name}:</b> {header?.value}</li>
                            })
                        }
                        ----
                        {
                            parsed.cookie.present && parsed.cookie.value.map((cookie) => {
                                <li
                                onMouseMove={(e) => handleMouseMove(e)}
                                onMouseOver={() => handleDetailMouseMover(parsed.cookie.value)}
                                onMouseOut={() => setShowTooltip(false)}
                            ><b>cookie:</b> {cookie.name} - {cookie.value}</li>
                            })
                        }
                    </ui>
                </div>
            )}
            {showTooltip && (
                <div className="tooltip" style={tooltipStyle}>
                    {tooltiptext}
                </div>)}

            {isShowGeneratedCode && (
                <div className="generated-code">
                    <button class="close" onClick={() => setIsShowGeneratedCode(false)}>x</button>
                    <pre style={{whiteSpace: 'pre-wrap'}}>
                        <code style={{overflowX: 'scroll', overflowY: 'scroll', wordBreak: 'break-all'}}>
                            { generatedCode }
                        </code>
                    </pre>
                </div>)}
        </div>

    );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Panel />, root);