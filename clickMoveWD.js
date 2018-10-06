

var param_win = { click : false };


function clickWD( intersect )
{	
	var obj = intersect.object;
	if ( obj.userData.tag == 'door_leaf' ) { obj = obj.door; }
	
	setUIPreview(obj, obj.pr_preview, obj.pr_catalog);
	setUIDoorSize(obj);
	addSelectedObject(obj);

	(obj.userData.door.type === 'DoorPattern') ? UI.show('doorPattern') : UI.hide('doorPattern');


	if(camera == cameraWall || camera == cameraTop) 
	{
		obj_selected = obj;
		
		// label zoom		
		var k = 1 / camera.zoom;
		if(k > 1) k = 1;
		for ( var i = 0; i < labelRuler1.length; i++ ) { labelRuler1[i].scale.set(k, k, k); } 		
	}		

 	getInfoWD_1(obj, intersect.point);
	
	clickShowRulerWD(obj);
}


function getInfoWD_1(obj, pos)
{
	if(camera != cameraWall) { pos.y = obj.position.y; }
	
	if(camera == cameraTop) 
	{
		planeMath.position.set( 0, pos.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);	
		var offset = new THREE.Vector3().subVectors( obj.position, pos );		
	}
	else
	{
		planeMath.position.copy( pos );
		planeMath.rotation.set( 0, obj.rotation.y, 0 );			
		var offset = new THREE.Vector3().subVectors( obj.position, pos );		
	}	
	
	planeMath.updateMatrixWorld();  //  (для того, что бы при первом клике, окно не улетало на старое место, где до этого стояла мат.плоскость)	

	param_win.click = true;

	obj.userData.door.offset = offset;	
	
	findOnWallWD(obj);
}



// находим у окна/двери ближайшие объекты (ограничевающие перемещение)
// если их нету, то находим конецы стены
function findOnWallWD(wd)
{
	var arrWD = wallLeftRightWD_2(wd);
	
	wd.geometry.computeBoundingBox();
	
	var wall = wd.userData.door.wall;
	wall.geometry.computeBoundingBox();	
	
	var off = 0.01;
	
	wd.userData.door.bound = { min : { x : wall.geometry.boundingBox.min.x + off, y : wall.geometry.boundingBox.min.y + off }, max : { x : wall.geometry.boundingBox.max.x - off, y : wall.geometry.boundingBox.max.y - off } };
	
	if(arrWD.left)
	{
		arrWD.left.updateMatrixWorld();
		var pos = arrWD.left.worldToLocal( wd.position.clone() );	 	
		var n = getMinDistanceVertex(arrWD.left.geometry.vertices, pos);
		
		var pos = arrWD.left.localToWorld( arrWD.left.geometry.vertices[n].clone() );		
		
		wd.userData.door.bound.min.x = wall.worldToLocal( pos.clone() ).x + off;
	}
	

	if(arrWD.right)
	{
		arrWD.right.updateMatrixWorld();
		var pos = arrWD.right.worldToLocal( wd.position.clone() );	 	
		var n = getMinDistanceVertex(arrWD.right.geometry.vertices, pos);
		
		var pos = arrWD.right.localToWorld( arrWD.right.geometry.vertices[n].clone() );
		
		wd.userData.door.bound.max.x = wall.worldToLocal( pos.clone() ).x - off;
	}		
	
	wd.userData.door.last.pos = wd.position.clone();	
	
	var v = wd.geometry.vertices;
	var f = wd.userData.door.form.v;
	wd.userData.door.last.x = v[f.maxX[0]].x - v[f.minX[0]].x;
	wd.userData.door.last.y = v[f.maxY[0]].y - v[f.minY[0]].y;
}




