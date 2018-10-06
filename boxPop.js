


// создаем линии для 2D контроллеров
function createLineBoxPop()
{
	var arr = [];
	var material = new THREE.MeshLambertMaterial({ color: 0xcccccc, side: THREE.DoubleSide, transparent: true, opacity: 1, depthTest: false }); 
	
	for ( var i = 0; i < 4; i++ )
	{
		arr[i] = new THREE.Mesh( createGeometryWD( 1, 0.01, 0.01 ), material ); 	
		arr[i].visible = false;		
		scene.add( arr[i] );		
	}
	
	arr[0].userData.lineBoxPop = { p : [6,7] };
	arr[1].userData.lineBoxPop = { p : [6,7] };
	arr[2].userData.lineBoxPop = { p : [6,5] };
	arr[3].userData.lineBoxPop = { p : [6,5] };
	
	return arr;
}




// создаем пустой куб, для масштабирования приметивов
function createBoxPop()
{
	var material = new THREE.MeshLambertMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5, side: THREE.DoubleSide }); 
	var box = new THREE.Mesh( createGeometryWD(1, 1, 1), material ); 	
	box.userData.tag = 'boxPop';
	box.userData.boxPop = {};
	box.userData.boxPop.popObj = null;
	box.visible = false;
	scene.add( box );

	return box;
}


// создаем 6 контроллеров для изменения длины/ширины box (для camera3D)
function createControlBoxPop3D()
{
	var arr = [];
	
	var geometry = createGeometryCube( 0.15, 0.15, 0.15 );
	geometry.faces[6].materialIndex = 1;
	geometry.faces[7].materialIndex = 1;		
	var materials = [ new THREE.MeshLambertMaterial( { color : 0x3DBA3D } ) , new THREE.MeshLambertMaterial( { color : 0x43D843 } )  ];
	
	for ( var i = 0; i < 8; i++ )
	{		
		arr[i] = new THREE.Mesh( geometry, materials );		
		arr[i].userData.tag = 'toggle_gp';
		arr[i].userData.contrBP = {};
		arr[i].userData.contrBP.number = i;
		arr[i].userData.contrBP.dir = [];
		arr[i].userData.contrBP.pos = new THREE.Vector3();
		arr[i].userData.contrBP.pos2 = [];
		arr[i].userData.contrBP.offset = new THREE.Vector3();
		arr[i].userData.contrBP.qt = [];		
		arr[i].visible = false;
		arr[i].renderOrder = 1;
		scene.add( arr[i] );
	}	
	
	// act - номера контроллеров, который перетаскиваются в месте с выбранным контроллером
	arr[0].userData.contrBP.act = { cam3D : [2,3,4,5], cam2D : { half : [2,3], total : [6,7] } };
	arr[1].userData.contrBP.act = { cam3D : [2,3,4,5], cam2D : { half : [2,3], total : [4,5] } };
	arr[2].userData.contrBP.act = { cam3D : [0,1,4,5], cam2D : { half : [0,1], total : [6,5] } };
	arr[3].userData.contrBP.act = { cam3D : [0,1,4,5], cam2D : { half : [0,1], total : [7,4] } };
	arr[4].userData.contrBP.act = { cam3D : [0,1,2,3], cam2D : { half : [], total : [] } };
	arr[5].userData.contrBP.act = { cam3D : [0,1,2,3], cam2D : { half : [], total : [] } };
	arr[6].userData.contrBP.act = { cam3D : [], cam2D : { half : [], total : [] } };
	arr[7].userData.contrBP.act = { cam3D : [], cam2D : { half : [], total : [] } }; 
	
	return arr;
}


