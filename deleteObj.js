

function detectDeleteObj()
{
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(camera == camera3D)
	{
		if ( tag == 'wall' ) return;
	}
	else if(camera == cameraWall)
	{
		if ( tag == 'wall' ) return;
	}	
		
	if ( tag == 'wall' ) { var ar = getInfoEvent4_before( obj ); var arrRoom = deleteWall_1( obj ).room; getInfoEvent4( ar[0], ar[1], arrRoom ); }
	else if ( tag == 'point' ) { if(obj.p.length == 2) { var arr1 = getInfoEvent9_before( obj );  var arr2 = deletePoint( obj ); getInfoEvent9( arr1, arr2.wall ); } } 
	else if ( tag == 'obj' ) { deleteObjCatalog(obj); }
	else if ( tag == 'window' || tag == 'door' ) { getInfoEvent5( obj ); deleteWinDoor( obj ); }
	else if ( tag == 'pivot' || tag == 'gizmo' ) { deleteObjCatalog(obj.parent.obj); }	

	 renderCamera();
}


function deleteWall_1( wall )
{	
	hideMenuObjUI_2D(wall);

	var arrZone = detectCommonZone_1( wall );
	var oldZ = findNumberInArrRoom(arrZone);
	deleteArrZone(arrZone); 
	
	var zone = (arrZone.length == 0) ? rayFurniture( wall ).obj : null; 
	
	deleteWall_2(wall);
	
	var newZones = [];
	
	// новые зоны, после удаления стены 
	if(oldZ.length > 0) 
	{ 
		var area = oldZ[0].floor.userData.room.areaTxt;
		var n = 0;
		for ( var i = 0; i < oldZ.length; i++ ) { if(oldZ[i].floor.userData.room.areaTxt > area) { n = i; } }
		
		newZones = detectRoomZone(nameRoomDef);

		if(newZones.length > 0) { assignOldToNewZones_2([newZones[0]], oldZ[n], false); } // если есть новая зона после удаления стены		
	}
	else
	{	
		if(zone) { getYardageSpace([zone]); }				
	}

	return { room : newZones }; 
}


// здесь только удаление стены, без обновления зон/площади/пола
function deleteWall_2(wall)
{
	objDeActiveColor_2D();
	
	var arr = wall.userData.wall.arrO;
	for ( var i = 0; i < arr.length; i ++ ){ deleteArrObj( arr[i] ); }
	for ( var i = 0; i < arr.length; i ++ ){ scene.remove( arr[i] ); }

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	deleteOneOnPointValue(p0, wall);
	deleteOneOnPointValue(p1, wall);
	deleteWallFromArr(wall);
	
	scene.remove(wall.label[0]);
	//scene.remove(wall.label[1]);	
	scene.remove( wall );
	
	if(p0.w.length == 0){ deletePointFromArr( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ deletePointFromArr( p1 ); scene.remove( p1 ); }


	var arrW = [];
	for ( var i = 0; i < p0.w.length; i++ ) { arrW[arrW.length] = p0.w[i]; }
	for ( var i = 0; i < p1.w.length; i++ ) { arrW[arrW.length] = p1.w[i]; }  
	clickMovePoint_BSP( arrW );	
	
	if(p0.w.length > 0){ upLineYY_2(p0, p0.p, p0.w, p0.start); }
	if(p1.w.length > 0){ upLineYY_2(p1, p1.p, p1.w, p1.start); }

	upLabelPlan_1(arrW);
	
	clickPointUP_BSP( arrW );
}


// удаляем разделяемую стену и окна/двери, которые принадлежат ей (без удаления зон)
function deleteWall_3(wall)
{
	objDeActiveColor_2D();
	
	var arr = wall.userData.wall.arrO;
	for ( var i = 0; i < arr.length; i ++ ){ deleteArrObj( arr[i] ); }
	for ( var i = 0; i < arr.length; i ++ ){ scene.remove( arr[i] ); }

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	deleteOneOnPointValue(p0, wall);
	deleteOneOnPointValue(p1, wall);
	deleteWallFromArr(wall);
	
	scene.remove(wall.label[0]);
	//scene.remove(wall.label[1]);	
	scene.remove( wall );
	
	if(p0.w.length == 0){ deletePointFromArr( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ deletePointFromArr( p1 ); scene.remove( p1 ); }

}


// удаление точки
function deletePoint( point )
{
	if(!point){ return [ null, null ]; }
	if(point.p.length != 2){ return [ null, null ]; }
	
	var wall_1 = point.w[0];
	var wall_2 = point.w[1];
		
	var arrW_2 = detectChangeArrWall([], point);
	
	clickMovePoint_BSP( arrW_2 );
	 
	var point1 = point.p[0];
	var point2 = point.p[1];
	
	var p1 = { id : point1.userData.id, pos : point1.position.clone() };
	var p2 = { id : point2.userData.id, pos : point2.position.clone() };	

	var dir1 = new THREE.Vector3().subVectors( point.position, point1.position ).normalize();
	var dir2 = new THREE.Vector3().subVectors( point2.position, point.position ).normalize();
	
	var d1 = wall_1.userData.wall.p[0].position.distanceTo( wall_1.userData.wall.p[1].position );
	var d2 = wall_2.userData.wall.p[0].position.distanceTo( wall_2.userData.wall.p[1].position );
	
	var wall = (d1 > d2) ? wall_1 : wall_2;	
	var res = (d1 > d2) ? 1 : 2;
	
	
	// собираем данные о стене
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material;
	var userData_material = wall.userData.material;
	
	// переварачиваем текстуру, если текструа была на одной стороне, то переносим ее на другую сторону стены
	if(res == 1)
	{
		if(point.start[0] != 1)		
		{
			material = [wall.material[0], wall.material[2], wall.material[1]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1]];			
		}
	}
	if(res == 2)
	{
		if(point.start[1] != 0)
		{
			material = [wall.material[0], wall.material[2], wall.material[1]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1]];			
		}
	}	
	
	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
	var arrO = [];
	for ( var i = 0; i < wall_1.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_1.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}

	for ( var i = 0; i < wall_2.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_2.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}
	
	var oldZones = detectCommonZone_1( wall_1 );   	// определяем с какиеми зонами соприкасается стена
	var oldZ = findNumberInArrRoom( oldZones );
	deleteArrZone( oldZones );						// удаляем зоны  с которыми соприкасается стена							
	
	deleteWall_3( wall_1 );		// удаляем разделяемую стену и окна/двери, которые принадлежат ей (без удаления зон)		
	deleteWall_3( wall_2 );		// удаляем разделяемую стену и окна/двери, которые принадлежат ей (без удаления зон)	
	 

	// находим точки (если стена была отдельна, то эти точки удалены и их нужно заново создать)
	var point1 = findObjFromId( 'point', p1.id );
	var point2 = findObjFromId( 'point', p2.id );	
	
	if(point1 == null) { point1 = createPoint( p1.pos, p1.id ); }
	if(point2 == null) { point2 = createPoint( p2.pos, p2.id ); }	
	
	var wall = createOneWall3( point1, point2, width, { offsetZ : offsetZ, height : height } ); 

	upLineYY_2(point1, point1.p, point1.w, point1.start);
	upLineYY_2(point2, point2.p, point2.w, point2.start);
	
	var arrW = [];
	for ( var i = 0; i < arrW_2.length; i++ ) { arrW[arrW.length] = arrW_2[i]; }
	arrW[arrW.length] = wall;
	
	upLabelPlan_1( arrW );	
	
	var newZones = detectRoomZone(nameRoomDef);		// создаем пол, для новых помещений	
	assignOldToNewZones_1(oldZ, newZones, 'delete');		// передаем параметры старых зон новым	(название зоны)			
	
	
	// вставляем окна/двери (если стены параллельны)
	if(comparePos(dir1, dir2)) 
	{
		for ( var i = 0; i < arrO.length; i++ ) { arrO[i].wall = wall; loadPopObj_1(arrO[i]); } 
	}
	
	// накладываем материал
	wall.material = [ material[0].clone(), material[1].clone(), material[2].clone() ]; 
	wall.userData.material = userData_material; 
	
	clickPointUP_BSP( arrW );
	
	lineAxis_1.visible = false;
	lineAxis_2.visible = false; 	
	
	return { point : { id : point.userData.id }, wall : wall }; 
} 



