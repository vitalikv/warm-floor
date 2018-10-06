/* global setCatalogSource, initUIButtons,param_ugol,loadFilePL,getDesignFile, createForm,loadPopObj, setCatalogSource, deletePlinths,param_3d_click, THREE, saveFile, loadFile  */
var editorButtons = null;

function sendMessage(action, payload) {
  window.parent.postMessage({ 'action': action, 'payload': payload }, '*');
  console.log('%cSENDING', 'color: #8500ff', action, 'payload ', payload);
}


function listener(event) 
{
	if (event.source === window) return;
	var msg = event.data;
	console.log(msg);
	var source = msg.action.split('.')[0];
	var action = msg.action.split('.')[1];


	if (source === 'UGOL') 
	{
		switch (action) 
		{
			case 'INIT':
				editorButtons = msg.payload.buttons;
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







window.addEventListener('message', listener);
