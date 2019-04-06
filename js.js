
const remote = require("electron").remote;
const ipc = require("electron").ipcRenderer;
let win = remote.BrowserWindow.getAllWindows()[0];
const fs = require("fs");
var fullScreen = false;
var isPlaying = false;
process.env.NODE_ENV = 'production';
var sideBarVisible = true;
var lastFrameSrc = "geometry_teapot.html";
var isOnCode = false;

$(document).ready(function(){
	ipc.send("put-in-tray");
});


$(function() {
	$(".left-bar").resizable({
		containment:".main",
		handles: "e",
		minWidth: 3,
		// maxWidth: 400,appTitle
		stop: function( event, ui ) {
			$(".mask").hide();
		},
		start: function( event, ui ) {
			$(".mask").show();
		},
		resize: function( event, ui ) {
			$( "#leftSize" ).text(ui.size.width+ " " +ui.size.height);
		}
	});
	$( ".dialog.cfg" ).resizable({
		containment:".main",
		minHeight: 50,
		minWidth: 50,
		handles: "e,w,n,s,nw,ne,se,sw",
		
	});
	$( ".dialog.cfg" ).draggable({
		handle: ".handlebar",
		containment:".main",
	});
	$(".toggle-cfg").on("click", ()=>{
		$(".dialog.cfg").toggle();
	});
	$(".options").on("click", ()=>{
		$(".dialog.cfg").toggle();
	});
	$(".code").on("click", ()=>{
		if(!isOnCode){
			$("#frame").attr("src", "code.html");
			$("#frame").show();
			$(".list.scenes").hide();
			$(".list.files").show();
			$(".code").addClass("active");
			isOnCode = true;
		}
		else{
			$("#frame").hide();
			$("#frame").attr("src", "");
			$(".list.scenes").show();
			$(".list.files").hide();
			$(".code").removeClass("active");
			isOnCode = false;
		}
		
	});
	$(".toggle_Left").on("click",toggleSideBar);
	$(".page_btn").each(function (index, element) {
		var id = $(element).attr("id") + ".html";
		$(element).on("click", ()=>{LoadFrame(id);});
	});
	$(".file").each(function (index, element) {
		var id = $(element).attr("fileName");
		$(element).on("click", ()=>{
			var editor = document.querySelector("iframe").contentDocument.querySelector(".CodeMirror").CodeMirror;
			var f = fs.readFileSync(id);
			editor.setValue(f.toString());
			
		});
	});
	$(".stop3d").on("click",ToggleFrame);
});
$(function(){
	
	$(".btn.close").on("click",CloseWindow);
	$(".btn.minimize").on("click",Minimize);
	$(".btn.maximize").on("click",Maximize);
	$( ".main" ).on("resize", WinResize)
});

function Maximize(){
	if(!fullScreen){
		win.maximize()
		fullScreen = true;
		$(".btn.maximize").switchClass("ion-arrow-resize","ion-arrow-shrink",100 );
		
	} else{
		win.unmaximize();
		fullScreen = false;
		$(".btn.maximize").switchClass("ion-arrow-shrink","ion-arrow-resize",100 );
	}
}
function Minimize(){
	win.minimize();
}
function CloseWindow()
{
	remote.app.quit();
}
function WinResize()
{
	// var w = $( ".main" ).width();
	// $( ".dialog.cfg" ).css("left", "calc(100% - left)");
}
function LoadFrame(frameSrc)
{
	var  src = $("#frame").attr("src");
	if(src != frameSrc){
		$("#frame").show();
		$("#frame").attr("src",frameSrc);
		$(".stop3d").switchClass("ion-play","ion-pause",100 );
		if(!isPlaying)
		isPlaying = true;
		lastFrameSrc = frameSrc;
	}
}
function ToggleFrame()
{
	if(isPlaying){
		$("#frame").hide();
		$("#frame").attr("src","");
		$(".stop3d").switchClass("ion-pause","ion-play",100 );
		isPlaying =!isPlaying;
	}
	else{
		LoadFrame(lastFrameSrc);
	}

}
function toggleSideBar()
{
	
	if(sideBarVisible){
		$(".toggle_Left").switchClass("ion-chevron-left","ion-chevron-right",10 );
		$(".left-bar").hide();

	}else{
		$(".left-bar").show();
		$(".toggle_Left").switchClass("ion-chevron-right","ion-chevron-left",10 );

	}
	sideBarVisible = !sideBarVisible;
}

