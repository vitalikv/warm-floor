

// коробка
var jambV_1 = [{ x : -0.003, y : 0.0 },{ x : -0.00088, y : -0.00088 },{ x : 0.0, y : -0.003 },{ x : 0.0, y : -0.042},{ x : 0.014, y : -0.042 },{ x : 0.01612, y : -0.04288 },{ x : 0.017, y : -0.045 },{ x : 0.017, y : -0.071 },{ x : 0.01612, y : -0.07312 },{ x : 0.014, y : -0.074 },{ x : -0.027, y : -0.074 },{ x : -0.027, y : 0.0 }];

var wallWidth_1 = 0.2;
var wallWidth_2 = wallWidth_1 - 0.002; 

var jambV_2 = [{ x : 0.0, y : -0.002 }, { x : 0.0, y : -0.04 }, { x : 0.002, y : -0.042 }, { x : 0.0133, y : -0.042 }, { x : 0.0135, y : -0.044 }, { x : 0.0135, y : wallWidth_1 }, { x : 0.0133, y : wallWidth_2 }, { x : -0.0315, y : wallWidth_1 }, { x : -0.0315, y : -0.002 }];
for ( var i = 0; i < jambV_2.length; i++ ){ jambV_2[i].x *= -1; jambV_2[i].y *= -1; }


// наличник default
var pdV = [{ x : 0.07, y : -0.014 }, { x : 0, y : -0.014 }, { x : 0, y : -0.01 }, { x : 0.001, y : -0.008 }, { x : 0.001, y : -0.008 }, { x : 0.015, y : -0.003 }, { x : 0.03, y : 0 }, { x : 0.043, y : 0 }, { x : 0.056, y : -0.003 }, { x : 0.069, y : -0.008 }, { x : 0.07, y : -0.01 }];



function resetParamDoor()
{
	var arr = 
	{ 
		lotid : 0,
		objWD : null,
		size : new THREE.Vector3(),   
		box : 0,					// тип коробки 0 - обычная коробка, 1 - коробка с растягиванием по толщине стены  (если 0 - то нужно создавать доборы)
		step : false,				// есть ли порог
		platband : 
		{ 
			type : 'standart',		// станадртный наличник	
			form : pdV,				// сплейн наличника
			side : 'BothSide', 		// со скольких сторон установленны наличники
			cut : 0, 				// тип подрезки наличника 90 (0), 45(1)
			json : null
		},
		material : null
	};
		
	return arr;
}





// зеркалим Mesh 
function mirrorAxisMesh(obj, cdm)
{
	var v = obj.geometry.vertices;  
	
	if(cdm == 'x') { for ( var i = 0; i < v.length; i++ ) { v[i].x *= -1; } }
	else if(cdm == 'y') { for ( var i = 0; i < v.length; i++ ) { v[i].y *= -1; } }
	else if(cdm == 'z') { for ( var i = 0; i < v.length; i++ ) { v[i].z *= -1; } }
	
	obj.geometry.verticesNeedUpdate = true;
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();
	obj.geometry.computeFaceNormals();

	obj.material.side = THREE.BackSide;
}
 

