

var pool_pop = [];




// скачиваем с сервера json файл, добавляем его в общий массив/библиотеку
// отправляем json в обработку, чтобы добавить на сцену
function loadPopObj_1(cdm) 
{			
	if(!Array.isArray(cdm)) { var arr = []; arr[0] = cdm; cdm = arr; }	
	
	if(!isNumeric(cdm[0].lotid)) { return; } // если не число, то отбой	
	
	
	if(cdm[0].size)
	{ 
		if((/,/i).test( cdm[0].size )) { var size = cdm[0].size.split(','); cdm[0].size = new THREE.Vector3(parseFloat(size[0]),parseFloat(size[1]),parseFloat(size[2])); }		
	}	
	
	// если лот уже есть в библиотеке, то достаем его от туда и НЕ обращаемся к серверу
	for ( var i = 0; i < pool_pop.length; i++ ) 
	{ 
		if(pool_pop[i].id == cdm[0].lotid) 
		{ 
			createEmptyFormWD(pool_pop[i], cdm[0]);		// вставка формы двери	
			loadPopObj_2(cdm); 
			return; 
		} 
	} 		
		
	cdm[0].emptyCube = createEmptyCube(cdm[0]);  	// если это мебель, то создаем пустой объект 	
	
	
	$.ajax
	({
		url: 'https://catalog.planoplan.com/api/v2/search/?keys[0]='+param_ugol.key+'&disregard_price=1&disregard_structure=1&id[0]='+cdm[0].lotid+'&lang=ru',
		type: 'GET', 
		dataType: 'json',
		success: function(json)
		{ 				 
			if(json.items.length == 0) 
			{ 
				var flag = true;
				for ( var i = 0; i < pool_pop.length; i++ ) { if(pool_pop[i].id == cdm[0].lotid) { flag = false; break; } }
				if(flag) { pool_pop[pool_pop.length] = { id : cdm[0].lotid, empty : true }; }	// если лота нету в массиве, то добавляем его как пустой объект
				return; 
			}
			
			json = json.items[0];
			
			json.preview = (json.preview == '') ? '' : 'https:'+json.preview;
			if(json.sourceImageURL) { json.sourceImageURL = 'https:'+json.sourceImageURL; }			
			if((/,/i).test( json.filters )) { json.filters = json.filters.split(','); }
			else { var f = []; f[0] = parseFloat(json.filters); json.filters = f; }			
			if((/,/i).test( json.size )) { var size = json.size.split(','); json.size = new THREE.Vector3(parseFloat(size[0]),parseFloat(size[1]),parseFloat(size[2])); }

			if(json.type == 'material') { json.size.x = 1/json.size.x; json.size.y = 1/json.size.y; };		
			
			createEmptyFormWD(json, cdm[0]);	// вставка формы двери	
			
			console.log(formatSizeUnits(roughSizeOfObject(json)));
			
			var n = pool_pop.length;
			pool_pop[n] = json;						
			
			var flag = true;
			if(pool_pop[n].fileJson) { if(pool_pop[n].fileJson != '') { getJsonModel(n, cdm); flag = false; } }	// если есть json, то сначала скачиваем его	
			
			if(flag) { loadPopObj_2(cdm); }					
		}, 
		error: function(json)
		{
			console.log('error', cdm[0].lotid);
		}
	});		

}

// создаем куб размером с объект (он находится в сцене, пока не подгрузится реальный объект)
// куб создается только для нового объекта в сцене (из каталога) 
function createEmptyCube(json) 
{
	if(menuUI.type == 'catalog_self') return null;	// если мы заменяем один объект на другой, то куб не создаем
	
	if(json.lotGroup == 'Furniture' || json.lotGroup == 'Light')
	{					 
		var material = new THREE.MeshLambertMaterial({ color: colWin, transparent: true, opacity: 0.5, side: THREE.DoubleSide }); 
		var cube = new THREE.Mesh( createGeometryCube(json.size.x, json.size.y, json.size.z), material ); 			
		
		if(1==1)
		{
			var arr = json.modifiers.split(';');			
			for ( var i2 = 0; i2 < arr.length; i2++ ) 
			{ 
				if(arr[i2] == 'SnapToCeil') { cube.position.y = Number(height_wall); break; } 								// объекты крепятся потолку
				if((/SetupBeginOverfloor/i).test( arr[i2] )) { cube.position.y = Number(arr[i2].split('*')[1]); break; }	// объекты крепятся на заданную высоту	
			}			
		}
		else
		{
			console.log(json);
		}

		
		cube.userData.tag = 'obj'; 
		cube.pr_scale = json.size;
		obj_selected = cube; 
		scene.add( cube );   
		
		return cube;					
	}
	
	
	return null;
}