// определяем есть ли между окном другие окна/двери и находим ближайшие
function wallLeftRightWD_2(wd)
{	
	var wall = wd.userData.door.wall;

	wall.updateMatrixWorld();
	
	var posC = wall.worldToLocal( wd.position.clone() );	// позиция главного окна относительно стены
	
	var arrL = { x : 99999, o : null }, arrR = { x : 99999, o : null };
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		if(wall.userData.wall.arrO[i] == wd) continue;
		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		var x = Math.abs(v.x - posC.x); 
		
		if (v.x <= posC.x) { if(x < arrL.x) { arrL.x = x; arrL.o = wall.userData.wall.arrO[i]; } }
		else { if(x < arrR.x) { arrR.x = x; arrR.o = wall.userData.wall.arrO[i]; } }		
	}	
	
	return { left : arrL.o, right : arrR.o };
}




// находим ближайшую точку к выброанной позиции
function getMinDistanceVertex(v, pos)
{
	var minDist = 99999;
	var hit = 0;

	for ( var i = 0; i < v.length; i++ )
	{
		var dist = pos.distanceTo(v[i]);
		if (dist <= minDist)
		{
			minDist = dist;
			hit = i;
		}
	}	

	return hit;
}



// находим ближайшую точку с одной стороны стены
function getMinDistanceWallOneSideVertex(v, pos)
{
	var minDist = 99999;
	var hit = 0;

	for ( var i = 0; i < v.length / 12; i++ )
	{
		var n = i * 12;
		
		var dist = Math.abs(v[0 + n].x - pos.x); 
		if (dist < minDist) { minDist = dist; hit = 0 + n; }
		
		dist = Math.abs(v[6 + n].x - pos.x);
		if (dist < minDist) { minDist = dist; hit = 6 + n; }
	}

	return hit;	
}


 

function moveWD( event, wd ) 
{
	if(camera == camera3D) { return; }
	
	var intersects = rayIntersect( event, planeMath, 'one' ); 	
	if ( intersects.length > 0 ) { moveWD_2( wd, intersects[ 0 ].point ); }	
}


var objsBSP = null;
var objClone = new THREE.Mesh();
var wallClone = new THREE.Mesh();

function moveWD_2( wd, pos )
{
	if(param_win.click)  
	{ 
		param_win.click = false; 
		d_tool.visible = false;

		wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : createCloneWD_BSP( wd ) };
	}
	
	var wall = wd.userData.door.wall;
	
	pos = new THREE.Vector3().addVectors( wd.userData.door.offset, pos );			
	pos = wall.worldToLocal( pos.clone() );
	
	var x_min = wd.geometry.boundingBox.min.x;
	var x_max = wd.geometry.boundingBox.max.x;
	var y_min = wd.geometry.boundingBox.min.y;
	var y_max = wd.geometry.boundingBox.max.y;
	
	var bound = wd.userData.door.bound;
	
	if(pos.x + x_min < bound.min.x){ pos.x = bound.min.x - x_min; }
	else if(pos.x + x_max > bound.max.x){ pos.x = bound.max.x - x_max; }		
	
	if(pos.y + y_min < bound.min.y + 0.1 - 0.014){ pos.y = bound.min.y - y_min + 0.1 - 0.014; }
	else if(pos.y + y_max > bound.max.y){ pos.y = bound.max.y - y_max; }

	
	if(camera == cameraTop){ pos.z = 0; }	
	
	var pos = wall.localToWorld( pos.clone() );
	
	var pos2 = new THREE.Vector3().subVectors( pos, wd.position );
	
	wd.position.copy( pos );	

	wd.userData.door.h1 += pos2.y;
	UI('window_above_floor_1').val(Math.round(wd.userData.door.h1 * 100) * 10);
	
	for ( var i = 0; i < arrContWD.length; i++ ) { arrContWD[i].position.add( pos2 ); } 	// меняем расположение контроллеров	
	
	MeshBSP( wd, objsBSP );
	
	showRulerWD_2D(wd); 	// перемещаем линейки и лайблы
	showRulerWD_3D(wd);
}