// геометрия доборки
function createGeometryCube_4(x, y, z)
{
	var geometry = new THREE.Geometry();

	var vertices = [
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,0,0),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(0,y,-z),
				new THREE.Vector3(0,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}






// начинаем создавать параметрическую дверь
function createJambDoor(json, cdm) 
{	 
	var objWD = cdm.emptyBox;
	
	cdm.emptyBox.userData.door.compilation = {}; 
	
	var arr = json.modifiers.split(';');

	
	var pr_door = resetParamDoor();
	pr_door.lotid = json.id;
	pr_door.objWD = cdm.emptyBox;	
	pr_door.size = objWD.userData.door.size; 
	pr_door.material = json.components;
	if(cdm.wall) { pr_door.wall = cdm.wall; }	
	
	var notD = true;
	
	for ( var i = 0; i < arr.length; i++ ) { if((/AddPlatband/i).test( arr[i] )) { pr_door.platband.side = 'BothSide'; notD = false; break; } }
	
	
	for ( var i = 0; i < arr.length; i++ ) 			// 1
	{		
		if((/DoorPattern*/i).test( arr[i] ))
		{
			var doorPattern = JSON.parse( arr[i].split('DoorPattern*')[1] );
			
			var size = doorPattern.size.replace("(", "");
			size = size.replace(")", "");
			pr_door.size.z = Number(size.split(',')[2]);					// ширина полотна
			
			var pivot_rot = doorPattern.pivot_rot.replace("(", "");
			pivot_rot = pivot_rot.replace(")", "");	
			var sc2 = pivot_rot.split(',');			// точка вращения двери (pivot_rot)
			
			
			if(doorPattern.frameProfileType) { pr_door.box = doorPattern.frameProfileType; }			
			if(doorPattern.platbandLocation) { pr_door.platband.side = doorPattern.platbandLocation; notD = false; }
			if(doorPattern.addDoorstep) { pr_door.step = doorPattern.addDoorstep; }
		}
		else if((/ReplaceableElement*/i).test( arr[i] ))
		{
			var repl = JSON.parse( arr[i].split('ReplaceableElement*')[1] );
			if(repl.type == 'Platband') { pr_door.platband.side = 'BothSide'; notD = false; }			
		}
	}
	
	if(notD) { pr_door.platband.side = 'none'; objWD.userData.door.platband = 'none'; }	// нету наличников
	
	 
	
	// 6
	var arrJ = [];
	
	for ( var i = 0; i < arr.length; i++ ) 
	{		
		if((/ReplaceableElement*/i).test( arr[i] )) 
		{ 
			arrJ[arrJ.length] = JSON.parse( arr[i].split('ReplaceableElement*')[1] ); 			
		}
	}
	
	
	if(cdm.options)
	{
		var ops = cdm.options.split(';');  
		
		for ( var i = 0; i < ops.length; i++ )
		{
			if((/s_re/i).test( ops[i] )) 
			{ 
				var str = ops[i].split('s_re')[1]; 
				str = str.split(':'); 
				
				for ( var i2 = 0; i2 < arrJ.length; i2++ ) 
				{
					if(str[0] == arrJ[i2].dumName) { arrJ[i2].default = Number(str[1]); }
				}
				
			}
		}
		
	}
	
	
	arrJ.sort(function (a, b) { return a.order - b.order; });		// сортируем по возрастанию (по параметру order)	


	// 7
	var arrLotid = [];
	for ( var i = 0; i < arrJ.length; i++ ) 
	{ 
		//if(arrJ[i].default == 13769) { arrJ[i].default = 12761; } 
		if(isNumeric(arrJ[i].default)) { arrLotid[arrLotid.length] = arrJ[i].default;  }
	}	
	
	loadPopObj_XML_1({ arrLotid : arrLotid, listId : arrLotid, mess : 'DoorPattern', arrJ : arrJ, pr_door : pr_door });		// загружаем все ПОП объекты+текстуры параметрической двери		
}



// находим все составные объекты из pool_pop, распарсиваем и отправляем на сборку
function parseJsonDoorCompile2( cdm )
{
	var arrLotid = cdm.listId;
	var arrJ = cdm.arrJ;
	var pr_door = cdm.pr_door;
	
	var arrObjs = [];
	
	for ( var i = 0; i < arrLotid.length; i++ )
	{
		for ( var i2 = 0; i2 < pool_pop.length; i2++ )
		{
			if(arrLotid[i] == pool_pop[i2].id) 
			{
				var obj = new THREE.ObjectLoader().parse( pool_pop[i2].fileJson );
				
				var dumName = '';
				for ( var i3 = 0; i3 < arrJ.length; i3++ )
				{
					if(arrJ[i3].default == arrLotid[i]) { dumName = arrJ[i3].dumName; break; } 
				}			
				
				var n = arrObjs.length;
				arrObjs[n] = pool_pop[i2];
				arrObjs[n].obj = obj;
				
				obj.userData.dumName = dumName;
				obj.userData.lotid = arrLotid[i];					
				
				break;
			}
		}
		
	}
	
	compileParamDoor(arrObjs, pr_door);	
}


// получаем инфу по всем составным деталям параметрической двери 
function loadPopDoorPattern(arrJ, pr_door)
{
	var n = 0;
	var list = '';
	for ( var i = 0; i < arrJ.length; i++ ) 
	{ 
		//if(arrJ[i].default == 13769) { arrJ[i].default = 12761; } 
		if(isNumeric(arrJ[i].default)) { list += '&id['+n+']=' + arrJ[i].default; n++; }
	}
	
	var arrObjs = [];	 
	 
	$.ajax
	({  
		url: 'https://catalog.planoplan.com/api/v2/search/?keys[0]='+param_ugol.key+'&disregard_price=1&disregard_structure=1'+list+'&lang=ru',
		type: 'GET', 
		dataType: 'json',
		success: function(json)
		{ 
			json = json.items;  
			if(json.length == 0) { return; }		
		
			for ( var i = 0; i < json.length; i++ )
			{
				var size = json[i].size.split(',');   
				json[i].size = new THREE.Vector3(size[0],size[1],size[2]);			
				
				parseJsonDoorCompile(json[i], arrObjs, pr_door, arrJ);
			}							
		}, 
		error: function(json)
		{
			console.log('error', list);
		}
	});	
}


// ждем пока все объекты дверей вместе собирутся, отправляем на сборку
function parseJsonDoorCompile(json, arrObjs, pr_door, arrJ)
{  
	
	$.ajax
	({  
		url: json.fileJson,
		type: 'GET', 
		dataType: 'json',
		success: function(json2)
		{
			new THREE.ObjectLoader().parse( json2, function ( obj )
			{
				var dumName = '';
				
				for ( var i = 0; i < arrJ.length; i++ )
				{
					if(arrJ[i].default == json.id) { dumName = arrJ[i].dumName; break; } 
				}			
				
				var n = arrObjs.length;
				arrObjs[n] = json;
				arrObjs[n].obj = obj;
				
				obj.userData.dumName = dumName;
				obj.userData.lotid = json.id;					
				
				if(arrObjs.length == arrJ.length) { compileParamDoor(arrObjs, pr_door); }
			});							
		}, 
		error: function(json)
		{
			console.log('error', list);
		}
	});	

}


// создание параметрической двери
// 1. находим модификатор DoorPattern и получаем от туда ширину полотна
// 2. создаем пустой объект, куда будем помещать все элементы параметрической двери (коробка, доборка, полотно, наличники)
// 2.2 подгоняем пустой объект под размер проема (центр объекта только с одного края)
// 3. собираем коробку
// 4. создаем доборы
// 5. создаем наличники
// 6. распарсиваем модификатор и ищем заменяемы элементы и получаем информацию (полотно, ручки, наличники)
// 7. загружаем по очереди все ПОП объекты (полотно, ручки, наличники)
function compileParamDoor(arrObjs, pr_door)
{
	var objWD = pr_door.objWD;
	var width = pr_door.size.x;
	var height = pr_door.size.y;
	var z = pr_door.size.z;	
	
	objWD.userData.door.lotid = pr_door.lotid;
	//objWD.userData.door.size = pr_door.size; 

	 
	// 2. создаем пустой объект
	var obj3D = new THREE.Mesh(createGeometryCube(width, height, 0.5), new THREE.MeshLambertMaterial({ color: 0xffff00, transparent: true, opacity: 0.0 }));
	var v = obj3D.geometry.vertices;	
	v[0].z = v[1].z = v[2].z = v[3].z = 0;	// 2.2
	v[4].z = v[5].z = v[6].z = v[7].z = objWD.userData.door.width; 
	obj3D.geometry.verticesNeedUpdate = true; 
	obj3D.geometry.elementsNeedUpdate = true;
	obj3D.geometry.computeBoundingSphere();
	obj3D.geometry.computeBoundingBox();
	obj3D.geometry.computeFaceNormals();   
	objWD.add(obj3D);
	obj3D.rotation.y += Math.PI;
	obj3D.position.set( 0, 0, objWD.geometry.vertices[0].z - obj3D.geometry.vertices[0].z );	// пустой объект к краю стены	
	
	objWD.userData.door.popObj = obj3D;

	// 3. собираем коробку
	var res = createDoorFrame(pr_door.box, width, height, obj3D);	
	var arrDF = res.arrDF; 
	var dist = res.dist;
	dist.z = z;
	for ( var i = 0; i < arrDF.length; i++ ) { assignTextureDoorParam(arrDF[i], 'door_frame', pr_door.material); }
	
	objWD.userData.door.compilation.doorFrame = res.arrDF;
	
	
	// 4. создаем доборы
	if(pr_door.box == 0)
	{
		var z = objWD.userData.door.width - Math.abs( arrDF[0].geometry.vertices[0].y );

		var complement = [];
		var geometry = createGeometryCube_4(0.015, height - 0.015, z);
		complement[0] = new THREE.Mesh( geometry.clone(), new THREE.MeshLambertMaterial({ color: 0xffffff }) );
		complement[1] = new THREE.Mesh( geometry.clone(), new THREE.MeshLambertMaterial({ color: 0xffffff }) );
		complement[2] = new THREE.Mesh( createGeometryCube_4(0.015, width, z), new THREE.MeshLambertMaterial({ color: 0xffffff }) );

		mirrorAxisMesh( complement[1], 'x' );	


		objWD.updateMatrixWorld();
		var pos1 = arrDF[1].geometry.vertices[0].clone().applyMatrix4( arrDF[1].matrixWorld ); 	// глобальное позиционирование child объекта 
		pos1 = obj3D.worldToLocal( pos1.clone() );	
		
		var pos2 = arrDF[0].geometry.vertices[0].clone().applyMatrix4( arrDF[0].matrixWorld );	// глобальное позиционирование child объекта
		pos2 = obj3D.worldToLocal( pos2.clone() );		
		
		//complement_3.renderOrder = 2;		 		
			
		complement[0].position.copy( pos1 );
		complement[1].position.copy( pos2 );
		complement[2].position.copy( pos1 );	
		complement[2].position.y = height;	
		
		complement[2].rotation.z -= Math.PI / 2;
		
		for ( var i = 0; i < complement.length; i++ ) 
		{ 
			upUvs_2( complement[i] );
			complement[i].userData.tag = 'complement';  
			complement[i].rotation.y += Math.PI; 
			obj3D.add( complement[i] ); 
		}
		
		for ( var i = 0; i < complement.length; i++ ) { assignTextureDoorParam(complement[i], 'door_holeborder', pr_door.material); }
		
		objWD.userData.door.compilation.complement = complement;
	}
	

	 
	for ( var i = 0; i < arrObjs.length; i++ )
	{
		if(arrObjs[i].lotGroup == 'DoorLeaf') 
		{
			var obj = arrObjs[i].obj;
			var size = arrObjs[i].size;			
			obj.scale.set(dist.x / size.x, dist.y / size.y, dist.z / size.z);  
			obj.pr_scale = size;
			obj3D.add( obj );
			obj.position.y = 0.01;   			 
			if(obj.userData.version == "2.0") { obj.position.z = 0.04; }

			assignTextureDoorParam(obj, obj.geometry.name, pr_door.material);

			objWD.userData.door.compilation.doorLeaf = obj;		
		}
		else if(arrObjs[i].lotGroup == 'Platband')
		{
			pr_door.platband.standart = false;
			
			var arr = arrObjs[i].modifiers.split(';');
			
			for ( var i2 = 0; i2 < arr.length; i2++ ) 			
			{		
				if((/PlatbandProfile*/i).test( arr[i2] ))
				{
					var str = arr[i2].split('PlatbandProfile*')[1];
					
					var str = str.split('|');
					
					var spline = [];
					for ( var i3 = 0; i3 < str.length; i3++ )
					{
						var vert2 = str[i3].split(',');
						spline[i3] = new THREE.Vector2( vert2[0], vert2[1] );
					}
					
					pr_door.platband.form = spline;	
					pr_door.platband.type = 'spline'; 
				}
				else if((/PlatbandType*/i).test( arr[i2] ))
				{
					pr_door.platband.cut = arr[i2].split('PlatbandType*')[1];  
				}
				else if((/HoleSize*/i).test( arr[i2] ))
				{
					pr_door.platband.type = 'mesh';
					pr_door.platband.mesh = arrObjs[i].obj;
					
					var str = arr[i2].split('HoleSize*')[1];
					str = str.replace(")", "");
					str = str.replace("(", ""); 
					str = str.split(','); 

					pr_door.platband.size = arrObjs[i].size;
					pr_door.platband.holdSize = { x : parseFloat(str[0]), y : parseFloat(str[1]) };
				}				
			}
		} 
	}
	
	
	// ставим ручки
	var arrD = getDumPopObj(obj3D, []);
	var handle = [];
	
	for ( var i = 0; i < arrObjs.length; i++ )
	{
		for ( var i2 = 0; i2 < arrD.length; i2++ )
		{
			if(new RegExp( arrObjs[i].obj.userData.dumName ,'i').test( arrD[i2].name )) 
			{															
				if(new RegExp( '_mz' ,'i').test( arrD[i2].name ))
				{
					var obj = arrObjs[i].obj.clone();
					arrD[i2].obj.add( obj );  
					obj.rotation.copy( arrD[i2].obj.rotation );						
					obj.scale.z = -1;
					handle[1] = obj;   
				}
				else 
				{
					var obj = arrObjs[i].obj.clone();
					arrD[i2].obj.add( obj );  
					obj.rotation.copy( arrD[i2].obj.rotation );
					handle[0] = obj;  
				} 
				
				if(obj.userData.version != "2.0") { obj.rotation.z -= Math.PI; }
				
				obj.userData.catalog = { caption : arrObjs[i].caption, filters : arrObjs[i].filters, preview : arrObjs[i].preview };
			}
		}
	}
	
	objWD.userData.door.compilation.handle = handle;
	

	// 5. создаем наличники	
	if(pr_door.platband.side != 'none')	
	{
		if(pr_door.platband.type == 'standart' || pr_door.platband.type == 'spline')
		{
			var arr = setStandartPlatband(obj3D, pr_door.platband.form, width, height);			
			for ( var i = 0; i < arr.length; i++ ) { assignTextureDoorParam(arr[i], 'door_molding_simple', pr_door.material); }
			objWD.userData.door.compilation.platband = { type : 'spline', obj : arr };
		}	
		else if(pr_door.platband.type == 'mesh')
		{	
			var mesh = setMeshPlatband(obj3D, pr_door); 
			objWD.userData.door.compilation.platband = { type : 'mesh', obj : mesh };
		}				
	}
	
	objWD.userData.door.goList.setPopObj = true; 
	 
	if(objWD.userData.door.goList.setEmptyBox) 
	{  
		changeWidthParamWD(objWD);
		setPosDoorLeaf_3(objWD); 				// если форма двери уже установлена на стене, то правильно устанвливаем ПОП объект		
		
	}		
}






// 1. создаем коробку
function createDoorFrame(type, width, height, obj3D)
{
	if(type == 0)
	{
		var shape = new THREE.Shape( jambV_1 );	
		var num = 11;
	}
	else if(type == 1)
	{
		jambV_2[5].y = objWD.wall.userData.wall.width * -1;
		jambV_2[6].y = (objWD.wall.userData.wall.width - 0.002) * -1;
		jambV_2[7].y = objWD.wall.userData.wall.width * -1;
		
		var shape = new THREE.Shape( jambV_2 );
		var num = 2;	
	}
	
	var objJL = createJamb_1('left', shape, height, width / 2, 0);
	var objJR = createJamb_1('right', shape, height, width / 2, 0);
	var objJT = createJamb_1('top', shape, width, width / 2, height);
	
	mirrorAxisMesh( objJR, 'x' );
	
	upUvs_1( objJL );
	upUvs_1( objJR );
	upUvs_1( objJT );
	
	obj3D.add( objJL );
	obj3D.add( objJR );
	obj3D.add( objJT );


	if(type == 1)
	{
		var v = objJL.geometry.vertices;
		v[7].y = v[16].y = v[3].y = v[8].y = v[14].y = v[15].y = -objWD.wall.userData.wall.width;
		var v = objJR.geometry.vertices;
		v[7].y = v[16].y = v[3].y = v[8].y = v[14].y = v[15].y = -objWD.wall.userData.wall.width; 
		var v = objJT.geometry.vertices;
		v[7].y = v[16].y = v[3].y = v[8].y = v[14].y = v[15].y = -objWD.wall.userData.wall.width;		
	}
	
	
	objJL.updateMatrixWorld();
	objJR.updateMatrixWorld();
	objJT.updateMatrixWorld();
	
	var pos1 = objJL.localToWorld( objJL.geometry.vertices[num].clone() );
	var pos2 = objJR.localToWorld( objJR.geometry.vertices[num].clone() );   
	var pos3 = objJT.localToWorld( objJT.geometry.vertices[num].clone() ); 
	
	
	var dist = { x : pos2.distanceTo(pos1) - 0.004, y : pos3.y - 0.012, z : 0 };	// получаем размеры для дверного полотна

	return { arrDF : [objJL, objJR, objJT], dist : dist };
}


// 2. устанавливаем коробку 
function createJamb_1(cdm, shape, length, posX, posY)
{
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 } );   // depthTest: false
	var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: length } ), material );
	//obj.renderOrder = 1.8;
	
	var v = obj.geometry.vertices;
	var minX = v[0].x;
	var minY = v[0].x;
	
	for ( var i = 0; i < v.length; i++ ){ if(minX > v[i].x) { minX = v[i].x; } }	
	for ( var i = 0; i < v.length; i++ ){ if(minY < v[i].y) { minY = v[i].y; } }
	
	for ( var i = 0; i < v.length; i++ ){ v[i].x -= minX; }
	for ( var i = 0; i < v.length; i++ ){ v[i].y -= minY; }
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();
	obj.geometry.computeFaceNormals();	
	
	
	switch (cdm) 
	{
		case 'left': obj.position.x = -posX; obj.rotation.x = -Math.PI / 2; break;
		case 'right': obj.position.x = posX; obj.rotation.x = -Math.PI / 2; break;
		case 'top': obj.position.x = -posX; obj.position.y = posY; obj.rotation.set(0, Math.PI / 2, -Math.PI / 2); break;
	}		

	return obj;
}


