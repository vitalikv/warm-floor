


function resetMenuUI()
{
	menuUI = { open: false, type: '', select: null };
}



function loadUrl(href) 
{
	var url = new URL(href); 
	var url = url.searchParams.get('file');  
	if(url) { loadFile(url); }
}


function resetScene() 
{	
	
	disposeHierchy(scene, disposeNode);
	
	for ( var i = 0; i < obj_line.length; i++ )
	{ 
		scene.remove(obj_line[i].label[0]); 
		scene.remove(obj_line[i].label[1]);
		if(obj_line[i].userData.wall.outline) { scene.remove(obj_line[i].userData.wall.outline); }
		scene.remove(obj_line[i]); 
	}
	for ( var i = 0; i < obj_point.length; i++ ){ scene.remove(obj_point[i]); }	
	for ( var i = 0; i < arr_window.length; i++ ){ scene.remove(arr_window[i]); }
	for ( var i = 0; i < arr_door.length; i++ ){ scene.remove(arr_door[i]); }	
	for ( var i = 0; i < arr_obj.length; i++ ) { scene.remove(arr_obj[i]); }
	
	for ( var i = 0; i < room.length; i++ )
	{
		if(room[i].userData.room.plinth.o) { for ( var i2 = 0; i2 < room[i].userData.room.plinth.obj.length; i2++ ) { scene.remove(room[i].userData.room.plinth.obj[i2]); } }
		
		scene.remove(room[i].label); 
		if(room[i].userData.room.outline) { scene.remove(room[i].userData.room.outline); }
		scene.remove(room[i]); 
		scene.remove( ceiling[i] );	
	}	
	
	wallVisible = [];
	obj_point = [];
	obj_line = [];
	arr_window = [];
	arr_door = [];
	arr_obj = [];
	room = [];
	ceiling = [];
	arrWallFront = [];
	
	param_usU = [];
	param_usR = [];
	leng_ur = -1;
	ndsf = 1;
	countId = 2;
	levelFloor = 1;
	projName = 'Новый проект';
	projVersion = '1';
	
	d_tool.visible = false;
	
	pointGrid.visible = true;
	
	menuUI = { open : false, type : '', select : null };
	
	camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true };
	
	clickO = resetVarParam(); 
	
	getConsoleRendererInfo()
}



// удалем из GPU объекты
function disposeHierchy(node, callback) 
{
	for (var i = node.children.length - 1; i >= 0; i--) 
	{
		if(node.children[i].userData.tag)
		{
			var tag = node.children[i].userData.tag;
			
			if(tag == 'point' || tag == 'wall' || tag == 'window' || tag == 'door' || tag == 'room' || tag == 'ceiling' || tag == 'obj')
			{
				var child = node.children[i];

				disposeHierchy(child, callback);
				callback(child);			
			}			
		}			
	}
}


function disposeNode(node) 
{
        if (node instanceof THREE.Mesh) 
		{
            if (node.geometry) { node.geometry.dispose(); }
			
            if (node.material) 
			{
                var materialArray;
                if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) 
				{
                    materialArray = node.material.materials;
                }
                else if(node.material instanceof Array) 
				{
                    materialArray = node.material;
                }
                
				if(materialArray) 
				{
                    materialArray.forEach(function (mtrl, idx) 
					{
                        if (mtrl.map) mtrl.map.dispose();
                        if (mtrl.lightMap) mtrl.lightMap.dispose();
                        if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                        if (mtrl.normalMap) mtrl.normalMap.dispose();
                        if (mtrl.specularMap) mtrl.specularMap.dispose();
                        if (mtrl.envMap) mtrl.envMap.dispose();
                        mtrl.dispose();
                    });
                }
                else 
				{
                    if (node.material.map) node.material.map.dispose();
                    if (node.material.lightMap) node.material.lightMap.dispose();
                    if (node.material.bumpMap) node.material.bumpMap.dispose();
                    if (node.material.normalMap) node.material.normalMap.dispose();
                    if (node.material.specularMap) node.material.specularMap.dispose();
                    if (node.material.envMap) node.material.envMap.dispose();
                    node.material.dispose();
                }
            }
        }
}