// создаем 8 контроллеров для изменения длины/ширины box (для cameraTop)
function createControlBoxPop2D()
{
	var arr = [];
	
	var geometry = createGeometryWD( 0.15, 0.15, 0.15 );		
	var material = new THREE.MeshLambertMaterial( { color : 0x3DBA3D, transparent: true, opacity: 1, depthTest: false } );
	
	for ( var i = 0; i < 8; i++ )
	{		
		arr[i] = new THREE.Mesh( geometry, material );		
		arr[i].userData.tag = 'toggle_gp';
		arr[i].userData.contrBP = {};
		arr[i].userData.contrBP.number = i;
		arr[i].userData.contrBP.dir = [];
		arr[i].userData.contrBP.pos = new THREE.Vector3();
		arr[i].userData.contrBP.pos2 = [];
		arr[i].userData.contrBP.offset = new THREE.Vector3();
		arr[i].userData.contrBP.qt = [];		
		arr[i].visible = false;
		arr[i].renderOrder = 1;
		scene.add( arr[i] );
	}	
	
	// act - номера контроллеров, который перетаскиваются в месте с выбранным контроллером
	arr[0].userData.contrBP.act = { cam3D : [2,3,4,5], cam2D : { half : [2,3], total : [6,7] } };
	arr[1].userData.contrBP.act = { cam3D : [2,3,4,5], cam2D : { half : [2,3], total : [4,5] } };
	arr[2].userData.contrBP.act = { cam3D : [0,1,4,5], cam2D : { half : [0,1], total : [6,5] } };
	arr[3].userData.contrBP.act = { cam3D : [0,1,4,5], cam2D : { half : [0,1], total : [7,4] } };
	arr[4].userData.contrBP.act = { cam3D : [0,1,2,3], cam2D : { half : [], total : [] } };
	arr[5].userData.contrBP.act = { cam3D : [0,1,2,3], cam2D : { half : [], total : [] } };
	arr[6].userData.contrBP.act = { cam3D : [], cam2D : { half : [], total : [] } };
	arr[7].userData.contrBP.act = { cam3D : [], cam2D : { half : [], total : [] } }; 
	
	return arr;
}


// кликнули на POP объект, расставляем box и контроллеры (центрируем boxPop на положении POP объекта)
function showBoxPop(obj)
{
	if(camera == cameraWall) return;
	if(!obj.userData.obj3D) return;
	if(!obj.userData.obj3D.boxPop) return;
	
	boxPop.userData.boxPop.popObj = obj; 
	
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
	var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x)) / 1;
	var y = (Math.abs(obj.geometry.boundingBox.max.y) + Math.abs(obj.geometry.boundingBox.min.y)) / 1;
	var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z)) / 1;

	// поправка на масштаб объекта
	x *= obj.scale.x;
	y *= obj.scale.y;
	z *= obj.scale.z;
	
	changeSizeBoxPop(x, y, z); 	// подгоняем boxPop под размер POP объекта

	// центрируем boxPop на POP объекте
	boxPop.position.copy( obj.localToWorld( obj.geometry.boundingSphere.center.clone() ) );
	boxPop.rotation.copy( obj.rotation );	
	if(camera == camera3D) { boxPop.visible = true; }
	
	boxPop.updateMatrixWorld();
	showToggleGp();		// устанавливаем контроллеры
		
	obj.userData.obj3D.controller = 'scale'; 
}



