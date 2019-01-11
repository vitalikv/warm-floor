


var param_wall = { click : false, wallR : [], posS : 0, qt_1 : [], qt_2 : [], arrZone : [] };

var arrM = [];

function clickWall_2D( intersect )
{
	var obj = intersect.object;
	if(camera == cameraTop) { if(obj.userData.parent) { obj = obj.userData.parent; clickO.obj = obj; clickO.rayhit.object = obj; } }
	obj_selected = obj;
	
	offset = new THREE.Vector3().subVectors( obj.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.posS = new THREE.Vector3().addVectors( intersect.point, offset );	// стартовое положение
	  
	param_wall.wallR = detectChangeArrWall_2(obj);

	for ( var i = 0; i < obj.userData.wall.p[0].w.length; i++ )
	{  
		var dir = new THREE.Vector3().subVectors( obj.userData.wall.p[0].position, obj.userData.wall.p[0].p[i].position ).normalize();	
		param_wall.qt_1[i] = quaternionDirection(dir);
	}
	
	for ( var i = 0; i < obj.userData.wall.p[1].w.length; i++ )
	{ 
		var dir = new THREE.Vector3().subVectors( obj.userData.wall.p[1].position, obj.userData.wall.p[1].p[i].position ).normalize();
		param_wall.qt_2[i] = quaternionDirection(dir);
	}
	
	prepareInfoClickWall(obj);		// подготовка, собираем данные о соседних стенах и объектах (окна,двери)
	
	param_wall.arrZone = compileArrPickZone(obj); 
	
	getInfoUndoWall(obj);	// undo/redo	
}


// собираем инфу для undo/redo
function getInfoUndoWall(wall)
{
	wall.userData.wall.p[0].userData.point.last.pos = wall.userData.wall.p[0].position.clone();
	wall.userData.wall.p[1].userData.point.last.pos = wall.userData.wall.p[1].position.clone();
	
	var walls = detectChangeArrWall_2(wall);
	
	for ( var i = 0; i < walls.length; i++ )
	{		
		walls[i].userData.wall.last.pos = walls[i].position.clone();
		walls[i].userData.wall.last.rot = walls[i].rotation.clone();
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			 
			wd.userData.door.last.pos = wd.position.clone();
			wd.userData.door.last.rot = wd.rotation.clone(); 
		}
	}		 				
}
	



// собираем в массив id зон, которые будем менять (исключаем повторяющиеся)
function compileArrPickZone( wall )
{
	var m = 0;
	arr = [];
	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) { arr[m] = wall.userData.wall.p[0].zone[i]; m++; } 
	for ( var i = 0; i < wall.userData.wall.p[1].zone.length; i++ )
	{
		var flag = true;
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			if(wall.userData.wall.p[1].zone[i] == arr[i2]) { flag = false; break; }
		}
		
		if(flag) { arr[m] = wall.userData.wall.p[1].zone[i]; m++; }
	}

	return arr;	
}







function moveWall( event, obj ) 
{		
	
	if(camera == camera3D) { cameraMove3D( event ); return; }
	
	if(param_win.click) 
	{
		clickMovePoint_BSP(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );	
		
		
		// перемещение стены вдоль своей оси
		var x1 = obj.userData.wall.p[1].position.z - obj.userData.wall.p[0].position.z;
		var z1 = obj.userData.wall.p[0].position.x - obj.userData.wall.p[1].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
		
		var qt1 = quaternionDirection(dir);
		var v1 = localTransformPoint( new THREE.Vector3().subVectors( pos, param_wall.posS ), qt1 );	
		v1 = new THREE.Vector3().addScaledVector( dir, v1.z );
		pos = new THREE.Vector3().addVectors( param_wall.posS, v1 );

		var pos3 = obj.position.clone();
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );			
		// ------------
		console.log(pos2.y);
		
		pos2 = new THREE.Vector3().subVectors ( changeWallLimit(obj.userData.wall.p[0], pos2, param_wall.qt_1, dir), obj.userData.wall.p[0].position ); 
		pos2 = new THREE.Vector3().subVectors ( changeWallLimit(obj.userData.wall.p[1], pos2, param_wall.qt_2, dir), obj.userData.wall.p[1].position );
		
		
		pos2 = new THREE.Vector3(pos2.x, 0, pos2.z);
		obj.position.add( pos2 );				
		obj.userData.wall.p[0].position.add( pos2 );
		obj.userData.wall.p[1].position.add( pos2 );		

		
		var pos2 = new THREE.Vector3().subVectors ( obj.position, pos3 );
		
		for ( var i = 0; i < obj.userData.wall.arrO.length; i++ )
		{ 
			obj.userData.wall.arrO[ i ].position.add( pos2 );
		}
		
		
		for ( var i = 0; i < arrM.length; i++ )
		{ 
			updateWall(arrM[i][0], arrM[i][1], arrM[i][2], arrM[i][3]);

			if(arrM[i][0].userData.wall.arrO.length > 0)
			{ 
				moveObjsWall( arrM[i][0].userData.wall.arrO, arrM[i][0].userData.wall.p[0].position, arrM[i][0].userData.wall.p[1].position, rel_pos[i], arrM[i][3] );
			}			
		}
		
		upLineYY(obj.userData.wall.p[0]);
		upLineYY(obj.userData.wall.p[1]);
		
		upLabelPlan_1(param_wall.wallR); 
	}	
}