// устанавливаем(стыкуем) наличники (Spline)
function setStandartPlatband(obj3D, pdV, width, height)
{
	var minX = pdV[0].x;
	var maxX = pdV[0].x;	
	for ( var i = 0; i < pdV.length; i++ ){ if(minX > pdV[i].x) { minX = pdV[i].x; } }
	for ( var i = 0; i < pdV.length; i++ ){ if(maxX < pdV[i].x) { maxX = pdV[i].x; } }
	var h = Number(height) + (maxX - minX);
	
	var shape = new THREE.Shape( pdV );
	
	var platband = [];
	
	for ( var i = 0; i < 6; i++ )
	{ 
		var z = (i == 2 || i == 5) ? width : h;
		
		platband[i] = createPlatband(shape, z); 
		platband[i].userData.tag = 'platband spline';
		obj3D.add( platband[i] );  
		
		if(i < 3) { platband[i].rotation.z = Math.PI; }
		
		//upUvs_2( platband[i] ); 
		upUvs_1( platband[i] );
	}
	
	mirrorAxisMesh( platband[1], 'x' );
	mirrorAxisMesh( platband[4], 'x' );
	
	
	// находим самую крайнюю точку (нужно для плинтусов, чтобы доходили только до наличников)
	var v = platband[0].geometry.vertices;
	var maxV = v[0].x;
	var intV = 0;
	for (i = 0; i < v.length/2; i++) { if(maxV > v[i].x) { maxV = v[i].x; intV = i; } }	
	 
	
	platband[0].position.copy(obj3D.geometry.vertices[4]);	platband[0].userData.platband = { typePos : { side : 'left', pos : 'right', intV : intV } };
	platband[1].position.copy(obj3D.geometry.vertices[7]);	platband[1].userData.platband = { typePos : { side : 'left', pos : 'left', intV : intV } };
	platband[2].position.copy(obj3D.geometry.vertices[5]);	platband[2].userData.platband = { typePos : { side : 'left', pos : 'top', intV : intV } };
	platband[2].rotation.y = -Math.PI / 2;

	platband[3].position.copy(obj3D.geometry.vertices[0]);	platband[3].userData.platband = { typePos : { side : 'right', pos : 'right', intV : intV } };	
	platband[4].position.copy(obj3D.geometry.vertices[3]);	platband[4].userData.platband = { typePos : { side : 'right', pos : 'left', intV : intV } };	
	platband[5].position.copy(obj3D.geometry.vertices[1]);	platband[5].userData.platband = { typePos : { side : 'right', pos : 'top', intV : intV } }; 
	platband[5].rotation.y = Math.PI / 2;	
	

	if(1==2)
	{
		obj3D.updateMatrixWorld();
		
			console.log(platband[3].localToWorld( platband[3].geometry.vertices[0].clone() ), platband[3].position );
		var cube = new THREE.Mesh( createGeometryCube(0.05, 0.05, 0.05), new THREE.MeshLambertMaterial( { color : 0xff0000, transparent: true, opacity: 1, depthTest: false } ) );
		scene.add( cube ); 	
		cube.position.copy( platband[3].geometry.vertices[intV].clone().applyMatrix4( platband[3].matrixWorld ) );

		var cube = new THREE.Mesh( createGeometryCube(0.05, 0.05, 0.05), new THREE.MeshLambertMaterial( { color : 0x0000ff, transparent: true, opacity: 1, depthTest: false } ) );
		scene.add( cube ); 	
		cube.position.copy( platband[4].geometry.vertices[intV].clone().applyMatrix4( platband[4].matrixWorld ) );

		var cube = new THREE.Mesh( createGeometryCube(0.05, 0.05, 0.05), new THREE.MeshLambertMaterial( { color : 0x37ff00, transparent: true, opacity: 1, depthTest: false } ) );
		scene.add( cube ); 	
		cube.position.copy( obj3D.localToWorld( platband[5].position.clone() ) );			
		
	}
		
	return platband;	
}