// создаем форму окна/двери/балкона при загрузки объекта (вставка формы двери в сцену)
function createEmptyFormWD(json, cdm)
{  

	if(json.lotGroup == 'Windows' || json.lotGroup == 'Doors')
	{
		var form = { type : '' , v : new THREE.Vector2( 0, 0 ) };
		
		var size = (cdm.size) ? cdm.size : json.size;  
		
		var material = new THREE.MeshLambertMaterial({ color: (json.lotGroup == 'Windows') ? colWin : colDoor, transparent: true, opacity: 1.0, depthTest: false });  
		
		if(camera == cameraTop)
		{ 
			material.depthTest = false;
			material.transparent = true;		
			material.opacity = 1.0; 		 	
		}
		else
		{ 		
			material.depthTest = true;
			material.transparent = true;
			material.opacity = 0;					
		}		
		
		var arr = json.modifiers.split(';'); 
		
		//console.log(json.allModifiers);
		
		if(typeof json.allModifiers.CutContourData !== "undefined") { /*console.log(json.allModifiers.CutContourData[0]);*/ } 
		


		for ( var i = 0; i < arr.length; i++ ) 
		{ 
			if((/CutContourData*/i).test( arr[i] )) 
			{
				var str = arr[i].split('CutContourData*')[1].split('|');				
				
				var spline = [];
				for ( var i2 = 0; i2 < str.length; i2+=2 ) { spline[spline.length] = new THREE.Vector2( parseFloat(str[i2]), parseFloat(str[i2 + 1]) ); }
				
				var shape = new THREE.Shape( spline );
				var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: 0.2 } ), material );
				
				var v = obj.geometry.vertices;
				
				var minX = [], maxX = [], minY = [], maxY = [], minZ = [], maxZ = [];
				
				for ( var i = 0; i < v.length; i++ )
				{
					v[i].z = Math.round(v[i].z * 100) / 100;
					if(v[i].z == 0) { minZ[minZ.length] = i; v[i].z = -0.1; }
					if(v[i].z == 0.2) { maxZ[maxZ.length] = i; v[i].z = 0.1; } 
				}
				
				obj.geometry.verticesNeedUpdate = true; 
				obj.geometry.elementsNeedUpdate = true;
				obj.geometry.computeBoundingSphere();
				obj.geometry.computeBoundingBox();
				obj.geometry.computeFaceNormals();	

				for ( var i = 0; i < v.length; i++ )
				{
					if(obj.geometry.boundingBox.min.x + 0.05 > v[i].x) { minX[minX.length] = i; }
					if(obj.geometry.boundingBox.max.x - 0.05 < v[i].x) { maxX[maxX.length] = i; }
					if(obj.geometry.boundingBox.min.y + 0.05 > v[i].y) { minY[minY.length] = i; }
					if(obj.geometry.boundingBox.max.y - 0.05 < v[i].y) { maxY[maxY.length] = i; }
				}
				
				
				var arr = { minX : minX, maxX : maxX, minY : minY, maxY : maxY, minZ : minZ, maxZ : maxZ };
				
				form = { type : 'spline' , v : arr };
				//form.type = '';
				
				break;
			}					
		}		
		
		if(form.type == '')
		{
			var obj = new THREE.Mesh( createGeometryWD(size.x, size.y, 0.2), material );

			var arr = { minX : [0,1,6,7], maxX : [2,3,4,5], minY : [0,3,4,7], maxY : [1,2,5,6], minZ : [4,5,6,7], maxZ : [0,1,2,3] };
			form = { type : 'box' , v : arr };
		} 
		
		var v = obj.geometry.vertices;
		var width = Math.round((v[arr.maxZ[0]].z - v[arr.minZ[0]].z) * 100) / 100;
		
		
		obj.userData.tag = 'free_dw';
		obj.userData.catalog = cdm.catalog;
		obj.userData.door = {};
		obj.userData.door.size = new THREE.Vector3( size.x, size.y, json.size.z );
		obj.userData.door.form = form;
		obj.userData.door.bound = {}; 
		obj.userData.door.floorCenterY = 0;  // центр wd над полом
		obj.userData.door.width = width;
		obj.userData.door.h1 = 0;
		obj.userData.door.color = obj.material.color; 
		obj.userData.door.popObj = null;
		obj.userData.door.wall = null;
		obj.userData.door.controll = {};
		obj.userData.door.ruler = {};
		obj.userData.door.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3(), x : 0, y : 0 };
		obj.userData.door.totalLoad = false;
		obj.userData.door.goList = { setEmptyBox : false, setPopObj : false, setPlinths : false };
		obj.userData.door.status = '';
		if(cdm.id) { obj.userData.id = cdm.id; obj.userData.door.status = cdm.status; }       	
		else { obj_selected = obj; clickO.last_obj = obj; }
		
		// замена двери/окна
		if(menuUI.type == 'catalog_self')
		{	
			obj.userData.id = cdm.obj.userData.id;
			obj.position.copy(cdm.obj.position);
			obj_selected = null;
			clickO.last_obj = null;
		}			
		
		cdm.emptyBox = obj;
		obj.renderOrder = 1;
		
		// выставляем мат.плоскость на заданный уровень
		if(1==1)
		{
			obj.updateMatrixWorld();
			obj.geometry.computeBoundingBox();			
			var y = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.min.y, 0) ).y;
			

			var k = (json.lotGroup == 'Windows') ? 0.6 : 0;			// высота вставки двери/окна	
			obj.userData.door.floorCenterY = obj.position.y - y + k;
			planeMath.position.set( 0, obj.userData.door.floorCenterY, 0 );
			planeMath.rotation.set(-Math.PI/2, 0, 0);  			
			
			if(camera == cameraTop) { objDeActiveColor_2D(); hideMenuObjUI_2D(clickO.last_obj); } 					
		}

		scene.add( obj ); 		
	}
}