// скрываем размеры и котнроллеры у окна/двери
function hideSizeWD( obj )
{	
	if(camera == cameraTop || camera == camera3D) 
	{
		//d_tool.visible = false;  
		
		if(obj)
		{
			if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
			{
				obj.userData.door.wall.label[0].visible = true; 
				obj.userData.door.wall.label[1].visible = true;	 	
			}			
		}
	}
		
	for ( var i = 0; i < arrContWD.length; i++ ) { arrContWD[i].visible = false; }
	for ( var i = 0; i < arrRule4.length; i++ ) { arrRule4[i].visible = false; }
	for ( var i = 0; i < labelRuler1.length; i++ ){ labelRuler1[i].visible = false; }
	for ( var i = 0; i < ruleVert_1.length; i++ ) { ruleVert_1[i].visible = false; }		
}


// кликнули на окно/дверь (показываем/скрываем таблицу, длина/ширина/высота )
function showTableWD(wd)
{			
	wd.geometry.computeBoundingBox();
	
	var minX = wd.geometry.boundingBox.min.x;
	var maxX = wd.geometry.boundingBox.max.x;
	var minY = wd.geometry.boundingBox.min.y;
	var maxY = wd.geometry.boundingBox.max.y;

	var d1 = Math.abs( maxX - minX );		
	var d2 = Math.abs( maxY - minY );			

	var wall = wd.userData.door.wall;
	var pos = wd.localToWorld( new THREE.Vector3(0,minY,0) );
	var h = wall.worldToLocal( pos.clone() ).y;	
	
	wd.userData.door.h1 = h; 
	
	var menu = '';
	
	//if(wd.userData.tag == 'door') { menu = (wd.userData.door.type == 'DoorEmpty') ? 'window' : 'door'; }
	//else if(wd.userData.tag == 'window') { menu = 'window'; }
	
	menu = (wd.userData.tag == 'window') ? 'window' : 'door';
	
	if(menu == 'door')
	{ 
		setUIPreview(wd, wd.pr_preview, wd.pr_catalog);
		UI('door_width_1').val(Math.round(d1 * 100) * 10)
		UI('door_width_2').val(Math.round(d1 * 100) * 10);	
		UI.showToolbar('door-2d-toolbar');  
	}
	else if(menu == 'window')
	{		
		UI('window_width_1').val(Math.round(d1 * 100) * 10)
		UI('window_height_1').val(Math.round(d2 * 100) * 10)
		UI('window_above_floor_1').val(Math.round(h * 100) * 10)
		UI.showToolbar('window-toolbar');		 
	}	
}



// измененяем ширину и высоту окна/двери, высоту над полом
function inputWidthHeightWD(wd)
{  
	var wall = wd.userData.door.wall;
	
	var x = Number(UI('window_width_1').val()) / 1000;	 				// ширина окна	
	var y = Number(UI('window_height_1').val()) / 1000;  				// высота окна
	var h = Number(UI('window_above_floor_1').val()) / 1000 - wd.userData.door.h1;		// высота над полом	
	
	h += (y - Math.abs( wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y )) / 2;    // вычитаем изменение высоты окна/двери  
	
	var pos = wd.position.clone();
	pos.y += h;		// вычитаем изменение высоты окна/двери
	wd.userData.door.h1 += h;
	
	сhangeSizePosWD( wd, pos, x, y );	// изменяем размер окна/двери, а также перемещаем
	
	wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
	wallClone.position.copy( wd.userData.door.wall.position ); 
	wallClone.rotation.copy( wd.userData.door.wall.rotation );		

	MeshBSP( wd, { wall : wallClone, wd : createCloneWD_BSP( wd ) } ); 	
	
	wd.updateMatrixWorld();
	
	clickShowRulerWD(wd);	// показываем линейки и контроллеры для окна/двери
	
	getInfoEvent7( wd );
}



// перетаскиваем (drag drop) контроллер переноса полотна двери
function moveToolDoor( event )
{
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	d_tool.position.set( intersects[ 0 ].point.x, d_tool.position.y, intersects[ 0 ].point.z );
	
	var door = d_tool.door;					// дверь (коробка)
	var door_leaf = door.userData.door.leaf_2D;			// полотно  	
	
	var v1 = door.worldToLocal(d_tool.position.clone());
	
	
	if(v1.z < 0)
	{
		if(v1.x < 0) { var open_type = 0; }
		else { var open_type = 2; }
	}
	else if(v1.z > 0)
	{ 
		if(v1.x < 0) { var open_type = 3; }
		else { var open_type = 1; }
	}

	
	if(door.userData.door.open_type != open_type) 
	{ 
		setPosDoorLeaf_1(door, open_type); 
		if(door.userData.door.type == 'DoorSimply') { setPosDoorLeaf_2(door); } 
		else if(door.userData.door.type == 'DoorPattern') { setPosDoorLeaf_3(door); } 
	}		
}





