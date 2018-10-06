
var type_browser = detectBrowser();
var newCameraPosition = null;


function updateKeyDown() 
{
	var flag = false;
	
	if ( camera == cameraTop )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.z -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.z += 0.1;
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			newCameraPosition = null;
			flag = true;
		}
	}
	else if ( camera == camera3D ) 
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( -x, 0, -z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			var x = Math.sin( camera.rotation.y - 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y - 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			var x = Math.sin( camera.rotation.y + 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y + 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 88 ] ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, -0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 67 ] ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
	}
	else if ( camera == cameraWall )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.y += 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.y -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			newCameraPosition = null;
			flag = true;
		}
	}

	if(flag) { renderCamera(); }
}

var radious = 10, theta = 90, onMouseDownTheta = 0, phi = 75, onMouseDownPhi = 75;
var centerCam = new THREE.Vector3( 0, 0, 0 );
var cam3dDir = new THREE.Vector3( 1, 0, 0 );

function cameraMove3D( event )
{
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( isMouseDown2 ) 
		{  
			newCameraPosition = null;
			radious = centerCam.distanceTo( camera.position );
			theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
			phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
			phi = Math.min( 180, Math.max( -80, phi ) );

			camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera.position.add( centerCam );  
			camera.lookAt( centerCam );

			wallAfterRender_2();
		}
		if ( isMouseDown3 )    
		{
			newCameraPosition = null;
			var mouseY = ( ( event.clientX - onMouseDownPosition.x ) * 0.01 );
			var mouseX = ( ( event.clientY - onMouseDownPosition.y ) * 0.01 );

			onMouseDownPosition.x = event.clientX;
			onMouseDownPosition.y = event.clientY;

			var pos2 = camera.position.clone();


			var dir = new THREE.Vector3().addScaledVector( cam3dDir, -mouseX );
			camera.position.add( dir.addScalar( 0.001 ) );


			var x1 = camera.position.z - centerCam.z;
			var z1 = centerCam.x - camera.position.x;
			dir = new THREE.Vector3( x1, 0, z1 ).normalize();        // dir (перпендикуляр стены)   
			dir = new THREE.Vector3().addScaledVector( dir, -mouseY );
			camera.position.add( dir.addScalar( 0.001 ) );

			centerCam.add( new THREE.Vector3( camera.position.x - pos2.x, camera.position.y - pos2.y, camera.position.z - pos2.z ) );

			wallAfterRender_2();
		}
	}
	else if ( camera3D.userData.camera.type == 'first' )
	{
		if ( isMouseDown2 )
		{
			newCameraPosition = null;
			var y = ( ( event.clientX - onMouseDownPosition.x ) * 0.006 );
			var x = ( ( event.clientY - onMouseDownPosition.y ) * 0.006 );

			camera.rotation.x -= x;
			camera.rotation.y -= y;
			onMouseDownPosition.x = event.clientX;
			onMouseDownPosition.y = event.clientY;

			var dir = camera.getWorldDirection();			
			//dir.y = 0;
			dir.normalize();
			dir.x *= camera3D.userData.camera.dist;
			dir.z *= camera3D.userData.camera.dist;
			dir.add( camera.position );
			dir.y = 0;
			
			centerCam.copy( dir ); 		
		}
	} 		
	
}


// скрываем внешние стены, когда она перекрывает обзор
function wallAfterRender_2()
{ return; 
	for ( var i = 0; i < wallVisible.length; i++ )
	{
		var wall = wallVisible[ i ].wall;
		//var pos = new THREE.Vector3().subVectors( wall.p[1].position, wall.p[0].position ).divideScalar( 2 ).add(wall.p[0].position);

		if ( camera.getWorldDirection().dot( wallVisible[ i ].normal.clone() ) > 0 )  
		{
			wall.visible = false;
			if(wall.userData.wall.outline) { scene.remove(wall.userData.wall.outline); wall.userData.wall.outline = null; }
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[ i2 ].visible = false;
				if ( wall.userData.wall.arrO[ i2 ].userData.door.popObj ) wall.userData.wall.arrO[ i2 ].userData.door.popObj.visible = false;
			}
		}
		else
		{
			wall.visible = true;
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[ i2 ].visible = true;
				if ( wall.userData.wall.arrO[ i2 ].userData.door.popObj ) wall.userData.wall.arrO[ i2 ].userData.door.popObj.visible = true;
			}
		}
	}
}



// кликаем левой кнопокой мыши (собираем инфу для перемещения камеры в 2D режиме)
function clickSetCamera2D( event, click )
{
	if ( click == 'left' ) { isMouseDown1 = true; return; }
	if ( camera == cameraTop || camera == cameraWall ) { }
	else { return; }

	isMouseRight1 = true;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
	newCameraPosition = null;
}


