/*****CONTROLLER SCRIPT*****/

//Initial setup for the viewer and controller
function start(){
	controller=window;
	viewer=window.open('code/www/viewer.html');
	
	//A default slide
	defaultSlide=`
		<div class="sample" onclick="slideShow(this)" oncontextmenu="slideEdit(this)">
			<div class="slide">
				<div class="slide-background">
					<div style="background-color:black;"></div>
				</div>
				<div class="slide-content" contenteditable>
					<p>We don't have to go to church, we get to go to church!</p>
				</div>
			</div>
		</div>
	`;
	
	//Once the viewer loads, start us up!
	viewer.onload=function(){
		//The buttons for the active content
		activeContent=null;
		activeBackground=null;
		activePacket=null;
		
		//Variables
		slideEditing=null;
		
		//Set up the viewer
		//If you close the controller, close the view
		controller.addEventListener(
			"beforeunload"
			,function(){viewer.window.close();}
		);
		
		//Viewer
		//If you close the viewer, close the controller
		viewer.addEventListener(
			"beforeunload"
			,function(){controller.window.close();}
		);
		
		//On resizing the window, adjust the styles for the sample slides
		viewer.onresize=function(){
			updateSampleSlides(.25)
		};
		
		//Update te sample slides immediately too (to fit the initial size)
		updateSampleSlides(.25);
		
		//Load a packet
		loadPacket();
	}
}

function updateSampleSlides(inputPercent){
	//Update the sample styles
	controller.document.getElementById("sample-styles").innerHTML=".sample{width:"+window.innerWidth*inputPercent+"px;height:"+window.innerHeight*inputPercent+"px;font-size:"+10*inputPercent+"px;}"
	
	viewer.document.getElementById("viewer").style.fontSize=10+"px";
}


//Load a packet's info
function loadPacket(inputElement){
	//For now, just with one option:
	ajaxCall(
		"packets/Default.json"
		,"GET"
		,""
		,displayPacket
		,inputElement
	);
}

function displayPacket(inputText,inputElement){
	var thisPacket=JSON.parse(inputText);
				
	var packetContents='';
	
	thisPacket['slides'].forEach(
		function(element){
			packetContents+='<div class="sample" onclick="slideShow(this)" oncontextmenu="slideEdit(this)">'+element+'</div>';
		}
	);
	
	//Put the packets into the slides section
	document.getElementById("slides").innerHTML=packetContents;
	
	//Make this element active
	if(activePacket) activePacket.classList.remove("active-packet");
	//activePacket=inputElement;
	//activePacket.classList.add('active-packet');
	
	//Display the packet's name
	document.getElementById("packetName").innerHTML=thisPacket.title;
	
	//Set background
}

function addSlide(){
	controller.document.getElementById("slides").insertAdjacentHTML("beforeend",defaultSlide);
}

//Get the HTML for the background
function backgroundHTML(inputBackground){
	//If it's a color, return a backing color
	if(inputBackground.indexOf("#")>-1){
		return "<div style='background-color:"+inputBackground+"'></div>"
	}
	
	//Otherwise, return the image/video
	
	//Change the type of background put out depending on the file type
	var ext=(inputBackground).split('.').splice(-1)[0];

	//Return a background setup depending on the file type
	switch(ext){
		//Videos
		case "webm":
			return "<video muted autoplay loop><source src='/backgrounds/"+inputBackground+"' type='video/webm'></video>";
			break;
		//Images
		default:
			return "<img src='/backgrounds/"+inputBackground+"'>";
	}
}

//Replace/edit the background
function editBackground(inputBackground){
	//Replace/alter the background for the slide currently being edited
	slideEditing.children[0].children[0].innerHTML=backgroundHTML(inputBackground);
}

//Show the slide currently displaying
function slideShow(inputElement){
	//If this slide is already opened for editing, don't do anything (the user's clicking inside to edit it)
	if(inputElement==slideEditing){
		return;
	}
	
	//Stop editing the slides, if we're editing any
	if(slideEditing){
		slideEditing.id="";
		slideEditing=null;
		editorHide();
	}
	
	event.preventDefault();
	
	//Get the HTML from the slide, but tweak it a bit to remove undesirable bits
	var passHTML=inputElement.innerHTML;
	
	//Remove the currently selected slide id, if there is one
	if(document.getElementById("slideShowing")){
		document.getElementById("slideShowing").id="";
	}
	
	//Show the element's selected
	inputElement.id="slideShowing";
	
	//Replace contenteditable stuff
	//passHTML=passHTML.replace(/contenteditable/g,'');
	
	viewer.window.document.getElementById("viewer").innerHTML=passHTML;
}

//Edit the slide clicked on
function slideEdit(inputElement){
	//If this slide is already opened for editing, don't do anything
	if(inputElement==slideEditing){
		return;
	}
	
	event.preventDefault();
	
	//Remove the currently being edited slide id, if there is one
	if(slideEditing){
		slideEditing.id="";
	}
	
	//Show the element's selected
	inputElement.id="slideEditing";
	slideEditing=inputElement;
	
	//Bring up the editor
	
	//Background chooser
	var editBackgrounds=document.getElementById("editBackgrounds");
	editBackgrounds.className="showEditor";
	
	editBackgrounds.style.left=inputElement.getBoundingClientRect().right+"px";
	editBackgrounds.style.top=inputElement.getBoundingClientRect().top+"px";
	editBackgrounds.style.height=inputElement.getBoundingClientRect().height+"px";
}

//Hide the slide editor
function editorHide(){
	editBackgrounds.className="";
}

//Make an AJAX call (load another file asynchronously)
function ajaxCall(inputFile,inputType,inputVars,successFunction,passValue){
	var ajaxCall = new XMLHttpRequest();
	
	ajaxCall.open(inputType,inputFile);
	if(inputType=="POST") ajaxCall.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	ajaxCall.send(inputVars);
	ajaxCall.onreadystatechange=function(){
		if(ajaxCall.readyState==4){
			if(ajaxCall.status==200){
				if(successFunction){
					successFunction(ajaxCall.responseText,passValue);
				}
			}else{
				alert("Failed to load file "+inputFile);
			}
		}
	}
}