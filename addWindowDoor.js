



// кликнули на стену или окно/дверь, когда к мышки привязана вставляемая дверь 
function clickToolWD()
{ 
	var obj = clickO.last_obj;
	  
	if(obj)
	{   
		// кликнули на стену, когда добавляем окно
		if(obj.userData.tag == 'free_dw') 
		{ 
			clickO.obj = obj;
			if(!obj.userData.door.wall) { return true; }
			
			clickO.last_obj = null;
			addWD( obj, obj.userData.door.wall, obj.position );  
			return true; 
		}
	}

	return false;
}



// добавляем на выбранную стену окно/дверь
// obj 		готовая дверь/окно
// wall		стену на которую кликнули
function addWD( obj, wall, pos )
{	
	pos.y -= 0.001;		// делаем чуть ниже уровня пола
	obj.position.copy( pos );
	obj.rotation.copy( wall.rotation ); 
	obj.material.transparent = false;
	clickO.obj = obj;
	
	if(camera == cameraTop)
	{ 
		obj.material.depthTest = false;  
		obj.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		obj.material.depthTest = true;
		obj.material.transparent = true;
		obj.material.opacity = 0;					
	}	
	
	changeWidthWD(obj, wall);		// выставляем ширину окна/двери равную ширине стены
	
	// обновляем(пересчитываем) размеры двери/окна/двери (если измениалась ширина)
	obj.geometry.computeBoundingBox(); 	
	obj.geometry.computeBoundingSphere();
	
	obj.userData.tag = (obj.userData.door.type == 'WindowSimply') ? 'window' : 'door';
	obj.userData.door.wall = wall;
	obj.userData.door.goList.setEmptyBox = true;  
	
	if(obj.userData.tag == 'window') { obj.userData.door.actList = abo.window; }
	else if(obj.userData.tag == 'door') { obj.userData.door.actList = abo.door; }
	
	if(!obj.userData.id) { obj.userData.id = countId; countId++; }  
	
	if(obj.userData.tag == 'window') { arr_window[arr_window.length] = obj; }
	else { arr_door[arr_door.length] = obj; }

	
	//--------
	
	obj.updateMatrixWorld();
	
	
	// создаем клон двери/окна, чтобы вырезать в стене нужную форму
	if(1==1)
	{  
		objsBSP = { wall : wall, wd : createCloneWD_BSP( obj ) };				
		MeshBSP( obj, objsBSP );
		
		//wall.material[0].wireframe = true;
		//wall.material[1].wireframe = true;
		//wall.material[2].wireframe = true;
		
		upUvs_1( wall );		
	}	


	wall.userData.wall.arrO[wall.userData.wall.arrO.length] = obj;
	
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();	
 
	// правильно поворачиваем окно/дверь	
	// obj.updateMatrixWorld();  сверху уже есть
	
	if(obj.userData.tag == 'door') 
	{ 
		createDoorLeaf(obj, (obj.userData.door.open_type) ? obj.userData.door.open_type : 0); 
		
		// устанавливаем (поварачиваем) ПОП дверь	
		if(obj.userData.door.type == 'DoorSimply') { setPosDoorLeaf_2(obj); }
		else if(obj.userData.door.type == 'DoorPattern') { if(obj.userData.door.goList.setPopObj) { changeWidthParamWD(obj); setPosDoorLeaf_3(obj); } } 
		
			 
	}
	else
	{
		var room = detectCommonZone_1( wall );
		
		if(room.length == 1)
		{
			var side = 0;
			for ( var i2 = 0; i2 < room[0].w.length; i2++ ) { if(room[0].w[i2].userData.id == wall.userData.id) { side = room[0].s[i2]; break; } }

			if(side == 0) { obj.userData.door.popObj.rotation.y += Math.PI; }
			else { }			
		}
		 
		obj.userData.door.popObj.position.copy(obj.geometry.boundingSphere.center.clone());
	}
	
	getInfoWD_1(obj, pos);
	resetMenuUI();
	
	// если объект новый (вставили из каталога), то записываем 
	// если объект загружен из сохраненного файла или вставлен из undoRedo, то ничего не делаем 
	if(obj.userData.door.status == '') { getInfoEvent6( obj ); }  
	//else if(obj.userData.door.status == 'undoRedo') { forceAssignActiveObj(obj); }	// выделение/активация объекта
	
	renderCamera();
}



