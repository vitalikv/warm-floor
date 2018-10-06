




// id_room - id комнаты из xml
// clickO.obj.userData.id - id нашей комнаты к которой будет приминен дизайн
function getDesignFile(file, id_room) 
{
	select_room = clickO.obj; 
	
	for ( var i = 0; i < room.length; i++ ) { if(room[i].userData.id == select_room.userData.id) { var roomID = i; break; } }
	
	$.ajax
	({
		url: 'convertArr.php',
		type: 'POST',
		data: { file: file },
		dataType: 'json',
		success: function(json){ getDesignJson(json, id_room, roomID); },
		error: function() {  }
	});	
}


// удаляем объекты/текстуры в комнате
function resetStyleRoom(id)
{  
	// плинтуса
	if(room[id].userData.room.plinth.o) 
	{ 
		for ( var i = 0; i < room[id].userData.room.plinth.obj.length; i++ ) { scene.remove(room[id].userData.room.plinth.obj[i]); }
		room[id].userData.room.plinth = { o : false, lotid : 0, v : [], mat : null, obj : [] }; 
	}

	// стены
	for ( var i = 0; i < room[id].w.length; i++ )
	{ 				
		deleteTextureWall( room[id].w[i], (room[id].s[i] == 0) ? 2 : 1 );
	}
	
	
	// пол/потолок
	deleteTextureFloorCeiling(room[id]);
	deleteTextureFloorCeiling(ceiling[id]);
	
	
	// объекты
	var furnitures = [];
	for ( var i = 0; i < arr_obj.length; i++ ) { furnitures[i] = { id : rayFurniture( arr_obj[i] ).id, obj : arr_obj[i] }; }
	for ( var i = 0; i < furnitures.length; i++ ) { if(room[id].userData.id == furnitures[i].id) deleteObjCatalog(furnitures[i].obj); }
	
	//clickO.obj = room[id]; 
}


