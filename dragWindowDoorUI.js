


function dragWD_2( event, obj ) 
{ 
	var arrDp = [];
	for ( var i = 0; i < obj_line.length; i++ ){ arrDp[arrDp.length] = obj_line[i]; } 
	for ( var i = 0; i < arr_door.length; i++ ){ arrDp[arrDp.length] = arr_door[i]; } 
	for ( var i = 0; i < arr_window.length; i++ ){ arrDp[arrDp.length] = arr_window[i]; } 
	arrDp[arrDp.length] = planeMath; 

	var intersects = rayIntersect( event, arrDp, 'arr' );
	
	var wall = null;
	
	var pos = new THREE.Vector3();
	if(obj.material.color == actColorWin) { obj.material.color = obj.userData.door.color; }
	
	for ( var i = 0; i < intersects.length; i++ )
	{
		if (intersects[ i ].face != null) 
		{
			var object = intersects[ i ].object;
			
			if(object.userData.tag == 'planeMath'){ obj.position.copy( intersects[i].point ); } 			
			else if(object.userData.tag == 'wall'){ wall = object; obj.rotation.copy( wall.rotation ); pos = intersects[i].point; }
			else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ obj.material.color = actColorWin; } 
		}
	}

	if(obj.material.color == actColorWin) { obj.userData.door.wall = null; return; }
	if(!wall) { obj.userData.door.wall = null; return; }

	

	wall.updateMatrixWorld();			
	var pos = wall.worldToLocal( pos.clone() );	
	var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0 ) ); 	
	
	var h = wall.userData.wall.p[0].position.y;   
	//if(obj.userData.door.type == 'WindowSimply') { h += 0.6; console.log(h , obj.position.y); }  
	obj.position.set( pos.x, obj.userData.door.floorCenterY + h, pos.z ); 	

	changeWidthWD(obj, wall);	
	
	obj.userData.door.wall = wall;
}


// изменение ширины формы окна/двери
function changeWidthWD(obj, wall)
{
	if(obj.userData.door.wall == wall) return;
	if(obj.userData.door.width == wall.userData.wall.width) return;
	
	var v = obj.geometry.vertices;
	var minZ = obj.userData.door.form.v.minZ; 
	var maxZ = obj.userData.door.form.v.maxZ;
	
	var width = wall.userData.wall.width; 
	wall.geometry.computeBoundingBox();
	
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z = wall.geometry.boundingBox.min.z; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z = wall.geometry.boundingBox.max.z; }
	
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeFaceNormals();		
	
	obj.userData.door.width = width;	
	
	if(obj.userData.door.popObj) obj.userData.door.popObj.position.copy(obj.geometry.boundingSphere.center.clone());
}



// получаем ближайшую левую и правую точку 
function getPosXMinMax(v, px)
{
	var min = 0;
	var max = 0;
	
	if(px < v[0].x){ px = v[0].x + 0.0001; }
	if(px < v[4].x){ px = v[4].x + 0.0001; }	
	if(px > v[v.length - 2].x){ px = v[v.length - 2].x - 0.0001; }
	if(px > v[v.length - 6].x){ px = v[v.length - 6].x - 0.0001; }		
	
	
	var mxp = v[0].x;
	
	for ( var i = 0; i < v.length; i++ )
	{ 
		if (v[i].x < px){ if(v[i].x >= mxp) { min = i; mxp = v[i].x; } } 
	}
	
	var mxp = v[v.length - 6].x;
	
	for ( var i = 0; i < v.length; i++ )
	{ 
		if(v[i].x > px) { if(v[i].x <= mxp) { max = i; mxp = v[i].x; } }
	}	

	return [min, max];
}


