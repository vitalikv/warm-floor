
var urs = [];

var param_usU = [];
var param_usR = [];
var leng_ur = -1;
var ndsf = 1;





// сбрасываем посление выделение
function resetActiveObj()
{
	
	clickO.obj = null; 
	if(camera == cameraTop) { hideMenuObjUI_2D( clickO.last_obj ); }
	else if(camera == camera3D) { hideMenuObjUI_3D( clickO.last_obj ); }
	else if ( camera == cameraWall ) { objDeActiveColor_Wall(clickO.last_obj); }
	
	clickO = resetVarParam();
}

// принудительно назначить/активировать выбранный объект
function forceAssignActiveObj(obj)
{
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем положение до переноса
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем положение после переноса		
	
	clickO.obj = obj;
	clickO.rayhit = ar.faceIndex;
	
	if(camera == cameraTop) { showMenuObjUI_2D( clickO.obj ); }
	else if(camera == camera3D) { showMenuObjUI_3D( clickO.obj ); }
	else if ( camera == cameraWall ) { objActiveColor_Wall(clickO.obj); }	
}



function assignArrUR( o, ur )
{
	o.faceIndex = (clickO.rayhit) ? clickO.rayhit.faceIndex : null;
	
	if(ur == 'down')
	{
		if(param_usU.length - 1 > leng_ur)
		{
			var d = param_usU.length - (leng_ur + 1);  
			param_usU.splice(leng_ur + 1, d);  		
			urs.splice(leng_ur + 1, d);
		}		
		
		leng_ur += 1; 
		param_usU[leng_ur] = o; 
		console.log('Undo', param_usU[leng_ur]);
	}
	else if(ur == 'up')
	{ 
		param_usR[leng_ur] = o;
		console.log('Redo', param_usR[leng_ur]);
	}		
}






// собираем инфо при перетаскивании стены
function getInfoEvent2( wall, walls )
{	
	var p = wall.userData.wall.p;
	
	var ar = { cdm : 'move_wall' };	
	
	ar.wall = { id : wall.userData.id, point1 : { id : p[0].userData.id, pos : p[0].userData.point.last.pos }, point2 : { id : p[1].userData.id, pos : p[1].userData.point.last.pos } };
	ar.walls = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{	
		var n = ar.walls.length; 
		ar.walls[n] = {  };
		
		ar.walls[n].id = walls[i].userData.id;
		//ar.walls[n].pos = walls[i].userData.wall.last.pos;
		//ar.walls[n].rot = walls[i].userData.wall.last.rot;
		ar.walls[n].arrO = [];
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			
			var n2 = ar.walls[n].arrO.length;
			ar.walls[n].arrO[n2] = {};
			
			ar.walls[n].arrO[n2].id = wd.userData.id;			
			ar.walls[n].arrO[n2].pos = wd.userData.door.last.pos;
			ar.walls[n].arrO[n2].rot = wd.userData.door.last.rot; 
		}
	}		
	
	assignArrUR( ar, 'down' );	
	
	 
	var ar = { cdm : 'move_wall' };
	
	ar.wall = { id : wall.userData.id, point1 : { id : p[0].userData.id, pos : p[0].position.clone() }, point2 : { id : p[1].userData.id, pos : p[1].position.clone() } };
	ar.walls = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{	
		var n = ar.walls.length; 
		ar.walls[n] = {  };
		
		ar.walls[n].id = walls[i].userData.id;
		//ar.walls[n].pos = walls[i].position.clone();
		//ar.walls[n].rot = walls[i].rotation.clone();
		ar.walls[n].arrO = [];
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			
			var n2 = ar.walls[n].arrO.length;
			ar.walls[n].arrO[n2] = {};
			
			ar.walls[n].arrO[n2].id = wd.userData.id;			
			ar.walls[n].arrO[n2].pos = wd.position.clone();
			ar.walls[n].arrO[n2].rot = wd.rotation.clone(); 
		}
	}	
	
	assignArrUR( ar, 'up' );
}


// собираем инфо при перетаскивании точки
function getInfoEvent3( point, walls )
{ 
	var ar = { cdm : 'move_point' };		
	

	ar.point = { id : point.userData.id, pos : point.userData.point.last.pos };
	ar.arrO = [];
	
	for ( var i = 0; i < point.w.length; i++ )
	{
		for ( var i2 = 0; i2 < point.w[i].userData.wall.arrO.length; i2++ )
		{
			var wd = point.w[i].userData.wall.arrO[i2];
			ar.arrO[ar.arrO.length] = { id : wd.userData.id, pos : wd.userData.door.last.pos, rot : wd.userData.door.last.rot };  
		}
	}
	
	ar.walls = [];	
	for ( var i = 0; i < walls.length; i++ )
	{	
		var n = ar.walls.length; 
		ar.walls[n] = {  };
		
		ar.walls[n].id = walls[i].userData.id;
		ar.walls[n].arrO = [];
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			
			var n2 = ar.walls[n].arrO.length;
			ar.walls[n].arrO[n2] = {};
			
			ar.walls[n].arrO[n2].id = wd.userData.id;			
			ar.walls[n].arrO[n2].pos = wd.userData.door.last.pos;
			ar.walls[n].arrO[n2].rot = wd.userData.door.last.rot; 
		}
	}
	
	assignArrUR( ar, 'down' );	
	
	var ar = { cdm : 'move_point' };
	ar.point = { id : point.userData.id, pos : point.position.clone() };
	ar.arrO = [];
	
	for ( var i = 0; i < point.w.length; i++ )
	{
		for ( var i2 = 0; i2 < point.w[i].userData.wall.arrO.length; i2++ )
		{
			var wd = point.w[i].userData.wall.arrO[i2];
			ar.arrO[ar.arrO.length] = { id : wd.userData.id, pos : wd.position.clone(), rot : wd.rotation.clone() }; 
		}
	}
	
	ar.walls = [];	
	for ( var i = 0; i < walls.length; i++ )
	{	
		var n = ar.walls.length; 
		ar.walls[n] = {  };
		
		ar.walls[n].id = walls[i].userData.id;
		ar.walls[n].arrO = [];
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			
			var n2 = ar.walls[n].arrO.length;
			ar.walls[n].arrO[n2] = {};
			
			ar.walls[n].arrO[n2].id = wd.userData.id;			
			ar.walls[n].arrO[n2].pos = wd.position.clone();
			ar.walls[n].arrO[n2].rot = wd.rotation.clone(); 
		}
	}		
	
	assignArrUR( ar, 'up' );	
}