// переключение положения двери по кнопки из меню 
function changeInputPosDoorLeaf(value) 
{
	var door = null;
	
	if(camera == cameraTop) { door = clickO.obj; }
	else { door = clickO.last_obj; }
	
	if(!door) { console.log('door null'); return; }
	if(!door.userData.door.leaf_2D) { return; }
	
	var open_type = 0;
	
	if(value == 0) 
	{ 
		if(door.userData.door.open_type == 0) { open_type = 2; }
		else if(door.userData.door.open_type == 2) { open_type = 0; }
		else if(door.userData.door.open_type == 3) { open_type = 1; }
		else if(door.userData.door.open_type == 1) { open_type = 3; }
	}
	else 
	{ 
		if(door.userData.door.open_type == 0) { open_type = 3; }
		else if(door.userData.door.open_type == 3) { open_type = 0; }
		else if(door.userData.door.open_type == 2) { open_type = 1; }
		else if(door.userData.door.open_type == 1) { open_type = 2; }  
	} 
	
	setPosDoorLeaf_1(door, open_type);
	if(door.userData.door.type == 'DoorSimply') { setPosDoorLeaf_2(door); }
	else if(door.userData.door.type == 'DoorPattern') { setPosDoorLeaf_3(door); }  
	clickToolDoorUp(door);	
}



// устанавливаем полотно в зависимости от параметра open_type
function setPosDoorLeaf_1(wd, open_type) 
{  
	if(!wd.userData.door.leaf_2D) return;
	
	var door_leaf = wd.userData.door.leaf_2D;
	door_leaf.rotation.y = Math.PI/2;		
	var v = wd.geometry.vertices;	
	
	var bound = wd.geometry.boundingBox;
	var center = wd.geometry.boundingSphere.center; 	
	
	if(open_type == 3) { door_leaf.position.set(bound.min.x + 0.08 / 2, 0, bound.max.z - 0.08); door_leaf.rotation.y -= Math.PI; }	
	else if(open_type == 2) { door_leaf.position.set(bound.max.x - 0.08 / 2, 0, bound.min.z + 0.08); }
	else if(open_type == 1) { door_leaf.position.set(bound.max.x - 0.08 / 2, 0, bound.max.z - 0.08); door_leaf.rotation.y += Math.PI; }
	else if(open_type == 0) { door_leaf.position.set(bound.min.x + 0.08 / 2, 0, bound.min.z + 0.08); }			
	
	wd.userData.door.open_type = open_type; 
	
	if(camera != cameraTop) { wd.remove(wd.userData.door.leaf_2D); }	// удаляем 2D полотно
}




// устанавливаем (поварачиваем) ПОП дверь, т.к. открыто дверное полотно type == 'DoorSimply'
function setPosDoorLeaf_2(door) 
{
	var popObj = door.userData.door.popObj;	
	 
	if(!popObj) return;
		
	var v = door.geometry.vertices;	
	var minZ = door.userData.door.form.v.minZ; 
	var maxZ = door.userData.door.form.v.maxZ;
	
	if(door.userData.door.leaf_2D)
	{
		var size = door.userData.door.size;
		
		if(door.userData.door.open_type == 0) 
		{
			popObj.scale.x = Math.abs(popObj.scale.x);
			popObj.scale.z = Math.abs(popObj.scale.z);			
			popObj.rotation.y = 0;
			popObj.position.set(0, 0, v[minZ[0]].z + Number(size.z) / 2);
		}
		else if(door.userData.door.open_type == 1)
		{ 
			popObj.scale.x = Math.abs(popObj.scale.x);
			popObj.scale.z = Math.abs(popObj.scale.z);	
			popObj.rotation.y = Math.PI; 
			popObj.position.set(0, 0, v[maxZ[0]].z - Number(size.z) / 2); 
		}
		else if(door.userData.door.open_type == 2)
		{ 
			popObj.scale.x = -Math.abs(popObj.scale.x);
			popObj.scale.z = Math.abs(popObj.scale.z);
			popObj.rotation.y = 0;
			popObj.position.set(0, 0, v[minZ[0]].z + Number(size.z) / 2);
		}
		else if(door.userData.door.open_type == 3)
		{ 
			popObj.scale.x = Math.abs(popObj.scale.x);
			popObj.scale.z = -Math.abs(popObj.scale.z); 
			popObj.rotation.y = 0;
			popObj.position.set(0, 0, v[maxZ[0]].z - Number(size.z) / 2);
		}
	}	
}



