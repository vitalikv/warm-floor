




function setCatalogSource(catalogSource, lotGroup) 
{
	if (!clickO.last_obj) { return; }
	var obj = clickO.last_obj;
	if (!obj.pr_catalog)  obj.pr_catalog = {};
	var source = {
		activeLot: catalogSource.activeLot,
		category: catalogSource.category,
		page: catalogSource.page,
		filters: catalogSource.filters,
		categoryFilters: catalogSource.categoryFilters,
		allFilters: catalogSource.allFilters,
		selectedFilters: catalogSource.selectedFilters,
		caption: catalogSource.caption,
		priceOrder: catalogSource.priceOrder
	}
	
	if (lotGroup == 'Plinths') 
	{
		(!obj.pr_catalog) ? obj.pr_catalog = { plinthSource: source } : obj.pr_catalog.plinthSource = source;
	}
	else if (lotGroup == 'FurnitureDoorHandle')
	{
		(!obj.pr_catalog) ? obj.pr_catalog = { handleSource: source } : obj.pr_catalog.handleSource = source;
	}
	else
	{
		obj.pr_catalog = source; 
		obj.userData.catalog = source;
	}
}



// меняем текстуру  
function setMultyMaterialSide3(cdm)
{	
	var obj = cdm.obj;
	var scale = cdm.scale;
	var index = cdm.index;
	
	var texture = cdm.image.clone();
	texture.needsUpdate = true;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = renderer.getMaxAnisotropy();  
	
	var tag = null;
	
	if(obj.userData.tag)
	{
		tag = obj.userData.tag;
	}
	 
	if(index == 2) { texture.repeat.x = -scale.x; } 
	else { texture.repeat.x = scale.x; }  
	texture.repeat.y = scale.y; 
	
	if(tag == 'room') { texture.repeat.y *= -1; }
	
 
	var material = (cdm.index) ? obj.material[cdm.index] : obj.material;

	material.map = texture;   
	material.needsUpdate = true; 

	if(obj.userData.tag) 
	{ 
		if(obj.userData.tag == 'plinths') 
		{ 
			obj.room.userData.room.plinth.mat = material;
		}
		else if(obj.userData.tag == 'platband3' || obj.userData.tag == 'complement3') 
		{
			texture.rotation += Math.PI/2; 
		}		
		
		menuSettingTexture( { obj : obj, index : cdm.index } );		// обнуляем в меню поворот/смещение		 
	}
	
	// поворот 
	if(cdm.rot)
	{
		texture.rotation = cdm.rot;
	}
	
	// смещение
	if(cdm.offset)
	{
		texture.offset.x = cdm.offset.x; 
		texture.offset.y = cdm.offset.y;		
	}
	
	renderCamera();
}



// вращение текстуры 
function materialRotation(cdm)
{
	if(!isNumeric(cdm.rot)) return;
	
	var obj = cdm.obj;
	
	if(!obj) return; 
	
	var map = (obj.userData.tag == 'wall') ? obj.material[cdm.index].map : obj.material.map; 
	
	if(!map) return;
		
	map.rotation = (cdm.loop) ? cdm.rot + map.rotation : cdm.rot; 

	menuSettingTexture( { obj : obj, index : cdm.index } );	 	
	
	renderCamera();
}


// смещение текстуры
function offsetTexture()
{
	if(!moveTexture.axis) return;
	
	var obj = clickO.last_obj;
	
	if(!obj) return;  
	
	var map = (obj.userData.tag == 'wall') ? obj.material[clickO.index].map : obj.material.map;
	
	if(!map) return;	
	
	var rad = new THREE.Vector2(Math.cos(-map.rotation), Math.sin(-map.rotation));
	
	if(obj.userData.tag == 'wall')
	{
		if(clickO.index == 1) rad = new THREE.Vector2(Math.cos(map.rotation), Math.sin(map.rotation));
	}	


	if(moveTexture.axis == 'x')  
	{ 
		rad = new THREE.Vector2(rad.x,-rad.y);		
	}
	else if(moveTexture.axis == 'y')
	{ 
		rad = new THREE.Vector2(rad.y,rad.x);  
	}	
	
	map.offset.x += rad.x * moveTexture.value; 
	map.offset.y += rad.y * moveTexture.value;

	menuSettingTexture( { obj : obj, index : clickO.index } );	
	
	renderCamera();
}



