



// кликнули на стену (в таблице показываем длину стены)
function showLengthWallUI( wall )
{
	UI.showToolbar('wall-2d-toolbar');
		
	var v = wall.userData.wall.v; 		
	var d1 = Math.abs( v[6].x - v[0].x );		
	var d2 = Math.abs( v[10].x - v[4].x );	
	
	UI('wall_length_1').val(Math.round(d1 * 100) * 10);
	UI('wall_length_2').val(Math.round(d2 * 100) * 10);			

	toggleButtonMenuWidthWall(wall);
}


// подготовка, собираем данные о соседних стенах и объектах (окна,двери)
function prepareInfoClickWall(wall)
{	
	var s1 = [];
	var s2 = [];
	var m = 0;
	for ( var i = 0; i < wall.userData.wall.p[0].w.length; i++ ){ if(wall.userData.wall.p[0].w[i] != wall) { s1[m] = i; m++; } }
	var m = 0;
	for ( var i = 0; i < wall.userData.wall.p[1].w.length; i++ ){ if(wall.userData.wall.p[1].w[i] != wall) { s2[m] = i; m++; } }		
	
	arrM = [];	
	var m2 = 0;
	var p = wall.userData.wall.p;
	for ( var i = 0; i < s1.length; i++ ){ arrM[m2] = [ p[0].w[ s1[i] ], p[0].p[ s1[i] ], p[0], p[0].start[ s1[i] ] ]; m2++; }	
	for ( var i = 0; i < s2.length; i++ ){ arrM[m2] = [ p[1].w[ s2[i] ], p[1].p[ s2[i] ], p[1], p[1].start[ s2[i] ] ]; m2++; }
	
	rel_pos = [];
	for ( var i = 0; i < arrM.length; i++ )
	{
		arrM[i][0].updateMatrixWorld();
		if(arrM[i][0].userData.wall.arrO.length > 0) { rel_pos[i] = getArrPosRelatively( arrM[i][0].userData.wall.arrO, arrM[i][0].userData.wall.p[0].position, arrM[i][0].userData.wall.p[1].position, arrM[i][3] ); }		
	}		
}



// миняем длину стены 
function inputLengthWall_2(wall, sideWall, inputName)
{
	prepareInfoClickWall(wall);  
	
	var wallR = detectChangeArrWall_2(wall);
	clickMovePoint_BSP(wallR);	

	var p1 = wall.userData.wall.p[1];
	var p0 = wall.userData.wall.p[0];	
 	
	
	var ns = 0;
	var flag = true;
	while ( flag )
	{	 
		var v = wall.userData.wall.v;

		var d = 0;
		if(inputName == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x ); var input_txt = UI('wall_length_1').val(); } 
		else if(inputName == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x ); var input_txt = UI('wall_length_2').val(); }
		d = Math.round(d * 1000);
		
		var sub = (input_txt - d) / 1000;
		if(sideWall == 'wallRedBlue') { sub /= 2; }	
		
		var dir = new THREE.Vector3().subVectors(p1.position, p0.position).normalize();
		var dir = new THREE.Vector3().addScaledVector( dir, sub );	

		if(sideWall == 'wallBlueDot')
		{ 
			var offset = new THREE.Vector3().addVectors( p1.position, dir ); 
			p1.position.copy( offset ); 
		}
		else if(sideWall == 'wallRedDot')
		{ 
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset ); 
			wall.position.copy( offset );
		}
		else if(sideWall == 'wallRedBlue')
		{ 			
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset );
			wall.position.copy( offset );
			
			p1.position.copy( new THREE.Vector3().addVectors( p1.position, dir ) );				
		}
		
		wall.geometry = createGeometryWall(p0.position.distanceTo( p1.position ), wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);	// обновляем стену до простой стены					
		
		wall.geometry.verticesNeedUpdate = true; 
		wall.geometry.elementsNeedUpdate = true;
		wall.geometry.computeBoundingBox();
		wall.geometry.computeBoundingSphere();	
		wall.geometry.computeFaceNormals();	

		for ( var i = 0; i < arrM.length; i++ ) 
		{  
			if(wall != arrM[i][0]) { updateWall(arrM[i][0], arrM[i][1], arrM[i][2], arrM[i][3]); } 
			if(arrM[i][0].userData.wall.arrO.length > 0){ moveObjsWall( arrM[i][0].userData.wall.arrO, arrM[i][0].userData.wall.p[0].position, arrM[i][0].userData.wall.p[1].position, rel_pos[i], arrM[i][3] ); }       
		} 		
		
		upLineYY(p0);
		upLineYY(p1);
		upLabelPlan_1( [wall] );
		if(inputName == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x ); }
		else if(inputName == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x ); }
		d = Math.round(d * 1000);

		if(input_txt - d == 0){ flag = false; }
		
		if(ns > 5){ flag = false; }
		ns++;
	} 	
	 
	upLabelPlan_1( wallR );		
	updateShapeFloor( compileArrPickZone(wall) );  				 			
	
	showLengthWallUI(wall);
	
	clickPointUP_BSP(wallR);
}