// скачиваем с сервера json 3D модели
function getJsonModel(n, cdm)
{	
	$.ajax
	({
		url: pool_pop[n].fileJson,
		type: 'GET',
		dataType: 'json',
		success: function(json) { pool_pop[n].fileJson = json; loadPopObj_2(cdm); },		
		error: function(json) { pool_pop[n].fileJson = ''; loadPopObj_2(cdm); console.log('error', json); }
	});	
}


// после того, как полностью получен json начинаем применять его к сцене
function loadPopObj_2(cdm)
{
	var json = pool_pop;
	var n = 0;
	
	for ( var i = 0; i < json.length; i++ )
	{					
		if(cdm[n].lotid != json[i].id) { continue; }
		if(json[i].empty) { continue; }
		
		
		if(json[i].type == 'object') 
		{	
			if(json[i].lotGroup == 'Furniture' || json[i].lotGroup == 'Light') 
			{  
				loaderObjPop(cdm[n], json[i]); 
			}					
			else if(json[i].lotGroup == 'Doors' || json[i].lotGroup == 'Windows') 
			{ 
				loaderWD(cdm[n], json[i]);
			}
			else if(json[i].lotGroup == 'Plinths')
			{						
												
			}
			else if(json[i].lotGroup == 'TypalRoom') 
			{ 
				loadFile(json[i].fileRender); 
			}
			if(json[i].lotGroup == 'FurnitureDoorHandle')
			{
				replaceHabdleDoor_2(cdm[n], json[i]);  
			}
		} 
		else if(json[i].type == 'material')
		{		
			loadPopMaterial(cdm[n], json[i]);
		}		
		
		break;			
	}
	
}