// удаление объекта (окно/дверь) из сцены
function deleteWinDoor( obj )
{	
	var wall = obj.userData.door.wall; 		
	
	d_tool.visible = false;
	
	clickMoveWD_BSP( obj );		
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ ){ if(obj == wall.userData.wall.arrO[i]) { wall.userData.wall.arrO.splice(i, 1); break; } }
	
	
	
	if(obj.userData.tag == 'window') { UI.hideToolbar( 'window-toolbar' ); }
	if(obj.userData.tag == 'door') { UI.hideToolbar( 'door-2d-toolbar' ); }
	

	hideSizeWD( obj ); 

	if(camera == camera3D)
	{
		wall.label[0].visible = false; 
		//wall.label[1].visible = false;	 			
	}
	
	scene.remove( obj.userData.door.leaf_2D );
	deleteArrObj( obj );
	scene.remove( obj );	
	
	clickO.obj = null; 
	clickO.last_obj = null;
}


function deleteObjCatalog( obj ) 
{
	hidePivotGizmo(obj);  
	
	if(!obj){ return; }  	
	
	for (i = 0; i < arr_obj.length; i++) { if(arr_obj[i] == obj) { arr_obj.splice(i, 1); break; } }
	
	
	if(clickO.obj == obj || clickO.last_obj == obj)
	{
		hideMenuObjUI_2D( obj );
		clickO.obj = null;
		clickO.last_obj = null;		
	}
	
	
	scene.remove( obj );	
}






// удаление объекта из массива
function deleteArrObj( obj )
{
	var arr = []; 
	if(obj.userData.tag == 'window')
	{
		var m = 0;
		for ( var i = 0; i < arr_window.length; i ++ ) { if(arr_window[i] != obj){ arr[m] = arr_window[i]; m++; } }
		arr_window = null;
		arr_window = arr;
	}
	else if(obj.userData.tag == 'door')
	{
		var m = 0;
		for ( var i = 0; i < arr_door.length; i ++ ) { if(arr_door[i] != obj){ arr[m] = arr_door[i]; m++; } }
		arr_door = null;
		arr_door = arr;
	}	
}


// удаление у точки 3 параметров
function deleteOneOnPointValue(point, wall)
{
	var n = -1;
	for ( var i = 0; i < point.w.length; i++ ){ if(point.w[i].userData.id == wall.userData.id) { n = i; break; } }
	
	point.p.splice(n, 1);
	point.w.splice(n, 1);
	point.start.splice(n, 1);	
}


// удаление стены из массива стен
function deleteWallFromArr(wall)
{
	var n = -1;
	for ( var i = 0; i < obj_line.length; i++ ){ if(obj_line[i].userData.id == wall.userData.id) { n = i; break; } }

	obj_line.splice(n, 1);	
}


// удаление точки из массива точек
function deletePointFromArr(point)
{
	var n = -1;
	for ( var i = 0; i < obj_point.length; i++ ){ if(obj_point[i].userData.id == point.userData.id) { n = i; break; } }
	
	obj_point.splice(n, 1);	
}




