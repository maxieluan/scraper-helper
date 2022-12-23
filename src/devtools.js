// get tab id of network panel
function log(message) {
    chrome.devtools.inspectedWindow.eval(`console.log(${JSON.stringify(message)})`);
}

chrome.devtools.panels.create("ScraperHelper", null, "panel.html", function (panel) {
    
})