// сбор инфо о стене перед удалением стены
function getInfoEvent4_before( wall ) 
{	
	var ar = { cdm : 'delete_wall' };
	ar.wall = { id : wall.userData.id };

	ar.wall.width = wall.userData.wall.width;
	ar.wall.height = wall.userData.wall.height_1;		
	ar.wall.offsetZ = wall.userData.wall.offsetZ;
	ar.wall.material = wall.material;
	ar.wall.userData = { material : wall.userData.material };
	
	ar.wall.p = [];
	ar.wall.p[0] = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone() };
	ar.wall.p[1] = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone() };
	

	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
	ar.wall.wd = [];
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var n = ar.wall.wd.length;
		var wd = wall.userData.wall.arrO[i];
		ar.wall.wd[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		ar.wall.wd[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { ar.wall.wd[n].open_type = wd.userData.door.open_type; }
	}
	
	var oldZones = detectCommonZone_1( wall );	// копируем удаляемые полы
	ar.floors = findNumberInArrRoom( oldZones );
	
	// redo	
	var ar2 = { cdm : 'delete_wall', wall : { id : wall.userData.id } };
	
	return [ar, ar2];
}


function getInfoEvent4( ar1, ar2, arrRoom )
{		 
	var floorsID = []; console.log(arrRoom.length); 
	for ( var i = 0; i < arrRoom.length; i++ ) { floorsID[i] = { id : arrRoom[i].userData.id }; }	// новые полы, которые появились в результате удаления стены

	ar1.delete = { floor : floorsID  };	
	
	assignArrUR( ar1, 'down' );
	
	assignArrUR( ar2, 'up' );
}




// сбор инфо о окне/двери перед удалением 
function getInfoEvent5( wd )
{
	var ar = { cdm : 'delete_dw' };
	ar.wall = { id : wd.userData.door.wall.userData.id };
	ar.wd = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), size : wd.userData.door.size, wall : null, status : 'undoRedo' };
	if(wd.userData.door.open_type) { ar.wd.open_type = wd.userData.door.open_type; }

	assignArrUR( ar, 'down' );

		
	var ar = { cdm : 'delete_dw', wd : { id : wd.userData.id } };
	
	assignArrUR( ar, 'up' );			
}





// сбор инфо о стене перед добавлением на нее окна/двери 
function getInfoEvent6( wd )
{
	var ar = { cdm : 'add_dw', wd : { id : wd.userData.id } };
	
	assignArrUR( ar, 'down' );


	var ar = { cdm : 'add_dw' };
	ar.wall = { id : wd.userData.door.wall.userData.id }; 
	ar.wd = { id : wd.userData.id, lotid : wd.userData.door.lotid, pos : wd.position.clone(), size : wd.userData.door.size, wall : null, status : 'undoRedo' };
	if(wd.userData.door.open_type) { ar.wd.open_type = wd.userData.door.open_type; }	

	assignArrUR( ar, 'up' );
}



// перемещение окна/двери 
function getInfoEvent7( wd )
{
	var ar = { cdm : 'move_dw', wd : { } };
	ar.wd.id = wd.userData.id;
	ar.wd.pos = wd.userData.door.last.pos;
	ar.wd.x = wd.userData.door.last.x;
	ar.wd.y = wd.userData.door.last.y;
	
	assignArrUR( ar, 'down' );	
	
	var ar = { cdm : 'move_dw', wd : { } };
	ar.wd.id = wd.userData.id;
	ar.wd.pos = wd.position.clone();
	ar.wd.x = Math.abs(wd.geometry.vertices[0].x) * 2;
	ar.wd.y = Math.abs(wd.geometry.vertices[0].y) * 2;	
	
	assignArrUR( ar, 'up' );
}



// разбить стену (добавить точку)
function getInfoEvent8( wall_id, point )
{
	var ar = { cdm : 'add_point_on_wall', wall : { id : wall_id }, point : { id : point.userData.id } };
	
	assignArrUR( ar, 'down' );
	
	
	var ar = { cdm : 'add_point_on_wall', walls : {}, point : { id : point.userData.id, pos : point.position.clone() } };
	
	ar.walls.old = { id : wall_id };
	ar.walls.new = [];
	ar.walls.new[0] = { id : point.w[0].userData.id };
	ar.walls.new[1] = { id : point.w[1].userData.id };
	
	assignArrUR( ar, 'up' );	
}



// удалить точку
function getInfoEvent9_before( point )
{
	var ar = { cdm : 'delete_point', walls : {}, point : { id : point.userData.id, pos : point.position.clone() } };			
	
	for ( var i = 0; i < 2; i++ )
	{
		var wall = point.w[i];
		
		ar.walls[i] = { id : wall.userData.id };

		ar.walls[i].width = wall.userData.wall.width;
		ar.walls[i].height = wall.userData.wall.height_1;		
		ar.walls[i].offsetZ = wall.userData.wall.offsetZ;
		ar.walls[i].material = wall.material;
		ar.walls[i].userData = { material : wall.userData.material };		
		

		// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
		ar.walls[i].wd = [];
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
		{
			var wd = wall.userData.wall.arrO[i2];
			ar.walls[i].wd[i2] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
			ar.walls[i].wd[i2].size = wd.userData.door.size;
			if(wd.userData.door.open_type) { ar.walls[i].wd[i2].open_type = wd.userData.door.open_type; }
		}
	}	
	
	return ar;
}



function getInfoEvent9( ar, wall )
{	
	var pointID = ar.point.id;
	ar.delete = { wall : { id : wall.userData.id }  };		
	assignArrUR( ar, 'down' );
	
	
	var ar = { cdm : 'delete_point', new : { wall : { id : wall.userData.id } }, delete : { point : { id : pointID } } };	
	assignArrUR( ar, 'up' );
}



