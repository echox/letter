// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var jq = require("jquery")
const Mustache = require("mustache")
const main = require('electron').remote.require("./main")
const w = require('electron').remote.getCurrentWebContents
var ipc = require('electron').ipcRenderer;

var template = ""

ipc.on('log', function(event, msg){
				console.log(msg)
				jq("#log").html(msg)

});

window.addEventListener('keypress', function(ev){
				if(ev.key === 'r') {

		data = main.getData()
				console.log(data)
	var rendered = Mustache.render(template, data)
	jq("#target").html(rendered)
	register()
				} else if (ev.key === '?') {
								toggleHelp();
				}
});

function toggleHelp() {

				jq("#help").toggle()
}

function register() {

	jq(".folder").click(function() {
		data = main.getData()
		var rendered = Mustache.render(template, data)
		jq("#target").html(rendered)
		register()
	})
}

jq(document).ready(function() {
	
	template = jq("#template").html()
	Mustache.parse(template)

	var data = main.getData()
	console.log(data)


	var rendered = Mustache.render(template, data)
	jq("#target").html(rendered)
	register()

	
})