// устанавливаем контроллеры
function showToggleGp()
{
	var v = boxPop.geometry.vertices;
	
	var x_left = boxPop.localToWorld( new THREE.Vector3(v[0].x, 0, 0) );
	var x_right = boxPop.localToWorld( new THREE.Vector3(v[3].x, 0, 0) );
	
	var z_left = boxPop.localToWorld( new THREE.Vector3(0, 0, v[0].z) ); 
	var z_right = boxPop.localToWorld( new THREE.Vector3(0, 0, v[7].z) );
	
	var arrGp = (camera == cameraTop) ? controlBoxPop2D : controlBoxPop3D;
	
	arrGp[0].position.copy(x_left);
	arrGp[1].position.copy(x_right);
	arrGp[2].position.copy(z_left);	
	arrGp[3].position.copy(z_right);

	
	if(camera == cameraTop)
	{
		var y = arrGp[0].position.y;
		
		arrGp[4].position.copy( boxPop.localToWorld( new THREE.Vector3(v[4].x, 0, v[4].z) ) );
		arrGp[5].position.copy( boxPop.localToWorld( new THREE.Vector3(v[3].x, 0, v[3].z) ) );
		arrGp[6].position.copy( boxPop.localToWorld( new THREE.Vector3(v[0].x, 0, v[0].z) ) );
		arrGp[7].position.copy( boxPop.localToWorld( new THREE.Vector3(v[7].x, 0, v[7].z) ) );
	}
	else if(camera == camera3D)
	{
		var y_min = boxPop.localToWorld( new THREE.Vector3(0, v[0].y, 0) ); 
		var y_max = boxPop.localToWorld( new THREE.Vector3(0, v[1].y, 0) );	
		
		arrGp[4].position.copy(y_min);
		arrGp[5].position.copy(y_max);		
	}	
	
	for ( var i = 0; i < 4; i++ )
	{
		var dir = new THREE.Vector3().subVectors( boxPop.position, arrGp[i].position ).normalize();
		
		var angle = Math.atan2( dir.x, dir.z );
		arrGp[i].rotation.set( 0, 0, Math.PI / 2 );
		arrGp[i].rotation.y = angle - Math.PI / 2;	
		arrGp[i].visible = true;
	}
	
	
	if(camera == cameraTop)
	{
		arrGp[4].rotation.copy( arrGp[1].rotation );	
		arrGp[5].rotation.copy( arrGp[1].rotation );
		arrGp[6].rotation.copy( arrGp[0].rotation );	
		arrGp[7].rotation.copy( arrGp[0].rotation );		
		arrGp[4].visible = true;
		arrGp[5].visible = true;
		arrGp[6].visible = true;
		arrGp[7].visible = true;
		
		for ( var i = 0; i < arrGp.length; i++ ) 
		{
			arrGp[i].updateMatrixWorld();
			arrGp[i].geometry.computeBoundingSphere();
		}		
		
		var pos_0 = arrGp[0].localToWorld( arrGp[0].geometry.boundingSphere.center.clone() );
		var pos_1 = arrGp[1].localToWorld( arrGp[1].geometry.boundingSphere.center.clone() );
		var pos_2 = arrGp[2].localToWorld( arrGp[2].geometry.boundingSphere.center.clone() );
		var pos_3 = arrGp[3].localToWorld( arrGp[3].geometry.boundingSphere.center.clone() );		
		
		var dirX = new THREE.Vector3().subVectors( pos_1, pos_0 ).normalize();
		var dirZ = new THREE.Vector3().subVectors( pos_3, pos_2 ).normalize();		
		
		var dirZ_0 = new THREE.Vector3().addVectors( pos_0, dirZ );
		var dirZ_1 = new THREE.Vector3().addVectors( pos_1, dirZ );
		var dirX_2 = new THREE.Vector3().addVectors( pos_2, dirX );
		var dirX_3 = new THREE.Vector3().addVectors( pos_3, dirX );		
		
		var pos = [];
		pos[0] = crossPointTwoLine_2(pos_1, dirZ_1, pos_3, dirX_3)[0];
		pos[1] = crossPointTwoLine_2(pos_1, dirZ_1, pos_2, dirX_2)[0];
		pos[2] = crossPointTwoLine_2(pos_0, dirZ_0, pos_2, dirX_2)[0];
		pos[3] = crossPointTwoLine_2(pos_0, dirZ_0, pos_3, dirX_3)[0];
		
		for ( var i = 4; i < arrGp.length; i++ )
		{
			var pos_7 = arrGp[i].localToWorld( arrGp[i].geometry.boundingSphere.center.clone() );
			pos_7 = new THREE.Vector3().subVectors( arrGp[i].position, pos_7 );
			arrGp[i].position.copy( pos[i - 4].add(pos_7) );	
			arrGp[i].position.y = arrGp[0].position.y;
		}

		showLineBoxPop();
	}
	else if(camera == camera3D)
	{
		arrGp[4].rotation.set( boxPop.rotation.x, boxPop.rotation.y, boxPop.rotation.z + Math.PI );
		arrGp[5].rotation.set( boxPop.rotation.x, boxPop.rotation.y, boxPop.rotation.z );
		arrGp[4].visible = true;
		arrGp[5].visible = true;		
	}
}



