

// линейки для окон (создается при старте)
function createRulerWin()
{
	var arrRule4 = [];
	
	for ( var i = 0; i < 6; i++ )
	{
		arrRule4[i] = new THREE.Mesh( createGeometryCube(1, 0.01, 0.01), new THREE.LineBasicMaterial( { color: 0x000000, transparent: true, depthTest : false } ) );
		var v = arrRule4[i].geometry.vertices; 
		v[0].x = v[1].x = v[6].x = v[7].x = 0;
		arrRule4[i].geometry.verticesNeedUpdate = true;			
		arrRule4[i].visible = false;	 
		arrRule4[i].renderOrder = 1;
		scene.add( arrRule4[i] );
	}
	
	return arrRule4;
}










// из массива объектов, находим ближайший левый и правый объект от выбранного объекта
// 1. находим ближайший левый и правый объект
// 2. находим ближайшую точку к выбранному объекту
function getNearlyWinV(arr, obj, wall, z)
{
	var hitL = null;
	var hitR = null;
	
	var xL = -999999;
	var xR = 999999;
	
	var posL = false;
	var posR = false;
	
	// 1
	wall.updateMatrixWorld();
	var pos = wall.worldToLocal( obj.position.clone() );
	
	for ( var i = 0; i < arr.length; i++ )
	{ 
		var v = wall.worldToLocal( arr[i].position.clone() );

		if (v.x < pos.x){ if(xL <= v.x) { hitL = arr[i]; xL = v.x; } } 
		else { if(xR >= v.x) { hitR = arr[i]; xR = v.x; } }	
	}

	// 2	
	if(hitL != null)
	{
		hitL.updateMatrixWorld();
		var pos = hitL.worldToLocal( obj.position.clone() );
		var v = hitL.geometry.vertices;
			
		var dist = pos.x;
		for ( var i = 0; i < v.length; i++ )
		{
			if (dist >= pos.x - v[i].x){ dist = pos.x - v[i].x; posL = v[i].clone(); }
		}
		
		posL.z = z;
		posL = hitL.localToWorld( posL.clone() );
	}
	if(hitR != null)
	{
		hitR.updateMatrixWorld();
		var pos = hitR.worldToLocal( obj.position.clone() );
		var v = hitR.geometry.vertices;

		var dist = pos.x;
		for ( var i = 0; i < v.length; i++ )
		{
			if (dist <= pos.x - v[i].x){ dist = pos.x - v[i].x; posR = v[i].clone(); }
		}
		posR.z = z;
		posR = hitR.localToWorld( posR.clone() );
	}	

	return [posR, posL];
}





// создаем цифры для 3D режима (показываем расстояние/отступ от стен до окна/двери) 
function createLabelRulerWin(text, x, y, size) 
{	
	canv2 = [];
	var labelRuler1 = [];
	
	for ( var i = 0; i < 6; i++ )
	{
		canv2[i] = document.createElement("canvas");
		var ctx = canv2[i].getContext("2d");
		
		canv2[i].width = 256;
		canv2[i].height = 256/2;
		
		ctx.font = size + 'pt Arial';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0, 0, canv2[i].width, canv2[i].height);
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(1, 1, canv2[i].width - 2, canv2[i].height - 2);
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(getValueInCurrentUnits(text, 1000), canv2[i].width / 2, canv2[i].height / 2 );	
		
		var texture = new THREE.Texture(canv2[i]);
		texture.needsUpdate = true;			
		labelRuler1[i] = new THREE.Mesh(createGeometryPlan2(x / 2 * kof_rd, y / 2 * kof_rd), new THREE.MeshBasicMaterial({ map : texture, transparent: true, depthTest : false }) );	
		labelRuler1[i].visible = false;
		labelRuler1[i].renderOrder = 1.0;
		scene.add( labelRuler1[i] );				
	}
	
	return labelRuler1;
}


function upLabelRulerWin(i, text, x, y, size) 
{		
	var ctx = canv2[i].getContext("2d");
		
    ctx.font = size + 'pt Arial';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, canv2[i].width, canv2[i].height);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(1, 1, canv2[i].width - 2, canv2[i].height - 2);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getValueInCurrentUnits(text, 1000), canv2[i].width / 2, canv2[i].height / 2 );	
	
	labelRuler1[i].material.map.needsUpdate = true;
}



