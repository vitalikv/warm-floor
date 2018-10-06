
var param_pivot = { click : false, obj : null, axis : '', posS : 0, dir : '', qt : '' };

var arrP_4 = [];
var arrP_5 = [];




function createPivot()
{
	var group = new THREE.Object3D();
	var arr = [];
	arr[0] = ['x', new THREE.Vector3(0, 0, 0), 'rgb(168, 69, 69)'];
	arr[1] = ['y', new THREE.Vector3(0, 0, Math.PI/2), 'rgb(17, 255, 0)'];
	arr[2] = ['z', new THREE.Vector3(0, Math.PI/2, 0), 'rgb(0, 64, 255)'];
	
	for ( var i = 0; i < 3; i++ )
	{
		var obj = new THREE.Mesh( createGeometryPivot(1, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: colWin, transparent: true, opacity: 0.0 }) );
		obj.userData.tag = 'pivot';
		obj.pr_axis = arr[i][0];	
		obj.rotation.set( arr[i][1].x, arr[i][1].y, arr[i][1].z );		
		group.add( obj );
		
		
		var axis = new THREE.Mesh( createGeometryPivot(1, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: arr[i][2], depthTest: false }) );	
		axis.renderOrder = 2;
		//axis.rotation.set( arr[i][1].x, arr[i][1].y, arr[i][1].z );		
		obj.add( axis );		
	}
	
	var center = new THREE.Mesh( createGeometryPivot(0.03, 0.03, 0.03), new THREE.MeshBasicMaterial({ color: 'rgb(102, 102, 102)', depthTest: false }) );
	center.position.set(-0.015, 0.0, 0.0);
	center.renderOrder = 2;	
	group.add( center );	
	
	var centerXZ = new THREE.Mesh( createGeometryPivot(0.3, 0.001, 0.3), new THREE.MeshBasicMaterial({ color: colWin, depthTest: false, transparent: true, opacity: 0.4 }) );
	centerXZ.position.set(0.015, 0.0, -0.16);
	centerXZ.renderOrder = 1.9;	
	centerXZ.userData.tag = 'pivot';
	centerXZ.pr_axis = 'xz';
	group.add( centerXZ );	
	
	scene.add( group );

	
	group.visible = false;
	
	return group;
}