// показываем и устанавливаем линейки для 2D контроллеров
function showLineBoxPop()
{
	updatePosLineBoxPop();
	
	for ( var i = 0; i < lineBoxPop.length; i++ )
	{
		lineBoxPop[i].visible = true;
	}
}


// подстраиваем размер линеек под положние контроллеров (только для cameraTop)
function updatePosLineBoxPop()
{
	var arrGp = (camera == cameraTop) ? controlBoxPop2D : controlBoxPop3D;
	
	for ( var i = 0; i < lineBoxPop.length; i++ )
	{
		lineBoxPop[i].position.copy( arrGp[i].position );
		
		var p = lineBoxPop[i].userData.lineBoxPop.p;
		
		var dir = new THREE.Vector3().subVectors( arrGp[p[1]].position, arrGp[p[0]].position ).normalize();
		
		var angle = Math.atan2( dir.x, dir.z );
		lineBoxPop[i].rotation.y = angle + Math.PI/2;					
		
		var d = arrGp[p[0]].position.distanceTo(arrGp[p[1]].position);
		
		var v = lineBoxPop[i].geometry.vertices;
		
		v[0].x = v[1].x = v[7].x = v[6].x = -d / 2;
		v[3].x = v[2].x = v[4].x = v[5].x = d / 2;

		lineBoxPop[i].geometry.verticesNeedUpdate = true;
		lineBoxPop[i].geometry.elementsNeedUpdate = true;	
		lineBoxPop[i].geometry.computeBoundingSphere();		
	}	 	

}


// скрываем box и контроллеры
function hideBoxPop()
{
	boxPop.userData.boxPop.popObj = null;
	boxPop.visible = false;
	for ( var i = 0; i < controlBoxPop2D.length; i++ ) { controlBoxPop2D[i].visible = false; }
	for ( var i = 0; i < controlBoxPop3D.length; i++ ) { controlBoxPop3D[i].visible = false; }
	
	for ( var i = 0; i < lineBoxPop.length; i++ ) { lineBoxPop[i].visible = false; }	
}



// кликнули на контроллер
function clickToggleGp( intersect )
{
	var obj = obj_selected = intersect.object;  
	
	var arrGp = (camera == cameraTop) ? controlBoxPop2D : controlBoxPop3D;
	
	var flag = (camera == cameraTop) ? true : false;
	
	var n = [];
	var n2 = [];
	if(obj.userData.contrBP.number == 0) { n[0] = 1; }		
	else if(obj.userData.contrBP.number == 1) { n[0] = 0; }
	else if(obj.userData.contrBP.number == 2) { n[0] = 3; }		
	else if(obj.userData.contrBP.number == 3) { n[0] = 2; }	
	else if(obj.userData.contrBP.number == 4) { n[0] = 5; if(camera == cameraTop) { n = [5,7]; n2 = [{total : 7}, {total : 5}]; }; }		
	else if(obj.userData.contrBP.number == 5) { n[0] = 4; if(camera == cameraTop) { n = [4,6]; n2 = [{total : 6}, {total : 4}]; }; }
	else if(obj.userData.contrBP.number == 6) { n = [5,7]; n2 = [{total : 7}, {total : 5}]; }		
	else if(obj.userData.contrBP.number == 7) { n = [4,6]; n2 = [{total : 6}, {total : 4}]; }
	
	for ( var i = 0; i < arrGp.length; i++ ) { arrGp[i].userData.contrBP.pos = arrGp[i].position.clone(); }
	
	obj.userData.contrBP.pos2 = [];
	obj.userData.contrBP.dir = [];
	obj.userData.contrBP.qt = [];
	
	for ( var i = 0; i < n.length; i++ )
	{
		var pos2 = arrGp[n[i]].position.clone();
		obj.userData.contrBP.pos2[i] = pos2;
		obj.userData.contrBP.pos = obj.position.clone();	
		obj.userData.contrBP.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	 
		obj.userData.contrBP.dir[i] = new THREE.Vector3().subVectors( pos2, obj.position ).normalize(); 
		obj.userData.contrBP.qt[i] = quaternionDirection( obj.userData.contrBP.dir[i].clone() );

		if(obj.userData.contrBP.number > 3) { obj.userData.contrBP.act.cam2D = n2; }
	}
	
	planeMath2.position.copy( intersect.point );
	planeMath2.rotation.set( 0, 0, 0 );
	

	if(camera == camera3D)
	{
		if(obj.userData.contrBP.number == 4 || obj.userData.contrBP.number == 5)
		{
			var dir = new THREE.Vector3().subVectors( planeMath2.position, camera.position ).normalize();
			var angle = Math.atan2( dir.x, dir.z );
			planeMath2.rotation.set( 0, 0, Math.PI / 2 );
			planeMath2.rotation.y = angle + Math.PI / 2;
		}		
	}
}


