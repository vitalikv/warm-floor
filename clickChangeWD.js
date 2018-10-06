

// создаем контроллеры для изменения ширины/высоты окна (при клике на оконо они появляются)
function createControllWD()
{
	var arr = []; 
	
	for ( var i = 0; i < 4; i++ )
	{
		arr[i] = new THREE.Mesh( new THREE.BoxGeometry( 0.15, 0.15, 0.15 ), new THREE.MeshLambertMaterial( { color : 0x222222, depthTest: false } ) );
		
		arr[i].userData.tag = 'controll_wd';
		arr[i].userData.controll = { id : i, obj : null };
		arr[i].visible = false;
		arr[i].renderOrder = 1.3;
		
		scene.add( arr[i] );
	}		
	
	return arr;
}




// создаем вертикальные линии для линейки
function createRulerVerticalWin()
{
	var arr = [];
	
	for ( var i = 0; i < 8; i++ )
	{
		arr[i] = new THREE.Mesh( new THREE.BoxGeometry( 0.01, 0.01, 0.10 ), new THREE.MeshLambertMaterial( { color : 0x222222 } ) );
		scene.add( arr[i] );
		arr[i].userData.tag = '';
		arr[i].number = i;
		arr[i].visible = false;
	}		
	
	return arr;	
}




// показываем контроллеры
function showControllWD( wall, wd, arrPos )
{	
	var arr = arrContWD;
	var arrVisible = [true, true, true, true];
	
	if(camera == cameraTop) { arrVisible = [true, true, false, false]; }
	else if(camera == camera3D) { arrVisible = [false, false, false, false]; }
	
	if(wd.userData.door.type == 'WindowSimply' || wd.userData.door.type == 'DoorEmpty') { }
	else { arrVisible = [false, false, false, false]; }

	for ( var i = 0; i < arr.length; i++ )
	{		
		arr[i].position.copy( arrPos[i] );	
		arr[i].rotation.copy( wall.rotation );
		arr[i].visible = arrVisible[i];
		arr[i].obj = wd; 
		arr[i].userData.controll.obj = wd;
	}
}


		
		

// показываем линейки и контроллеры для окна/двери (собираем инфу, для перемещения линеек) 
function clickShowRulerWD(wd)
{
	var wall = wd.userData.door.wall;  

	wall.label[0].visible = false;
	wall.label[1].visible = false; 
	
	
	setUIDoorSize(wd);
	
	var p = [];	
	
	var bound = wd.geometry.boundingBox;
	var center = wd.geometry.boundingSphere.center; 
	
	var pos_1 = new THREE.Vector3(bound.min.x, center.y, center.z);	
	var pos_2 = new THREE.Vector3(bound.max.x, center.y, center.z);
	var pos_3 = new THREE.Vector3(center.x, bound.min.y, center.z);
	var pos_4 = new THREE.Vector3(center.x, bound.max.y, center.z);


	// позиция котроллеров 
	p[0] = wd.localToWorld( pos_1.clone() );
	p[1] = wd.localToWorld( pos_2.clone() );
	p[2] = wd.localToWorld( pos_3.clone() );
	p[3] = wd.localToWorld( pos_4.clone() );

	showControllWD( wall, wd, p );		// показываем контроллеры
	
	var boundPos = [];		// находим (границы) позиции от выбранного окна/двери до ближайших окон/дверей/края стены
	
	var v = wall.userData.wall.v; 
	
	var vp = v[0].clone(); 
	vp.z = v[0].z + (v[4].z - v[0].z) / 2; 
	boundPos[0] = vp.clone(); 

	vp.x = v[6].x; 
	boundPos[1] = vp.clone(); 

	vp.x = v[4].x; 
	boundPos[2] = vp.clone(); 

	vp.x = v[10].x; 
	boundPos[3] = vp.clone(); 

	for ( var i = 0; i < boundPos.length; i++ ){ wall.localToWorld( boundPos[i] ); boundPos[i].y = p[0].y; } 



  // находим объекты, которые принадлежат выбранной группе, заносим в массив (минус выбранный объект) 
	var arrO = [];  
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ ){ if(wd != wall.userData.wall.arrO[i]) { arrO[arrO.length] = wall.userData.wall.arrO[i]; } }   

	if(arrO.length > 0)  
	{ 
		var posX = getNearlyWinV(arrO, wd, wall, (Math.abs(v[0].z) - Math.abs(v[4].z)) / 2);    
		 
		if(posX[1] != false) { boundPos[0] = boundPos[2] = posX[1]; boundPos[0].y = boundPos[2].y = p[0].y; } 
		if(posX[0] != false) { boundPos[1] = boundPos[3] = posX[0]; boundPos[1].y = boundPos[3].y = p[0].y; } 
	}	

	// инфа для перемещения линеек	
	wd.userData.door.ruler.boundPos = boundPos;	
	
	// может быть clickO.rayhit.object.userData.tag == 'controll_wd' ( когда кликнули на контроллер, а потом ввели значение в input и нажали enter )
	if(clickO.rayhit.object.userData.tag == 'window' || clickO.rayhit.object.userData.tag == 'door') 
	{ 
		//wd.userData.door.ruler.faceIndex = clickO.rayhit.faceIndex; 		
		wd.userData.door.ruler.faceIndex = clickO.rayhit.face.normal.z;
	}	 
	
	showRulerWD_2D(wd); 
	showRulerWD_3D(wd);
}