// создаем наличники
function createPlatband(shape, length)
{
	//color: 0xff4747
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 } );   // depthTest: false
	var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: length } ), material );
	//obj.renderOrder = 1.8;
	
	var v = obj.geometry.vertices;
	var minX = v[0].x;
	var minY = v[0].y;
	
	for ( var i = 0; i < v.length; i++ ){ if(minX < v[i].x) { minX = v[i].x; } }
	for ( var i = 0; i < v.length; i++ ){ if(minY > v[i].y) { minY = v[i].y; } }	
	
	for ( var i = 0; i < v.length; i++ ){ v[i].x -= minX; v[i].y -= minY; }
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeFaceNormals();	
	
	obj.rotation.x = -Math.PI / 2;		

	return obj;
}




// устанавливаем(стыкуем) наличники (Mesh)
function setMeshPlatband(obj3D, pr_door)
{	
	var pdV = pr_door.platband.mesh; 
	var size_1 = pr_door.platband.size; 
	var holdSize = pr_door.platband.holdSize; 
	var size_2 = pr_door.size; 
	var material = pr_door.material;
	
	var ratio = { x : holdSize.x / size_1.x, y : holdSize.y / size_1.y };   
	
	pdV.scale.x = (size_2.x - 0.03) / holdSize.x;
	pdV.scale.y = (size_2.y - 0.03) / holdSize.y; 
		
	
	assignTextureDoorParam(pdV, 'door_molding_simple', material);
	
	var obj_2 = pdV.clone();
	
	pdV.userData.tag = 'platband mesh';	
	pdV.userData.platband = { side : 'right' };		
	pdV.rotation.copy( obj3D.rotation );
	pdV.rotation.y += Math.PI;
	obj3D.add( pdV );

	obj_2.scale.z = -1; 
	obj3D.add( obj_2 ); 
	obj_2.position.set(0, 0, obj3D.geometry.vertices[7].z); 
	obj_2.userData.tag = 'platband mesh'; 
	obj_2.userData.platband = { side : 'left' };

	return [pdV, obj_2];
}