// создание новой стены : от точки до точки / до пустого места
function getInfoEvent10( cdm )  
{ 
	var ar = { cdm : 'create_wall' };
	
	var wall = cdm.wall;
	
	ar.wall = { id : wall.userData.id, point : [] };
	ar.wall.point[0] = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].userData.point.last.pos.clone(), last : wall.userData.wall.p[0].userData.point.last };
	ar.wall.point[1] = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].userData.point.last.pos.clone(), last : wall.userData.wall.p[1].userData.point.last };	
	
	if(cdm.moveOldWall) { ar.moveOldWall = cdm.moveOldWall; }
	
	assignArrUR( ar, 'down' );
	
	
	var ar = { cdm : 'create_wall' };
	ar.active = { id : cdm.point.userData.id };
	ar.wall = { id : wall.userData.id, point : [] };
	
	ar.wall.width = wall.userData.wall.width;
	ar.wall.height = wall.userData.wall.height_1;		
	ar.wall.offsetZ = wall.userData.wall.offsetZ;
	ar.wall.material = wall.material;
	ar.wall.userData = { material : wall.userData.material };	
	
	ar.wall.point[0] = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone(), last : wall.userData.wall.p[0].userData.point.last };
	ar.wall.point[1] = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone(), last : wall.userData.wall.p[1].userData.point.last };
	
	ar.mess = (cdm.mess) ? cdm.mess : '';
	
	if(cdm.moveOldWall) { ar.moveOldWall = cdm.moveOldWall; }
	
	assignArrUR( ar, 'up' );	
}




// соединение старой точки с другой точкой
function getInfoEvent11( cdm )  
{ 
	var ar = { cdm : 'old_point_join_point' };
	
	var wall = cdm.wall;
	var p = cdm.oldPoint;
	
	ar.wall = { id : wall.userData.id };

	ar.wall.width = wall.userData.wall.width;
	ar.wall.height = wall.userData.wall.height_1;		
	ar.wall.offsetZ = wall.userData.wall.offsetZ;
	ar.wall.material = wall.material;
	ar.wall.userData = { material : wall.userData.material };
	
	ar.wall.p = [];
	ar.wall.p[0] = { id : p[0].userData.id, pos : p[0].userData.point.last.pos.clone(), last : p[0].userData.point.last };
	ar.wall.p[1] = { id : p[1].userData.id, pos : p[1].userData.point.last.pos.clone(), last : p[1].userData.point.last };
	

	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
	ar.wall.wd = [];
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var n = ar.wall.wd.length;
		var wd = wall.userData.wall.arrO[i];
		ar.wall.wd[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.userData.door.last.pos, wall : null };
		ar.wall.wd[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { ar.wall.wd[n].open_type = wd.userData.door.open_type; }
	}
	
	assignArrUR( ar, 'down' );
	
	
	var ar = { cdm : 'old_point_join_point' };
	ar.active = { id : cdm.point.userData.id }; 
	
	var p = cdm.newPoint;
	
	ar.wall = { id : wall.userData.id };

	ar.wall.width = wall.userData.wall.width;
	ar.wall.height = wall.userData.wall.height_1;		
	ar.wall.offsetZ = wall.userData.wall.offsetZ;
	ar.wall.material = wall.material;
	ar.wall.userData = { material : wall.userData.material };
	
	ar.wall.p = [];
	ar.wall.p[0] = { id : p[0].userData.id, pos : p[0].position.clone(), last : p[0].userData.point.last };
	ar.wall.p[1] = { id : p[1].userData.id, pos : p[1].position.clone(), last : p[1].userData.point.last };
	

	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
	ar.wall.wd = [];
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var n = ar.wall.wd.length;
		var wd = wall.userData.wall.arrO[i];
		ar.wall.wd[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position, wall : null };
		ar.wall.wd[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { ar.wall.wd[n].open_type = wd.userData.door.open_type; }
	}
	
	assignArrUR( ar, 'up' );	
}





// соединение старой точки со стеной
function getInfoEvent12( cdm )  
{ 
	var ar = { cdm : 'old_point_join_wall' };
	
	var wall = cdm.wall;
	
	ar.wall = { id : wall.userData.id };

	ar.wall.width = wall.userData.wall.width;
	ar.wall.height = wall.userData.wall.height_1;		
	ar.wall.offsetZ = wall.userData.wall.offsetZ;
	ar.wall.material = wall.material;
	ar.wall.userData = { material : wall.userData.material };
	
	ar.wall.p = [];
	ar.wall.p[0] = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].userData.point.last.pos.clone(), last : wall.userData.wall.p[0].userData.point.last };
	ar.wall.p[1] = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].userData.point.last.pos.clone(), last : wall.userData.wall.p[1].userData.point.last };
	

	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
	ar.wall.wd = [];
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var n = ar.wall.wd.length;
		var wd = wall.userData.wall.arrO[i];
		ar.wall.wd[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.userData.door.last.pos, wall : null };
		ar.wall.wd[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { ar.wall.wd[n].open_type = wd.userData.door.open_type; }
	}
	
	ar.delete = { point : { id : cdm.point.userData.id } };
	ar.oldWall = { id : cdm.oldWall.userData.id };
	
	assignArrUR( ar, 'down' );
	
	
	var ar = { cdm : 'old_point_join_wall' };
	ar.active = { id : cdm.point.userData.id };
	
	ar.point = { id : cdm.point.userData.id };
	
	ar.wall = { id : wall.userData.id };

	ar.wall.width = wall.userData.wall.width;
	ar.wall.height = wall.userData.wall.height_1;		
	ar.wall.offsetZ = wall.userData.wall.offsetZ;
	ar.wall.material = wall.material;
	ar.wall.userData = { material : wall.userData.material };
	
	ar.wall.p = [];
	ar.wall.p[0] = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone(), last : wall.userData.wall.p[0].userData.point.last };
	ar.wall.p[1] = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone(), last : wall.userData.wall.p[1].userData.point.last };
	

	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
	ar.wall.wd = [];
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var n = ar.wall.wd.length;
		var wd = wall.userData.wall.arrO[i];
		ar.wall.wd[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position, wall : null };
		ar.wall.wd[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { ar.wall.wd[n].open_type = wd.userData.door.open_type; }
	}
	
	assignArrUR( ar, 'up' );	
}