// перемещаем линейки и лайблы 2D
function showRulerWD_2D(wd)
{
	if(camera != cameraTop) return;
	
	var wall = wd.userData.door.wall;
	var boundPos = wd.userData.door.ruler.boundPos;
	var p = [];
	for ( var i = 0; i < arrContWD.length; i++ ) { p[i] = arrContWD[i].position; }
	
	var x1 = wall.userData.wall.p[1].position.z - wall.userData.wall.p[0].position.z;
	var z1 = wall.userData.wall.p[0].position.x - wall.userData.wall.p[1].position.x;	
	var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены
	
	var width = Number(wall.userData.wall.width) / 2 + 0.05;	

	var dz_1 = dir.clone().multiplyScalar( -width );
	var dz_2 = dir.clone().multiplyScalar( width );
	var dz_3 = dir.clone().multiplyScalar( -0.1 );
	var dz_4 = dir.clone().multiplyScalar( 0.1 );	
	
	var dirZ = [];
	dirZ[0] = dz_3;
	dirZ[1] = dz_4;
	dirZ[2] = dz_3;	
	dirZ[3] = dz_4;
	dirZ[4] = dz_3;
	dirZ[5] = dz_4;
		
	
	var p2 = [];	
	p2[0] = new THREE.Vector3().addVectors(boundPos[0], dz_1);	
	p2[1] = new THREE.Vector3().addVectors(boundPos[2], dz_2);
	p2[2] = new THREE.Vector3().addVectors(p[1], dz_1);
	p2[3] = new THREE.Vector3().addVectors(p[1], dz_2);
	p2[4] = new THREE.Vector3().addVectors(p[0], dz_1);
	p2[5] = new THREE.Vector3().addVectors(p[0], dz_2);

	var w2 = [];	
	w2[0] = p2[4];
	w2[1] = p2[5];
	w2[2] = new THREE.Vector3().addVectors(boundPos[1], dz_1);	
	w2[3] = new THREE.Vector3().addVectors(boundPos[3], dz_2);
	w2[4] = p2[2];
	w2[5] = p2[3];	


	var wp = [];
	wp[0] = p2[0];
	wp[1] = p2[1];
	wp[2] = p2[2];
	wp[3] = p2[3];
	wp[4] = w2[0];
	wp[5] = w2[1];
	wp[6] = w2[2];
	wp[7] = w2[3];
	


	var dir = new THREE.Vector3().subVectors( wall.userData.wall.p[1].position, wall.userData.wall.p[0].position );  		
	var rotation = new THREE.Euler().setFromQuaternion( quaternionDirection(dir.clone().normalize()) );  // из кватерниона в rotation

	var rotY2 = Math.atan2(dir.x, dir.z); 
	if(rotY2 <= 0.001){ rotY2 -= Math.PI / 2; }
	else { rotY2 += Math.PI / 2; }	
	
	// линейки показывающие длину
	for ( var i = 0; i < 6; i++ )
	{ 
		var d = w2[i].distanceTo(p2[i]); 
		var v = arrRule4[i].geometry.vertices; 	
		v[3].x = v[2].x = v[5].x = v[4].x = d;
		arrRule4[i].geometry.verticesNeedUpdate = true;
				
		arrRule4[i].position.copy( p2[i] );
		arrRule4[i].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);
		arrRule4[i].visible = true;
				
		var dir = new THREE.Vector3().subVectors( w2[i], p2[i] );
		labelRuler1[i].position.copy( p2[i] );	
		labelRuler1[i].position.add( dirZ[i] );
		labelRuler1[i].position.add( dir.divideScalar( 2 ) ); 
		labelRuler1[i].rotation.set( -Math.PI / 2, 0, rotY2 - Math.PI );
		labelRuler1[i].visible = true;
		
		upLabelRulerWin(i, Math.round(d * 100) * 10, 0.4, 0.2, 50);
	}	

	// линейки отсечки
	for ( var i = 0; i < ruleVert_1.length; i++ )
	{
		ruleVert_1[i].position.copy( wp[i] );
		ruleVert_1[i].rotation.set(0, rotation.y - Math.PI / 2, 0); 
		ruleVert_1[i].visible = true;
	}	
}


