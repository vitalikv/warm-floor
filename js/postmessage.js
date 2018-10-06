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

	if (source === 'CATALOG') 
	{
		if (action === 'OPEN_CATALOG') emitAction('open-catalog-menu');
		//if (action === 'CLOSE_CATALOG') emitAction('close-catalog-menu');	  
		  
		if (action === 'OBJECT_PICK') 
		{
			var lotGroup = msg.payload.lotGroup;
			var type = msg.payload.type;
			// var typeOnPlan = msg.payload.typeOnPlan;

			if(lotGroup == 'Doors')
			{
				if(camera != cameraTop) { if(menuUI.type != 'catalog_self') { UI.setView('2D'); return; } }
			}

			if (type != 'TypalRoom') setCatalogSource(msg.payload.source, msg.payload.lotGroup);

			if (type == 'object' || type == 'TypalRoom') 
			{
				var obj = clickO.last_obj;
				
				if (lotGroup == '') { lotGroup = 'Furniture'; }
				
				if (lotGroup == 'Plinths') 
				{				
					deletePlinths(obj, false);
					UI('plinth-preview').val(msg.payload.preview);
					UI.setObjectCaption(msg.payload.source.caption, 'plinth');
				} 
				else if (lotGroup == 'FurnitureDoorHandle') 
				{
					UI('handle-preview').val(msg.payload.preview);
					UI.setObjectCaption(msg.payload.source.caption, 'handle');
				} 
				else 
				{
					if (obj) 
					{
						if (obj.userData.tag === 'door') { UI('doors-preview').val(msg.payload.preview); }
					}
				}
				
				loadPopObj_1({ obj: obj, lotid: msg.payload.id, catalog : msg.payload.source, lotGroup: msg.payload.lotGroup, size : msg.payload.size, modifiers : msg.payload.modifiers });
			}
			else if (type == 'material') 
			{			  
				setCatalogSource(msg.payload.source, msg.payload.lotGroup);

				UI('wall-preview').val(msg.payload.preview);
				UI('floor-preview').val(msg.payload.preview);
				UI.setObjectCaption(msg.payload.source.caption);

				catalogSelectionObj(msg);

				if (clickO.last_obj) 
				{
					if (clickO.last_obj.userData.tag == 'wall')
					{
						for ( var i = 0; i < arrWallFront.length; i++ )
						{
							loadPopObj_1({ obj: arrWallFront[i].obj, lotid: msg.payload.id, start: 'new', index: arrWallFront[i].index, catalog : msg.payload.source });
						}
					}
					else
					{
						loadPopObj_1({ obj: clickO.last_obj, lotid: msg.payload.id, start: 'new', index: clickO.index, catalog : msg.payload.source });
					}
				}
			}
		}
	}


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
			
			
			case 'OPEN_FAVORITES' :
			
				menuUI.open = true; 
				menuUI.type = 'catalog_ugol_favorites';
				
			break;
			
			case 'PROJECT_SAVE':

				saveFile('');
				
			break;
			
			case 'REINIT':
			
				initUIButtons(msg.payload.buttons, function () { sendMessage('EDITOR.REINIT_SUCCESS', null); });
				
			break;
			
			case 'DESIGN_PICK':

				if(menuUI.type == 'catalog_ugol_design') { getDesignFile(msg.payload.file, msg.payload.room_id); }
				else if(menuUI.type == 'catalog_ugol_favorites') { catalogSelectionObj(msg); }

			break;
			
			case 'OBJECT_PICK':

				if (msg.payload.type == 'material') 
				{
					UI('wall-preview').val(msg.payload.preview);
					UI('floor-preview').val(msg.payload.preview);

					catalogSelectionObj(msg);
				}
				else
				{	
					loadPopObj_1([{ obj: null, lotid: msg.payload.id, pr_id: 'new', pos: new THREE.Vector3(), rot: new THREE.Vector3(), catalog : msg.payload.source, lotGroup: msg.payload.lotGroup, size : msg.payload.size, modifiers : msg.payload.modifiers }]);
				}

			break;	

			case 'CAMERA_PICK': 

				switchCamers3D( msg.payload.id );

			break;				
		}
	}
}







// выбрали объект/материал из основного каталога (превью приклепляеется к мыши)
function catalogSelectionObj(msg)
{
	if(menuUI.type == 'catalog_full' || menuUI.type == 'catalog_ugol_favorites') { }
	else { return; }
	//if(camera != camera3D) return;
	 
	if(clickO.last_obj) { hideMenuObjUI_3D(clickO.last_obj); clickO.last_obj = null; }		
	if(camera == cameraTop) { objDeActiveColor_2D(); hideMenuObjUI_2D(clickO.last_obj); }   
	
	UI.showObjectPreview( msg.payload.preview ); 
	
	menuUI.select = msg.payload;	
	
	loadPopObj_XML_1({ arrLotid : [msg.payload.id] });  
}


// кликнули на что-то когда у нас выбран объект/материал из каталога
function catalogClickObj(obj, intersect)
{ 
	if(!menuUI.select) return;
	
	if(obj)
	{
		var flag = false;
		var index = 0;
		
		if(menuUI.select.room_id)
		{
			if(obj.userData.tag == 'room') { flag = true; }
		}
		else
		{
			if(obj.userData.tag == 'wall') { index = intersect.face.materialIndex; if(index == 1 || index == 2) { flag = true; } }
			else if(obj.userData.tag == 'room') { flag = true; }	
			else if(obj.userData.tag == 'ceiling') { flag = true; }
		}
		
		if(flag)
		{
			if(menuUI.select.room_id) { getDesignFile(menuUI.select.file, menuUI.select.room_id); }
			else 
			{ 
				if (obj.userData.tag == 'wall')
				{
					var sel = menuUI.select;
					
					for ( var i = 0; i < arrWallFront.length; i++ )
					{ 
						var obj = arrWallFront[i].obj;
						var index = arrWallFront[i].index;
						
						loadPopObj_1({ obj: obj, lotid: sel.id, start: 'new', index: index, catalog : sel.source });
						setUIPreview( obj, obj.userData.material[index].preview, obj.userData.material[index].catalog, index);
					}
				}
				else
				{
					loadPopObj_1({ obj: obj, lotid: menuUI.select.id, start: 'new', index: index, catalog : menuUI.select.source }); 
				}								
			}			
		}
	}
		
	menuUI.select = null;
	
	UI.hideObjectPreview();
}


// скрываем превью у мыши
function catalogResetObj()
{
	menuUI.select = null;
	
	UI.hideObjectPreview();
}



window.addEventListener('message', listener);

$(document).ready(function () {
  sendMessage('EDITOR.READY', null);
});