// назначаем текстуру всем объектам входящие в родительский (объект из сцены)
function assignTextureDoorParam(obj, value, components)
{	
	var length = 0;
	var index = 0;
	
	for ( var i = 0; i < components.length; i++ )
	{			
		if(new RegExp( components[i].alias ,'i').test( value ))
		{					
			if(length < components[i].alias.length) { length = components[i].alias.length; index = i; }
		}				
	}
	
	if(length > 0) 
	{  		
		//var mapping = JSON.parse( components[index].mapping );
		var scale = (components[index].mapping) ? components[index].mapping.scale : new THREE.Vector3(1, 1, 1);
		
		loadPopObj_1({ obj: obj, lotid: components[index].lots[0], start : 'new', containerID : components[index].alias, scale : scale });   
	}	

}




// находим ДУМЫ у ПОП объекта (рекурсия дерево)
function getDumPopObj(obj, arr)
{
	if(obj.type == "Group") arr[arr.length] = { obj : obj, name : obj.name };
	
	var arr2 = [];
	
	for ( var i = 0; i < obj.children.length; i++ )
	{
		var arr3 = getDumPopObj(obj.children[i], arr);
		
		if(obj.children.length - 1 == i) { return arr3.concat( arr2 ); }
		else { arr3.concat( arr2 ); }
	}
	
	return arr;
}