function loaderObjPop(cdm, json)
{	
	// замена выделенного объекта
	var parO = { pos : new THREE.Vector3(), rot : new THREE.Vector3() };
	
	var pos = (cdm.pos) ? new THREE.Vector3(Number(cdm.pos.x), Number(cdm.pos.y), Number(cdm.pos.z)) : new THREE.Vector3();
	var rot = (cdm.rot) ? new THREE.Vector3(Number(cdm.rot.x), Number(cdm.rot.y), Number(cdm.rot.z)) : new THREE.Vector3();

	
	var obj = param_pivot.obj;
	if(obj) 
	{ 
		if(menuUI.type == 'catalog_self') 
		{ 
			parO.pos = new THREE.Vector3(obj.position.x, obj.position.y, -obj.position.z); 
			parO.rot = new THREE.Vector3(obj.rotation.x + Math.PI, obj.rotation.y + Math.PI, obj.rotation.z + Math.PI); 
			deleteObjCatalog(obj);   
		}
		else 
		{
			param_pivot.obj = null;
			pivot.visible = false;
			gizmo.visible = false;				
		}
	}				
	
	var mod = json.modifiers.split(';');
	
	if(!cdm.id)
	{
		offset = new THREE.Vector3();
		
										
		for ( var i2 = 0; i2 < mod.length; i2++ ) 
		{ 
			if(mod[i2] == 'SnapToCeil') { pos.y = Number(height_wall); break; } 							// объекты крепятся к потолку
			if((/SetupBeginOverfloor/i).test( mod[i2] )) { pos.y = Number(mod[i2].split('*')[1]); break; }	// объекты крепятся на заданную высоту	
		}
		
		planeMath2.position.set( pos.x, pos.y, pos.z );
		planeMath2.rotation.set( 0, 0, 0 );
		
		parO.pos.y = pos.y;
		pos.copy( parO.pos ); 									
		rot.copy( parO.rot ); 
	}
	
	// json parse
	var obj = new THREE.ObjectLoader().parse( json.fileJson );

	var obj3D = createCopyPopForm(obj);  		
	
	if(cdm.id) { var id = cdm.id; }
	else { var id = countId; countId++; }
	
	
	
		 						 								
	obj3D.lotid = json.id; 
	obj3D.pr_scale = (cdm.id) ? cdm.size : json.size;	
	obj3D.pr_group = null;
	obj3D.pr_catalog = Object.assign({}, cdm.catalog);
	obj3D.pr_filters = json.filters;
	obj3D.pr_preview = json.preview;
	
	obj3D.userData.id = id;
	obj3D.userData.tag = 'obj';
	obj3D.userData.catalog = cdm.catalog;
	obj3D.userData.obj3D = { lotid : json.id, lotGroup : json.lotGroup, size : (cdm.id) ? cdm.size : json.size, filters : json.filters, preview : json.preview, caption : json.caption, catalog : Object.assign({}, cdm.catalog) };
	
	var box = null;
	
	for ( var i2 = 0; i2 < mod.length; i2++ ) 
	{ 
		if((/ResizeOption/i).test( mod[i2] )) { box = boxPop; break; }	// объекту можно менять высоту/ширину/длину
	}	
	
	obj3D.userData.obj3D.boxPop = box; 
	obj3D.userData.obj3D.controller = 'pivot'; 
	
	if(cdm.id)
	{
		obj3D.scale.set(cdm.size.x / json.size.x, cdm.size.y / json.size.y, cdm.size.z / json.size.z);									
		assignTextureAllChildrensLoadPop(obj, cdm.material);
		obj3D.position.set(pos.x, pos.y, -pos.z); 					// ковертируем с помощью -pos.z		
	}
	else
	{
		if(menuUI.type != 'catalog_self') { obj_selected = obj3D; }		
		assignTextureAllChildrens(obj, json.components);

		if(cdm.emptyCube) { obj3D.position.copy( cdm.emptyCube.position ); scene.remove( cdm.emptyCube ); }
		else { obj3D.position.set(pos.x, pos.y, -pos.z); }   		
	}

	popChangeMaxAnisotropy(obj);
	obj3D.add( obj ); 
	
	// ковертируем с помощью Math.PI
	if(obj.userData.version == "2.0") { obj3D.rotation.set(rot.x, -rot.y, rot.z); }
	else { obj3D.rotation.set(rot.x + Math.PI, rot.y, rot.z + Math.PI); }					
	
	
	arr_obj[arr_obj.length] = obj3D; 

	if(cdm.group) 
	{ 
		var box = cdm.group;
		box.add( obj3D );
		var n = box.userData.arrO.length;
		box.userData.arrO[n] = obj3D;
		box.userData.pos_obj[n] = obj3D.position.clone();
		obj3D.pr_group = box; 
	}		 

	resetMenuUI();
	renderCamera();
}



// устанавливаем у POP для map и lightMap максимальное значение anisotropy
function popChangeMaxAnisotropy(obj) 
{
	for (var i = obj.children.length - 1; i >= 0; i--) 
	{
		var child = obj.children[i];		
	
		if(child.material)
		{
			if(child.material.map) child.material.map.anisotropy = renderer.getMaxAnisotropy(); 
			if(child.material.lightMap) child.material.lightMap.anisotropy = renderer.getMaxAnisotropy();
		}
		
		popChangeMaxAnisotropy(child);			
	}
}