// сохраняем окна/двери
function saveWindows(wall)
{
	var windows = [], doors = [];
	
	var arrO = wall.userData.wall.arrO;

	var o = [[], []];

	for ( var i2 = 0; i2 < arrO.length; i2++ ) 
	{
		if(arrO[i2].userData.tag == 'window') { o[0][o[0].length] = arrO[i2]; }
		else if(arrO[i2].userData.tag == 'door') { o[1][o[1].length] = arrO[i2]; }		
	}

	var p = wall.userData.wall.p;

	for ( var i = 0; i < o.length; i++ )
	{
		for ( var i2 = 0; i2 < o[i].length; i2++ )
		{ 
			var wd = o[i][i2];
			var v = wd.geometry.vertices;
			var f = wd.userData.door.form.v;
		
			var v7 = new THREE.Vector3().subVectors( v[f.maxX[0]], v[f.minX[0]] ).divideScalar ( 2 );		
			var v7 = wd.localToWorld( v[f.minX[0]].clone().add(v7) );
			var dir1 = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize();
			var dir2 = new THREE.Vector3().subVectors( v7, p[0].position );
			qt1 = quaternionDirection(dir1);
			var x = localTransformPoint(dir2, qt1).z; 
			x = x / p[1].position.distanceTo( p[0].position );
			
			var y = wall.worldToLocal( wd.localToWorld(v[f.minY[0]].clone()) ).y;

			var arr = {};
			
			arr.id = wd.userData.id;	// id
			arr.lotid  = wd.userData.door.lotid;		// lotid  
			arr.width = Math.round((v[f.maxX[0]].x - v[f.minX[0]].x) * 100) / 100;	// width
			arr.height = Math.round((v[f.maxY[0]].y - v[f.minY[0]].y) * 100) / 100;	// height		
			arr.startPointDist = Math.round(x * 100) / 100;				// pos_start
			arr.over_floor = Math.round(y * 100) / 100;				// over_floor
			if(wd.userData.door.open_type) { arr.open_type = wd.userData.door.open_type; }	// open_type	
			if(wd.userData.tag == 'door') { arr.doState = 'false'; }							// doState	
			arr.options = '';
			
			if(wd.userData.door.type == 'DoorPattern')
			{
				var handle = wd.userData.door.compilation.handle[0];
				
				arr.options = 's_re' + handle.userData.dumName + ':' + handle.userData.lotid;			
			}
			
			if(wd.userData.tag == 'window') { windows[windows.length] = arr; }
			else if(wd.userData.tag == 'door') { doors[doors.length] = arr; }			
		}		
	}

	return { windows : windows, doors : doors };
}


function saveFile(cdm) 
{ 
	var json = JSON.stringify( getJsonGeometry() );
	
	$.ajax
	({
		url: 'saveJson.php',
		type: 'POST',
		data: {myarray: json},
		dataType: 'json',
		success: function(json)
		{ 			
			console.log(json); 
		},
		error: function(json){ console.log(json);  }
	});	
	
	if(1==2)
	{
		var csv = JSON.stringify( txt );	
		var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);	
		
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.href = csvData;
		link.target = '_blank';
		link.download = 'filename.json';
		link.click();			
	}
}