// изменение длины стены
function updateWall(wall, point_0, point_1, side) 
{
	if(side == 1) { var p0 = point_0; var p1 = point_1; }
	else if(side == 0) { var p1 = point_0; var p0 = point_1; }
		
	//wall.updateMatrixWorld(); перенес на момент клика
	var v = wall.geometry.vertices;
 
	var dist = p0.position.distanceTo(p1.position);
	
	v[0].x = v[1].x = v[2].x = v[3].x = v[4].x = v[5].x = 0;
	v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = dist;
 
	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	wall.geometry.computeBoundingBox();	
	wall.geometry.computeBoundingSphere();	
	wall.geometry.computeFaceNormals();
	


	var dir = new THREE.Vector3().subVectors(p0.position, p1.position).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);

	wall.position.copy( p0.position );		
}





// изменение ширины стены
function inputWidthWall() 
{
	if(!clickO.obj){ return; } 
	if(clickO.obj.userData.tag != 'wall'){ return; } 

	var wall = clickO.obj;
	var wallR = detectChangeArrWall_2(wall);
	
	clickMovePoint_BSP(wallR);
			
	var v = wall.geometry.vertices;
	
	var type = UI('wall-resize').val();
	var width = Number(UI('wall_width_1').val()) / 1000;
	var z = [0,0];
	
	if(type == 'wallRedBlueArrow')
	{ 	
		width = (width < 0.01) ? 0.01 : width;
		width /= 2;		
		z = [width, -width];		
		var value = Math.round(width * 2 * 1000);
	}
	else if(type == 'wallBlueArrow')
	{ 
		width = (Math.abs(Math.abs(v[4].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[4].z) : width;   		
		z = [width, v[4].z];
		var value = width * 1000;
	}
	else if(type == 'wallRedArrow')
	{		 
		width = (Math.abs(Math.abs(v[0].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[0].z) : width;    		
		z = [v[0].z, -width];
		var value = width * 1000;
	}

	v[0].z = v[1].z = v[6].z = v[7].z = z[0];
	v[4].z = v[5].z = v[10].z = v[11].z = z[1];	

	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	
	wall.geometry.computeBoundingSphere();
	wall.geometry.computeBoundingBox();
	wall.geometry.computeFaceNormals();	
	
	var width = Math.abs(v[0].z) + Math.abs(v[4].z);	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.offsetZ = v[0].z + v[4].z;	

	UI('wall_width_1').val(value);
	
	//upLineYY(wall.userData.wall.p[0]);
	//upLineYY(wall.userData.wall.p[1]);
	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1];
	upLineYY_2(p0, p0.p, p0.w, p0.start);	
    upLineYY_2(p1, p1.p, p1.w, p1.start);	
	
	// меняем ширину wd
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		var wd = wall.userData.wall.arrO[i];	
		var v = wd.geometry.vertices;
		var f = wd.userData.door.form.v;
		
		for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = wall.geometry.vertices[4].z; }
		for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = wall.geometry.vertices[0].z; }	

		wd.geometry.verticesNeedUpdate = true; 
		wd.geometry.elementsNeedUpdate = true;
		wd.geometry.computeBoundingSphere();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeFaceNormals();		
	}
	
	// правильно устанавливаем Pop после изменение ширины стены
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		if(wall.userData.wall.arrO[i].userData.door.type == 'DoorPattern')
		{
			changeWidthParamWD(wall.userData.wall.arrO[i]);
		}
		else if(wall.userData.wall.arrO[i].userData.door.type == 'WindowSimply')
		{
			wall.userData.wall.arrO[i].userData.door.popObj.position.copy(wall.userData.wall.arrO[i].geometry.boundingSphere.center.clone()); 
		}
		else if(wall.userData.wall.arrO[i].userData.door.type == 'DoorSimply')
		{
			setPosDoorLeaf_1(wall.userData.wall.arrO[i], wall.userData.wall.arrO[i].userData.door.open_type);
			setPosDoorLeaf_2(wall.userData.wall.arrO[i]);			
		}
	}	
	
	upLabelPlan_1( wallR );	 				
	getYardageSpace( compileArrPickZone(wall) );
	
	clickPointUP_BSP(wallR);

	if(camera == camera3D) {}
}