// кликнули на pivot
function clickPivot( intersect )
{
	obj_selected = intersect.object;  
	
	param_obj.off = [];
	//var pos = intersect.object.matrixWorld.getPosition();
	var pos = pivot.position;
	
	offset = new THREE.Vector3().subVectors( pos, intersect.point );
	param_pivot.posS = new THREE.Vector3().addVectors( intersect.point, offset );
	
	var axis = intersect.object.pr_axis;
	param_pivot.pr_axis = axis;	
		
	
	if(axis == 'x')
	{ 
		planeMath2.rotation.set( 0, 0, 0 ); 
		var dir = param_pivot.obj.getWorldDirection(); 		
		param_pivot.dir = new THREE.Vector3(-dir.z, 0, dir.x).normalize();	
		param_pivot.qt = quaternionDirection( param_pivot.dir ); 
	}
	else if(axis == 'z')
	{ 
		planeMath2.rotation.set( 0, 0, 0 ); 
		param_pivot.dir = param_pivot.obj.getWorldDirection(); 
		param_pivot.qt = quaternionDirection( param_pivot.dir ); 
	}
	else if(axis == 'xz')
	{ 
		planeMath2.rotation.set( 0, 0, 0 ); 
	}
	else if(axis == 'y')
	{ 
		planeMath2.rotation.set( 0, 0, Math.PI/2 ); 
		param_pivot.dir = dir_y.clone(); 
		param_pivot.qt = qt_plus_y.clone(); 
	}		 
	
	var v = param_pivot.obj.geometry.vertices; 
	var min = v[0].y;
	for ( var i = 0; i < v.length; i++ ){ if (v[i].y <= min){ param_pivot.minVertY = i; } }	
	
	
	//var v = param_pivot.obj.children[0].geometry.attributes.position.array;
	//var min = v[1];
	//for ( var i = 1; i < v.length; i+=3 ){ if(v[i].y <= min){ param_pivot.minVertY = i; } }	
	
	planeMath2.position.copy( intersect.point );
	

	param_pivot.obj.updateMatrixWorld();
	if(param_pivot.pr_axis == 'y')
	{
		var pos3 = param_pivot.obj.localToWorld( param_pivot.obj.geometry.vertices[param_pivot.minVertY].clone() );	 
		param_obj.off[0] = new THREE.Vector3().subVectors( pos, pos3 );		
	}
	//else if(param_pivot.pr_axis == 'x' || param_pivot.pr_axis == 'z')
	else if(1 == 2)	
	{
		arrP_4 = [];
		arrP_4[0] = param_pivot.obj.localToWorld( param_pivot.obj.geometry.vertices[0].clone() );	
		arrP_4[1] = param_pivot.obj.localToWorld( param_pivot.obj.geometry.vertices[3].clone() );
		arrP_4[2] = param_pivot.obj.localToWorld( param_pivot.obj.geometry.vertices[4].clone() );
		arrP_4[3] = param_pivot.obj.localToWorld( param_pivot.obj.geometry.vertices[7].clone() );	

		param_obj.off[0] = new THREE.Vector3().subVectors( pos, arrP_4[0] );
		param_obj.off[1] = new THREE.Vector3().subVectors( pos, arrP_4[1] );	
		param_obj.off[2] = new THREE.Vector3().subVectors( pos, arrP_4[2] );
		param_obj.off[3] = new THREE.Vector3().subVectors( pos, arrP_4[3] );	
		
		arrP_5 = [];
		for ( var i = 0; i < obj_line.length; i++ )
		{
			arrP_5[i] = [];
			obj_line[i].updateMatrixWorld();
			var v = obj_line[i].geometry.vertices;
			arrP_5[i][0] = obj_line[i].localToWorld( v[0].clone() );
			arrP_5[i][1] = obj_line[i].localToWorld( v[v.length - 6].clone() );
			arrP_5[i][2] = obj_line[i].localToWorld( v[4].clone() );
			arrP_5[i][3] = obj_line[i].localToWorld( v[v.length - 2].clone() );
			
			var x1 = obj_line[i].p[1].position.z - obj_line[i].p[0].position.z;
			var z1 = obj_line[i].p[0].position.x - obj_line[i].p[1].position.x;	
			arrP_5[i][4] = new THREE.Vector3(x1, 0, z1).normalize();						// dir (перпендикуляр стены)		
			arrP_5[i][5] = quaternionDirection( arrP_5[i][4] );								// quaternion
		}
	}
	
} 