// 1. кликаем левой кнопокой мыши (собираем инфу для вращения камеры в 3D режиме)
// 2. кликаем правой кнопокой мыши (собираем инфу для перемещения камеры в 3D режиме и устанавливаем мат.плоскость)
function clickSetCamera3D( event, click )
{
	if ( camera != camera3D ) { return; }

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

	if ( click == 'left' )				// 1
	{
		//var dir = camera.getWorldDirection();
		var dir = new THREE.Vector3().subVectors( centerCam, camera.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; }
		phi = dergree;  	
		
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    
		theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;	
		
		
		isMouseDown2 = true;
		onMouseDownTheta = theta;
		onMouseDownPhi = phi;
	}
	else if ( click == 'right' )		// 2
	{
		isMouseDown3 = true;
		planeMath.position.copy( centerCam );
		planeMath.rotation.copy( camera.rotation );
		planeMath.updateMatrixWorld();

		var v = planeMath.geometry.vertices;
		var v1 = planeMath.localToWorld( v[ 0 ].clone() );
		var v2 = planeMath.localToWorld( v[ 2 ].clone() );
		cam3dDir = new THREE.Vector3().subVectors( v2, v1 ).normalize();
	}
}





function moveCameraTop( event ) 
{
	if ( !isMouseRight1 ) { return; }

	var f = 1.3 / camera.zoom;

	var x = ( ( event.clientX - onMouseDownPosition.x ) * 0.01 * f );
	var y = ( ( event.clientY - onMouseDownPosition.y ) * 0.01 * f );

	camera.position.x -= x;
	camera.position.z -= y;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
	newCameraPosition = null;
}


// перемещение cameraWall
function moveCameraWall2D( event )
{
	if ( !isMouseRight1 ) { return; }

	var f = 1.3 / camera.zoom;

	var mx = ( ( event.clientX - onMouseDownPosition.x ) * 0.01 * f );
	var my = ( ( event.clientY - onMouseDownPosition.y ) * 0.01 * f );

	var x = Math.sin( camera.rotation.y - 1.5707963267948966 );
	var z = Math.cos( camera.rotation.y - 1.5707963267948966 );
	var dir = new THREE.Vector3( x, 0, z );
	dir = new THREE.Vector3().addScaledVector( dir, mx );
	camera.position.add( dir );

	//camera.position.x -= x;
	camera.position.y += my;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
	newCameraPosition = null;	
}


// cameraZoom
function mousewheel( e )
{
	var delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }

	cameraZoomTop( camera.zoom - ( delta * 0.1 * ( camera.zoom / 2 ) ) );
	cameraZoom3D( delta, 1 );

	if ( camera == cameraWall )
	{
		camera.zoom = camera.zoom - ( delta * 0.1 * ( camera.zoom / 2 ) );
		camera.updateProjectionMatrix();

		// label zoom		
		var k = 1 / camera.zoom;
		if ( k > 1 ) k = 1;
		for ( var i = 0; i < labelRuler1.length; i++ ) { labelRuler1[ i ].scale.set( k, k, k ); }
	}
	
	renderCamera();
}