// меняем ширину двери (после изменения толщены стены)
function changeWidthParamWD(objWD)
{
	var obj3D = objWD.userData.door.popObj;
	objWD.updateMatrixWorld();
	var v = obj3D.geometry.vertices;	
	v[0].z = v[1].z = v[2].z = v[3].z = 0;	// 2.2
	v[4].z = v[5].z = v[6].z = v[7].z = objWD.userData.door.wall.userData.wall.width;
	obj3D.geometry.verticesNeedUpdate = true; 
	obj3D.geometry.elementsNeedUpdate = true;
	obj3D.geometry.computeBoundingSphere();
	obj3D.geometry.computeBoundingBox();
	obj3D.geometry.computeFaceNormals();
	
	var open_type = Number(objWD.userData.door.open_type);
	
	setPosDoorLeaf_1(objWD, open_type);			// устанавливаем полотно		
	setPosDoorLeaf_3(objWD); 					// устанавливаем (поварачиваем) ПОП дверь		
				
	
	var arrDF = objWD.userData.door.compilation.doorFrame;
	
	for ( var i = 0; i < arrDF.length; i++ ) { arrDF[i].updateMatrixWorld(); }
	
	if(objWD.userData.door.compilation.complement) 
	{
		var complement = objWD.userData.door.compilation.complement;
		
		var z = objWD.userData.door.wall.userData.wall.width - Math.abs( arrDF[0].geometry.vertices[0].y );

		for ( var i = 0; i < complement.length; i++ ) 
		{
			var v = complement[i].geometry.vertices;
			
			v[4].z = v[5].z = v[6].z = v[7].z = -z;
			
			complement[i].geometry.verticesNeedUpdate = true; 
			complement[i].geometry.elementsNeedUpdate = true;
			complement[i].geometry.computeBoundingBox();
			complement[i].geometry.computeBoundingSphere();
			complement[i].geometry.computeFaceNormals();			
		}


		objWD.updateMatrixWorld();
		var pos1 = arrDF[1].geometry.vertices[0].clone().applyMatrix4( arrDF[1].matrixWorld ); 	// глобальное позиционирование child объекта 
		pos1 = obj3D.worldToLocal( pos1.clone() );	
		
		var pos2 = arrDF[0].geometry.vertices[0].clone().applyMatrix4( arrDF[0].matrixWorld );	// глобальное позиционирование child объекта
		pos2 = obj3D.worldToLocal( pos2.clone() );		
				 		
			
		complement[0].position.copy( pos1 );
		complement[1].position.copy( pos2 );
		complement[2].position.copy( pos1 );	
		complement[2].position.y = objWD.userData.door.size.y;	
		
		for ( var i = 0; i < complement.length; i++ ) { upUvs_1( complement[i] ); }
	}


	if(objWD.userData.door.compilation.platband.type == 'mesh')
	{
		var obj_2 = objWD.userData.door.compilation.platband.obj[1];
		
		obj_2.position.set(0, 0, obj3D.geometry.vertices[7].z);
	}
	
	
}