// меняем толщену стены
function getInfoEvent20(wall, ur)
{	
	var ar = { cdm : 'change_width_wall', wall : { id : wall.userData.id, width : wall.userData.wall.width, offsetZ : wall.userData.wall.offsetZ, z : [wall.userData.wall.v[0].z, wall.userData.wall.v[4].z] } };
	
	var v = wall.userData.wall.v;
	
	if(wall.userData.wall.offsetZ < 0) { var width = Math.round(Math.abs(v[0].z) * 1000); }
	else if(wall.userData.wall.offsetZ > 0) { var width = Math.round(Math.abs(v[4].z) * 1000); }	
	else { var width = Math.round((Math.abs(v[0].z) + Math.abs(v[4].z)) * 1000); }

	ar.wall.width = width;
	
	assignArrUR( ar, ur );
}



// сбор инфо при изменении длины стены
function getInfoEvent21( wall, ur )
{		
	var p = wall.userData.wall.p;
	var walls = detectChangeArrWall_2(wall);

	var ar = { cdm : 'change_length_wall' };
	
	ar.wall = { id : wall.userData.id, point1 : { id : p[0].userData.id, pos : p[0].position.clone() }, point2 : { id : p[1].userData.id, pos : p[1].position.clone() } };
	ar.walls = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{	
		var n = ar.walls.length; 
		ar.walls[n] = {  };
		
		ar.walls[n].id = walls[i].userData.id;
		//ar.walls[n].pos = walls[i].position.clone();
		//ar.walls[n].rot = walls[i].rotation.clone();
		ar.walls[n].arrO = [];
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			
			var n2 = ar.walls[n].arrO.length;
			ar.walls[n].arrO[n2] = {};
			
			ar.walls[n].arrO[n2].id = wd.userData.id;			
			ar.walls[n].arrO[n2].pos = wd.position.clone();
			ar.walls[n].arrO[n2].rot = wd.rotation.clone(); 
		}
	}	
	
	assignArrUR( ar, ur );	
}



// изменение текстуры на стене
function getInfoEvent22( cdm, json )
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'change_texture' };
	
	var m = (obj.userData.tag == 'wall') ? obj.userData.material[cdm.index] : obj.userData.material;
	
	ar.wall = { id : obj.userData.id, tag : obj.userData.tag, material : {} };
	m.color.r = Math.round(m.color.r * 100);
	m.color.g = Math.round(m.color.g * 100);
	m.color.b = Math.round(m.color.b * 100);	
	ar.wall.material = { lotid : m.lotid, color : m.color, scale : m.size, index : (cdm.index) ? cdm.index : null }; 	
	
	assignArrUR( ar, 'down' );
	
	
	var ar = { cdm : 'change_texture' };	
	 
	var lotid = json.id;  
	var size = json.size; 
	var color = json.color; 

	ar.wall = { id : obj.userData.id, tag : obj.userData.tag, material : {} };
	var color = { r : Math.round(color.r * 100), g : Math.round(color.g * 100), b : Math.round(color.b * 100) };

	ar.wall.material = { lotid : lotid, color : color, scale : size, index : (cdm.index) ? cdm.index : null }; 
	
	assignArrUR( ar, 'up' );
}


//------------------------


// восстанавливаем 
function setInfoEvent1( cdm )
{		  
	var n = (cdm == 'redo') ? leng_ur + 1 : leng_ur;	
	
	if(n < 0 | n > (param_usU.length - 1)){ return; }
	
	leng_ur = n;
	
	if(cdm == 'undo'){ ndsf = 1; }
	else if(cdm == 'redo'){ ndsf = 2; }   
	
	resetActiveObj();
	
	if(param_usU[n].cdm == 'move_point'){ setInfoEvent3(); }
	else if(param_usU[n].cdm == 'move_wall'){ setInfoEvent2(); }
	else if(param_usU[n].cdm == 'delete_wall'){ setInfoEvent4(); }	
	else if(param_usU[n].cdm == 'delete_dw'){ setInfoEvent5(); }
	else if(param_usU[n].cdm == 'add_dw'){ setInfoEvent6(); }
	else if(param_usU[n].cdm == 'move_dw'){ setInfoEvent7(); }	
	else if(param_usU[n].cdm == 'add_point_on_wall'){ setInfoEvent8(); }
	else if(param_usU[n].cdm == 'delete_point'){ setInfoEvent9(); }		
	else if(param_usU[n].cdm == 'create_wall'){ setInfoEvent10(); }
	else if(param_usU[n].cdm == 'old_point_join_point'){ setInfoEvent11(); }
	else if(param_usU[n].cdm == 'old_point_join_wall'){ setInfoEvent12(); }
	else if(param_usU[n].cdm == 'change_width_wall'){ setInfoEvent20(); }
	else if(param_usU[n].cdm == 'change_length_wall'){ setInfoEvent21(); }
	else if(param_usU[n].cdm == 'change_texture'){ setInfoEvent22(); }
	
	var n = leng_ur;	
	if(ndsf == 1) { console.log('undo', param_usU[n]); }			// удаляем окно/дверь
	else if(ndsf == 2) { console.log('redo', param_usR[n]); }		// восстанавливаем окно/дверь				
	
	if(cdm == 'undo'){ leng_ur -= 1; }		
}







// восстанавливаем положение стены (после того, как подвигали)
function setInfoEvent2()
{	
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем положение до переноса
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем положение после переноса	

	var wall = findObjFromId( 'wall', ar.wall.id );
	
	var walls = [];
	for ( var i = 0; i < ar.walls.length; i++ ) { walls[walls.length] = findObjFromId( 'wall', ar.walls[i].id ); }
	clickMovePoint_BSP(walls);
	
	forceAssignActiveObj(wall); 	// выделение/активация объекта
	
	var point1 = findObjFromId( 'point', ar.wall.point1.id );	point1.position.copy( ar.wall.point1.pos );
	var point2 = findObjFromId( 'point', ar.wall.point2.id );	point2.position.copy( ar.wall.point2.pos );
	
	
	for ( var i = 0; i < point1.p.length; i++ ) { updateWall(point1.w[i], point1.p[i], point1, point1.start[i]); }	
	for ( var i = 0; i < point2.p.length; i++ ) { updateWall(point2.w[i], point2.p[i], point2, point2.start[i]); }	
	
	upLineYY( point1 ); 
	upLineYY( point2 );	
	
	
	for ( var i = 0; i < ar.walls.length; i++ )
	{
		for ( var i2 = 0; i2 < ar.walls[i].arrO.length; i2++ )
		{
			var wd = findObjFromId( 'wd', ar.walls[i].arrO[i2].id );
			wd.position.copy( ar.walls[i].arrO[i2].pos );
			wd.rotation.copy( ar.walls[i].arrO[i2].rot );
		}
	}
	
	upLabelPlan_1(walls);	
	updateShapeFloor( compileArrPickZone(wall) );	
	clickPointUP_BSP(walls);
	
	if(camera == camera3D) { updateFormPlinths( detectCommonZone_1( wall ) ); }

	lineAxis_1.visible = false;
	lineAxis_2.visible = false;	
}


