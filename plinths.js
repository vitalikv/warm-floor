




// создаем плинтуса
// 1. создаем и устанавливаем плинтуса (положение и поворот) + если есть двери, то делаем разрыв
// 2. находим одинаковые (равные) точки с одной стороны и с другой (находим торцы плинтуса)
// 3. соединяем углы
function getLengthPlinths( room, json ) 
{	
	var plinth = room.userData.room.plinth;
	plinth.o = true;

	if(json)
	{
		var arrShape = [];
		var m = json.modifiers.split('PlinthData*')[1].split('|');																			
		for ( var i2 = 0; i2 < m.length; i2++ ) { var v = m[i2].split(','); arrShape[i2] = new THREE.Vector3(parseFloat(v[0]),parseFloat(v[1]),0); }
		
		plinth.v = arrShape;
		plinth.lotid = json.id;
		plinth.preview = json.preview;
		plinth.caption = json.caption;
		plinth.matId = json.components[0].lots[0];	
		plinth.obj = [];  
	}
	else
	{		
		var arrShape = plinth.v;
		
		for ( var i2 = 0; i2 < plinth.obj.length; i2++ ) { scene.remove(plinth.obj[i2]); } 
		
		plinth.obj = [];
	} 	

	plinth.param = { length : 0, stopCount : 0, outCornersCount : 0, inCournersCount : 0 };
	
	
	
	var shape = new THREE.Shape( arrShape );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, lightMap : lightMap_1, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, /*transparent: true, opacity: 1, depthTest: false*/ } );	

	
		
	// 1
	for (i = 0; i < room.w.length; i++) 
	{
		
		if(room.w[i].userData.wall.height_1 < 0.1) continue;
		
		room.w[i].updateMatrixWorld();					
		
		var v = room.w[i].userData.wall.v;
		
		var arrPos = [];
		arrPos[0] = { pos1 : new THREE.Vector3(), pos2 : new THREE.Vector3() };	

		// устанавливаем начальное положение стены, взависимости, как построена стена (по часовой или против)
		if(room.s[i] == 0) 
		{ 
			arrPos[0].pos1 = room.w[i].localToWorld( v[4].clone() );
			arrPos[0].pos1.y = 0;
			var pi = Math.PI;
			var z = v[4].z;
		}
		else 
		{ 
			arrPos[0].pos1 = room.w[i].localToWorld( v[6].clone() );
			arrPos[0].pos1.y = 0;
			var pi = -Math.PI;
			var z = v[6].z;	
		}	

		// находим высоту плинтуса
		var y_min = arrShape[0].y;
		var y_max = arrShape[0].y;	
		for (i2 = 0; i2 < arrShape.length; i2++)
		{
			if(y_min > arrShape[i2].y) { y_min = arrShape[i2].y; }
			if(y_max < arrShape[i2].y) { y_max = arrShape[i2].y; }		
		}	
		var heightPl = y_max - y_min;	// высота плинтуса	
		
		
		
		// если есть двери/окна (у стены), то находим глобальное положение габаритов ширины двери
		// так же находим положение двери/окна относительно стены (нужно чтобы определить порядок, как расположенны двери)
		if(room.w[i].userData.wall.arrO.length > 0) 
		{
			var arrPl = [];
			
			for (i2 = 0; i2 < room.w[i].userData.wall.arrO.length; i2++)
			{
				room.w[i].userData.wall.arrO[i2].updateMatrixWorld();
				room.w[i].userData.wall.arrO[i2].geometry.computeBoundingBox();
				
				var y_min = room.w[i].userData.wall.arrO[i2].geometry.boundingBox.min.y;				
				var y_min = room.w[i].userData.wall.arrO[i2].localToWorld( new THREE.Vector3(0, y_min, 0) ).y; 	// находим нижнию точку у окна/двери			
				if(y_min >= heightPl) continue; 	// если дверь/окно выше плинтуса, то пропускаем расчеты (не делаем разделение плинтуса)				
				
				
				
				var typePlatband = 'none';	// нужен плинтус или нет
				
				
				if(room.w[i].userData.wall.arrO[i2].userData.tag == 'door')
				{
					if(room.w[i].userData.wall.arrO[i2].userData.door.type == 'DoorPattern')	// параметрическая дверь или нет
					{ 
						if(room.w[i].userData.wall.arrO[i2].userData.door.compilation.platband)
						{ 
							var tp = room.w[i].userData.wall.arrO[i2].userData.door.compilation.platband.type;
							typePlatband = (tp) ? tp : '';													
						}
					}
				}
				
				
				
				if(typePlatband == 'spline' || typePlatband == 'mesh') 
				{ 			
			
					if(!room.w[i].userData.wall.arrO[i2].userData.door.popObj.children) continue;			// дверь еще не до конца не загрузилась из xml
					
					var child = room.w[i].userData.wall.arrO[i2].userData.door.popObj.children;	// получаем все составные объекты параметрической двери
					
					for (i3 = 0; i3 < child.length; i3++)
					{ 
						if(child[i3].userData.tag) 
						{  
							if(child[i3].userData.tag == 'platband spline')	// находим крайные точки для наличника из сплайна
							{								
								var side = (room.s[i] == 0) ? 'left' : 'right';		// взависимости от положении стены, получаем наличник с нужной стороны
								
								if(child[i3].userData.platband.typePos.side == side)
								{
									var intV = child[i3].userData.platband.typePos.intV;
									
									// конвертируем из local в World position (крайние точки у наличников)
									if(child[i3].userData.platband.typePos.pos == 'left')
									{
										var posL = child[i3].geometry.vertices[intV].clone().applyMatrix4( child[i3].matrixWorld );
									}
									else if(child[i3].userData.platband.typePos.pos == 'right')
									{
										var posR = child[i3].geometry.vertices[intV].clone().applyMatrix4( child[i3].matrixWorld );
									}									
								}
							}
							
							if(child[i3].userData.tag == 'platband mesh')		// находим крайные точки для наличника из меша ( в виде целого объекта)
							{ 
								// определяем как отрывается дверь (какой стороной она повернута) 
								var open_type = room.w[i].userData.wall.arrO[i2].userData.door.open_type;
								
								if(open_type == 0 || open_type == 2) { var side = (room.s[i] == 0) ? 'right' : 'left'; }
								else { var side = (room.s[i] == 0) ? 'left' : 'right'; }

								
								if(child[i3].userData.platband.side == side) 
								{									
									child[i3].geometry.computeBoundingBox();  
									
									if(room.s[i] == 0)
									{
										if(open_type == 2 || open_type == 1)		 
										{
											var posL = new THREE.Vector3(child[i3].geometry.boundingBox.min.x, 0, 0);
											var posR = new THREE.Vector3(child[i3].geometry.boundingBox.max.x, 0, 0);										
										}
										else 
										{
											var posR = new THREE.Vector3(child[i3].geometry.boundingBox.min.x, 0, 0);
											var posL = new THREE.Vector3(child[i3].geometry.boundingBox.max.x, 0, 0);										
										}										
									}
									else
									{
										if(open_type == 0 || open_type == 3)		 
										{
											var posL = new THREE.Vector3(child[i3].geometry.boundingBox.min.x, 0, 0);
											var posR = new THREE.Vector3(child[i3].geometry.boundingBox.max.x, 0, 0);										
										}
										else 
										{
											var posR = new THREE.Vector3(child[i3].geometry.boundingBox.min.x, 0, 0);
											var posL = new THREE.Vector3(child[i3].geometry.boundingBox.max.x, 0, 0);										
										}										
									}
									
									posL.applyMatrix4( child[i3].matrixWorld );
									posR.applyMatrix4( child[i3].matrixWorld );							
									
									break;
								}								
							}
						}
					}
		
					// взависимости от положении стены, выставляем max и min position в нужной последовательности
					if (room.s[i] == 0) { var pos1 = posR; var pos2 = posL; }
					else { var pos1 = posL; var pos2 = posR; }					
					
				}
				else
				{ 
					var x_min = room.w[i].userData.wall.arrO[i2].geometry.boundingBox.min.x;
					var x_max = room.w[i].userData.wall.arrO[i2].geometry.boundingBox.max.x;
					var y_min = room.w[i].userData.wall.arrO[i2].geometry.boundingBox.min.y;
					
					
					// если форма wd создавалась из spline, то находим все точки wd ниже плинтуса
					// а затем у найденых точек, находим крайние по X
					if(room.w[i].userData.wall.arrO[i2].userData.door.form.type == 'spline')
					{
						var arrV = [];
						var v2 = room.w[i].userData.wall.arrO[i2].geometry.vertices;
						var h = room.w[i].userData.wall.arrO[i2].worldToLocal( new THREE.Vector3(0, heightPl, 0) ).y;
						
						for (i3 = 0; i3 < v2.length; i3++)
						{
							if(v2[i3].y < h) { arrV[arrV.length] = v2[i3]; }
						}
						
						var x_min = arrV[0].x;
						var x_max = arrV[0].x;	
						for (i3 = 0; i3 < arrV.length; i3++)
						{
							if(x_min > arrV[i3].x) { x_min = arrV[i3].x; }
							if(x_max < arrV[i3].x) { x_max = arrV[i3].x; }		
						}											
					}
					
					var pos1 = room.w[i].userData.wall.arrO[i2].localToWorld( new THREE.Vector3(x_min, y_min, z) );	
					var pos2 = room.w[i].userData.wall.arrO[i2].localToWorld( new THREE.Vector3(x_max, y_min, z) );					
				}
				 
				var posCent = room.w[i].worldToLocal( room.w[i].userData.wall.arrO[i2].position.clone() );
	
				arrPl[arrPl.length] = { glob_min : pos1, glob_max : pos2, posCent : posCent };	// глобальное положение крайних точек двери/окна
				
				plinth.param.stopCount += 2;	// подсчет заглушек для плинтуса (для сметы)
			}	
			
			if(room.s[i] == 0)
			{
				arrPl.sort(function (a, b) { return a.posCent.x - b.posCent.x; });	// определяем порядок расположения дверей в стене (от нуля до ...)
			}
			else
			{
				arrPl.sort(function (a, b) { return b.posCent.x - a.posCent.x; });	// определяем порядок расположения дверей в стене (от большего к нулю)
			}
			

			// добавляем габариты дверей (чтобы при подсчете был разрыв, на месте двери)
			for (i2 = 0; i2 < arrPl.length; i2++)
			{
				arrPos[arrPos.length - 1].pos2 = (room.s[i] == 0) ? arrPl[i2].glob_min : arrPl[i2].glob_max;
				arrPos[arrPos.length] = { pos1 : (room.s[i] == 0) ? arrPl[i2].glob_max : arrPl[i2].glob_min, pos2 : new THREE.Vector3() };					
			}
		}	

		
		// устанавливаем конечное положение стены, взависимости, как построена стена (по часовой или против) 
		if(room.s[i] == 0) { var pos = room.w[i].localToWorld( v[10].clone() ); }
		else { var pos = room.w[i].localToWorld( v[0].clone() ); }				
		pos.y = 0;	
		arrPos[arrPos.length - 1].pos2 = pos;	
		
		// создаем и устанвливаем плинтуса
		for (i2 = 0; i2 < arrPos.length; i2++)
		{
			var length = arrPos[i2].pos2.distanceTo(arrPos[i2].pos1);			
			var pos = arrPos[i2].pos1;
			
			if(length <= 0) { continue; }
			if(length <= 0) { length = 0.001; }
			
			var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: length } ), material );	
			obj.userData.tag = 'plinths';
			obj.room = room;
			obj.visible = false;
			obj.position.set(pos.x, 0, pos.z);
			obj.rotation.set(0, room.w[i].rotation.y + pi / 2, 0);					

			plinth.obj[plinth.obj.length] = obj;															
			obj.updateMatrixWorld();
			scene.add( obj );	

			plinth.param.length += length;		// подсчет общий длины плинтуса (для сметы)
		}
	}
	
	
	
	// подсчет внешних и внутренних углов (для сметы) 
	for (i = 0; i < room.p.length - 1; i++)
	{
		var n = (i == 0) ? room.p.length - 2 : i - 1;
		
		var x1 = room.p[i].position.z - room.p[n].position.z;
		var z1 = room.p[n].position.x - room.p[i].position.x;	
		var dir1 = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены
		
		var x1 = room.p[i + 1].position.z - room.p[i].position.z;
		var z1 = room.p[i].position.x - room.p[i + 1].position.x;	
		var dir2 = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены				
		
		var cross = new THREE.Vector3().crossVectors ( dir2, dir1 );
		
		if(cross.y > 0.1) { plinth.param.outCornersCount += 1; }
		else if(cross.y < -0.1) { plinth.param.inCournersCount += 1; }
	}
	

	if(camera == camera3D) { for (i = 0; i < plinth.obj.length; i++) { plinth.obj[i].visible = true; } }	// показываем плинтуса если в 3D режиме
	
	

	// 2
	var v = plinth.obj[0].geometry.vertices;
	var arrN = [];
	
	for (i = 0; i < v.length/2; i++) 
	{
		for (i2 = v.length/2; i2 < v.length; i2++) 
		{
			if(v[i].x == v[i2].x && v[i].y == v[i2].y) { arrN[i] = i2; break; }			
		}		
	}
	
	var min = v[0].x;
	var z_min = 0;	
	for (i = 0; i < v.length/2; i++) 
	{
		if(min > v[i].x) { min = v[i].x; z_min = i; } 
	}
 

	
	// 3
	var arrVect = [];
	
	// конвертируем все точки профиля (начало и конец) плинтусов из локального в глобальное
	for (i = 0; i < plinth.obj.length; i++)
	{
		arrVect[i] = {v1 : [], v2 : []};
		
		var v = plinth.obj[i].geometry.vertices;
		
		for (i2 = 0; i2 < v.length/2; i2++)
		{ 
			arrVect[i].v1[arrVect[i].v1.length] = plinth.obj[i].localToWorld( v[i2].clone() );
			arrVect[i].v2[arrVect[i].v2.length] = plinth.obj[i].localToWorld( v[arrN[i2]].clone() );
		}				
	}
	
	// находим точку пересечения 2-х плинтусов и соеднияем эти плинтуса
	for (i = 0; i < arrVect.length; i++)
	{
		var n = (i == arrVect.length - 1) ? 0 : i + 1;
		
		for (i2 = 0; i2 < v.length/2; i2++)
		{
			var point = crossPointTwoLine_2(arrVect[i].v1[i2], arrVect[i].v2[i2], arrVect[n].v1[i2], arrVect[n].v2[i2]);
			
			if(point[1]) continue;	// если прямые параллельны 	

			// если прямые находятся на стенах разной толщены
			if(i2 == 0) { var d = arrVect[i].v2[z_min].distanceTo(arrVect[n].v1[z_min]); if(d > 0.005) { break; }; }			
			
			var pos1 = plinth.obj[i].worldToLocal( point[0].clone() );
			pos1.y = v[i2].y;
			plinth.obj[i].geometry.vertices[arrN[i2]] = pos1;
			
			var pos2 = plinth.obj[n].worldToLocal( point[0].clone() ); 
			pos2.y = v[i2].y;
			plinth.obj[n].geometry.vertices[i2] = pos2;  
		}
	}

	for (i = 0; i < plinth.obj.length; i++) 
	{ 
		var obj = plinth.obj[i];
		
		upUvs_2( obj );  
		
		if(plinth.mat) { obj.material = plinth.mat; }
		else { loadPopObj_1([{ obj: obj, lotid: plinth.matId, start : 'new', containerID : '' }]); }			
	}	 
	
}



 
// при замене двери, обновляем плинтуса в комнате (чтобы подогнать под размер новой двери)
function updatePlinthsReplaceDoor(obj)  
{
	if(camera != camera3D) return;
	
	if(obj.userData.door.goList.setEmptyBox && obj.userData.door.goList.setPopObj){}
	else { return; }
	
	var room = detectCommonZone_1( obj.userData.door.wall ); 
		
	updateFormPlinths(room);			
}


function updateFormPlinths(room) 
{
	for ( var i = 0; i < room.length; i++ )
	{
		deletePlinths(room[i], room[i].userData.room.plinth.o); 
		if(room[i].userData.room.plinth.o) getLengthPlinths( room[i], null ); 
	}

	 renderCamera();
}



function deletePlinths(floor, flag)
{
	if(!floor) return;
	
	
	if(floor.userData.room.plinth.o) 
	{ 
		for ( var i2 = 0; i2 < floor.userData.room.plinth.obj.length; i2++ ) { scene.remove(floor.userData.room.plinth.obj[i2]); }  
		
		floor.userData.room.plinth.obj = [];
		
		if(!flag) 
		{ 
			floor.userData.room.plinth = { o : flag }; 
			floor.pr_catalog.plinthSource = null;
		}
	
		floor.userData.room.plinth.o = flag; 
	}
	
	 renderCamera();
}



