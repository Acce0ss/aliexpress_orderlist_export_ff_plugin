var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var resultDisplay = require("sdk/panel").Panel({
    width: 600,
    height: 800,
    contentURL: self.data.url("resultDisplay.html"),
    contentScriptFile: self.data.url("getResultText.js")
});

function processResult(info)
{
    if(info.hasNextPage)
    {
	
	tabs.on("ready", function(tab){
	    
	    var worker = tabs.activeTab.attach(
		{
		    contentScriptFile: 'export-script.js'
		});
	    worker.port.on("ready", processResult);
	    worker.port.emit("scanPage", info);
	});

    }
    else
    {
	var csv = "";
	info.items.forEach(function (e, i, l){csv += e.name + ";" + e.date 
					      + ";" + e.status + ";" + e.count 
					      + ";" + e.value + ";" + e.currency + ";\n"});
	showResult(csv);
    }
}

function goThroughOrders()
{
    var worker = tabs.activeTab.attach(
    {
	contentScriptFile: 'export-script.js'
    });

    worker.port.on("ready", processResult);

    worker.port.emit("scanPage", null);
}

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
    onClick: goThroughOrders
});

function showResult(result)
{
    resultDisplay.port.emit("setResult", result);
    resultDisplay.show();

}

