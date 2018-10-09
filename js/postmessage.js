/* global setCatalogSource, initUIButtons,param_ugol,loadFilePL,getDesignFile, createForm,loadPopObj, setCatalogSource, deletePlinths,param_3d_click, THREE, saveFile, loadFile  */
var editorButtons = null;

function sendMessage(action, payload) {
  window.parent.postMessage({ 'action': action, 'payload': payload }, '*');
  console.log('%cSENDING', 'color: #8500ff', action, 'payload ', payload);
}


function listener(event) 
{ 
	//if (event.source === window) return;
	var msg = event.data;
	console.log(msg);
	var source = msg.action.split('.')[0];
	var action = msg.action.split('.')[1];


	if (source === 'UGOL') 
	{
		switch (action) 
		{
			case 'INIT':
				editorButtons = buttons;
				disableUIButtons();

				assignBlockParam(msg.payload.mode);

				param_ugol.file = (msg.payload.file) ? msg.payload.file : '';
				param_ugol.hash = (msg.payload.hash) ? msg.payload.hash : '';
				param_ugol.key = (msg.payload.key) ? msg.payload.key : libs;
				param_ugol.link_render = (msg.payload.link_render) ? msg.payload.link_render : '';
				param_ugol.link_save = (msg.payload.link_save) ? msg.payload.link_save : '';

				console.log(param_ugol);

				UI.setProjectInfo(param_ugol.hash, param_ugol.file);

				loadFile('');
				
				UI.toggleStatsPanel('fps');

			break;
			
			case 'PROJECT_SAVE':

				saveFile('');
				
			break;
						

			case 'CAMERA_PICK': 

				switchCamers3D( msg.payload.id );

			break;				
		}
	}
}


var buttons = {
save: 1,
line: 1,
window: 1,
doorway: 1,
changeView: 1,
toggleSizes: 1,
center: 1,
centerCamera2d: 1,
zoomIn: 1,
zoomOut: 1,
angle: 1,
changeViewMode: 1,
cameraHeight: 1,
ceilingHeight: 1,
};




window.addEventListener('message', listener);