// ограничение длины стены (точка не может быть перемещена за пределы длины стены или при встречи с окном/дверью)
function changeWallLimit(point, pos2, qt, dir2)
{
	var pos = new THREE.Vector3().addVectors ( point.position, pos2 );	// получаем новое положение точки 
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.w[i] == obj_selected){ continue; }
		
		var v = point.w[i].userData.wall.v;
		
		
		if(point.start[i] == 0)
		{
			var x1_a = v[0].x;
			var x1_b = v[4].x;				
			var x2_a = v[6].x;
			var x2_b = v[10].x;
			

			var v2 = localTransformPoint( new THREE.Vector3().subVectors( new THREE.Vector3(0,0,0), pos2 ), qt[i] );
			
			var fg1 = false;
			var fg2 = false;
			if(x2_a - (x1_a + v2.z) <= 0.05){ fg1 = true; }
			if(x2_b - (x1_b + v2.z) <= 0.05){ fg2 = true; } 
			if(fg1 & fg2)
			{ 
				if(x2_a - (x1_a + v2.z) < x2_b - (x1_b + v2.z) ){ fg2 = false; } 
				else{ fg1 = false; }
			}
			
						
			if(fg1)
			{				
				var zx1 = v[6].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[4], v[0] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{	
				var zx1 = v[10].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[0], v[4] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );			
				pos = point.w[i].localToWorld( ps3.clone() );	
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены					
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = crossPointTwoLine(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}
		}
		else if(point.start[i] == 1)
		{
			var v2 = localTransformPoint( new THREE.Vector3().subVectors( pos2, new THREE.Vector3(0,0,0) ), qt[i] );
			
			var n = v.length;				
			var x1_a = v[n - 12].x;
			var x1_b = v[n - 8].x;				
			var x2_a = v[n - 6].x;
			var x2_b = v[n - 2].x;	

			
			var fg1 = false;
			var fg2 = false;
			if((x2_a + v2.z) - x1_a < 0.05){ fg1 = true; }
			if((x2_b + v2.z) - x1_b < 0.05){ fg2 = true; }
			if(fg1 & fg2)
			{ 
				if((x2_a + v2.z) - x1_a < (x2_b + v2.z) - x1_b){ fg2 = false; } 
				else{ fg1 = false; }
			}			

			
			if(fg1)
			{
				var zx1 = v[v.length - 12].clone();	
				zx1.x += 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 2], v[v.length - 6] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{			
				var zx1 = v[v.length - 8].clone();	// создаем точку, берем точка которая начинается у окна
				zx1.x += 0.05;						// прибавляем ей смещение (аналог v[v.length - 4] + смещение)
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 6], v[v.length - 2] );	// находим разницу по длине между двумя точками
				zx2.add( zx1 );		// прибавляем эту разницу к созданой точки (аналог v[v.length - 5] + смещение)
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );		// находим центр у двух точек		
				pos = point.w[i].localToWorld( ps3.clone() );	// перводим в глобальные координаты								
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены					
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = crossPointTwoLine(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}			
		}	

				
	}
	
	return pos;
}






