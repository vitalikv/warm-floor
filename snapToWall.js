var inititalObjectOffset;
var inititalObjectRotation;
var lastTimeWasFlip = false;
var lastObject = false;
var snap_debug = false;

function getSnapPosition( position, rotation, size, mouseOffset, mousePosition )
{

  var snapPoint, rayDistance;
  var snapOffset = 0.01;
  var snapDistance = 0.10;
  var axisY = new THREE.Vector3( 0, 1, 0 );
  var rayDirection = new THREE.Vector3( 0, 0, 1 );
  var rayDirectionY = new THREE.Vector3( 0, -1, 0 );
  var initialRotation = rotation.clone();
  var newRotation = rotation.clone();

  rayDistance = size.y + snapDistance;
  rayDirection = new THREE.Vector3( 0, -1, 0 );

  var ep = rayDirection.clone();
  var np = position.clone().add( new THREE.Vector3( 0, 1, 0 ).multiplyScalar( size.y ) );
  var intersectPoint = checkIntersect( np, rayDirection, 0, rayDistance, room, helperY1 );
  var endPoint = np.add( ep.multiplyScalar( rayDistance ) );
  var snapPoint = getSnapPointY( intersectPoint, endPoint, snapDistance, position, initialRotation, rayDirection );

  if ( snapPoint )
  {
    position = snapPoint.point;
  }

  rayDirection = new THREE.Vector3( 0, 1, 0 );

  intersectPoint = checkIntersect( position, rayDirection, size.y, rayDistance, ceiling, helperY2 );
  ep = rayDirection.clone();
  np = position.clone();
  endPoint = np.add( ep.multiplyScalar( rayDistance ) );
  snapPoint = getSnapPointY( intersectPoint, endPoint, snapDistance, position, initialRotation, rayDirection );

  if ( snapPoint )
  {
    position = snapPoint.point;
  }

  rayDirection = new THREE.Vector3( 0, 0, 1 );
  rayDistance = size.z + snapDistance;
  rayDirection.applyEuler( rotation );

  intersectPoint = checkIntersect( position, rayDirection, size.z, rayDistance, obj_line, helperZ1 );
  ep = rayDirection.clone();
  np = position.clone();
  endPoint = np.add( ep.multiplyScalar( rayDistance ) );
  snapPoint = getSnapPoint( intersectPoint, endPoint, snapDistance, position, initialRotation, rayDirection );

  var flag = false;
  
  if ( snapPoint )
  {
    position = snapPoint.point;
    if ( !snapPoint.rotation.equals( initialRotation ) && rotation.equals( initialRotation ) )
    {  
      rotation = snapPoint.rotation;
	  flag = true;
    }
  }

  rayDistance = size.x + snapDistance;
  rayDirection.applyAxisAngle( axisY, -Math.PI / 2 );
  ep = rayDirection.clone();
  np = position.clone();
  endPoint = np.add( ep.multiplyScalar( rayDistance ) );
  intersectPoint = checkIntersect( position, rayDirection, size.x, rayDistance, obj_line, helperX1 );
  snapPoint = getSnapPoint( intersectPoint, endPoint, snapDistance, position, initialRotation, rayDirection );

  if ( snapPoint )
  {
    position = snapPoint.point;
    if ( !snapPoint.rotation.equals( initialRotation ) && rotation.equals( initialRotation ) )
    {  
      rotation = snapPoint.rotation;
	  flag = true;
    }
  }

  rayDistance = size.z + snapDistance;
  rayDirection.applyAxisAngle( axisY, -Math.PI / 2 );
  ep = rayDirection.clone();
  np = position.clone();
  endPoint = np.add( ep.multiplyScalar( rayDistance ) );
  intersectPoint = checkIntersect( position, rayDirection, size.z, rayDistance, obj_line, helperZ2 );
  snapPoint = getSnapPoint( intersectPoint, endPoint, snapDistance, position, initialRotation, rayDirection );

  if ( snapPoint )
  {
    position = snapPoint.point;
    if ( !snapPoint.rotation.equals( initialRotation ) && rotation.equals( initialRotation ) )
    {
      rotation = snapPoint.rotation;
	  flag = true;
    }
  }

  rayDistance = size.x + snapDistance;
  rayDirection.applyAxisAngle( axisY, -Math.PI / 2 );
  ep = rayDirection.clone();
  np = position.clone();
  endPoint = np.add( ep.multiplyScalar( rayDistance ) );
  intersectPoint = checkIntersect( position, rayDirection, size.x, rayDistance, obj_line, helperX2 );
  snapPoint = getSnapPoint( intersectPoint, endPoint, snapDistance, position, initialRotation, rayDirection );

  if ( snapPoint )
  {
    if ( !snapPoint.rotation.equals( initialRotation ) && rotation.equals( initialRotation ) )
    { 
      rotation = snapPoint.rotation;
	  flag = true;
    }
	
	var rot1 = new THREE.Vector3(obj_selected.rotation.x, obj_selected.rotation.y, obj_selected.rotation.z);
	var rot2 = new THREE.Vector3(rotation.x, rotation.y, rotation.z);
	
	if(flag) { if(comparePos(rot1, rot2)) { flag = false; } }
	 
		
    return {
      point: snapPoint.point,
      rotation: rotation,
      offset: mouseOffset,
	  changeRotation: flag
    }
  }

}


