


function createFloor(arrP, arrW, arrS, id, roomType, material, plinth)
{	
	var point_room = [];
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		point_room[i] = new THREE.Vector2 ( arrP[i].position.x, arrP[i].position.z );		
	}
	
	for ( var i = 0; i < arrW.length; i++ ) 
	{ 
		arrW[i].userData.wall.room.side = arrS[i]; console.log(arrS[i], arrW[i].userData.wall.room.side); 
	}
	
	//var str = ''; for ( var i = 0; i < arrP.length; i++ ) { str += ' | ' + arrP[i].userData.id; } console.log(str);
	console.log('-------------');	 
	
	var shape = new THREE.Shape( point_room );
	var geometry = new THREE.ShapeGeometry( shape );
	
	var n = room.length;	
	//room[n] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color : 0xe3e3e5, side : THREE.BackSide } ) );	
	room[n] = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: -arrW[0].userData.wall.height_0 } ), new THREE.MeshLambertMaterial( { color : 0xe3e3e5, lightMap : lightMap_1 } ) ); 
	room[n].position.set( 0, arrP[0].position.y, 0 );
	room[n].rotation.set( Math.PI / 2, 0, 0 );	
	room[n].p = arrP;
	room[n].w = arrW; 
	room[n].s = arrS;
	room[n].label = createLabelArea('0', 2, 0.5, '65', false, geometryLabelFloor);			
	room[n].pr_preview = '';
	room[n].pr_catalog = '';
	
	
	if(id == 0) { id = countId; countId++; }  

	room[n].userData.tag = 'room';
	room[n].userData.id = (id == 0) ? countId : countId++;
	room[n].userData.room = { roomType : roomType, areaTxt : 0, p : arrP, w : arrW, s : arrS, preview : '', caption : '', outline : null }; 
	room[n].userData.material = { lotid : 4956, containerID : null, caption : '', color : room[n].material.color, scale : new THREE.Vector2(1,1), filters : 1039, preview : '', catalog : null };
	room[n].userData.room.plinth = {o : plinth[0].o, lotid : plinth[0].lotid, v : [], mat : null, obj : [], preview : '', caption : '', param : null, catalog : null };		
	
	
	ceiling[n] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color : 0xffffff, lightMap : lightMap_1 } ) );			
	ceiling[n].position.set( 0, arrP[0].position.y + height_wall, 0 );
	ceiling[n].rotation.set( Math.PI / 2, 0, 0 );	
	
	ceiling[n].userData.tag = 'ceiling';
	ceiling[n].userData.id = (id == 0) ? countId : countId++;
	ceiling[n].userData.ceil = { preview : '', caption : '' };
	ceiling[n].userData.material = { lotid : 4957, containerID : null, caption : '', color : ceiling[n].material.color, scale : new THREE.Vector2(1,1), filters : 1039, preview : '', catalog : null };
	ceiling[n].userData.ceil.plinth = {o : plinth[1].o, lotid : plinth[1].lotid, v : [], mat : null, obj : [], preview : '', caption : '', param : null, catalog : null };
	


	// загружаем материал (пол, потолок)
	//setMaterialFloorCeiling(n, material)
	
	
	
	
	getYardageSpace( [room[n]] );

	scene.add( room[n] );
	scene.add( ceiling[n] );	
	
	addParamPointOnZone(arrP, room[n]);
		
	if(plinth[0].o) { loadPopObj_1({ obj: room[n], lotid : plinth[0].lotid }); } 
	//if(plinth[1].o) { loadPopObj_1({ obj: ceiling[n], lotid : plinth[0].lotid}); }
	
	return room[n];
}



// загружаем материал (пол, потолок)
function setMaterialFloorCeiling(n, material)
{
	for ( var i = 0; i < material.length; i++ )
	{
		var obj = null;
		if(material[i].containerID == 'floor') { obj = room[n]; }
		else if(material[i].containerID == 'ceil') { obj = ceiling[n]; }
		else { continue; }

		var rgb = { r : 100, g : 100, b : 100 };  
		if(material[i].color) { rgb = material[i].color; }			
			
		var scale = (material[i].scale) ? material[i].scale : new THREE.Vector2(1,1);
		
		var inf = { obj: obj, lotid: material[i].lotid, start: 'load', rgb : rgb, scale : scale };
		
		if(material[i].offset) { inf.offset = material[i].offset; }
		if(material[i].rotation) { inf.rot = material[i].rotation; }
		
		loadPopObj_1(inf);
	}	
}


// добавляем к точкам параметр зона и предыдущая точка
function addParamPointOnZone(arrP, zone)
{
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		var k1 = (i == 0) ? arrP.length - 2 : i - 1;				
		var f = arrP[i].zone.length;
		arrP[i].zone[f] = zone; 
		arrP[i].zoneP[f] = arrP[k1]; 		
	}		
}



// добавляем к точкам параметр зона и предыдущая точка
function replaceParamPointOnZone(zone, newPoint, replacePoint)
{
	for ( var i = 0; i < zone.length; i++ )  
	{  		
		for ( var i2 = 0; i2 < zone[i].p.length; i2++ )
		{
			if(zone[i].p[i2] == replacePoint) { zone[i].p[i2] = newPoint; }
		}			
	}			
}