// кликнули на стену (создаем outline)
function clickWallOutline(wall, index)  
{	
	if(!wall) return;
	
	var obj = new THREE.Group(); 
	
	wall.updateMatrixWorld();
	var v = wall.userData.wall.v;
	 
	var arrV = [];
	var arrP = [];	
	
	if(index == 2) { arrV = [v[4].clone(), v[5].clone(), v[11].clone(), v[10].clone(), v[4].clone()]; }
	else { arrV = [v[0].clone(), v[1].clone(), v[7].clone(), v[6].clone(), v[0].clone()]; }
	
	
	// определяем относится ли стена к какому-нибудь помещению
	var room = detectRoomWallSide(wall, index);
	
	arrWallFront = [{ obj : wall, index : index }];
	
	// объединяем прямо стоящие соседние стены в одну стену
	if(camera == camera3D)
	{
		var p = wall.userData.wall.p;
		var dir1 = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize();						
		var unique = detectDirectionWall([{ obj : wall, dir : 'forward' }], p, dir1);	
		
		var arrW = [];
		var arrS = [];
		for (i = 0; i < unique.length; i++) 
		{ 
			arrW[i] = unique[i].obj; 
			arrS[i] = (unique[i].dir == 'forward') ? index : (index == 1) ? 2 : 1; 	// находим какой стороной стены повернуты к выбранной комнате
		}
		
		
		// убираем из массива все стены, которые не принадлежат к выбранной комнате
		if(room)
		{
			for (i = arrW.length - 1; i >= 0; i--) 
			{ 
				var flag = true;
				
				for (i2 = 0; i2 < room.w.length; i2++)  
				{
					if(arrW[i] == room.w[i2]) { flag = false; break; }
				}	

				if(flag) { arrW.splice(i, 1); arrS.splice(i, 1); }
			}			
		}
		
		arrWallFront = [];
		for (i = 0; i < arrW.length; i++) 
		{ 
			arrWallFront[i] = { obj : arrW[i], index : arrS[i] };  
		}		
		 
		
		// переводим вершины (у всех стен) в локальные значения для выбранной стены   
		var arrV2 = [];
		for (i = 0; i < arrW.length; i++)
		{
			arrW[i].updateMatrixWorld();
			var v = arrW[i].userData.wall.v;			
			
			var arrN = (arrS[i] == 2) ? [4,5,11,10] : [0,1,7,6];

			for (i2 = 0; i2 < arrN.length; i2++)
			{
				if(i == 0) { arrV2[arrV2.length] = v[arrN[i2]].clone(); }
				else 
				{ 
					var worldV = arrW[i].localToWorld( v[arrN[i2]].clone() ); 
					arrV2[arrV2.length] = arrW[0].worldToLocal( worldV ); 
				}
			}
		}
		
		// находим из значений вершин всех стен min/max значения ширины и высоты
		var box = { min : { x : arrV2[0].x, y : arrV2[0].y }, max : { x : arrV2[0].x, y : arrV2[0].y } };
		
		for (i = 0; i < arrV2.length; i++)
		{
			if(arrV2[i].x < box.min.x) { box.min.x = arrV2[i].x; }
			else if(arrV2[i].x > box.max.x) { box.max.x = arrV2[i].x; }
			
			if(arrV2[i].y < box.min.y) { box.min.y = arrV2[i].y; }
			else if(arrV2[i].y > box.max.y) { box.max.y = arrV2[i].y; }			
		}
		
		
		var arrV3 = 
		[
			new THREE.Vector3(box.min.x, box.min.y, 0), 
			new THREE.Vector3(box.min.x, box.max.y, 0),
			new THREE.Vector3(box.max.x, box.max.y, 0),
			new THREE.Vector3(box.max.x, box.min.y, 0), 
		];
			

		// зная min/max ширины/высоты, находим точки для outLine	
		var z = arrV[0].z;
		var arrV = [];
		
		for (i = 0; i < arrV3.length; i++)
		{
			var min = 99999;
			var n = 0;
			
			for (i2 = 0; i2 < arrV2.length; i2++)
			{
				var d = arrV3[i].distanceTo(arrV2[i2]);
				
				if(min > d) { n = i2; min = d; }
			}
			
			arrV[i] = arrV2[n];
		}	
		
		arrV[arrV.length] = arrV[0].clone();
		
		for (i = 0; i < arrV.length; i++) { arrV[i].z = z; }		
	}
	
	
	// если есть пол, то поднимаем outLine для стены
	if(camera == camera3D || camera == cameraWall)
	{
		if(room)
		{
			for (i = 0; i < arrV.length; i++)
			{
				if(arrV[i].y < 0.05) arrV[i].y += 0.1; 
			}					
		}
	}
	
	
	// создаем outLine
	for (i = 0; i < arrV.length - 1; i++)
	{		
		var p1 = wall.localToWorld( arrV[i].clone() );
		var p2 = wall.localToWorld( arrV[i + 1].clone() );
		
		//var p1 = arrV[i].clone();
		//var p2 = arrV[i + 1].clone();
		
		var x = p2.distanceTo(p1);	
		
		var geometry = createGeometryLine(x, 0.02, 0.02); 
		var outline = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 'rgb(17, 255, 0)', depthTest: false }) );
		outline.renderOrder = 2;
		 
		outline.position.set( p1.x, p1.y, p1.z );
		
		if(i == 1 || i == 3) {  }
		if(i == 1 || i == 3)
		{
			var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
			var angleDeg = Math.atan2(dir.x, dir.z);
			
			if(i == 3) { outline.rotation.set(0, wall.rotation.y - Math.PI, 0); }
			else { outline.rotation.set(0, wall.rotation.y - Math.PI, Math.PI); }			
		}
		else if(i == 0) { outline.rotation.set(0, wall.rotation.y + Math.PI, Math.PI / 2); } 
		else if(i == 2) { outline.rotation.set(0, wall.rotation.y + Math.PI, -Math.PI / 2); } 
		
		obj.add( outline );
	}

			
	scene.add( obj );
	
	return obj;
}