// устанавливаем (поварачиваем) ПОП дверь, т.к. открыто дверное полотно type == 'DoorPattern'
function setPosDoorLeaf_3(door)
{
	//if(camera != cameraTop && door.userData.door.leaf_2D) { door.remove(door.userData.door.leaf_2D); }	// удаляем 2D полотно		
	
	door.geometry.computeBoundingBox();
	
	var popObj = door.userData.door.popObj;
		
	var open_type = door.userData.door.open_type;	
	
	if(open_type == 0 || open_type == 1) { popObj.scale.x = Math.abs(popObj.scale.x); }	
	else { popObj.scale.x = -Math.abs(popObj.scale.x); }		
	 
	if(open_type == 0 || open_type == 2) 
	{
		popObj.rotation.y = 0;
		popObj.position.set( 0, door.geometry.boundingBox.min.y, door.geometry.vertices[7].z - popObj.geometry.vertices[0].z );
	}
	else
	{
		popObj.rotation.y = -Math.PI;
		popObj.position.set( 0, door.geometry.boundingBox.min.y, door.geometry.vertices[0].z - popObj.geometry.vertices[0].z );
	}		
}



// устанавливаем контроллер перемещения полотна на торец полотна
function clickToolDoorUp(wd) 
{
	if(camera != cameraTop) { return; }	
	
	if (wd.userData.door.type == 'DoorSimply' || wd.userData.door.type == 'DoorPattern') { }
	else { d_tool.visible = false; return; }
	
	wd.updateMatrixWorld();
	wd.userData.door.leaf_2D.updateMatrixWorld();
	var v = wd.userData.door.leaf_2D.geometry.vertices;
	var pos2 = wd.userData.door.leaf_2D.localToWorld( new THREE.Vector3(v[3].x, v[2].y, (v[4].z - v[3].z) / 2 + v[3].z) );
	d_tool.position.copy( pos2 ); 

	d_tool.visible = true;     
}



// изменяем размер окна/двери, а также перемещаем
function сhangeSizePosWD( wd, pos, x, y )
{	
	var v = wd.geometry.vertices;
	var f = wd.userData.door.form.v;
	
	for ( var i = 0; i < f.minX.length; i++ ) { v[f.minX[i]].x = -x / 2; }
	for ( var i = 0; i < f.maxX.length; i++ ) { v[f.maxX[i]].x = x / 2; }
	for ( var i = 0; i < f.minY.length; i++ ) { v[f.minY[i]].y = -y / 2; }
	for ( var i = 0; i < f.maxY.length; i++ ) { v[f.maxY[i]].y = y / 2; }


	wd.geometry.verticesNeedUpdate = true;
	wd.geometry.elementsNeedUpdate = true;	
	wd.geometry.computeBoundingSphere();

	wd.position.copy( pos );
	
	changeWindowDoorPop(wd, x / 2, y / 2);		// изменяем у ПОП объекта ширину/высоту/центрируем 
	
	
}




// сняли клик с мышки после токо как кликнули на стену
function clickWDMouseUp(wd)
{
	clickToolDoorUp(wd);
	
	if(comparePos(wd.userData.door.last.pos, wd.position)) { return; }		// не двигали
	
	getInfoEvent7( wd );	
}