// при изменении формы пола обновляем geometry.faces
function updateShapeFloor(arrRoom)
{  
	
	for ( var i = 0; i < arrRoom.length; i++ ) 
	{	 
		var point = [];
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ ) { point[i2] = new THREE.Vector2 ( arrRoom[i].p[i2].position.x, arrRoom[i].p[i2].position.z ); }			
		var txt = ''; for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ ) { txt += ' | ' + arrRoom[i].p[i2].userData.id; } console.log(arrRoom[i].userData.id + ' = ' + txt);	
		
		var shape = new THREE.Shape( point );				

		var geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: -arrRoom[i].w[0].userData.wall.height_0 } ); 
		
		arrRoom[i].geometry.vertices = geometry.vertices;
		arrRoom[i].geometry.faces = geometry.faces;		
		arrRoom[i].geometry.verticesNeedUpdate = true;
		arrRoom[i].geometry.elementsNeedUpdate = true;
		
		arrRoom[i].geometry.computeBoundingSphere();
		arrRoom[i].geometry.computeBoundingBox();
		arrRoom[i].geometry.computeFaceNormals();
		
		getYardageSpace([arrRoom[i]]); 

		// потолок	
		var num = 0;		
		for ( var i2 = 0; i2 < room.length; i2++ ) { if(room[i2].userData.id == arrRoom[i].userData.id) { num = i2; break; } }	// находим потолок	
		
		var geometry = new THREE.ShapeGeometry( shape );
		ceiling[num].geometry.vertices = geometry.vertices;
		ceiling[num].geometry.faces = geometry.faces;			
		ceiling[num].geometry.verticesNeedUpdate = true;
		ceiling[num].geometry.elementsNeedUpdate = true;
		
		ceiling[num].geometry.computeBoundingSphere();
		ceiling[num].geometry.computeBoundingBox();
		ceiling[num].geometry.computeFaceNormals();		
	}
	
	//getSkeleton_1(arrRoom);
}



// находим потолок, который соответсвует полу
function findNumberInArrRoom(arr) 
{
	var arrN = [];
	if(!Array.isArray(arr)) { var res = arr; var arr = [res]; }
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(room[i2] == arr[i]) { arrN[i] = { floor : room[i2], ceiling : ceiling[i2] }; break; }
		}		
	}	
	
	return arrN;
}



// показываем меню room
function showTableFloorUI()
{		
	var room = clickO.obj;
	UI('room-type').val(room.userData.room.roomType);
	UI.showToolbar('floor-2d-toolbar');
}


// меняем зоны в меню 
function clickTableZoneUI(value)
{ 
	var room = clickO.obj;
	
	upLabelArea2(room.label, room.userData.room.areaTxt + ' м2', value, '85', 'rgba(255,255,255,1)', false);
	
	room.userData.room.roomType = value;
}



// кликнули на пол (создаем outline)
function clickFloorOutline(obj) 
{	
	if(obj.userData.tag == 'room' || obj.userData.tag == 'ceiling') {}
	else { return; }
	
	if(obj.userData.tag == 'ceiling') 
	{
		for (i = 0; i < ceiling.length; i++)
		{
			if(ceiling[i] == obj) { var floor = room[i];  break; }
		}
	}
	else if(obj.userData.tag == 'room') 
	{
		var floor = obj;
	}
	
	
	var outline = new THREE.Group();
	
	for (i = 0; i < floor.w.length; i++)
	{
		var wall = floor.w[i];
		
		wall.updateMatrixWorld();
			
		var v = wall.userData.wall.v;
		
		if(floor.s[i] == 0)
		{			
			var x = v[10].x - v[4].x;
			var p1 = wall.localToWorld( v[4].clone() );
			var p2 = wall.localToWorld( v[10].clone() );
		}
		else 
		{
			var x = v[6].x - v[0].x;
			var p1 = wall.localToWorld( v[0].clone() );
			var p2 = wall.localToWorld( v[6].clone() );			
		}	
		
		var geometry = createGeometryLine(x, 0.02, 0.02); 
		var line = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 'rgb(17, 255, 0)', depthTest: false }) );
		line.renderOrder = 2;
		
		line.position.set( p1.x, 0, p1.z );
		
		var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
		var angleDeg = Math.atan2(dir.x, dir.z);
		line.rotation.set(0, angleDeg + Math.PI / 2, 0);	

		outline.add( line );
	}
	
	outline.position.y = obj.position.y;
	
	scene.add( outline );
	
	return outline;
}
 


function createGeometryLine(x, y, z)
{
	var geometry = new THREE.Geometry();
	
	var h1 = 0;
	
	var z1 = z;
	var z2 = z;
	
		
	var vertices = [
				new THREE.Vector3(0,h1,z1),
				new THREE.Vector3(0,y,z1),
				new THREE.Vector3(0,h1,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(0,h1,z2),
				new THREE.Vector3(0,y,z2),								
								
				new THREE.Vector3(x,h1,z1),
				new THREE.Vector3(x,y,z1),
				new THREE.Vector3(x,h1,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,h1,z2),
				new THREE.Vector3(x,y,z2),						
			];	
			
	var faces = [
				new THREE.Face3(0,6,7),
				new THREE.Face3(7,1,0),
				new THREE.Face3(4,5,11),
				new THREE.Face3(11,10,4),				
				new THREE.Face3(1,7,9),
				new THREE.Face3(9,3,1),					
				new THREE.Face3(9,11,5),
				new THREE.Face3(5,3,9),				
				new THREE.Face3(6,8,9),
				new THREE.Face3(9,7,6),				
				new THREE.Face3(8,10,11),
				new THREE.Face3(11,9,8),
				
				new THREE.Face3(0,1,3),
				new THREE.Face3(3,2,0),	

				new THREE.Face3(2,3,5),
				new THREE.Face3(5,4,2),	

				new THREE.Face3(0,2,8),
				new THREE.Face3(8,6,0),

				new THREE.Face3(2,4,10),
				new THREE.Face3(10,8,2),					
			];

			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	
	return geometry;
}