// восстанавливаем положение точки (после того, как подвигали)
function setInfoEvent3()
{
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем положение до переноса
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем положение после переноса	
	
	var walls = [];
	for ( var i = 0; i < ar.walls.length; i++ ) { walls[walls.length] = findObjFromId( 'wall', ar.walls[i].id ); }	
	clickMovePoint_BSP(walls);	
	
	var point = findObjFromId( 'point', ar.point.id );
	
	forceAssignActiveObj(point); 	// выделение/активация объекта
	
	point.userData.point.last.pos = ar.point.pos; 		
	
	for ( var i = 0; i < ar.walls.length; i++ )
	{
		for ( var i2 = 0; i2 < ar.walls[i].arrO.length; i2++ )
		{
			var wd = findObjFromId( 'wd', ar.walls[i].arrO[i2].id );
			wd.userData.door.last.pos = ar.walls[i].arrO[i2].pos;
			wd.userData.door.last.rot = ar.walls[i].arrO[i2].rot; 			
		}
	}
	
	undoRedoChangeMovePoint( point, walls );

	if(camera == camera3D) { updateFormPlinths(point.zone); }
}

	
// восстанавливаем стены (после того, как удалили)
function setInfoEvent4()
{	
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем положение до переноса
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем положение после переноса		
	
	if(ndsf == 1)	// восстанавливаем стены
	{ 
		var point1 = findObjFromId( 'point', ar.wall.p[0].id );
		var point2 = findObjFromId( 'point', ar.wall.p[1].id );	
		
		if(point1 == null) { point1 = createPoint( ar.wall.p[0].pos, ar.wall.p[0].id ); }
		if(point2 == null) { point2 = createPoint( ar.wall.p[1].pos, ar.wall.p[1].id ); }			
		
		var wall = createOneWall3( point1, point2, ar.wall.width, { id : ar.wall.id, offsetZ : ar.wall.offsetZ, height : ar.wall.height } );
		
		wall.material = ar.wall.material;
		wall.userData.material = Object.assign({}, ar.wall.userData.material);
		
		// вставляем окна/двери
		for ( var i = 0; i < ar.wall.wd.length; i++ ) { ar.wall.wd[i].wall = wall; loadPopObj_1(ar.wall.wd[i]); }
		
		
		var walls = detectChangeArrWall_2(wall);		
		//for ( var i = 0; i < walls.length; i++ ){ if(walls[i].userData.id == wall.userData.id) { obj_line.splice(i, 1); break; } }
		clickMovePoint_BSP(walls);
		
		upLineYY( point1 );
		upLineYY( point2 );			
		
		upLabelPlan_1( point1.w );
		upLabelPlan_1( point2.w );		

		
		var arrRoom = [];	
		for ( var i = 0; i < ar.delete.floor.length; i++ ) { arrRoom[i] = findObjFromId( 'room', ar.delete.floor[i].id ); }  
		deleteArrZone(arrRoom);		// удаляем зоны		 

		var newZones = detectRoomZone(nameRoomDef);				// создаем пол, для новых помещений	
		assignOldToNewZones_1(ar.floors, newZones, 'copy');		// передаем параметры старых зон новым	(название зоны)	

		clickPointUP_BSP(walls);

		forceAssignActiveObj(wall); 	// выделение/активация объекта
	}
	else if(ndsf == 2)	// удаляем стены
	{  
		var wall = findObjFromId( 'wall', ar.wall.id );
		
		deleteWall_1( wall );  
	}		
}



// восстанавливаем окно/дверь (после того, как удалили)
function setInfoEvent5()
{
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем окно/дверь
	else if(ndsf == 2) { var ar = param_usR[n]; }		// удаляем окно/дверь			
 
	if(ndsf == 1)	
	{ 
		ar.wd.wall = findObjFromId( 'wall', ar.wall.id );
		loadPopObj_1(ar.wd);
	}
	else if(ndsf == 2)	
	{ 
		deleteWinDoor( findObjFromId( 'wd', ar.wd.id ) ); 
	}
}



// удаляем окно/дверь (после того, как добавил на стену окно/дверь)
function setInfoEvent6()
{
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// удаляем окно/дверь
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем окно/дверь			
	
	if(ndsf == 1)	
	{ 
		deleteWinDoor( findObjFromId( 'wd', ar.wd.id ) );
	}
	else if(ndsf == 2)	
	{ 
		ar.wd.wall = findObjFromId( 'wall', ar.wall.id );
		loadPopObj_1(ar.wd);
	}		
}




// возращаем окно/дверь после перемещения или изменения размеров
function setInfoEvent7()
{
	var n = leng_ur;		
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// возращаем окно/дверь после перемещения
	else if(ndsf == 2) { var ar = param_usR[n]; }		// возращаем окно/дверь после перемещения	

	var wd = findObjFromId( 'wd', ar.wd.id );
	
	wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
	wallClone.position.copy( wd.userData.door.wall.position ); 
	wallClone.rotation.copy( wd.userData.door.wall.rotation );	
	  
	сhangeSizePosWD( wd, ar.wd.pos, ar.wd.x, ar.wd.y );
	
	objsBSP = { wall : wallClone, wd : createCloneWD_BSP( wd ) };

	MeshBSP( wd, objsBSP );

	
	//forceAssignActiveObj(wd); 	// выделение/активация объекта
	
	//clickToolDoorUp(wd); 
}


