

var pool_pop = [];




// скачиваем с сервера json файл, добавляем его в общий массив/библиотеку
// отправляем json в обработку, чтобы добавить на сцену
function loadPopObj_1(cdm) 
{			
	if(!Array.isArray(cdm)) { var arr = []; arr[0] = cdm; cdm = arr; }	
	
	if(!isNumeric(cdm[0].lotid)) { return; } // если не число, то отбой	
	
	
		
	
	
	$.ajax
	({
		url: 'https://catalog.planoplan.com/api/v2/search/?keys[0]='+param_ugol.key+'&disregard_price=1&disregard_structure=1&id[0]='+cdm[0].lotid+'&lang=ru',
		type: 'GET', 
		dataType: 'json',
		success: function(json)
		{ 				 

			
			json = json.items[0];	
			
			createEmptyFormWD(json, cdm[0]);	// вставка формы двери	
			

			
							
		}, 
		error: function(json)
		{
			console.log('error', cdm[0].lotid);
		}
	});		

}



// создаем форму окна/двери/балкона при загрузки объекта (вставка формы двери в сцену)
function createEmptyFormWD(cdm)
{  
	var json = {};
	(cdm.lotid == 8747) ? json.lotGroup = 'Windows' : json.lotGroup = 'Doors';
	 
	if(json.lotGroup == 'Windows' || json.lotGroup == 'Doors')
	{
		var form = { type : '' , v : new THREE.Vector2( 0, 0 ) };  
		
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

		
		var size = (json.lotGroup == 'Windows') ? new THREE.Vector2( 1.3, 1.3 ) : new THREE.Vector2( 1, 2 );
		
		
		var obj = new THREE.Mesh( createGeometryWD(size.x, size.y, 0.2), material );
		var arr = { minX : [0,1,6,7], maxX : [2,3,4,5], minY : [0,3,4,7], maxY : [1,2,5,6], minZ : [4,5,6,7], maxZ : [0,1,2,3] };
		form = { type : 'box' , v : arr };
		
		
		var v = obj.geometry.vertices;
		var width = Math.round((v[arr.maxZ[0]].z - v[arr.minZ[0]].z) * 100) / 100;
		
		
		obj.userData.tag = 'free_dw';
		obj.userData.door = {};
		obj.userData.door.size = new THREE.Vector3( size.x, size.y, 0.2 );
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

		loaderWD(cdm, json);
	}
}





function loaderWD(cdm, json)
{
	
	var obj = cdm.emptyBox;

	obj.userData.door.type = (json.lotGroup == 'Windows') ? 'WindowSimply' : 'DoorEmpty';
	
	obj.caption = '';
	obj.pr_preview = '';	
	obj.userData.door.popObj = null;
	
	// если это загрузка (из xml), то вставляем дверь 
	if(cdm.id) 
	{ 
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