// находим все соседние стены с которые находятся на одном уровне и напрвлении 
// из-за того что забыл поставить var i, она была глобальной и всё ломалось ( рекурсия )
function detectDirectionWall(arr, p, dir1)
{
	// находим у стены все соседние стены с которыми она соединяется 
	var arrW = [...new Set([...p[0].w, ...p[1].w])];		// объединяем массивы, в результате в новом массиве будет только неповторяющиеся объекты (стены) ES6	
	
	// находим стены, которые параллельны главной стене
	for (var i = 0; i < arrW.length; i++)
	{ 	
		var flag = false;
		for (i2 = 0; i2 < arr.length; i2++) { if(arrW[i] == arr[i2].obj) { flag = true; break; } }
		if(flag) continue;
		
		var dir2 = new THREE.Vector3().subVectors( arrW[i].userData.wall.p[1].position, arrW[i].userData.wall.p[0].position ).normalize();
		
		var str = null;
		
		if(comparePos(dir1, dir2)) { str = 'forward'; }
		else if(comparePos(dir1, new THREE.Vector3(-dir2.x,-dir2.y,-dir2.z))) { str = 'back'; }
		
		if(str) 
		{ 	console.log(arrW[i].userData.id, str, dir1, dir2);
			arr[arr.length] = { obj : arrW[i], dir : str }; 
			arr = detectDirectionWall(arr, arrW[i].userData.wall.p, dir1); 
		}
	}		

	
	return arr;
}




// определяем к какому помещению принадлежит выделенная сторона стены 
function detectRoomWallSide(wall, index)
{
	var num = -1;
	
	for ( var i = 0; i < room.length; i++ ) 
	{  
		for ( var i2 = 0; i2 < room[i].w.length; i2++ )
		{
			if(wall == room[i].w[i2])
			{
				var side = (index == 1) ? 1 : 0;
				
				if(side == room[i].s[i2]) { num = i; }
				
				break;
			} 
		}	
	}

	if(num == -1) { return null; /* стена не принадлежит ни одному помещению */ };

	return room[num];
}



// сняли клик с мышки после токо как кликнули на стену
function clickWallMouseUp(wall)
{
	if(comparePos(wall.userData.wall.last.pos, wall.position)) { return; }		// не двигали
	
	upLineYY( wall.userData.wall.p[ 0 ] );
	upLineYY( wall.userData.wall.p[ 1 ] );
	upLabelPlan_1( param_wall.wallR ); 
	updateShapeFloor( param_wall.arrZone ); 
	if ( camera == cameraTop ) { getInfoEvent2( wall, param_wall.wallR ); }	
	
	clickPointUP_BSP(param_wall.wallR);
	
	calculationAreaFundament_2();
}