function getDesignJson(arr, id_room, roomID)
{
	console.log(arr, id_room, roomID);
	
	if(arr.code_server != 200) { emitAction('load_error', { code: arr['code_server'] }); console.log('server : ' + arr.code_server); return; }
	
	var num = 0;
	var points = [];
	var walls = [];
	
	
	// находим помещение с нужным id и получаем точки 
	var p = [];	
	for ( var i = 0; i < arr.floors[0].rooms.length; i++ )
	{
		if(arr.floors[0].rooms[i].id == id_room) 
		{ 
			num = i;  
			for ( var i2 = 0; i2 < arr.floors[0].rooms[i].pointid.length; i2++ ){ p[i2] = arr.floors[0].rooms[i].pointid[i2]; }
			p[p.length] = arr.floors[0].rooms[i].pointid[0];
			break; 
		}
	}
	
	for ( var i2 = p.length - 1; i2 >= 0; i2-- ) { points[points.length] = { id: p[i2], w : [], start : []}; }	// т.к. у кости идет по часовой, а у меня против
	

	
	if(points.length == 0) { return; }
	
	
	// reset style room
	resetStyleRoom(roomID);
	
	
	// по точкам находям все стены этого помещения
	for ( var i = 0; i < arr.floors[0].walls.length; i++ )
	{		
		for ( var i2 = points.length - 2; i2 >= 0; i2-- )
		{ 
			if(arr.floors[0].walls[i].pointStart == points[i2].id) { var m = points[i2].w.length; points[i2].w[m] = arr.floors[0].walls[i].id; points[i2].start[m] = 0; }
			else if(arr.floors[0].walls[i].pointEnd == points[i2].id) { var m = points[i2].w.length; points[i2].w[m] = arr.floors[0].walls[i].id; points[i2].start[m] = 1; }
		}
	}
	
	// определяем, как расположена стена (какой стороной повернута во внутырь помещения)  
	points[points.length - 1] = points[0];
	var zp = compileArrPointRoom_1(points);
	
	for ( var i = 0; i < arr.floors[0].walls.length; i++ )
	{
		for ( var i2 = 0; i2 < zp[0].length; i2++ )
		{
			if(arr.floors[0].walls[i].id == zp[0][i2])
			{
				var n = walls.length;
				
				walls[n] = arr.floors[0].walls[i];
				walls[n].side = zp[1][i2];
				
				var pos = [];
				for ( var i3 = 0; i3 < arr.floors[0].points.length; i3++ )
				{
					if(arr.floors[0].walls[i].pointStart == arr.floors[0].points[i3].id) { pos[0] = new THREE.Vector3(arr.floors[0].points[i3].pos.x, 0, -arr.floors[0].points[i3].pos.z); }
					else if(arr.floors[0].walls[i].pointEnd == arr.floors[0].points[i3].id) { pos[1] = new THREE.Vector3(arr.floors[0].points[i3].pos.x, 0, -arr.floors[0].points[i3].pos.z); }					
				}
				
				var x1 = pos[1].z - pos[0].z;
				var z1 = pos[0].x - pos[1].x;	
				
				var dir = (walls[n].side == 0) ? new THREE.Vector3(x1, 0, z1) : new THREE.Vector3(-x1, 0, -z1);
				
				walls[n].dir = dir.normalize();				// перпендикуляр стены

				break;
			}			
		}
	}
	

	
	
	// зная сторону стены, находим материал стены
	for ( var i = 0; i < walls.length; i++ )
	{	
		walls[i].material = { lotid : 4954, color : {r : 93, g : 87, b : 83 }, scale : new THREE.Vector2(1,1) };
		
		for ( var i2 = 0; i2 < walls[i].colors.length; i2++ )
		{			
			var n = ('wall3d_' + walls[i].id + '_p1' == walls[i].colors[i2].containerID) ? 0 : 1;
			
			if(walls[i].side != n) continue;	// т.к. у кости идет по часовой, а у меня против, то стены смотрят в противоположную сторону			
			
			if(walls[i].colors[i2].lot)
			{
				if(isNumeric(walls[i].colors[i2].lot.id))
				{
					walls[i].material.lotid = walls[i].colors[i2].lot.id;
				}					
			}
			
			if(walls[i].colors[i2].matMod)
			{
				if(walls[i].colors[i2].matMod.colorsets[0].color)
				{
					var color = walls[i].colors[i2].matMod.colorsets[0].color;
					color.r = Math.round(color.r * 100);
					color.g = Math.round(color.g * 100);
					color.b = Math.round(color.b * 100);

					walls[i].material.color = color;
				}

				if(walls[i].colors[i2].matMod.texScal)
				{
					walls[i].material.scale = new THREE.Vector2( walls[i].colors[i2].matMod.texScal.x, walls[i].colors[i2].matMod.texScal.y );
				}
			}			
		}	
	}
	
	
	
	// назначаем материал стенам
	var roomW = room[roomID].w;
	var roomS = room[roomID].s;
	
	for ( var i = 0; i < roomW.length; i++ )
	{
		var index = (roomS[i] == 0) ? 2 : 1;
		
		var x1 = roomW[i].userData.wall.p[1].position.z - roomW[i].userData.wall.p[0].position.z;
		var z1 = roomW[i].userData.wall.p[0].position.x - roomW[i].userData.wall.p[1].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();			// перпендикуляр стены		
		
		dir = (roomS[i] == 1) ? new THREE.Vector3().addScaledVector( dir, -1 ) : dir;	// если стена строится в обратную сторону
		
		var n = 0;
		var res = -1;
		for ( var i2 = 0; i2 < walls.length; i2++ )
		{
			var dot = dir.clone().dot( walls[i2].dir.clone() );
			if(dot > res) { res = dot; n = i2; }			
		}
		
		loadPopObj_1([{ obj: roomW[i], lotid: walls[n].material.lotid, start: 'load', index : index, rgb : walls[n].material.color, scale : walls[n].material.scale }]);
	}
	

	// назначаем материал потолку и полу
	var colors = arr.floors[0].rooms[num].colors;
	for ( var i2 = 0; i2 < colors.length; i2++ )	
	{
		var obj = null;
		if(colors[i2].containerID == 'floor') { obj = room[roomID]; }
		else if(colors[i2].containerID == 'ceil') { obj = ceiling[roomID]; }
		else { continue; }		
		
		var material = {};
		material.containerID = colors[i2].containerID;
		
		if(!colors[i2].lot)
		{
			if(material.containerID == 'floor') { colors[i2].lot = { id : 4956 }; }
			if(material.containerID == 'ceil') { colors[i2].lot = { id : 4957 }; }
		}
		
		if(colors[i2].lot.id)
		{
			if(isNumeric(colors[i2].lot.id))
			{
				material.lotid = colors[i2].lot.id;
			}				
		}
		
		material.color = new THREE.Color('rgb(100%,100%,100%)');
		if(colors[i2].matMod)
		{
			if(colors[i2].matMod.colorsets[0].color)
			{
				var color = colors[i2].matMod.colorsets[0].color;
				color.r = Math.round(color.r * 100);
				color.g = Math.round(color.g * 100);
				color.b = Math.round(color.b * 100);
				
				material.color = color;					
			}
			
			if(colors[i2].matMod.texScal)
			{
				material.scale = new THREE.Vector2( colors[i2].matMod.texScal.x, colors[i2].matMod.texScal.y );
			}				
		}				
		
		loadPopObj_1([{ obj: obj, lotid: material.lotid, start: 'load', rgb : material.color, scale : material.scale }]);
	}	


	// установка плинтусов
	if(arr.floors[0].rooms[num].plinthLot) { loadPopObj_1([{ obj: room[roomID], lotid : arr.floors[0].rooms[num].plinthLot.id}]); } 
	//if(arr.room[num].plinthCeilLot) { loadPopObj_1([{ obj: room[roomID], lotid : arr.room[num].plinthCeilLot}]); }
	
	
	
	// создаем группу для объектов 
	
	myRoom = { centP : new THREE.Vector3(), min : { x : 999999, z : 999999 }, max : { x : -999999, z : -999999 } };
	oldRoom = { centP : new THREE.Vector3(), min : { x : 999999, z : 999999 }, max : { x : -999999, z : -999999 } };
	
	// box из выбранной комнаты (к которой применяем дизайн)
	for ( var i = 0; i < room[roomID].p.length - 1; i++ )		
	{
		var pos = room[roomID].p[i].position;
		
		if(myRoom.min.x > pos.x) { myRoom.min.x = pos.x; }
		if(myRoom.min.z > pos.z) { myRoom.min.z = pos.z; }
		
		if(myRoom.max.x < pos.x) { myRoom.max.x = pos.x; }
		if(myRoom.max.z < pos.z) { myRoom.max.z = pos.z; }
	}
	
	myRoom.centP = new THREE.Vector3((myRoom.max.x - myRoom.min.x) / 2 + myRoom.min.x, 0, (myRoom.max.z - myRoom.min.z) / 2 + myRoom.min.z);
	
	// box для старой комнаты (к которой получаем дизайн)
	for ( var i = 0; i < arr.floors[0].rooms[num].pointid.length; i++ )		
	{
		for ( var i2 = 0; i2 < arr.floors[0].points.length; i2++ )
		{
			if(arr.floors[0].rooms[num].pointid[i] != arr.floors[0].points[i2].id) continue;
				
			if(oldRoom.min.x > arr.floors[0].points[i2].pos.x) { oldRoom.min.x = arr.floors[0].points[i2].pos.x; }
			if(oldRoom.min.z > arr.floors[0].points[i2].pos.z) { oldRoom.min.z = arr.floors[0].points[i2].pos.z; }
			
			if(oldRoom.max.x < arr.floors[0].points[i2].pos.x) { oldRoom.max.x = arr.floors[0].points[i2].pos.x; }
			if(oldRoom.max.z < arr.floors[0].points[i2].pos.z) { oldRoom.max.z = arr.floors[0].points[i2].pos.z; }

			break;
		}
	}			
	
	
	oldRoom.centP = new THREE.Vector3((oldRoom.max.x - oldRoom.min.x) / 2 + oldRoom.min.x, 0, (oldRoom.max.z - oldRoom.min.z) / 2 + oldRoom.min.z);
	
	
	var material = new THREE.MeshLambertMaterial({ color: colWin, transparent: true, opacity: 0.5, side: THREE.DoubleSide }); 
	var box = new THREE.Mesh( createGeometryCube(myRoom.max.x - myRoom.min.x, 1, myRoom.max.z - myRoom.min.z), material ); 	
	box.position.copy(myRoom.centP);
	box.userData.xz = { x : myRoom.max.x - myRoom.min.x, z : myRoom.max.z - myRoom.min.z };
	box.userData.arrO = [];
	box.userData.pos_obj = [];
	box.userData.tag = 'group_pop';
	//scene.add( box );
	
	
	var roomScale = { x : (myRoom.max.x - myRoom.min.x) / (oldRoom.max.x - oldRoom.min.x), z : (myRoom.max.z - myRoom.min.z) / (oldRoom.max.z - oldRoom.min.z) };
	
	

	// объекты
	var objPop = arr.floors[0].furn; 
	for ( var i = 0; i < objPop.length; i++ )
	{
		if(objPop[i].roomId == id_room)
		{
			var material = [];
			
			var color = (objPop[i].colors) ? objPop[i].colors : [];  
			
			for ( var i2 = 0; i2 < color.length; i2++ )
			{
				if(!color[i2].lotid) { continue; }
				
				var lotid = color[i2].lotid;	
				var containerID = color[i2].containerID;
				var rgb = new THREE.Color('rgb('+color[i2].color.r+'%,'+color[i2].color.g+'%,'+color[i2].color.b+'%)');
				var opacity = color[i2].color.a;
				var scale = new THREE.Vector2( color[i2].texScale.x, color[i2].texScale.y );		 
				
				material[material.length] = { lotid : lotid, containerID : containerID, rgb : rgb, opacity : opacity, scale : scale } 			
			}

			var rot = objPop[i].rot;
			rot.x = THREE.Math.degToRad(rot.x);
			rot.y = THREE.Math.degToRad(rot.y);
			rot.z = THREE.Math.degToRad(rot.z);	

			var pos = new THREE.Vector3().subVectors( objPop[i].pos, oldRoom.centP );  
			pos.x *= roomScale.x;
			pos.z *= roomScale.z;  
			
			pos.x += myRoom.centP.x;
			pos.z += -myRoom.centP.z;
			
			var id = countId; countId++;
			
			loadPopObj_1({ id : id, lotid : objPop[i].lotid, pos : pos, rot : rot, size : objPop[i].size, material : material });

			countId++;
		}
	}	
}




