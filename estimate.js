


// пускаем луч и определяем к какой комнате принадлежит объект
function rayFurniture( obj ) 
{
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	
	//var pos = obj.position.clone();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	pos.y = 1;
	
	var ray = new THREE.Raycaster();
	ray.set( pos, new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObjects( room, true );	
	
	var floor = (intersects.length == 0) ? null : intersects[0].object				
	
	return { id : (floor) ? floor.userData.id : 0, obj : floor };
}



// создание сметы
function createEstimateJson()
{
	
	var floorArea = 0;
	var rooms = [];
	var windows = [];
	var doors = [];
	var furnitures = [];
	
	
	for ( var i = 0; i < arr_obj.length; i++ )
	{
		furnitures[i] = { id_room : rayFurniture( arr_obj[i] ).id, obj : arr_obj[i] };
	}	
	
	
	// суммарная площадь комнат
	for ( var i = 0; i < room.length; i++ ) { floorArea += Number(room[i].userData.room.areaTxt); }
	
	for ( var i = 0; i < room.length; i++ )
	{
		var floorMaterial = 
		{
            id : 0, 
            group : "MaterialFloor", 
            lotId : Number(room[i].userData.material.lotid), 
            caption : room[i].userData.material.caption			
		};
		
		var ceilMaterial = 
		{
            id : 0, 
            group : "MaterialCeil", 
            lotId : Number(ceiling[i].userData.material.lotid), 
            caption : ceiling[i].userData.material.caption			
		};  
		
		var plinth = null;
		var plinthCeil = null;
		
		if(room[i].userData.room.plinth.o)
		{		
			getLengthPlinths( room[i], null ); 
			 
			plinth = 
			{
				group : "Plinths",
				outCornersCount : room[i].userData.room.plinth.param.outCornersCount,		// наружный уголок
				length : room[i].userData.room.plinth.param.length,
				stopCount : room[i].userData.room.plinth.param.stopCount,					// заглушка
				lotId : room[i].userData.room.plinth.lotid,
				caption : room[i].userData.room.plinth.caption,
				inCournersCount : room[i].userData.room.plinth.param.inCournersCount		// внутренний уголок				
			}
		}
		
		if(ceiling[i].userData.ceil.plinth.o)
		{
			plinthCeil = 
			{
				group : "PlinthsCeil", 
				outCornersCount : 0,
				length : 0,
				stopCount : 0,
				lotId : ceiling[i].userData.ceil.plinth.lotid,
				caption : ceiling[i].userData.ceil.plinth.caption,
				inCournersCount : 0				
			}
		}		
		
		
			
		var walls = [];
		
		for ( var i2 = 0; i2 < room[i].w.length; i2++ )
		{
			walls[i2] = 
			{
				id : Number(room[i].w[i2].userData.id),
				area : calculationSpaceWall( room[i].w[i2], (room[i].s[i2] == 0) ? 2 : 1 ).area,
				material :
				{
					id : 0,
					group : 'MaterialWall',
					lotId : Number(room[i].w[i2].userData.material[(room[i].s[i2] == 0) ? 2 : 1].lotid),   
					caption	: room[i].w[i2].userData.material[(room[i].s[i2] == 0) ? 2 : 1].caption,
				},
				height : Math.round(room[i].w[i2].userData.wall.height_1 * 100) / 100
			}
		}
		
		var arrO = [];
		for ( var i2 = 0; i2 < furnitures.length; i2++ )
		{
			if(room[i].userData.id == furnitures[i2].id_room)
			{
				arrO[arrO.length] =
				{
					  id : Number(furnitures[i2].obj.userData.id),
					  group : furnitures[i2].obj.userData.obj3D.lotGroup,
					  lotId : Number(furnitures[i2].obj.userData.obj3D.lotid),
					  caption : furnitures[i2].obj.userData.obj3D.caption,			
				}								
			}
		}
		
		var inf = sumWallsAreaRoom(room[i].w, room[i].s);
		
		rooms[i] = 
		{
			id : Number(room[i].userData.id),
			wallsArea : inf.area, 
			roomArea : Number(room[i].userData.room.areaTxt),
			name : room[i].userData.room.roomType,
			perimeter : Math.round(inf.perimeter * 100) / 100,
			floorMaterial : floorMaterial,
			ceilMaterial : ceilMaterial,
			plinth : plinth,
			plinthCeil : plinthCeil,
			walls : walls,
			furnitures : arrO,
		}
	}
	
	for ( var i = 0; i < arr_window.length; i++ )
	{
		var v = arr_window[i].geometry.vertices;
		var width = v[3].x - v[0].x;
		var height = v[1].y - v[0].y;
		
		windows[i] = 
		{
			id : Number(arr_window[i].userData.id),
			indexOnPlan : 0,
			group : 'Windows',
			lotId : (arr_window[i].userData.door.popObj) ? Number(arr_window[i].userData.door.lotid) : 0,
			width : width,
			height : height,
			roomId : Number(getIdRoomWD(arr_window[i])),
			caption : arr_window[i].caption 
		}
	}
	
	for ( var i = 0; i < arr_door.length; i++ )
	{
		var v = arr_door[i].geometry.vertices;
		var width = v[3].x - v[0].x;
		var height = v[1].y - v[0].y;
		
		doors[i] = 
		{
			id : Number(arr_door[i].userData.id),
			indexOnPlan : 0,
			group : 'Doors',
			lotId : (arr_door[i].userData.door.popObj) ? Number(arr_door[i].userData.door.lotid) : 0,
			width : width,
			height : height,
			roomId : Number(getIdRoomWD(arr_door[i])),
			caption : arr_door[i].caption
		}
	}


	var arrO = [];
	for ( var i = 0; i < furnitures.length; i++ )
	{
		if(furnitures[i].id_room == null)
		{
			arrO[arrO.length] =
			{
				  id : Number(furnitures[i].obj.userData.id),
				  group : furnitures[i].obj.userData.obj3D.lotGroup,
				  lotId : Number(furnitures[i].obj.userData.obj3D.lotid),
				  caption : furnitures[i].obj.userData.obj3D.caption,					  
			}								
		}
	}	

	
	var json = 
	{
		floors :
		
			[
				{
					id : levelFloor,			// id этажа					
					name : "Этаж 1", 			// имя этажа
					floorIndex : 1, 			// индекс этажа, начиная с 1
					floorArea : floorArea,		// суммарная площадь комнат 					
					rooms :	rooms, 				// массив комнат				
					windows : windows,			// массив окон					
					doors : doors,				// массив дверей
					furnitures : arrO			// массив мебелине попавших ни в одну из комнат
				}
			],
		version: '1.0'
		
	}
	
	console.log(json);
	
	return { estimate : JSON.stringify(json), noTask : 1 };
}


// площадь всех стен одной комнаты и длина периметра
function sumWallsAreaRoom(walls, arrIndex)
{
	var area = 0;
	var perimeter = 0;
	
	for ( var i = 0; i < walls.length; i++ )
	{		
		var side = (arrIndex[i] == 0) ? 2 : 1;
		
		var inf = calculationSpaceWall( walls[i], side );
		
		area += inf.area;
		perimeter += inf.length; 
	}
	
	return { area : area, perimeter : perimeter };
}


// определяем к какой комнате относится дверь/окно
function getIdRoomWD(obj)
{
	//if(!obj.wall) return 0;
	
	var wall_id = obj.userData.door.wall.userData.id; 
	
	for ( var i = 0; i < room.length; i++ )
	{
		for ( var i2 = 0; i2 < room[i].w.length; i2++ )
		{
			if(room[i].w[i2].userData.id == wall_id)
			{
				return room[i].userData.id;
			}
		}
	}
	
	return 0;
}