// смещение текстуры (при нажатии enter)
function offsetTextureInput()  
{
	var obj = clickO.last_obj;
	
	if(!obj) return;  
	
	var map = (obj.userData.tag == 'wall') ? obj.material[clickO.index].map : obj.material.map;
	
	if(!map) return;
	
	var str = (obj.userData.tag == 'wall') ? 'wall' : 'floor';
	
	var x = UI(str+'_texture_offset_x').val();
	var y = UI(str+'_texture_offset_y').val();
	
	if(!isNumeric(x)) return;
	if(!isNumeric(y)) return;				
	
	map.offset.x = Number(x); 
	map.offset.y = Number(y);
	
	renderCamera();
}




function upUvs_1( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
    for (var i = 0; i < faces.length; i++) 
	{				
        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0][i] =
		[
            new THREE.Vector2(v1['x'] * n, v1['y'] * n),
            new THREE.Vector2(v2['x'] * n, v2['y'] * n),
            new THREE.Vector2(v3['x'] * n, v3['y'] * n)
        ];
    }

    geometry.uvsNeedUpdate = true;	
}


function upUvs_2( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
    for (var i = 0; i < faces.length; i++) 
	{				
        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0][i] =
		[
            new THREE.Vector2(v1.z * n, v1.y * n),
            new THREE.Vector2(v2.z * n, v2.y * n),
            new THREE.Vector2(v3.z * n, v3.y * n)
        ];
    }

    geometry.uvsNeedUpdate = true;	
}




// удаляем текстуру на стене (восстанавливаем стандарт)
function deleteTextureWall( wall, index )
{ 
	if(!wall) return;
	//new THREE.Color('rgb(93%,87%,83%)')			

	for ( var i = 0; i < arrWallFront.length; i++ )
	{
		var obj = arrWallFront[i].obj;
		var side = arrWallFront[i].index;
		obj.material[side] = new THREE.MeshLambertMaterial( { color: 0xedded4, clippingPlanes: [ clippingMaskWall ], lightMap : lightMap_1 } );	 	
		obj.userData.material[side] = { lotid : 4954, caption : '', color : obj.material[side].color, scale : new THREE.Vector2(1,1), filters : 1039, preview : '', catalog : '' };		
	}
	
	UI( 'wall-preview' ).val( '' ); 
	UI.setObjectCaption( '', 'wall-preview' );	
	
	menuSettingTexture( { obj : wall, index : index } ); 
}



// удаляем текстуру на полу/потолке (восстанавливаем стандарт)
function deleteTextureFloorCeiling(obj)
{ 
	if(!obj) return;
	
	if(obj.userData.tag == 'room') 
	{
		var colorDefault = 0xe3e3e5;
		var lotid = 4956;
	}
	else
	{
		var colorDefault = 0xffffff;
		var lotid = 4957;		
	}
	
	obj.material = new THREE.MeshLambertMaterial( { color : colorDefault, lightMap : lightMap_1 } );
		
	obj.pr_preview = '';
	obj.pr_catalog = '';
	
	obj.userData.material = { lotid : lotid, containerID : null, caption : '', color : { r : 1, g : 1, b : 1 }, scale : new THREE.Vector2(1,1), filters : 1039, preview : '', catalog : null };
	
	UI( 'floor-preview' ).val( '' ); 
	UI.setObjectCaption( '', 'floor-preview' );	

	menuSettingTexture( { obj : obj } );
}


//------------



// применить текстуру ко всем стенам одного помещения
function assignTextureOnAllWall()
{
	if(!clickO.last_obj) { return; }
	
	var wall = clickO.last_obj;
	var index = clickO.index;	
	

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

	if(num == -1) { return; /* стена не принадлежит ни одному помещению */ };
	
	 
	
	for ( var i = 0; i < room[num].w.length; i++ ) 
	{  
		loadPopObj_1([{ obj: room[num].w[i], lotid: wall.userData.material[index].lotid, start : 'new', index : (room[num].s[i] == 1) ? 1 : 2, rgb : wall.userData.material[index].color, scale : wall.userData.material[index].scale, catalog : wall.userData.material[index].catalog }]); 
	}	
	
}