// удаляем точку после ее добавления на стену
function setInfoEvent8()
{
	var n = leng_ur;		

	
	if(ndsf == 1) { var ar = param_usU[n]; }			// возращаем окно/дверь после перемещения
	else if(ndsf == 2) { var ar = param_usR[n]; }		// возращаем окно/дверь после перемещения		
	
	if(ndsf == 1) // удаляем точку
	{ 		
		var wall = deletePoint( findObjFromId( 'point', ar.point.id ) ).wall;	
		
		wall.userData.id = ar.wall.id;   
	}
	else if(ndsf == 2) // добавляем точку на стену, делим стену
	{ 
		var wall = findObjFromId( 'wall', ar.walls.old.id );
		var point = createPoint( ar.point.pos, ar.point.id );
		
		addPoint_1( wall, point );
		
		point.w[0].userData.id = ar.walls.new[0].id;
		point.w[1].userData.id = ar.walls.new[1].id;
		
		forceAssignActiveObj(point); 	// выделение/активация объекта	
	}	
	
}



// восстанавливаем точку после ее удаления
function setInfoEvent9()
{
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем точку
	else if(ndsf == 2) { var ar = param_usR[n]; }		// удаляем точку		
	
	if(ndsf == 1)	
	{ 
		var wall = findObjFromId( 'wall', ar.delete.wall.id );
		var point = createPoint( ar.point.pos, ar.point.id );
		
		addPoint_1( wall, point );
		
		point.w[0].userData.id = ar.walls[0].id;
		point.w[1].userData.id = ar.walls[1].id;
		
		
		for ( var i = 0; i < 2; i++ )
		{
			var w = ar.walls[i];
			var wall = findObjFromId( 'wall', w.id );			
			
			wall.material = w.material;
			wall.userData.material = Object.assign({}, w.userData.material);

			// вставляем окна/двери
			for ( var i2 = 0; i2 < w.wd.length; i2++ ) { w.wd[i2].wall = wall; loadPopObj_1(w.wd[i2]); }
		}		

		forceAssignActiveObj( point ); 	// выделение/активация объекта		
	}
	else if(ndsf == 2)	
	{  
		var wall = deletePoint( findObjFromId( 'point', ar.delete.point.id ) ).wall;  
		
		wall.userData.id = ar.new.wall.id;
	}			
}


 


// удаляем стену после создания (стена была создана от точки)
// удаляем стену после создания (стена была создана из пустого места)
function setInfoEvent10()
{
	var n = leng_ur;

	if(ndsf == 1) { var ar = param_usU[n]; }			// удаляем стену (после создания)
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем стену			
	
	if(ndsf == 1) // удаляем стену или перемещаем (если это старая точка)
	{ 		
		var point1 = findObjFromId( 'point', ar.wall.point[0].id );
		var point2 = findObjFromId( 'point', ar.wall.point[1].id );
		
		point1.userData.point.last = ar.wall.point[0].last;
		point2.userData.point.last = ar.wall.point[1].last;		
		
		deleteWall_1( findObjFromId( 'wall', ar.wall.id ) );
		
		if(point1.userData.point.last.cdm == 'new_point_1') { deletePoint( point1 ).wall.userData.id = point1.userData.point.last.cross.walls.old; }
		if(point2.userData.point.last.cdm == 'new_point_2') { deletePoint( point2 ).wall.userData.id = point2.userData.point.last.cross.walls.old; } 
	}
	else if(ndsf == 2) // восстанавливаем
	{ 	
		var point1 = findObjFromId( 'point', ar.wall.point[0].id );
		var point2 = findObjFromId( 'point', ar.wall.point[1].id );
		
		if(point1 == null) { point1 = createPoint( ar.wall.point[0].pos, ar.wall.point[0].id ); }
		if(point2 == null) { point2 = createPoint( ar.wall.point[1].pos, ar.wall.point[1].id ); }
		
		point1.userData.point.last = ar.wall.point[0].last;
		point2.userData.point.last = ar.wall.point[1].last;
		
		var wall = createOneWall3( point1, point2, ar.wall.width, { id : ar.wall.id, offsetZ : ar.wall.offsetZ, height : ar.wall.height } );		
		wall.material = ar.wall.material;
		wall.userData.material = Object.assign({}, ar.wall.userData.material);		
		
		if(point1.userData.point.last.cdm == 'new_point_1')
		{
			var arrW = splitWalls( findObjFromId( 'wall', point1.userData.point.last.cross.walls.old ), point1 ); 			
			
			if(arrW[0].userData.wall.p[0].userData.id == point1.userData.point.last.cross.walls.new[0].p2.id)
			{
				arrW[0].userData.id = point1.userData.point.last.cross.walls.new[0].id;
				arrW[1].userData.id = point1.userData.point.last.cross.walls.new[1].id;			 		
			}
			else
			{
				arrW[0].userData.id = point1.userData.point.last.cross.walls.new[1].id;
				arrW[1].userData.id = point1.userData.point.last.cross.walls.new[0].id;			 		
			}			
		}		 
		
		if(point2.userData.point.last.cdm == 'new_point_2')
		{
			var arrW = splitWalls( findObjFromId( 'wall', point2.userData.point.last.cross.walls.old ), point2 ); 			
			
			if(arrW[0].userData.wall.p[0].userData.id == point2.userData.point.last.cross.walls.new[0].p2.id)
			{
				arrW[0].userData.id = point2.userData.point.last.cross.walls.new[0].id;
				arrW[1].userData.id = point2.userData.point.last.cross.walls.new[1].id;			 		
			}
			else
			{
				arrW[0].userData.id = point2.userData.point.last.cross.walls.new[1].id;
				arrW[1].userData.id = point2.userData.point.last.cross.walls.new[0].id;			 		
			}					
		}	
		
		if(point1.userData.point.last.cdm == 'new_point_1' || point2.userData.point.last.cdm == 'new_point_2'){}
		else
		{
			var arrW = detectChangeArrWall_3(wall);
			clickMovePoint_BSP( arrW );	
			upLineYY_2(point1, point1.p, point1.w, point1.start);
			upLineYY_2(point2, point2.p, point2.w, point2.start);
			//console.log(detectChangeArrWall_3(wall));
			upLabelPlan_1( arrW );
			clickPointUP_BSP( arrW );
			
			if(ar.mess == 'zone') { splitZone(wall); }			
		}	

		forceAssignActiveObj(findObjFromId( 'point', ar.active.id )); 	// выделение/активация объекта 
	}	
	
}


 