// переключаем в меню стены кнокпи ширины 
function toggleButtonMenuWidthWall(wall)
{		
	wall.geometry.verticesNeedUpdate = true;
	var v = wall.userData.wall.v; 			
	
	var k = UI('wall-resize').val();
	
	if(k == 'wallRedBlueArrow') { var width = Math.round((Math.abs(v[0].z) + Math.abs(v[4].z)) * 1000); }
	else if(k == 'wallBlueArrow') { var width = Math.round(Math.abs(v[0].z) * 1000); }
	else if(k == 'wallRedArrow') { var width = Math.round(Math.abs(v[4].z) * 1000); }

	if(Math.abs(width) < 0.001){ width = 0; }   
	
	UI('wall_width_1').val(width);	
}



// изменение ширины стены (undo|redo)
function inputWidthWall_2(wall, z) 
{

	var wallR = detectChangeArrWall_2(wall);
	
	clickMovePoint_BSP(wallR);
			
	var v = wall.geometry.vertices;		

	v[0].z = v[1].z = v[6].z = v[7].z = z[0];
	v[4].z = v[5].z = v[10].z = v[11].z = z[1];	

	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	
	wall.geometry.computeBoundingSphere();
	wall.geometry.computeBoundingBox();
	wall.geometry.computeFaceNormals();	
	
	var width = Math.abs(v[0].z) + Math.abs(v[4].z);	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.offsetZ = v[0].z + v[4].z;	
	
	//upLineYY(wall.userData.wall.p[0]);
	//upLineYY(wall.userData.wall.p[1]);
	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1];
	upLineYY_2(p0, p0.p, p0.w, p0.start);	
    upLineYY_2(p1, p1.p, p1.w, p1.start);	
	
	// меняем ширину wd
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		var wd = wall.userData.wall.arrO[i];	
		var v = wd.geometry.vertices;
		var f = wd.userData.door.form.v;
		
		for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = wall.geometry.vertices[4].z; }
		for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = wall.geometry.vertices[0].z; }	

		wd.geometry.verticesNeedUpdate = true; 
		wd.geometry.elementsNeedUpdate = true;
		wd.geometry.computeBoundingSphere();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeFaceNormals();		
	}
	
	// правильно устанавливаем Pop после изменение ширины стены
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		if(wall.userData.wall.arrO[i].userData.door.type == 'DoorPattern')
		{
			changeWidthParamWD(wall.userData.wall.arrO[i]);
		}
		else if(wall.userData.wall.arrO[i].userData.door.type == 'WindowSimply')
		{
			wall.userData.wall.arrO[i].userData.door.popObj.position.copy(wall.userData.wall.arrO[i].geometry.boundingSphere.center.clone()); 
		}
		else if(wall.userData.wall.arrO[i].userData.door.type == 'DoorSimply')
		{
			setPosDoorLeaf_1(wall.userData.wall.arrO[i], wall.userData.wall.arrO[i].userData.door.open_type);
			setPosDoorLeaf_2(wall.userData.wall.arrO[i]);			
		}
	}	
	
	upLabelPlan_1( wallR );	 				
	getYardageSpace( compileArrPickZone(wall) );
	
	clickPointUP_BSP(wallR);
}




// меняем глобальную переменную ширины стены
function inputGlobalWidthWall()
{
	var width = $('[input_wl="6"]').val();
	
	width = (width < 0.01) ? 0.01 : width;
	
	$('[input_wl="6"]').val(width);
	
	width_wall = width;
}