// перемещаем линейки и лайблы в режиме cameraWall 
function showRulerWD_3D(wd)
{
	if(camera != cameraWall) return;
	
	var wall = wd.userData.door.wall;
	var boundPos = wd.userData.door.ruler.boundPos;
	var index = wd.userData.door.ruler.faceIndex;
	var rt = 0;
	
	var p = [];
	for ( var i = 0; i < arrContWD.length; i++ ) { p[i] = arrContWD[i].position; }
	
	var w2 = [];
	if(index > 0.98) 
	{
		w2[0] = new THREE.Vector3(boundPos[0].x, p[0].y, boundPos[0].z); 
		w2[1] = new THREE.Vector3(boundPos[1].x, p[1].y, boundPos[1].z);		
	}
	else if(index < -0.98) 	
	{
		w2[0] = new THREE.Vector3(boundPos[2].x, p[0].y, boundPos[2].z);
		w2[1] = new THREE.Vector3(boundPos[3].x, p[1].y, boundPos[3].z);
		rt = Math.PI;
	}
	
	w2[2] = new THREE.Vector3(p[2].x, 0, p[2].z);
	w2[3] = new THREE.Vector3(p[3].x, wall.userData.wall.height_1, p[3].z);

		
	// линейки показывающие длину
	for ( var i = 0; i < p.length; i++ )
	{
		var d = w2[i].distanceTo(p[i]); 
		var v = arrRule4[i].geometry.vertices; 	
		v[3].x = v[2].x = v[5].x = v[4].x = d;
		arrRule4[i].geometry.verticesNeedUpdate = true;		
		
		arrRule4[i].position.copy( p[i] );
		arrRule4[i].visible = true;
				
		var dir = new THREE.Vector3().subVectors( w2[i], p[i] );  		
		var rotation = new THREE.Euler().setFromQuaternion( quaternionDirection(dir.clone().normalize()) );  // из кватерниона в rotation
		arrRule4[i].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);
		
		
		labelRuler1[i].position.copy( p[i] );
		labelRuler1[i].position.add( dir.divideScalar( 2 ) );	
		
		labelRuler1[i].rotation.set( 0, wall.rotation.y + rt, 0 );    
		labelRuler1[i].visible = true;		
		upLabelRulerWin(i, Math.round(d * 100) * 10, 0.4, 0.2, 50);		
	}
}
 