function getSnapPointY( intersectPoint, endPoint, snapDistance, position, rotation, vector )
{

  if ( !intersectPoint )
  {
    return {
      point: position,
      rotation: rotation
    };
  }

  var point = position.clone();
  var object = intersectPoint.object;
  var dir = new THREE.Vector3().subVectors( intersectPoint.point, endPoint );
  var length = dir.length() - snapDistance;
  var rot = rotation.clone();

  point.add( dir.normalize().multiplyScalar( length ) );

  return {
    point: point,
    rotation: rot
  }

}

function getSnapPoint( intersectPoint, endPoint, snapDistance, position, rotation, vector )
{

  if ( !intersectPoint )
  {
    return {
      point: position,
      rotation: rotation
    };
  }

  var point = position.clone();
  var object = intersectPoint.object;
  var dir = new THREE.Vector3().subVectors( intersectPoint.point, endPoint );
  var length = dir.length() - snapDistance;
  var rot = rotation.clone();

  var projection = spPoint( object.userData.wall.p[ 0 ].position, object.userData.wall.p[ 1 ].position, point );
  projection.y = position.y;
  var proj = new THREE.Vector3( projection.x, projection.y, projection.z );
  var direction = new THREE.Vector3().subVectors( projection, point ).normalize();
  var angle = Math.atan2( direction.x, direction.z );
  var direction2 = new THREE.Vector3().subVectors( intersectPoint.point, point ).normalize();
  var angle2 = Math.atan2( direction2.x, direction2.z );

  if ( !calScal( object.userData.wall.p[ 0 ].position, object.userData.wall.p[ 1 ].position, proj ) )
  {
    return {
      point: position,
      rotation: rotation
    }
  }

  var v2 = new THREE.Vector3( 0, 1, 0 );
  var quaternion = new THREE.Quaternion().setFromAxisAngle( v2, angle - angle2 );
  var q2 = new THREE.Quaternion().setFromEuler( rot ).multiply( quaternion );

  rot.copy( new THREE.Euler().setFromQuaternion( q2 ) );
  point.add( dir.normalize().multiplyScalar( length ) );

  return {
    point: point,
    rotation: rot
  }

}

function castRay( position, direction, rayDistance, target )
{

  var ray = new THREE.Raycaster( position, direction, 0, rayDistance );
  var objIntersects = ray.intersectObjects( target );

  if ( objIntersects.length > 0 )
  {
    return objIntersects[ 0 ];
  }

}


function snapToPlane( object, newPos, mouseOffset, mousePosition, inititalObjectOffset, inititalObjectRotation )
{

  var objectRotation = object.rotation.clone();
  var size = object.geometry.boundingBox.max;
  object.position.add( newPos );

  var snapPoint = getSnapPosition( object.position, objectRotation, size, mouseOffset, mousePosition );
  if ( snapPoint )
  {  
    object.position.copy( snapPoint.point );
    object.rotation.copy( snapPoint.rotation );
    mouseOffset.copy( snapPoint.offset );
    return { pos : new THREE.Vector3().subVectors( object.position, snapPoint.point ), changeRotation : snapPoint.changeRotation }; 
  }
  else
  { 
    inititalObjectOffset && mouseOffset.copy( inititalObjectOffset );
    inititalObjectRotation && object.rotation.copy( inititalObjectRotation );
    return { pos : newPos, changeRotation : false }
  }

}

function checkIntersect( position, rayDirection, size, rayDistance, obj, helper )
{

  var intersectPoint = castRay( position, rayDirection, rayDistance, obj );

  if ( helper )
  {
    helper.position.copy( position );
    helper.setDirection( rayDirection );
    helper.setLength( rayDistance );
    if ( intersectPoint )
    {
      helper.setColor( new THREE.Color( 0xff0000 ) );
    } else
    {
      helper.setColor( new THREE.Color( 0x00ff00 ) );
    }
  }

  return intersectPoint;

}

var helperPos = new THREE.Vector3( 0, 0, 0 );
var helperDir = new THREE.Vector3( 0, 0, 0 );
var helperX1 = new THREE.ArrowHelper( helperDir, helperPos, 10, 0xff0000 );
var helperX2 = new THREE.ArrowHelper( helperDir, helperPos, 10, 0xff0000 );
var helperZ1 = new THREE.ArrowHelper( helperDir, helperPos, 10, 0x00ff00 );
var helperZ2 = new THREE.ArrowHelper( helperDir, helperPos, 10, 0x009900 );
var helperY1 = new THREE.ArrowHelper( helperDir, helperPos, 10, 0x0000ff );
var helperY2 = new THREE.ArrowHelper( helperDir, helperPos, 10, 0x0000ff );
var helpersInit = false;

function initHelpers()
{

  if ( helpersInit ) return;

  scene.add( helperZ1 );
  scene.add( helperZ2 );
  scene.add( helperX1 );
  scene.add( helperX2 );
  scene.add( helperY1 );
  scene.add( helperY2 );

  helpersInit = true;

}

if ( snap_debug )
{

  document.addEventListener( 'keypress', function ( e )
  {
    if ( e.keyCode === 109 )
    {
      initHelpers();
      var obj = {
        lotGroup: 'Furniture',
        size: {
          x: 3,
          y: 1,
          z: 2
        },
        modifiers: ''
      }
      createEmptyCube( obj );
    }
  } )

}