// заменить ручку у двери
function replaceHabdleDoor_2(cdm, json)
{
	if (camera == camera3D) { door = clickO.last_obj; }
	else { door = clickO.last_obj; }
	
	if(!door) { return; }
	
	var handle = door.userData.door.compilation.handle; 
	
	var dum = [];
	
	for ( var i = 0; i < handle.length; i++ )
	{
		dum[i] = { socket : handle[i].parent, dumName : handle[i].userData.dumName };
		
		dum[i].socket.remove(handle[i]);
	}
	

	// ставим ручки
	var handle = new THREE.ObjectLoader().parse( json.fileJson );
	var arr = [];	
	
	for ( var i2 = 0; i2 < dum.length; i2++ )
	{
		if(new RegExp( '_mz' ,'i').test( dum[i2].socket.name )) 
		{
			var obj = handle.clone();
			dum[i2].socket.add( obj );  
			obj.rotation.copy( dum[i2].socket.rotation );						
			obj.scale.z = -1;
			arr[1] = obj;
		}
		else 
		{
			var obj = handle.clone();
			dum[i2].socket.add( obj );  
			obj.rotation.copy( dum[i2].socket.rotation );
			arr[0] = obj;
		} 
		 
		if(obj.userData.version != "2.0") { obj.rotation.z -= Math.PI; }
		
		obj.userData.dumName = dum[i2].dumName;
		obj.userData.lotid = json.id;
		obj.userData.catalog = { caption : json.caption, filters : json.filters, preview : json.preview };
	}
	
	door.userData.door.compilation.handle = arr;	
}