var zoomLoop = '';
function cameraZoomTopLoop() 
{
	var flag = false;
	
	if ( camera == cameraTop )
	{
		//if(zoomLoop == 'zoomOut'){ setTimeout(cameraZoomTop( 0.3 ), 1000); }
		//if(zoomLoop == 'zoomIn'){ setTimeout(cameraZoomTop( -0.3 ), 1000); }

		if ( zoomLoop == 'zoomOut' ) { cameraZoomTop( camera.zoom - ( 0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoomTop( camera.zoom - ( -0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
	}
	if ( camera == camera3D )
	{
		if ( zoomLoop == 'zoomOut' ) { cameraZoom3D( 0.3, 0.3 ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoom3D( -0.3, 0.3 ); flag = true; }
	}
	if ( camera == cameraWall )
	{
		if ( zoomLoop == 'zoomOut' ) { camera.zoom = camera.zoom - ( 0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { camera.zoom = camera.zoom - ( -0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		camera.updateProjectionMatrix();
	}
	
	if(flag) { renderCamera(); }
}



function cameraZoomTop( delta )
{
	if ( camera != cameraTop ) return;



	camera.zoom = delta;
	camera.updateProjectionMatrix();


	// zoom point
	zoom_binding = camera.zoom;

	var k = 0.085 / camera.zoom;



	var n = 0;
	var v = p_tool.geometry.vertices;
	for ( var i = 0; i < circle.length; i++ )
	{
		v[ n ] = new THREE.Vector3().addScaledVector( circle[ i ].clone().normalize(), 0.1 / camera.zoom );
		v[ n ].y = 0;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = 0;
		n++;

		v[ n ] = v[ n - 2 ].clone();
		v[ n ].y = height_wall + 0.01;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = height_wall + 0.01;
		n++;
	}

	
	p_tool.geometry.verticesNeedUpdate = true;
	p_tool.geometry.elementsNeedUpdate = true;





	// zoom label
	var k = 1 / camera.zoom;
	if ( k < 1 ) 
	{
		k *= kof_rd;

		var n1 = 0.25 * k;
		var n2 = 0.125 * k;
		
		for ( var i = 0; i < obj_line.length; i++ )
		{
			var v1 = geometryLabelWall.vertices;

			v1[ 0 ].x = v1[ 1 ].x = -n1;
			v1[ 2 ].x = v1[ 3 ].x = n1;
			v1[ 1 ].z = v1[ 2 ].z = n2;
			v1[ 0 ].z = v1[ 3 ].z = -n2;

			geometryLabelWall.verticesNeedUpdate = true;
			geometryLabelWall.elementsNeedUpdate = true;
		}

		upLabelPlan_1( obj_line, true );

		if ( labelRuler1[ 0 ].visible ) { for ( var i = 0; i < labelRuler1.length; i++ ) { labelRuler1[ i ].scale.set( k, k, k ); } }

		var n1 = 0.5 * k;
		
		for ( var i = 0; i < room.length; i++ )
		{
			var v = geometryLabelFloor.vertices;

			v[ 0 ].x = v[ 1 ].x = -n1;
			v[ 2 ].x = v[ 3 ].x = n1;
			v[ 1 ].z = v[ 2 ].z = n2;
			v[ 0 ].z = v[ 3 ].z = -n2;

			geometryLabelFloor.verticesNeedUpdate = true;
			geometryLabelFloor.elementsNeedUpdate = true;
		}
	}
}



function cameraZoom3D( delta, z )
{
	if ( camera != camera3D ) return;

	var vect = ( delta < 0 ) ? z : -z;

	var pos2 = camera.position.clone();

	var dir = new THREE.Vector3().subVectors( centerCam, camera.position ).normalize();
	dir = new THREE.Vector3().addScaledVector( dir, vect );
	dir.addScalar( 0.001 );
	var pos3 = new THREE.Vector3().addVectors( camera.position, dir );


	var offset = new THREE.Vector3().subVectors( pos3, pos2 );
	var pos2 = new THREE.Vector3().addVectors( centerCam, offset );

	if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam.copy( pos2 ); } }

	if ( pos3.distanceTo( centerCam ) >= 0.5 ) { camera.position.copy( pos3 ); }
}




// центрируем камеру cameraTop
function centerCamera2D()
{
	if ( camera != cameraTop ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}
	else if ( arr_obj.length > 0 )
	{
		for ( var i = 0; i < arr_obj.length; i++ ) { pos.add( arr_obj[ i ].position ); }
		pos.divideScalar( arr_obj.length );
	}

	newCameraPosition = {position2D: new THREE.Vector3(pos.x, cameraTop.position.y, pos.z)};
	// cameraTop.position.x = pos.x;
	// cameraTop.position.z = pos.z;
}


function centerCamera3D()
{
	if ( camera != camera3D ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}
	else if ( arr_obj.length > 0 )
	{
		for ( var i = 0; i < arr_obj.length; i++ ) { pos.add( arr_obj[ i ].position ); }
		pos.divideScalar( arr_obj.length );
	}

	newCameraPosition = { position3D: new THREE.Vector3( pos.x, 0, pos.z )};

}


function moveCameraToNewPosition()
{

	if ( !newCameraPosition ) return;

	if (camera === cameraTop && newCameraPosition.position2D) 
	{ 
		var pos = camera.position.clone();
		
		camera.position.lerp(newCameraPosition.position2D, 0.1);
		
		if(camera3D.userData.camera.startProject)
		{
			var pos2 = new THREE.Vector3( camera.position.x - pos.x, 0, camera.position.z - pos.z );
			centerCam.add( pos2 );
			camera3D.position.add( pos2 );			
		}
		
		if(comparePos(camera.position, newCameraPosition.position2D)) { newCameraPosition = null; if(camera3D.userData.camera.startProject) { camera3D.userData.camera.startProject = false; }; };		
	}
	
	else if ( camera === camera3D && newCameraPosition.position3D )
	{
		centerCam.lerp( newCameraPosition.position3D, 0.1 );

		var oldDistance = centerCam.distanceTo( camera.position );

		camera.position.x = oldDistance * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = oldDistance * Math.sin( phi * Math.PI / 360 );
		camera.position.z = oldDistance * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

		camera.position.add( centerCam );
		camera.lookAt( centerCam );
		wallAfterRender_2();
		
		if(comparePos(centerCam, newCameraPosition.position3D)) { newCameraPosition = null; };		
	}

	else if ( camera === camera3D && newCameraPosition.positionFirst || camera === camera3D && newCameraPosition.positionFly )
	{
		var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
		
		camera.position.lerp( pos, 0.1 );
		
		camera.lookAt( centerCam ); 
		
		if(comparePos(camera.position, pos)) { newCameraPosition = null; };		
	}
	else
	{
		newCameraPosition = null;
	}
	
	renderCamera();
}


// изменение высоты (через ползунок) камеры в режиме от первого лица 
function changeHeightCameraFirst(value)
{
	if(camera3D.userData.camera.type != 'first') return;
	
	$('.range-slider2').attr("value", value);
	
	camera3D.position.y = (value / 100) * 2 + 0.2;  
}


function detectBrowser()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	// а может это вообще поисковый робот
	return 'Search Bot';
}


console.log( detectBrowser() );