// перемещаем контроллер
function moveToggleGp( event )
{
	var intersects = rayIntersect( event, planeMath2, 'one' );
	
	if (!intersects) return;
	
	var obj = obj_selected;
	
	// положение контроллера с ограничениями
	var posNew = new THREE.Vector3();
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, obj.userData.contrBP.offset );	
	var posOff2 = [];
	
	for ( var i = 0; i < obj.userData.contrBP.pos2.length; i++ )
	{
		var pos2 = obj.userData.contrBP.pos2[i].clone();		
		var v1 = localTransformPoint( new THREE.Vector3().subVectors( pos2, pos ), obj.userData.contrBP.qt[i] );	 	
		if(v1.z < 0.1) { v1.z = 0.1; }	
		v1 = new THREE.Vector3().addScaledVector( obj.userData.contrBP.dir[i], -v1.z );
		
		if(i == 1) 
		{ 
			var posOff = new THREE.Vector3().subVectors( posNew, obj.userData.contrBP.pos );
			pos2.add( posOff );		// для смещения диагонального контроллера по второй оси
			posOff2[0] = posOff;	// для подсчета смещения второстепенных 2D контроллеров (который по диагонали)
		}
		
		posNew = new THREE.Vector3().addVectors( pos2, v1 );

		// для подсчета смещения второстепенных 2D контроллеров (который по диагонали)
		if(i == 1) { posOff2[1] = new THREE.Vector3().subVectors( new THREE.Vector3().addVectors( obj.userData.contrBP.pos2[i].clone(), v1 ), obj.userData.contrBP.pos ); }		
	}
	var pos2 = new THREE.Vector3().subVectors( posNew, obj.position );	
	obj.position.copy(posNew);		

	var arrGp = (camera == cameraTop) ? controlBoxPop2D : controlBoxPop3D;
	
	// перетаскиваем второстепенные контроллеры
	if(camera == camera3D)
	{
		pos2.divideScalar( 2 );
		var arr = obj.userData.contrBP.act.cam3D; 
		for ( var i = 0; i < arr.length; i++ ) { arrGp[arr[i]].position.add(pos2); }		
	}
	else if(camera == cameraTop)
	{
		if(obj.userData.contrBP.number == 0 || obj.userData.contrBP.number == 1 || obj.userData.contrBP.number == 2 || obj.userData.contrBP.number == 3)
		{
			var arr = obj.userData.contrBP.act.cam2D.total;
			for ( var i = 0; i < arr.length; i++ ) { arrGp[arr[i]].position.add(pos2); }	
			
			var arr = obj.userData.contrBP.act.cam2D.half; 
			pos2.divideScalar( 2 );
			for ( var i = 0; i < arr.length; i++ ) { arrGp[arr[i]].position.add(pos2); }					
		}
		else
		{ 
			var arr = obj.userData.contrBP.act.cam2D;
			for ( var i = 0; i < arr.length; i++ ) { arrGp[arr[i].total].position.copy( arrGp[arr[i].total].userData.contrBP.pos.clone().add(posOff2[i]) ); }	

			var pos3 = new THREE.Vector3().subVectors( arrGp[6].position, arrGp[7].position ).divideScalar( 2 );
			arrGp[0].position.copy( new THREE.Vector3().addVectors( arrGp[7].position, pos3 ) );	
			
			var pos3 = new THREE.Vector3().subVectors( arrGp[4].position, arrGp[5].position ).divideScalar( 2 );
			arrGp[1].position.copy( new THREE.Vector3().addVectors( arrGp[5].position, pos3 ) );

			var pos3 = new THREE.Vector3().subVectors( arrGp[5].position, arrGp[6].position ).divideScalar( 2 );
			arrGp[2].position.copy( new THREE.Vector3().addVectors( arrGp[6].position, pos3 ) );
			arrGp[2].updateMatrixWorld();		
			var offset = arrGp[2].localToWorld( arrGp[2].geometry.boundingSphere.center.clone() );
			offset = new THREE.Vector3().subVectors( arrGp[2].position, offset );			
			arrGp[2].position.add(offset); 

			arrGp[3].updateMatrixWorld();
			var offset = arrGp[3].localToWorld( arrGp[3].geometry.boundingSphere.center.clone() );
			offset = new THREE.Vector3().subVectors( arrGp[3].position, offset );
			var pos3 = new THREE.Vector3().subVectors( arrGp[7].position, arrGp[4].position ).divideScalar( 2 );
			arrGp[3].position.copy( new THREE.Vector3().addVectors( arrGp[4].position, pos3 ) );
			arrGp[3].position.add(offset); 			
		}
		
		updatePosLineBoxPop();
	}
	
	
	// центруем POP объект относительно контроллеров
	var sumPos = new THREE.Vector3();
	for ( var i = 0; i < 4; i++ ) { sumPos.add(arrGp[i].position); }
	boxPop.position.copy( sumPos.divideScalar( 4 ) );
	
	// находим ширину/длину/высоту куба с помощью расстояний между контроллерами
	var x = arrGp[0].position.distanceTo(arrGp[1].position);
	var z = arrGp[2].position.distanceTo(arrGp[3].position);
	var y = arrGp[4].position.distanceTo(arrGp[5].position);
	
	changeSizeBoxPop(x, y, z);
	
	// меняем масштаб POP объекта и его положение
	if(1==1)
	{
		var popObj = boxPop.userData.boxPop.popObj; 		
		var dX = Math.abs(popObj.geometry.boundingBox.max.x) + Math.abs(popObj.geometry.boundingBox.min.x);
		var dY = Math.abs(popObj.geometry.boundingBox.max.y) + Math.abs(popObj.geometry.boundingBox.min.y);	 
		var dZ = Math.abs(popObj.geometry.boundingBox.max.z) + Math.abs(popObj.geometry.boundingBox.min.z);
		
		if(camera == cameraTop) { popObj.scale.set(x / dX, popObj.scale.y, z / dZ); }
		else if(camera == camera3D) { popObj.scale.set(x / dX, y / dY, z / dZ); }
		
		var pos = popObj.localToWorld( popObj.geometry.boundingSphere.center.clone() );
		popObj.position.add( new THREE.Vector3().subVectors( boxPop.position, pos ) );
		
		//objectControls.position.copy( popObj.position );
		//gizmo.position.copy( popObj.position );
	}
}


// меняем размеры boxPop
function changeSizeBoxPop(x, y, z)
{	
	var v = boxPop.geometry.vertices;
	v[0].x = v[1].x = v[7].x = v[6].x = -x / 2;
	v[3].x = v[2].x = v[4].x = v[5].x = x / 2;
	v[0].y = v[3].y = v[7].y = v[4].y = -y / 2;
	v[1].y = v[2].y = v[5].y = v[6].y = y / 2;	
	v[4].z = v[5].z = v[6].z = v[7].z = -z / 2;
	v[0].z = v[1].z = v[2].z = v[3].z = z / 2;
	
	boxPop.geometry.verticesNeedUpdate = true;
	boxPop.geometry.elementsNeedUpdate = true;
	boxPop.geometry.computeBoundingBox();
	boxPop.geometry.computeBoundingSphere();
}