// создаем полотно (при вставке двери в стену)
function createDoorLeaf(door, open_type) 
{
	//if(camera != cameraTop) return;
	if(door.userData.door.type == 'DoorEmpty') return;
	
	var geometry = createGeometryWD(1.0, 2.1, 0.08);		
	
	var v = geometry.vertices; 
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	v[2].x = v[3].x = v[4].x = v[5].x = 0.8;
	var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: colDoor, depthTest: false }) );
	
	obj.renderOrder = 1;
	obj.door = door;
	obj.userData.tag = 'door_leaf';
	
	door.userData.door.leaf_2D = obj;
	door.add( obj );
	
	setPosDoorLeaf_1(door, Number(open_type));	// устанавливаем полотно			
}





// изменяем у ПОП объекта ширину/высоту/центрируем
function changeWindowDoorPop(obj, x, y) 
{
	var popObj = obj.userData.door.popObj;
	
	if(popObj) 
	{ 
		popObj.position.x = obj.geometry.boundingSphere.center.x; 
		popObj.position.y = obj.geometry.boundingSphere.center.y;
		
		popObj.geometry.computeBoundingBox();		
		var dX = popObj.geometry.boundingBox.max.x - popObj.geometry.boundingBox.min.x;
		var dY = popObj.geometry.boundingBox.max.y - popObj.geometry.boundingBox.min.y;	
			
		popObj.scale.set(x * 2 / dX, y * 2 / dY, 1);  
	} 	
}
   


// заменяем старую стену на новыу, переносим все данные, удаляем старую стену
function upWallAfterReplace( newWall, oldWall )
{
	newWall.userData.tag = 'wall';
	
	var point1 = newWall.userData.wall.p[0];	
	var point2 = newWall.userData.wall.p[1];
	
	deleteOneOnPointValue(point1, oldWall);
	deleteOneOnPointValue(point2, oldWall);
		
	for ( var i = 0; i < obj_line.length; i++ ){ if(obj_line[i] == oldWall) { obj_line[i] = newWall; break; } }	// заменяем в массиве новую, на старую стену			
	
	for ( var i = 0; i < newWall.userData.wall.arrO.length; i++ )
	{
		newWall.userData.wall.arrO[i].userData.door.wall = newWall;
	}	
	
	var n = point1.w.length;		
	point1.w[n] = newWall;
	point1.p[n] = point2;
	point1.start[n] = 0;	
	
	var n = point2.w.length;		
	point2.w[n] = newWall;
	point2.p[n] = point1;
	point2.start[n] = 1;

	scene.remove( oldWall );  
}