function getJsonGeometry()
{
	var json = 
	{
		floors : 
		[
			{ 
				points : [],
				walls : [],	
				furn : [],
				rooms : [],
				height : height_wall,
				levelFloor : 1,
				projName : 'Новый проект',
				version : '1'
			}			
		]
	};	
	
	var points = [];
	var walls = [];
	var rooms = [];
	var furn = [];
	
	for ( var i = 0; i < obj_line.length; i++ )
	{	
		var wall = obj_line[i];
		
		var p = wall.userData.wall.p;
		
		for ( var i2 = 0; i2 < p.length; i2++ )  
		{
			var flag = true;
			for ( var i3 = 0; i3 < points.length; i3++ ) { if(p[i2].userData.id == points[i3].id){ flag = false; break; } }
			
			if(flag) 
			{  
				var m = points.length;
				points[m] = {};
				points[m].id = p[i2].userData.id;
				points[m].pos = new THREE.Vector3(p[i2].position.x, p[i2].position.y, -p[i2].position.z); 
			}
		}
	}	
	
	
	
	for ( var i = 0; i < obj_line.length; i++ )
	{ 
		var p = obj_line[i].userData.wall.p;
		
		walls[i] = { }; 
		
		walls[i].id = obj_line[i].userData.id;
		walls[i].pointStart = p[0].userData.id;
		walls[i].pointEnd = p[1].userData.id;
		walls[i].width = obj_line[i].userData.wall.width; 
		walls[i].height = obj_line[i].userData.wall.height_1; 


		var x1 = p[1].position.z - p[0].position.z;
		var z1 = p[0].position.x - p[1].position.x;	
		var dir = new THREE.Vector3(z1, 0, -x1).normalize();						// перпендикуляр стены  (перевернуты x и y)
		dir.multiplyScalar( obj_line[i].userData.wall.offsetZ );
		walls[i].startShift = new THREE.Vector3(dir.z, 0, dir.x);
				
		var wd = saveWindows(obj_line[i]);		
		walls[i].windows = wd.windows;
		walls[i].doors = wd.doors;
		

		walls[i].colors = [];
		var mat = obj_line[i].userData.material;
		var arr = [{containerID : 'wall3d_'+obj_line[i].userData.id+'_p2', num : 1}, {containerID : 'wall3d_'+obj_line[i].userData.id+'_p1', num : 2}];				
		
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			walls[i].colors[i2] = {  };		
			walls[i].colors[i2].containerID = arr[i2].containerID;
			walls[i].colors[i2].lot = { id : mat[arr[i2].num].lotid };

			var color = { r : Number(mat[arr[i2].num].color.r), g : Number(mat[arr[i2].num].color.g), b : Number(mat[arr[i2].num].color.b), a : 1 };
			
			walls[i].colors[i2].matMod = { colorsets : [{ color : color }] };

			walls[i].colors[i2].matMod.texScal = mat[arr[i2].num].scale;
			
			walls[i].colors[i2].matMod.mapingRotate = 0; 
			
			var map = obj_line[i].material[arr[i2].num].map;
			if(map) 
			{
				walls[i].colors[i2].matMod.texOffset = map.offset;
				walls[i].colors[i2].matMod.mapingRotate = THREE.Math.radToDeg( map.rotation ); 				 
			}
		}		
	}	


	for ( var i = 0; i < room.length; i++ )
	{
		rooms[i] = { pointid : [] };
		
		rooms[i].id = room[i].userData.id;  
		rooms[i].name = 'Room';
		rooms[i].roomSType = detectNameRoom('textToId', room[i].userData.room.roomType);		
		
		rooms[i].pointid = [];
		var s = 0; for ( var i2 = room[i].p.length - 1; i2 >= 1; i2-- ) { rooms[i].pointid[s] = room[i].p[i2].userData.id; s++; }
		
		if(room[i].userData.room.plinth.o) { rooms[i].plinthLot = { id : room[i].userData.room.plinth.lotid }; }    
		
		
		rooms[i].colors = [];
		var arr = [{containerID : 'floor', obj : room[i]}, {containerID : 'ceil', obj : ceiling[i]}];				
		
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			rooms[i].colors[i2] = {  };		
			rooms[i].colors[i2].containerID = arr[i2].containerID;
			rooms[i].colors[i2].lot = { id : arr[i2].obj.userData.material.lotid };

			var color = { r : Number(arr[i2].obj.material.color.r), g : Number(arr[i2].obj.material.color.g), b : Number(arr[i2].obj.material.color.b), a : 1 };
			
			rooms[i].colors[i2].matMod = { colorsets : [{ color : color }] };

			rooms[i].colors[i2].matMod.texScal = arr[i2].obj.userData.material.scale;

			rooms[i].colors[i2].matMod.mapingRotate = 0; 
			
			var map = arr[i2].obj.material.map;
			if(map) 
			{
				rooms[i].colors[i2].matMod.texOffset = map.offset;
				rooms[i].colors[i2].matMod.mapingRotate = THREE.Math.radToDeg( map.rotation ); 
			}			
		}	
	}
	

	
	json.floors[0].points = points;
	json.floors[0].walls = walls;
	json.floors[0].rooms = rooms;
	json.floors[0].furn = furn;
	
	return json;
}






function loadFile(file) 
{
	$.ajax
	({
		url: '/t/fileJson.json',
		type: 'POST',
		dataType: 'json',
		success: function(json)
		{ 
			json.code_server = 200;
			loadTotalLotid(json); 	// загрузка json
		},
	});	
}


function loadTotalLotid(arr)
{
	resetScene();	
		
	UI.setView('2D');	// переключаемся в 2D
	
	loadFilePL(arr);
}