// восстанавливаем старое положение стены, после того как мы перетощили точку и соеденили с точкой
function setInfoEvent11()
{
	var n = leng_ur;

	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем старое положение стены
	else if(ndsf == 2) { var ar = param_usR[n]; }		// соединяем старую точку с точкой		
	
	if(ndsf == 1) 
	{ 		
		deleteWall_1( findObjFromId( 'wall', ar.wall.id ) );
		
		var point1 = findObjFromId( 'point', ar.wall.p[0].id );
		var point2 = findObjFromId( 'point', ar.wall.p[1].id );		
		
		//if(ar.delete) { deletePoint( findObjFromId( 'point', ar.delete.point.id ) ).wall.userData.id = point1.userData.point.last.cross.walls.old; }		

		if(point1 == null) { point1 = createPoint( ar.wall.p[0].pos, ar.wall.p[0].id ); }
		if(point2 == null) { point2 = createPoint( ar.wall.p[1].pos, ar.wall.p[1].id ); }

		point1.userData.point.last = ar.wall.p[0].last;
		point2.userData.point.last = ar.wall.p[1].last;			
		
		var wall = createOneWall3( point1, point2, ar.wall.width, { id : ar.wall.id, offsetZ : ar.wall.offsetZ, height : ar.wall.height } );
		wall.material = ar.wall.material;
		wall.userData.material = Object.assign({}, ar.wall.userData.material);		
		
		var arrW = detectChangeArrWall_3(wall)
		
		clickMovePoint_BSP( arrW );	
		upLineYY_2(point1, point1.p, point1.w, point1.start);		
		upLineYY_2(point2, point2.p, point2.w, point2.start);		
		upLabelPlan_1( arrW );
		clickPointUP_BSP( arrW );				
		
		// вставляем окна/двери
		for ( var i = 0; i < ar.wall.wd.length; i++ ) { ar.wall.wd[i].wall = wall; loadPopObj_1(ar.wall.wd[i]); }

	}
	else if(ndsf == 2) 
	{ 
		deleteWall_1( findObjFromId( 'wall', ar.wall.id ) );
		
		var point1 = findObjFromId( 'point', ar.wall.p[0].id );
		var point2 = findObjFromId( 'point', ar.wall.p[1].id );		
		
		//if(ar.delete) { deletePoint( findObjFromId( 'point', ar.delete.point.id ) ).wall.userData.id = point1.userData.point.last.cross.walls.old; }		

		if(point1 == null) { point1 = createPoint( ar.wall.p[0].pos, ar.wall.p[0].id ); }
		if(point2 == null) { point2 = createPoint( ar.wall.p[1].pos, ar.wall.p[1].id ); }

		point1.userData.point.last = ar.wall.p[0].last;
		point2.userData.point.last = ar.wall.p[1].last;			
		
		var wall = createOneWall3( point1, point2, ar.wall.width, { id : ar.wall.id, offsetZ : ar.wall.offsetZ, height : ar.wall.height } );
		wall.material = ar.wall.material;
		wall.userData.material = Object.assign({}, ar.wall.userData.material);		
		
		var arrW = detectChangeArrWall_3(wall)
		
		clickMovePoint_BSP( arrW );	
		upLineYY_2(point1, point1.p, point1.w, point1.start);		
		upLineYY_2(point2, point2.p, point2.w, point2.start);		
		upLabelPlan_1( arrW );
		clickPointUP_BSP( arrW );				
		
		// вставляем окна/двери
		for ( var i = 0; i < ar.wall.wd.length; i++ ) { ar.wall.wd[i].wall = wall; loadPopObj_1(ar.wall.wd[i]); }
		
		
		splitZone(wall);				// создаем пол, для новых помещений		

		forceAssignActiveObj(findObjFromId( 'point', ar.active.id )); 	// выделение/активация объекта 
	}	
	
}
 



 
// восстанавливаем старое положение стены, после того как мы перетощили точку и соеденили со стеной
function setInfoEvent12()
{
	var n = leng_ur;

	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем старое положение стены
	else if(ndsf == 2) { var ar = param_usR[n]; }		// соединяем старую точку со стеной		
	
	if(ndsf == 1) 
	{ 		
		deleteWall_1( findObjFromId( 'wall', ar.wall.id ) );			
		
		if(ar.delete) { deletePoint( findObjFromId( 'point', ar.delete.point.id ) ).wall.userData.id = ar.oldWall.id; }	 

		var point1 = findObjFromId( 'point', ar.wall.p[0].id );
		var point2 = findObjFromId( 'point', ar.wall.p[1].id );			

		if(point1 == null) { point1 = createPoint( ar.wall.p[0].pos, ar.wall.p[0].id ); }
		if(point2 == null) { point2 = createPoint( ar.wall.p[1].pos, ar.wall.p[1].id ); }

		point1.userData.point.last = ar.wall.p[0].last;
		point2.userData.point.last = ar.wall.p[1].last;			
		
		var wall = createOneWall3( point1, point2, ar.wall.width, { id : ar.wall.id, offsetZ : ar.wall.offsetZ, height : ar.wall.height } );
		wall.material = ar.wall.material;
		wall.userData.material = Object.assign({}, ar.wall.userData.material);		
		
		var arrW = detectChangeArrWall_3(wall)
		
		clickMovePoint_BSP( arrW );	
		upLineYY_2(point1, point1.p, point1.w, point1.start);		
		upLineYY_2(point2, point2.p, point2.w, point2.start);		
		upLabelPlan_1( arrW );
		clickPointUP_BSP( arrW );				
		
		// вставляем окна/двери
		for ( var i = 0; i < ar.wall.wd.length; i++ ) { ar.wall.wd[i].wall = wall; loadPopObj_1(ar.wall.wd[i]); }

	}
	else if(ndsf == 2) 
	{ 
		deleteWall_1( findObjFromId( 'wall', ar.wall.id ) );
		
		var point1 = findObjFromId( 'point', ar.wall.p[0].id );
		var point2 = findObjFromId( 'point', ar.wall.p[1].id );			

		if(point1 == null) { point1 = createPoint( ar.wall.p[0].pos, ar.wall.p[0].id ); }
		if(point2 == null) { point2 = createPoint( ar.wall.p[1].pos, ar.wall.p[1].id ); }

		point1.userData.point.last = ar.wall.p[0].last;
		point2.userData.point.last = ar.wall.p[1].last;			
		
		var wall = createOneWall3( point1, point2, ar.wall.width, { id : ar.wall.id, offsetZ : ar.wall.offsetZ, height : ar.wall.height } );
		wall.material = ar.wall.material;
		wall.userData.material = Object.assign({}, ar.wall.userData.material);

		// вставляем окна/двери
		for ( var i = 0; i < ar.wall.wd.length; i++ ) { ar.wall.wd[i].wall = wall; loadPopObj_1(ar.wall.wd[i]); }		
		
		
		if(1==1)
		{
			var point1 = findObjFromId( 'point', ar.point.id );
			
			var arrW = splitWalls( findObjFromId( 'wall', point1.userData.point.last.cross.walls.old ), point1 ); 			
			
			if(arrW[0].userData.wall.p[0].userData.id == point1.userData.point.last.cross.walls.new[0].p2.id)
			{
				arrW[0].userData.id = point1.userData.point.last.cross.walls.new[0].id;
				arrW[1].userData.id = point1.userData.point.last.cross.walls.new[1].id;			 		
			}
			else
			{
				arrW[0].userData.id = point1.userData.point.last.cross.walls.new[1].id;
				arrW[1].userData.id = point1.userData.point.last.cross.walls.new[0].id;			 		
			}			
		}	

		forceAssignActiveObj(findObjFromId( 'point', ar.active.id )); 	// выделение/активация объекта 
	}	
	
}




 
// восстанавливаем ширину стены
function setInfoEvent20()
{
	var n = leng_ur;			
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем ширину стены (undo)
	else if(ndsf == 2) { var ar = param_usR[n]; }		// redo				
	
	var wall = findObjFromId( 'wall', ar.wall.id );
	showLengthWallUI( wall );	

	inputWidthWall_2(wall, ar.wall.z);
	
	var str = '[data-value="wallRedBlueArrow"]';	
	if(ar.wall.offsetZ < 0) { str = '[data-value="wallBlueArrow"]'; }
	else if(ar.wall.offsetZ > 0) { str = '[data-value="wallRedArrow"]'; }
	
	clickO.obj = wall;
	switchRadioBtn($('[data-action="wall-resize"]'), $(str));
	//UI('wall_width_1').val(ar.wall.width);	
	
	if(camera == camera3D) { updateFormPlinths( detectCommonZone_1( wall ) ); }
}



