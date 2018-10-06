


var param_obj = { click : false, obj: null, vrs1: 0, rotY: 0, minVertY: 0, off: [] };


// кликнули на ПОП объект
function clickPopObj( intersect )
{

	if ( !intersect ) return;

	var obj = intersect.object;
	if ( obj.userData.tag == 'obj' ) { if ( obj.pr_group ) return; }

	if ( camera == cameraTop || camera == camera3D ) { obj_selected = obj; }
	// console.log(obj_selected.position)

	
	offset = new THREE.Vector3().subVectors( obj.position, intersect.point );
	inititalObjectOffset = offset.clone();

	var flag = true;
	
	if(obj.userData.obj3D) { if(obj.userData.obj3D.controller == 'scale') { flag = false; } }
	
	if(!flag)	// показаны контроллеры scale  
	{ 
		hidePivotGizmo_2(); 
		showBoxPop(obj);  
		param_pivot.obj = obj; 
	} 
	else 		// показан pivot
	{
		hideBoxPop();
		showPivotGizmo( obj );
		
		if ( obj_selected )
		{
			inititalObjectRotation = obj_selected.rotation.clone();
			if ( !obj_selected.geometry.boundingBox ) obj_selected.geometry.computeBoundingBox(); 
			lastObject = obj_selected;
			showObjectControls( obj_selected );
			addSelectedObject( obj_selected );
		}		
	}

	planeMath2.position.copy( intersect.point );
	planeMath2.rotation.set( 0, 0, 0 );
	
	param_obj.click = true;

	// scene.add(arrowHelper);
}


// кликнули на ПОП объект, показываем меню 
function showTablePopObjUI( obj )
{
	//if(obj.userData.tag == 'group_pop') return;  
	if ( obj.userData.tag == 'obj' ) { if ( obj.pr_group ) return; }

	setUIPreview( obj, obj.pr_preview, obj.pr_catalog );

	UI.showToolbar( 'object-toolbar' );
	function toFixed( number )
	{
		return Math.round( ( number ) * 100 ) / 100
	}
	var x = toFixed( obj.pr_scale.x );
	var y = toFixed( obj.pr_scale.y );
	var z = toFixed( obj.pr_scale.z );
	UI( 'obj_pop_size' ).val( x + 'x' + y + 'x' + z );
	UI( 'obj_pop_height_above_floor' ).val( Math.round( obj.position.y * 10 ) / 10 );
}




// показываем Pivot/Gizmo
function showPivotGizmo( obj )
{	
	param_pivot.obj = obj;

	obj.updateMatrixWorld();
	param_obj.vrs1 = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	//obj.children[0].updateMatrixWorld();
	//pivot.position.copy( obj.localToWorld( obj.children[0].position.clone() ) );
	// pivot.position.copy( obj.position );
	//pivot.position.copy( param_obj.vrs1 ); 
	// pivot.rotation.copy( obj.rotation );
	// pivot.rotation.y += Math.PI;
	// pivot.visible = true;
	// pivot.obj = obj;

	gizmo.position.copy( obj.position );
	//gizmo.position.copy( param_obj.vrs1 );
	// gizmo.rotation.copy( obj.rotation );
	gizmo.visible = true; 
	gizmo.obj = obj;

	showObjectControls( obj );

	adjustInitialGizmoSize( obj );
	adjustObjectControlsScale();
	adjustGizmoScale();
	
	if(obj.userData.obj3D) obj.userData.obj3D.controller = 'pivot';
}


// скрываем Pivot/Gizmo
function hidePivotGizmo( obj )
{
	if ( obj_selected ) if ( obj_selected.userData.tag == 'obj' ) return; 
	if ( obj_selected ) if ( obj_selected.userData.tag == 'pivot' ) return;
	if ( obj_selected ) if ( obj_selected.userData.tag == 'gizmo' ) return;
	if ( obj_selected ) if ( obj_selected.userData.tag == 'move_control' ) return;
	//if ( obj_selected ) if ( obj_selected.userData.tag == 'group_pop' ) return;
	if ( obj_selected ) if ( obj_selected.userData.tag == 'toggle_gp' ) return;

	UI.hideToolbar( 'object-toolbar' );

	hidePivotGizmo_2();
}

function hidePivotGizmo_2()
{
	param_pivot.obj = null;
	pivot.visible = false;
	gizmo.visible = false;

	hideObjectControls();
	hideGizmo();
	clearSelectedObjects();
	hideBoxPop();	
}


function movePopObj( event )
{
	if(param_obj.click)
	{
		param_obj.click = false;
	}
	
	var intersects = rayIntersect( event, planeMath2, 'one' );

	if ( intersects.length == 0 ) { return; }

	var obj = obj_selected;
	
	var flag = true;
	
	if(obj.userData.obj3D)
	{
		if(obj.userData.obj3D.controller == 'scale') { flag = false; }
	}
	
	
	if(flag)	// показан pivot
	{
		if ( lastObject !== obj )
		{
			offset = new THREE.Vector3( 0, 0, 0 );
			inititalObjectOffset = offset.clone();
			inititalObjectRotation = obj.rotation.clone();
			planeMath2.position.copy( obj.position );
			planeMath2.rotation.set( 0, 0, 0 );
			obj.geometry.computeBoundingBox();
		}
	}
	else	// показаны контроллеры scale 
	{
		var posOld = obj.position.clone();
	}	

	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	
	var sp = snapToPlane( obj, pos2, offset, intersects[ 0 ].point, inititalObjectOffset, inititalObjectRotation );

	
	if(flag)	// показан pivot
	{
		gizmo.position.copy( obj.position );   

		if ( camera == camera3D ) updateObjectControlRotation();
		updateObjectControlsPosition( obj );
		adjustObjectControlsScale();
		adjustGizmoScale();		
	}
	else	// показаны контроллеры scale
	{ 
	 
		if(sp.changeRotation) 
		{
			if(obj_selected.userData.obj3D.boxPop)
			{
				if(obj_selected.userData.obj3D.controller == 'scale')
				{
					showBoxPop(obj_selected);
				}
			}
		}	
	
		var pos2 = new THREE.Vector3().subVectors( obj.position, posOld ); 
		boxPop.position.add(pos2);
		for ( var i = 0; i < controlBoxPop2D.length; i++ ) { controlBoxPop2D[i].position.add(pos2); }
		for ( var i = 0; i < controlBoxPop3D.length; i++ ) { controlBoxPop3D[i].position.add(pos2); }
		for ( var i = 0; i < lineBoxPop.length; i++ ) { lineBoxPop[i].position.add(pos2); }
	}

	UI.setCursor( 'move' );
	UI( 'obj_pop_height_above_floor' ).val( Math.round( obj.position.y * 10 ) / 10 );

	lastObject = obj;

}


// меняем высоту POP над полом через input
function inputChangeHeightPopObj( value )
{
	if ( !value ) return;

	var height = Math.round( value * 10 ) / 10;

	var obj = param_pivot.obj;
	//console.log(  );

	var offset = height - obj.position.y;

	obj.position.y = height;

	pivot.position.y += offset;
	objectControls.position.y += offset;
	objectControls.yAxis.position.y += offset;
	gizmo.position.y += offset;
	
	if(obj.userData.obj3D.controller == 'scale')
	{
		boxPop.position.y += offset;
		for ( var i = 0; i < controlBoxPop2D.length; i++ ) { controlBoxPop2D[i].position.y += offset; }
		for ( var i = 0; i < controlBoxPop3D.length; i++ ) { controlBoxPop3D[i].position.y += offset; }
	}	
}