//var pop8747 = null; new THREE.ObjectLoader().load( 'pop/8747.json', function ( obj ) { pop8747 = obj; console.log(111111); });



function loaderWD(cdm, json)
{
	
	var obj = cdm.emptyBox;

	obj.userData.door.lotid = json.id;
	obj.userData.door.type = (json.lotGroup == 'Windows') ? 'WindowSimply' : ((/DoorPattern*/i).test( json.modifiers )) ? 'DoorPattern' : 'DoorSimply';
	
	obj.caption = json.caption;
	obj.pr_catalog = Object.assign({}, cdm.catalog);
	obj.pr_filters = json.filters;
	obj.lotid = json.id;
	obj.pr_preview = json.preview;
	 	
	
	// кликнули/выбрали дверь, заменяем на другую
	if(menuUI.type == 'catalog_self')
	{	
		//cdm.mess = 'replace';
		cdm.id = Number(cdm.obj.userData.id);
		cdm.pos = cdm.obj.position.clone();
		cdm.wall = cdm.obj.userData.door.wall;		
		if(cdm.obj.userData.door.open_type) { cdm.open_type = cdm.obj.userData.door.open_type; }
		obj_selected = null;
		
		//obj.userData.door.width = cdm.obj.userData.door.width;
		
		deleteWinDoor( cdm.obj );
		delete cdm.obj;		
	}	
	
	if(obj.userData.door.type == 'DoorPattern')
	{  					
		createJambDoor(json, cdm);  // параметрическая дверь   		
	}
	else 
	{  
		if(json.fileJson) { var popObj = (json.fileJson.geometries) ? new THREE.ObjectLoader().parse( json.fileJson ) : null; }
		else { var popObj = null; }				
				
		obj.userData.door.popObj = popObj;	
		obj.userData.door.goList.setPopObj = true; 
		
		if(json.id == 9012) { obj.pr_filters = [3856, 3864]; }
		else if(json.id == 278) { obj.pr_filters = [3770]; }		
		else if(json.id == 575) { obj.pr_filters = [3856, 3864]; }
		
		if(popObj)
		{
			if(!popObj.geometry) 
			{
				if(popObj.children[0]) { obj.userData.door.popObj = popObj.children[0]; obj.add( popObj ); }
			}
		}		
		
		//var arr = json.modifiers.split(';');
		//for ( var i = 0; i < arr.length; i++ ) { if((/Mirrored/i).test( arr[i] )) { size.x *= -1; } }
		
		var existObj = (obj.userData.door.popObj) ? (obj.userData.door.popObj.geometry) ? true : false : false;
		
		if(existObj)
		{  
			var size = (cdm.size) ? cdm.size : json.size;
			
			popObj = obj.userData.door.popObj;
			
			popObj.geometry.computeBoundingBox();		
			var dX = popObj.geometry.boundingBox.max.x - popObj.geometry.boundingBox.min.x;
			var dY = popObj.geometry.boundingBox.max.y - popObj.geometry.boundingBox.min.y;
			popObj.scale.set( size.x / dX, size.y / dY, 1 );	 				

			assignTextureAllChildrens(popObj, json.components);		
			obj.add( popObj );			
		}
		else 
		{
			obj.userData.door.type = 'DoorEmpty';			
			obj.userData.door.popObj = null;
		}		
	}
	
	if(obj) { (obj.userData.door.type === 'DoorPattern') ? UI.show('doorPattern') : UI.hide('doorPattern'); }
	
	// если это загрузка (из xml), то вставляем дверь 
	if(cdm.id) 
	{ 
		if(obj.userData.door.type == 'DoorSimply' || obj.userData.door.type == 'DoorPattern')
		{
			if(cdm.open_type) obj.userData.door.open_type = cdm.open_type;
		}
		
		if(cdm.status)
		{
			if(cdm.status == 'load')
			{					
				var middleY = (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2;
				cdm.pos.y += middleY;  
			}
		}
		
		addWD( obj, cdm.wall, cdm.pos ); 
	}		  	 
 	
}





// создаем один объект из нескольких дочерних (объединяем)
function createCopyPopForm(objPop)
{
	var objPop = objPop.clone(); 
	var childrens = getAllChildrenObj(objPop, []);
	
	var modelGeometry = new THREE.Geometry();
	
	if(objPop.geometry)
	{
		var geometry = new THREE.Geometry().fromBufferGeometry( objPop.geometry );
		modelGeometry.merge(geometry);		
	}
	
	for ( var i = 0; i < childrens.length; i++ )
	{
		if(childrens[i].obj.parent)
		{
			childrens[i].obj.updateMatrixWorld();
			childrens[i].obj.applyMatrix(childrens[i].obj.parent.matrixWorld); 					
		}
		var geometry = new THREE.Geometry().fromBufferGeometry( childrens[i].obj.geometry );
		
		modelGeometry.merge(geometry, childrens[i].obj.matrix);
	}

	bufGeometry = new THREE.BufferGeometry().fromGeometry(modelGeometry);
	//modelGeometry = new THREE.Geometry().fromBufferGeometry( modelGeometry );

	//var material = new THREE.MeshLambertMaterial({ color: colWin, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
	//var material = new THREE.MeshLambertMaterial( { color : 0xffff00, transparent: true, opacity: 0.6, side: THREE.BackSide } );
	var material = new THREE.MeshLambertMaterial( { color : 0xffff00, transparent: true, opacity: 0.0, side: THREE.DoubleSide } ); 
	
	var obj = new THREE.Mesh( bufGeometry, material );
	
	scene.add(obj);   

	return obj;
}





// назначаем текстуру всем объектам входящие в родительский (объект загружается из xml)
function assignTextureAllChildrensLoadPop(obj, mat)
{
	var childrens = getAllChildrenObj(obj, []);  

	var containerID = [];
	for ( var i = 0; i < mat.length; i++ ) containerID[i] = mat[i].containerID;	
	
	for ( var i = 0; i < childrens.length; i++ ) childrens[i].name = childrens[i].name.replace(/_CRUNCHED/i, '');
	for ( var i = 0; i < mat.length; i++ ) mat[i].containerID = mat[i].containerID.replace(/_CRUNCHED/i, '');
	
	
	for ( var i = 0; i < childrens.length; i++ )
	{		
		var length = 0;
		var index = 0;
		
		for ( var i2 = 0; i2 < mat.length; i2++ )
		{			
			if(new RegExp( mat[i2].containerID ,'i').test( childrens[i].name ))
			{		
				if(length < mat[i2].containerID.length) { length = mat[i2].containerID.length; index = i2; }
			}
		}
		
		if(length > 0) 
		{  
			loadPopObj_1({ obj: childrens[i].obj, lotid: mat[index].lotid, start : 'load', containerID : containerID[index], rgb : mat[index].rgb, scale : mat[index].scale });
		}
	}
}





// назначаем текстуру всем объектам входящие в родительский (объект из сцены)
function assignTextureAllChildrens(obj, components)
{
	var childrens = getAllChildrenObj(obj, []);
	
	var containerID = [];
	for ( var i = 0; i < components.length; i++ ) containerID[i] = components[i].alias;		
	
	for ( var i = 0; i < childrens.length; i++ ) childrens[i].name = childrens[i].name.replace(/_CRUNCHED/i, '');
	for ( var i = 0; i < components.length; i++ ) components[i].alias = components[i].alias.replace(/_CRUNCHED/i, '');
	
	
	for ( var i = 0; i < childrens.length; i++ )
	{		
		var length = 0;
		var index = 0;
		
		for ( var i2 = 0; i2 < components.length; i2++ )
		{			
			if(new RegExp( components[i2].alias ,'i').test( childrens[i].name ))
			{			
				if(length < components[i2].alias.length) { length = components[i2].alias.length; index = i2; }
			}				
		}
		
		if(length > 0) 
		{  
			if(components[index].lots) 
			{
				loadPopObj_1({ obj: childrens[i].obj, lotid: components[index].lots[0], start : 'new', containerID : containerID[index] });
			} 
		}
	}
}



// находим все Children у ПОП объекта (рекурсия дерево)
function getAllChildrenObj(obj, arr)
{
	if(obj.geometry) arr[arr.length] = { obj : obj, name : obj.geometry.name };
	
	var arr2 = [];
	
	for ( var i = 0; i < obj.children.length; i++ )
	{
		var arr3 = getAllChildrenObj(obj.children[i], arr);
		
		if(obj.children.length - 1 == i) { return arr3.concat( arr2 ); }
		else { arr3.concat( arr2 ); }
	}
	
	return arr;
}



// загрузка материала 
function loadPopMaterial(cdm, json) 
{
	var obj = cdm.obj; 
	var lotid = json.id;  
	var scale = json.size; 
	var mat_color = json.color; 
	var filters = json.filters; 
	var preview = json.preview; 
	var caption = json.caption; 
	var catalog = cdm.catalog;
	
	var color = null;
	
	if (cdm.start == 'new') 
	{ 
		color = (json.sourceImageURL) ? new THREE.Color( 0xffffff ) : new THREE.Color('#'+json.color);		
		if(obj.userData.tag == 'wall' || obj.userData.tag == 'room') { getInfoEvent22( cdm, { id : lotid, size : scale, color : color } ) } 
	}
	else 
	{ 
		if(cdm.rgb) color = new THREE.Color('rgb('+cdm.rgb.r+'%,'+cdm.rgb.g+'%,'+cdm.rgb.b+'%)');
		if(cdm.scale) scale = cdm.scale;
	}	
	
	
	if(obj.userData.tag == 'wall') 
	{ 
		var material = obj.material[cdm.index]; 
	}
	else 
	{ 
		var material = obj.material; 
	}


	// загрузка текстуры
	if(json.sourceImageURL) 
	{ 
		new THREE.TextureLoader().load(json.sourceImageURL, function ( image ) 
		{ 
			var inf = {obj : obj, image : image, scale : scale};
			
			if(cdm.offset) { inf.offset = cdm.offset; } 
			if(cdm.rot) { inf.rot = cdm.rot; }
			if(obj.userData.tag == 'wall') { inf.index = cdm.index; }
			 
			setMultyMaterialSide3(inf); 
			material.color = color; 
		}); 
	}
	else 
	{ 
		material.map = null; 
		material.color = color; 
		material.needsUpdate = true; 
	}

	
	if(obj.userData.tag != 'wall')
	{			 		 
		obj.pr_containerID = (cdm.containerID) ? cdm.containerID : null;
		obj.pr_matScale = scale;  
		obj.pr_filters = filters;
		obj.pr_preview = preview;
		obj.pr_catalog = Object.assign({}, catalog);
	}
	
	var inf = { lotid : lotid, containerID : cdm.containerID, caption : caption, color : color, scale : scale, filters : filters, preview : preview, catalog : catalog };
	
	if(obj.userData.tag == 'wall') { obj.userData.material[cdm.index] = inf; }
	else { obj.userData.material = inf; }
		

	resetMenuUI();
}



 
// находим по id , ссылку на объект, получаем из ссылки json файл, распарсеваем и создаем объект
function loadPopObj_XML_1( cdm )   
{			
	var arrLotid = cdm.arrLotid;
	
	var arr2 = []; 
	for ( var i = 0; i < arrLotid.length; i++ ) { if(isNumeric(arrLotid[i])) { arr2[arr2.length] = arrLotid[i]; } } 
	arrLotid = arr2; 

	var arrND = [];
	
	if(pool_pop.length > 0)
	{
		for ( var i = 0; i < arrLotid.length; i++ ) 
		{
			for ( var i2 = 0; i2 < pool_pop.length; i2++ )
			{ 
				if(arrLotid[i] == pool_pop[i2].id) { arrND[arrND.length] = i; break; }
			}
		}
	}

	for ( var i = arrND.length - 1; i >= 0; i-- ) { arrLotid.splice(arrND[i], 1); }
	
	var list = '';
	for ( var i = 0; i < arrLotid.length; i++ ) { list += '&id['+i+']=' + arrLotid[i]; }	
	
	if(arrLotid.length > 0)
	{  
		$.ajax
		({
			url: 'https://catalog.planoplan.com/api/v2/search/?keys[0]='+param_ugol.key+'&disregard_price=1&disregard_structure=1'+list+'&lang=ru',
			type: 'GET', 
			dataType: 'json',
			success: function(json)
			{ 				
				json = json.items;  				
				var pool_xml = [];
				
				//console.log(arrLotid, json.length, formatSizeUnits(roughSizeOfObject(json)));
				
				var url = [];
				for ( var i = 0; i < json.length; i++ ) 
				{  			
					json[i].preview = (json[i].preview == '') ? '' : 'https:'+json[i].preview;  														
					if(json[i].sourceImageURL) { json[i].sourceImageURL = 'https:'+json[i].sourceImageURL; }
					if((/,/i).test( json[i].filters )) { json[i].filters = json[i].filters.split(','); }
					else { var f = []; f[0] = parseFloat(json[i].filters); json[i].filters = f; }
					
					if((/,/i).test( json[i].size )) { var size = json[i].size.split(','); json[i].size = new THREE.Vector3(parseFloat(size[0]),parseFloat(size[1]),parseFloat(size[2])); }
					
					if(json[i].type == 'material') { json[i].size.x = 1/json[i].size.x; json[i].size.y = 1/json[i].size.y; };
			
					var n = pool_xml.length;
					pool_xml[n] = json[i];
					if(pool_xml[n].fileJson) { if(pool_xml[n].fileJson != '') { url[url.length] = n; } }
				}
				
				if(url.length > 0)
				{ 
					getJsonModel_A2(url, 0, arrLotid, cdm, pool_xml);
				}
				else
				{ 
					loadPopObj_XML_2(arrLotid, cdm, pool_xml);
				}				
			}, 
			error: function(json)
			{
				console.log('error', 'https://catalog.planoplan.com/api/v2/search/?keys[0]='+param_ugol.key+'&disregard_price=1&disregard_structure=1'+list+'&lang=ru');
			}
		});		
		
	}	
	else
	{ 
		if(cdm.mess)
		{
			if(cdm.mess == 'loadXML') { loadFilePL(cdm.jsonXML); }
			else if(cdm.mess == 'DoorPattern') { parseJsonDoorCompile2( cdm ); }
		}
		
	}
}


function getJsonModel_A2(url, num, arrLotid, cdm, pool_xml)
{	

	var n = url[num];
	var count = url.length;
	
	$.ajax
	({
		url: pool_xml[n].fileJson,
		type: 'GET',
		dataType: 'json',
		success: function(json) 
		{ 
			num += 1; 
			pool_xml[n].fileJson = json; 
			if(count == num) { loadPopObj_XML_2(arrLotid, cdm, pool_xml) }
			else { getJsonModel_A2(url, num, arrLotid, cdm, pool_xml); }			
		},		
		error: function(json) {  }		
	});	
}




// после того, как получили все лоты, ищем в этих лотах другие лоты (в компонентах)
// если есть дочерние лоты, добавляем их в массив, который опять будет отправлен для получения json для каждого лота
function loadPopObj_XML_2(arrLotid, cdm, pool_xml)
{	

	// arrLotid - все лоты, которые были добавлены в запрос (есть повторающиеся, есть которые будут пустые)
	// pool_xml - лоты, которые получили после обращения к серверу (нету повторов, нету пустых лотов)
	// находим лоты которые не попали (были пустые) в pool_xml и заносим их в виде { id : id, empty : true } 
	// нужно чтобы в будущем при желании загрузить этот лот, не было обращения к серверу, а просто пропускал этот лот
	
	for ( var i = 0; i < arrLotid.length; i++ ) 
	{
		var exist = false;
		
		for ( var i2 = 0; i2 < pool_xml.length; i2++ )
		{ 
			if(arrLotid[i] == pool_xml[i2].id) { exist = true; break; }
		}
		
		if(!exist) { pool_xml[pool_xml.length] = { id : arrLotid[i], empty : true }; }
	}
	
	// добавляем обновленный pool_xml в общий массив pool_pop
	for ( var i = 0; i < pool_xml.length; i++ ) { pool_pop[pool_pop.length] = pool_xml[i]; }
	
	
	// находим в массиве лотах дочерние лоты и заносим в массив новых лот
	var arrLotid = [];
	for ( var i = 0; i < pool_xml.length; i++ )
	{
		if(pool_xml[i].components)
		{
			for ( var i2 = 0; i2 < pool_xml[i].components.length; i2++ )
			{
				if(!pool_xml[i].components[i2].lots) continue;
				arrLotid[arrLotid.length] = pool_xml[i].components[i2].lots[0];
			}
		}
	}
	
	// если есть дочерние лоты, то отправляем их на получение json 
	// иначе заканчивем загрузку лотов с сервера
	if(arrLotid.length > 0) 
	{ 
		cdm.arrLotid = arrLotid;
		loadPopObj_XML_1(cdm); 
	}	
	else 
	{ 
		if(cdm.mess)
		{
			if(cdm.mess == 'loadXML') { loadFilePL(cdm.jsonXML); }
			else if(cdm.mess == 'DoorPattern') { parseJsonDoorCompile2( cdm ); }
		}
	} 

}