// кликнули на контроллер
function clickToggleChangeWin( intersect, cdm )
{
	obj_selected = intersect.object; 
	var controll = intersect.object;	
	var wd = controll.userData.controll.obj;
	var wall = wd.userData.door.wall;
	var pos2 = new THREE.Vector3();
	
	
	var m = controll.userData.controll.id;
	
	if(camera == cameraTop)
	{
		planeMath.position.set( 0, intersect.point.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		
		var v = wall.userData.wall.v;
		var z = v[0].z + (v[4].z - v[0].z) / 2;
	
		if(m == 0) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.min.x, controll.position.y, z) ); }
		else if(m == 1) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.max.x, controll.position.y, z) ); }				
	}
	else if(camera == cameraWall)
	{
		//clickO.obj = null;
		planeMath.position.copy( intersect.point );
		planeMath.rotation.set( 0, controll.rotation.y, 0 );
		
		var dir = new THREE.Vector3().subVectors( wall.userData.wall.p[1].position, wall.userData.wall.p[0].position ).normalize();
		
		if(m == 0) { pos2 = new THREE.Vector3().addVectors( controll.position, dir ); }
		else if(m == 1) { pos2 = new THREE.Vector3().subVectors( controll.position, dir ); }	
		else if(m == 2) { pos2 = controll.position.clone(); pos2.y = -9999; }
		else if(m == 3) { pos2 = controll.position.clone(); pos2.y = 9999; }
	}

	
	var offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point ); 
	var dir = new THREE.Vector3().subVectors( controll.position, pos2 ).normalize();  
	var qt = quaternionDirection( dir );

	
	wd.userData.door.wall.controll = {  }; 
	wd.userData.door.wall.controll.obj = controll;
	wd.userData.door.wall.controll.pos = controll.position.clone();
	wd.userData.door.wall.controll.dir = dir;
	wd.userData.door.wall.controll.qt = qt;
	wd.userData.door.wall.controll.offset = offset;
	
	var ps = [];
	ps[ps.length] = wall.worldToLocal( arrContWD[0].position.clone() );
	ps[ps.length] = wall.worldToLocal( arrContWD[1].position.clone() );
	ps[ps.length] = wall.worldToLocal( arrContWD[2].position.clone() );
	ps[ps.length] = wall.worldToLocal( arrContWD[3].position.clone() );
	
	wd.userData.door.wall.controll.arrPos = ps;
	
	wd.updateMatrixWorld();	// окно/дверь
	wall.updateMatrixWorld();
	
	param_win.click = true;
}

 

 
// перемещаем контроллер
function moveToggleChangeWin( event, controll )
{	
	var intersects = rayIntersect( event, planeMath, 'one' ); 	
	if ( intersects.length < 1 ) return; 
	
	var wd = controll.userData.controll.obj;
	var wall = wd.userData.door.wall;

	
	if(param_win.click) 
	{ 
		param_win.click = false; 

		wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
	}	
	
	var pos = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.offset, intersects[ 0 ].point );	
	var v1 = localTransformPoint( new THREE.Vector3().subVectors( pos, wd.userData.door.wall.controll.pos ), wd.userData.door.wall.controll.qt );
	v1 = new THREE.Vector3().addScaledVector( wd.userData.door.wall.controll.dir, v1.z );  
	v1 = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.pos, v1 );	


	// ограничитель до ближайших окон/дверей/края стены
	if(1==1)
	{		
		var pos2 = wall.worldToLocal( v1.clone() );		
 
		if(controll.userData.controll.id == 0)
		{  
			var x_min = wd.userData.door.bound.min.x;
			if(pos2.x < x_min){ pos2.x = x_min; } 	
			else if(pos2.x > wd.userData.door.wall.controll.arrPos[1].x - 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[1].x - 0.2; }		
		}		
		else if(controll.userData.controll.id == 1)
		{
			var x_max = wd.userData.door.bound.max.x;
			if(pos2.x > x_max){ pos2.x = x_max; }
			else if(pos2.x < wd.userData.door.wall.controll.arrPos[0].x + 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[0].x + 0.2; }							
		}
		else if(controll.userData.controll.id == 2)
		{
			var y_min = wd.userData.door.bound.min.y + 0.1;
			if(pos2.y < y_min){ pos2.y = y_min; }
			else if(pos2.y > wd.userData.door.wall.controll.arrPos[3].y - 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[3].y - 0.2; }		
		}		
		else if(controll.userData.controll.id == 3)
		{
			var y_max = wd.userData.door.bound.max.y;
			if(pos2.y > y_max){ pos2.y = y_max; }
			else if(pos2.y < wd.userData.door.wall.controll.arrPos[2].y + 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[2].y + 0.2; }					
		}		
		
		v1 = wall.localToWorld( pos2 );			
	}
	
	var pos2 = new THREE.Vector3().subVectors( v1, controll.position );
	controll.position.copy( v1 ); 	

	// обновляем форму окна/двери и с новыми размерами вырезаем отверстие в стене
	if(1==1)
	{
		var arr = arrContWD;
		
		var x = arr[0].position.distanceTo(arr[1].position);
		var y = arr[2].position.distanceTo(arr[3].position);
		
		var pos = pos2.clone().divideScalar( 2 ).add( wd.position.clone() )
		
		сhangeSizePosWD( wd, pos, x, y );
		
		objsBSP = { wall : wallClone, wd : createCloneWD_BSP( wd ) };

		MeshBSP( wd, objsBSP ); 
	}
	
	// устанавливаем второстепенные контроллеры, в правильное положение
	var arr = arrContWD;	
	if(controll.userData.controll.id == 0 || controll.userData.controll.id == 1)
	{ 
		arrContWD[2].position.add( pos2.clone().divideScalar( 2 ) );
		arrContWD[3].position.add( pos2.clone().divideScalar( 2 ) );
	}
	else if(controll.userData.controll.id == 2 || controll.userData.controll.id == 3)
	{ 
		arrContWD[0].position.add( pos2.clone().divideScalar( 2 ) );
		arrContWD[1].position.add( pos2.clone().divideScalar( 2 ) );
	}	
	
	 // изменяем знаечние ширину/высоту окна в input (при перемещении контроллера)
	if(wd.userData.tag == 'window') 
	{
		showTableWD(wd); 
	}
	
	
	showRulerWD_2D(wd);
	showRulerWD_3D(wd);
}