function loadFilePL(arr) 
{                 		
	if(!arr) return;
	
	console.log(arr);
	//console.log(pool_pop);
	
	
	levelFloor = arr.floors[0].id;
	//height_wall = arr.floors[0].height;
	projName = arr.floors[0].name;
	projVersion = arr.version;
		
	var point = arr.floors[0].points;
	var walls = arr.floors[0].walls;
	var rooms = arr.floors[0].rooms;
	var obj_pop = [];
	

	//if(height_wall < 0.1) { height_wall = 3; }	
			
	var wall = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{
		wall[i] = { };
		
		
		wall[i].id = walls[i].id;		
		wall[i].width = walls[i].width;
		wall[i].offsetV = new THREE.Vector3(walls[i].startShift.z, 0, walls[i].startShift.x);   		
		wall[i].height = walls[i].height;			
		
		wall[i].points = [];
		wall[i].points[0] = { id : walls[i].pointStart, pos : new THREE.Vector3() };
		wall[i].points[1] = { id : walls[i].pointEnd, pos : new THREE.Vector3() };
								
		for ( var i2 = 0; i2 < point.length; i2++ ) 			 
		{  	
			if(wall[i].points[0].id == point[i2].id) { wall[i].points[0].pos = new THREE.Vector3(point[i2].pos.x, 0, -point[i2].pos.z); }
			if(wall[i].points[1].id == point[i2].id) { wall[i].points[1].pos = new THREE.Vector3(point[i2].pos.x, 0, -point[i2].pos.z); }
		}
		
		
		wall[i].material = [];
		wall[i].material[0] = { lotid : 4954, color : {r : 93, g : 87, b : 83 }, scale : new THREE.Vector2(1,1) };
		wall[i].material[1] = { lotid : 4954, color : {r : 93, g : 87, b : 83 }, scale : new THREE.Vector2(1,1) };
		

		var arrO = [];
		
		if(walls[i].doors) for ( var i2 = 0; i2 < walls[i].doors.length; i2++ ) { arrO[arrO.length] = walls[i].doors[i2]; arrO[arrO.length - 1].type = 'door'; }
		if(walls[i].windows) for ( var i2 = 0; i2 < walls[i].windows.length; i2++ ) { arrO[arrO.length] = walls[i].windows[i2]; arrO[arrO.length - 1].type = 'window'; }
		
		wall[i].arrO = [];
		
		
		for ( var i2 = 0; i2 < arrO.length; i2++ )
		{					
			wall[i].arrO[i2] = {  }
			
			wall[i].arrO[i2].id = arrO[i2].id;
			wall[i].arrO[i2].lotid = arrO[i2].lotid;
			wall[i].arrO[i2].pos = new THREE.Vector3(Math.round(arrO[i2].startPointDist * 100) / 100, Math.round(arrO[i2].over_floor * 100) / 100, 0);
			wall[i].arrO[i2].size = new THREE.Vector2(Math.round(arrO[i2].width * 100) / 100, Math.round(arrO[i2].height * 100) / 100);
			if(arrO[i2].open_type) { wall[i].arrO[i2].open = arrO[i2].open_type; }
			wall[i].arrO[i2].type = arrO[i2].type;
			
			if(arrO[i2].options){ wall[i].arrO[i2].options = arrO[i2].options; }
		} 	
	}
	


	//-------------
	 
	// удаляем стены, которые пересекаются с друг другом (стена в стене)
	for ( var i = wall.length - 1; i >= 0; i-- )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(wall[i] == wall[i2]) continue;			
			
			var count = 0;
			var pos1 = [];
			var pos2 = [];
			if(wall[i].points[0].id == wall[i2].points[0].id) { count++; pos1 = [wall[i].points[0].pos, wall[i].points[1].pos]; pos2 = [wall[i2].points[0].pos, wall[i2].points[1].pos]; }
			if(wall[i].points[0].id == wall[i2].points[1].id) { count++; pos1 = [wall[i].points[0].pos, wall[i].points[1].pos]; pos2 = [wall[i2].points[1].pos, wall[i2].points[0].pos]; }
			if(wall[i].points[1].id == wall[i2].points[0].id) { count++; pos1 = [wall[i].points[1].pos, wall[i].points[0].pos]; pos2 = [wall[i2].points[0].pos, wall[i2].points[1].pos]; }
			if(wall[i].points[1].id == wall[i2].points[1].id) { count++; pos1 = [wall[i].points[1].pos, wall[i].points[0].pos]; pos2 = [wall[i2].points[1].pos, wall[i2].points[0].pos]; }
			
			if(count == 2) { wall.splice(i, 1); }
			else if(count == 1)
			{
				var dir1 = new THREE.Vector3().subVectors( pos1[0], pos1[1] ).normalize();
				var dir2 = new THREE.Vector3().subVectors( pos2[0], pos2[1] ).normalize();
				
				if(!comparePos(dir1, dir2)) { continue; }
				
				var d1 = pos1[0].distanceTo( pos1[1] );
				var d2 = pos2[0].distanceTo( pos2[1] );
				
				if(d1 > d2) { wall.splice(i, 1); } 
			}
		}
	}
	
	// создаем и устанавливаем все стены (без окон/дверей)
	var arrW = [];
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var point1 = findObjFromId( 'point', wall[i].points[0].id );
		var point2 = findObjFromId( 'point', wall[i].points[1].id );	
		
		if(point1 == null) { point1 = createPoint( wall[i].points[0].pos, wall[i].points[0].id ); }
		if(point2 == null) { point2 = createPoint( wall[i].points[1].pos, wall[i].points[1].id ); }
	

		var dir = new THREE.Vector3().subVectors( point2.position, point1.position ).normalize();
		var offsetZ = localTransformPoint(wall[i].offsetV, quaternionDirection(dir)).z;
		var inf = { id : wall[i].id, offsetZ : -offsetZ, height : wall[i].height, material : wall[i].material };
		var obj = createOneWall3( point1, point2, wall[i].width, inf ); 		
		
		obj.updateMatrixWorld();
		arrW[arrW.length] = obj;
	}	
	 
	
	for ( var i = 0; i < obj_point.length; i++ ) { upLineYY_2(obj_point[i], obj_point[i].p, obj_point[i].w, obj_point[i].start); }
	
	upLabelPlan_1(obj_line);	// размеры стен
	// создаем и устанавливаем все стены (без окон/дверей)

	

	detectRoomZone(nameRoomDef);
	

	
	// устанавливаем окна/двери
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var obj = arrW[i];
		
		var point1 = obj.userData.wall.p[0];
		var point2 = obj.userData.wall.p[1];		
		
		for ( var i2 = 0; i2 < wall[i].arrO.length; i2++ )
		{			
			wall[i].arrO[i2].pos.x = point1.position.distanceTo( point2.position ) * wall[i].arrO[i2].pos.x;
			
			var intP = obj.localToWorld( wall[i].arrO[i2].pos.clone() );  						

			// если не смогли загрузить дверь, то загружаем проем
			var flag = true;
			
			for ( var i3 = 0; i3 < pool_pop.length; i3++ ) { if(pool_pop[i3].id == wall[i].arrO[i2].lotid) { if(!pool_pop[i3].empty) { flag = false; break; } } } 
			 
			if(flag) 
			{ 
				if(wall[i].arrO[i2].type == 'door') { wall[i].arrO[i2].lotid = 575; delete wall[i].arrO[i2].open; } 
				else if(wall[i].arrO[i2].type == 'window') { wall[i].arrO[i2].lotid = 8747; }
			}

			var inf = { status : 'load', id : wall[i].arrO[i2].id, lotid: wall[i].arrO[i2].lotid, pos : intP, wall : obj };	 		
			if(wall[i].arrO[i2].size) { inf.size = wall[i].arrO[i2].size; }
			if(wall[i].arrO[i2].open) { inf.open_type = wall[i].arrO[i2].open; } 
			if(wall[i].arrO[i2].options) { inf.options = wall[i].arrO[i2].options; }				
						 
			createEmptyFormWD(inf);
		}		
	}
	// устанавливаем окна/двери
	
			


	
	// восстанавливаем countId
	for ( var i = 0; i < scene.children.length; i++ ) 
	{ 
		if(scene.children[i].userData.id) 
		{ 
			var index = parseInt(scene.children[i].userData.id);
			if(index > countId) { countId = index; }
		} 
	}
	countId++; 
	// восстанавливаем countId
	
	
	upLabelPlan_1(obj_line);
	
	centerCamera2D();
	
	emitAction('load-project-end');
	emitAction('stop-fake-loading');
	renderCamera();
	
	//getSkeleton_1(room); 
}



 


// конверитруем типы в текст комнат
function detectNameRoom(cdm, value)
{
	var list = roomTypes;		
	
	if(cdm == 'idToText')
	{
		if(isNumeric(value)) 		// если число
		{
			for ( var i = 0; i < list.length; i++ ) { if(value == list[i].id) { return list[i].caption; } }
		}
		else
		{
			for ( var i = 0; i < list.length; i++ ) { if(value == list[i].alias) { return list[i].caption; } }		
		}		
	}
	else if(cdm == 'textToId')
	{
		for ( var i = 0; i < list.length; i++ ) { if(value == list[i].caption) { return list[i].alias; } }
	}
	
	return 'null';
}