// создаем копию стены (для ThreeBSP), но без перемещаемого окна/двери (запускается один раз в момент, когда начали перемещать окно/дверь)
// 1. обновляем стену до простой стены без окон/дверей
// 2. добавляем откосы
// 3. вырезаем отверстия для окон/дверей , кроме перемещаемого окна/двери
function clickMoveWD_BSP( wd )  
{
	console.log('clone wall (без перемещаемого WD)');
	
	var wall = wd.userData.door.wall;
	
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;	
	var d = p1.distanceTo( p2 );		
	
	wall.geometry = createGeometryWall(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);	// обновляем стену до простой стены
	
	// добавляем откосы
	var v = wall.geometry.vertices;
	
	for ( var i = 0; i < v.length; i++ ) { v[i] = wall.userData.wall.v[i].clone(); }
	
	//wall.updateMatrixWorld();

	
	// вырезаем отверстия для окон/дверей
	var arrO = wall.userData.wall.arrO;
	
	for ( var n = 0; n < arrO.length; n++ )
	{
		if(arrO[n] == wd) continue;
		
		var objClone = createCloneWD_BSP( arrO[n] );

		var wdBSP = new ThreeBSP( objClone );    
		var wallBSP = new ThreeBSP( wall ); 			// копируем выбранную стену	
		var newBSP = wallBSP.subtract( wdBSP );		// вычитаем из стены объект нужной формы		
		wall.geometry = newBSP.toMesh().geometry;	
	}
	
	if(arrO.length > 1)
	{
		wall.geometry.computeFaceNormals();

		for ( var i = 0; i < wall.geometry.faces.length; i++ )
		{
			wall.geometry.faces[i].normal.normalize();
			if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
			else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
		}		
	}
	
	upUvs_1( wall );	
	
	return wall;
}




// создаем форму окна/двери (для boolean), чуть шире стены
function createCloneWD_BSP( wd )
{
	//console.log('clone WD (но чушь шире оригинала) (для boolean)');
	
	objClone.geometry = wd.geometry.clone(); 
	objClone.position.copy( wd.position );
	objClone.rotation.copy( wd.rotation );
	
	//var width = wd.userData.door.width / 2 + 0.3;
	var minZ = wd.userData.door.form.v.minZ;
	var maxZ = wd.userData.door.form.v.maxZ;
	
	var v = objClone.geometry.vertices;
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z -= 0.2; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z += 0.2; }

	return objClone;	
}



// вырезаем отверстие под окно/дверь 
function MeshBSP( wd, objsBSP )
{  
	var wall = wd.userData.door.wall;
	
	var wallClone = objsBSP.wall;
	var wdClone = objsBSP.wd;
	
	wdClone.position.copy( wd.position );

	var wdBSP = new ThreeBSP( wdClone );    
	var wallBSP = new ThreeBSP( wallClone ); 			// копируем выбранную стену	
	var newBSP = wallBSP.subtract( wdBSP );				// вычитаем из стены объект нужной формы		
	wall.geometry = newBSP.toMesh().geometry;	
	
	wall.geometry.computeFaceNormals();

	for ( var i = 0; i < wall.geometry.faces.length; i++ )
	{
		wall.geometry.faces[i].normal.normalize();
		if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
		else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
	}

	//wall.updateMatrixWorld();
	
	upUvs_1( wall );	 	
}

 
 
 
 // создаем копии стен (для ThreeBSP) без окон/дверей (запускается один раз, когда начали перемещать точку)
function clickMovePoint_BSP( arrW ) 
{
	var w = [];
	for ( var i = 0; i < arrW.length; i++ ) { w[w.length] = arrW[i].userData.id; }
	console.log('click_BSP_1', w);
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i]; 
		
		if(wall.userData.wall.arrO.length == 0) continue;
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;	
		var d = p1.distanceTo( p2 );		
		
		wall.geometry = createGeometryWall(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);	// обновляем стену до простой стены		
		 
		// добавляем откосы
		var v = wall.geometry.vertices;
		for ( var i2 = 0; i2 < v.length; i2++ ) { v[i2] = wall.userData.wall.v[i2].clone(); }	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;	
		wall.geometry.computeBoundingSphere();
	}
}
 
 
// сняли клик, после перемещения точки (вставляем wd)
function clickPointUP_BSP( arrW )   
{
	var w = [];
	for ( var i = 0; i < arrW.length; i++ ) { w[w.length] = arrW[i].userData.id; }
	console.log('click_BSP_2', w);
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i];
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
		{
			var wd = wall.userData.wall.arrO[i2];
			
			var wdClone = createCloneWD_BSP( wd );
			
			objsBSP = { wall : wall, wd : wdClone };		
			
			MeshBSP( wd, objsBSP );			
		}
	}
} 
 
 
 
 
 
 
 
 