function movePivot( event )
{	
	var intersects = rayIntersect( event, planeMath2, 'one' ); 
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );

		if(param_pivot.pr_axis == 'xz')
		{
			var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
			pivot.position.add( pos2 );	
			gizmo.position.add( pos2 );
			param_pivot.obj.position.add( pos2 );
			return;			
		}		
		
		
		var subV = new THREE.Vector3().subVectors( pos, param_pivot.posS );
		var locD = localTransformPoint(subV, param_pivot.qt);						
		
		var v1 = new THREE.Vector3().addScaledVector( param_pivot.dir, locD.z );
		pos = new THREE.Vector3().addVectors( param_pivot.posS, v1 );	


		if(param_pivot.pr_axis == 'y') 
		{ 
			if(pos.y - param_obj.off[0].y < 0){ pos.y = param_obj.off[0].y - 0;  } 
		}
		
		if(param_pivot.pr_axis == 'x' || param_pivot.pr_axis == 'z')
		{
			var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
										
				
			var m1 = 0;
			var m2 = 0;
			var posS_1 = [];
			var posS_2 = [];
			//for ( var i = 0; i < arrP_5.length; i++ )
			if(1==2)
			{				
				var f1 = false;
				var f2 = false;		
				
				for ( var n = 0; n < arrP_4.length; n++ )
				{		
					var n2 = (n == arrP_4.length - 1) ? 0 : n + 1;
			
					var p0 = new THREE.Vector3().addVectors( arrP_4[n], pos2 );
					var p1 = new THREE.Vector3().addVectors( arrP_4[n2], pos2 );								
					
					if( CrossLine(p0, p1, arrP_5[i][0], arrP_5[i][1]) ) { f1 = true; }						
					if( CrossLine(p0, p1, arrP_5[i][2], arrP_5[i][3]) ) { f2 = true; }					
				}

				if(f1)
				{ 
					var crossP = [];
					for ( var n = 0; n < arrP_4.length; n++ )
					{				
						var p0 = new THREE.Vector3().addVectors( arrP_4[n], pos2 );
						var posP = crossPointTwoLine(p0, new THREE.Vector3().addVectors( p0, arrP_5[i][4] ), arrP_5[i][0], arrP_5[i][1]);					
						var v1 = localTransformPoint(pos2, quaternionDirection( pos2.clone().normalize() ));

						crossP[n] = []; 
						crossP[n][0] = v1.z; 
						crossP[n][1] = n; 
						crossP[n][2] = p0;
					}
					
					var minDist = crossP[0][0];
					var hit = crossP[0][1];	
					var pv = crossP[0][2];
					for ( var n = 0; n < crossP.length; n++ ) { if (crossP[n][0] > minDist){ minDist = crossP[n][0]; hit = crossP[n][1]; pv = crossP[n][2]; } }
					
					var v1 = new THREE.Vector3().addScaledVector( pos2.clone().normalize(), -minDist );
					var ps = new THREE.Vector3().addVectors( pv, v1 );															
					pos = new THREE.Vector3().addVectors( param_obj.off[ hit ], ps );	
					m1++;
				}
				
				
				if(f2)
				{ 
					var crossP = [];
					for ( var n = 0; n < arrP_4.length; n++ )
					{						
						var p0 = new THREE.Vector3().addVectors( arrP_4[n], pos2 );
						var posP = crossPointTwoLine(p0, new THREE.Vector3().addVectors( p0, arrP_5[i][4] ), arrP_5[i][2], arrP_5[i][3]);					
						//var v1 = localTransformPoint(new THREE.Vector3().subVectors( p0, posP ), arrP_5[i][5]);						
						var v1 = localTransformPoint(pos2, quaternionDirection( pos2.clone().normalize() ));


						crossP[n] = []; 
						crossP[n][0] = -v1.z; 
						crossP[n][1] = n; 
						crossP[n][2] = p0;
					}
	
					var minDist = crossP[0][0];
					var hit = crossP[0][1];
					var pv = crossP[0][2];
					for ( var n = 0; n < crossP.length; n++ ) { if (crossP[n][0] < minDist){ minDist = crossP[n][0]; hit = crossP[n][1]; pv = crossP[n][2]; } }
					
					
					var v1 = new THREE.Vector3().addScaledVector( pos2.clone().normalize(), minDist ); 
					var ps = new THREE.Vector3().addVectors( pv, v1 );															
					pos = new THREE.Vector3().addVectors( param_obj.off[ hit ], ps ); 
					//posS_2[m2] = new THREE.Vector3().subVectors( ps, pivot.position );
					m2++;					
				}
			}

			if(posS_2.length > 0){ pos = pivot.position.clone(); }			
			
		}	 
		
		
		var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
		pivot.position.add( pos2 );
		gizmo.position.add( pos2 );
		param_pivot.obj.position.add( pos2 );
		
		for ( var n = 0; n < arrP_4.length; n++ ){ arrP_4[n].add( pos2 ); }
	}
}