// восстанавливаем длину стены
function setInfoEvent21()
{	
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем положение до переноса
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем положение после переноса	

	var wall = findObjFromId( 'wall', ar.wall.id );
	
	var walls = [];
	for ( var i = 0; i < ar.walls.length; i++ ) { walls[walls.length] = findObjFromId( 'wall', ar.walls[i].id ); }
	clickMovePoint_BSP(walls);
	
	forceAssignActiveObj(wall); 	// выделение/активация объекта
	
	var point1 = findObjFromId( 'point', ar.wall.point1.id );	point1.position.copy( ar.wall.point1.pos );
	var point2 = findObjFromId( 'point', ar.wall.point2.id );	point2.position.copy( ar.wall.point2.pos );
	
	
	for ( var i = 0; i < point1.p.length; i++ ) { updateWall(point1.w[i], point1.p[i], point1, point1.start[i]); }	
	for ( var i = 0; i < point2.p.length; i++ ) { updateWall(point2.w[i], point2.p[i], point2, point2.start[i]); }	
	
	upLineYY( point1 ); 
	upLineYY( point2 );	
	
	
	for ( var i = 0; i < ar.walls.length; i++ )
	{
		for ( var i2 = 0; i2 < ar.walls[i].arrO.length; i2++ )
		{
			var wd = findObjFromId( 'wd', ar.walls[i].arrO[i2].id );
			wd.position.copy( ar.walls[i].arrO[i2].pos );
			wd.rotation.copy( ar.walls[i].arrO[i2].rot );
		}
	}
	
	upLabelPlan_1(walls);	
	updateShapeFloor( compileArrPickZone(wall) );	
	clickPointUP_BSP(walls);
	
	if(camera == camera3D) { updateFormPlinths( detectCommonZone_1( wall ) ); }

	lineAxis_1.visible = false;
	lineAxis_2.visible = false;	
}



// восстанавливаем текстуру
function setInfoEvent22()
{
	var n = leng_ur;
	
	if(ndsf == 1) { var ar = param_usU[n]; }			// восстанавливаем положение до переноса
	else if(ndsf == 2) { var ar = param_usR[n]; }		// восстанавливаем положение после переноса		
	
	loadPopObj_1({ obj: findObjFromId( ar.wall.tag, ar.wall.id ), lotid: ar.wall.material.lotid, index: ar.wall.material.index, rgb : ar.wall.material.color, scale : ar.wall.material.scale });	
}



// находим стены/точки/объекты по id
function findObjFromId( cdm, id )
{
	if(cdm == 'wall')
	{
		for ( var i = 0; i < obj_line.length; i++ ){ if(obj_line[i].userData.id == id){ return obj_line[i]; } }			
	}
	else if(cdm == 'point')
	{
		for ( var i = 0; i < obj_point.length; i++ ){ if(obj_point[i].userData.id == id){ return obj_point[i]; } }
	}
	else if(cdm == 'wd')
	{
		for ( var i = 0; i < arr_window.length; i++ ){ if(arr_window[i].userData.id == id){ return arr_window[i]; } }
		for ( var i = 0; i < arr_door.length; i++ ){ if(arr_door[i].userData.id == id){ return arr_door[i]; } }
	}
	else if(cdm == 'window')
	{
		for ( var i = 0; i < arr_window.length; i++ ){ if(arr_window[i].userData.id == id){ return arr_window[i]; } }
	}
	else if(cdm == 'door')
	{
		for ( var i = 0; i < arr_door.length; i++ ){ if(arr_door[i].userData.id == id){ return arr_door[i]; } }
	}
	else if(cdm == 'room')
	{
		for ( var i = 0; i < room.length; i++ ){ if(room[i].userData.id == id){ return room[i]; } }
	}	
	return null;
}


