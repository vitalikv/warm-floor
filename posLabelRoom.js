



var skeleton = { line : [], point : [], cycle : [] };





function getSkeleton_1(arrRoom)
{	
	for ( var i = 0; i < skeleton.line.length; i ++ ){ scene.remove( skeleton.line[i] ); }
	for ( var i = 0; i < skeleton.point.length; i ++ ){ scene.remove( skeleton.point[i] ); }
	
	var p = [];
	skeleton.line = [];	
	skeleton.point = [];		
	
	
	for ( var s = 0; s < arrRoom.length; s++ )
	{		
		skeleton.cycle = [];
		p = [];
		for ( var i = 0; i < arrRoom[s].p.length - 1; i++ ) 
		{ 		
			p[i] = {pos: arrRoom[s].p[i].position.clone(), id: arrRoom[s].p[i].userData.id};			
		}			
		
		var p = getSkeleton_2(p, 0, arrRoom[s].userData.id);

		var p = getSkeleton_2(p, 0, arrRoom[s].userData.id);
		var p = getSkeleton_2(p, 0, arrRoom[s].userData.id);
		var p = getSkeleton_2(p, 0, arrRoom[s].userData.id);
		var p = getSkeleton_2(p, 0, arrRoom[s].userData.id);

		
		if(skeleton.cycle.length > 0)
		{
			var res = { max : skeleton.cycle[0].num, n : 0 };
			
			for ( var i = 0; i < skeleton.cycle.length; i++ )
			{
				if(res.max < skeleton.cycle[i].num) { res.max = skeleton.cycle[i].num; res.n = i; }
			}
			
			//console.log(arrRoom[s].userData.id, res.n, skeleton.cycle);
			
			
			var sumX = 0;
			var sumZ = 0;
			for ( var i = 0; i < skeleton.cycle[res.n].p.length; i++ ) 
			{ 
				sumX += skeleton.cycle[res.n].p[i].x; 
				sumZ += skeleton.cycle[res.n].p[i].z;
			}			
			
			arrRoom[s].label.position.set(sumX / skeleton.cycle[res.n].p.length, 0.2, sumZ / skeleton.cycle[res.n].p.length);						
		}
		else
		{
			//console.log(arrRoom[s].userData.id, skeleton);
		}
	}
}






// 1. создаем контур из линий, который смещен во внутрь помещения
// 2. создаем точки в местах пересечения математических линий
// 3. назначаем точки линиям (в свойства), чтобы понимать, из каких точек состоит отрезок
// 4. находим линии, которые после пересечения перевернулись, удаляем эти линии, объединяем соседнии линии (если они не параллельны) 
// 5. после того, как все точки и линии выстроины , ищем пересечения между уже построенными прямыми
// 6. находим отрезки, которые пересеклись и делим эти отрезки
function getSkeleton_2(arrP, cycle, roomId)
{
	if(arrP.length == 0) return;
	
	// 1. создаем контур из линий, который смещен во внутрь помещения
	// создаем 2 точки смещенные во внутрь помещения (имитация прямой линии)
	var arrLine = [];
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var i2 = (i == arrP.length - 1) ? 0 : i + 1;
		
		var x1 = arrP[i2].pos.z - arrP[i].pos.z;
		var z1 = arrP[i].pos.x - arrP[i2].pos.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
		dir = new THREE.Vector3().addScaledVector( dir, 0.3 );
		
		var pos1 = arrP[i].pos.clone();
		var pos2 = arrP[i2].pos.clone();
		pos1.add( dir );
		pos2.add( dir );
		
		var dir = new THREE.Vector3().subVectors( pos2, pos1 ).normalize();
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);
		
		arrLine[arrLine.length] = { p : [ { position : pos1 }, { position : pos2 }], dir : dir, cross : [] };		
	}
	
	
	// 2. создаем точки в местах пересечения математических линий
	var geometry = new THREE.Geometry();
	var arr = [];
	for ( var i = 0; i < arrLine.length; i++ )
	{
		var i2 = (i == arrLine.length - 1) ? 0 : i + 1;					
		
		var p = {};
		p.pos = crossPointTwoLine(arrLine[i].p[0].position, arrLine[i].p[1].position, arrLine[i2].p[0].position, arrLine[i2].p[1].position);
		p.id = arrP[ i2 ].id;
		arr[arr.length] = p;
		
		geometry.vertices.push(p.pos);

		skeleton.point[skeleton.point.length] = createPoint( p.pos, p.id );
	}
	
	
	color = (color == 0xff0000) ? 0x0422c9 : 0xff0000;
	var line = skeleton.line[skeleton.line.length] = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({color: color }));
	scene.add(line);

		
	
	
	console.log('--------------');
	
	
	
	// 3. назначаем точки линиям (в свойства), чтобы понимать, из каких точек состоит отрезок 
	for ( var i = 0; i < arr.length; i++ )
	{
		var i2 = (i == arr.length - 1) ? 0 : i + 1;	
		
		arrLine[i2].p[0] = arr[i];
		arrLine[i2].p[1] = arr[i2];
	}	
	
	
	// 5. после того, как все точки и линии выстроины , ищем пересечения между уже построенными отрезками
	for ( var i = 0; i < arrLine.length; i++ )
	{		
		for ( var i2 = 0; i2 < arrLine.length; i2++ )
		{
			if(arrLine[i] == arrLine[i2]) continue;
			
			if(arrLine[i].p[0] == arrLine[i2].p[0]) continue;
			if(arrLine[i].p[0] == arrLine[i2].p[1]) continue;
			if(arrLine[i].p[1] == arrLine[i2].p[0]) continue;
			if(arrLine[i].p[1] == arrLine[i2].p[1]) continue;	
 			

			if( CrossLine(arrLine[i].p[0].pos, arrLine[i].p[1].pos, arrLine[i2].p[0].pos, arrLine[i2].p[1].pos) )
			{ 
				var flag = true;
				for ( var i3 = 0; i3 < arrLine[i].cross.length; i3++ )
				{
					if(arrLine[i].cross[i3].wall == arrLine[i2]) 
					{ 
						flag = false;
						break;
					}
				}
				
				if(flag)
				{
					var pos = crossPointTwoLine(arrLine[i].p[0].pos, arrLine[i].p[1].pos, arrLine[i2].p[0].pos, arrLine[i2].p[1].pos);	
					
					var point = skeleton.point[skeleton.point.length] = createPoint( pos, 0 );;					

					arrLine[i].cross[arrLine[i].cross.length] = { wall : arrLine[i2], point : point };
					arrLine[i2].cross[arrLine[i2].cross.length] = { wall : arrLine[i], point : point };						
				}
			}
		}
	}	
	
	
	
	
	return arr;
}
var color = 0xff0000;


// отображаем информация в console
function showConsoleSkeleton(arr, roomId)
{
	var str = '[' +roomId+ '] ';
	for ( var i = 0; i < arr.length; i++ )
	{		
		str += ' | ';
		
		var l = [];
		var r = [];
		
		for ( var i2 = 0; i2 < arr[i].p.length; i2++ )
		{ 
			if(arr[i].start[i2] == 1) { l[l.length] = arr[i].p[i2].userData.id; }
			if(arr[i].start[i2] == 0) { r[r.length] = arr[i].p[i2].userData.id; }
		}
		
		for ( var i2 = 0; i2 < l.length; i2++ )
		{
			str += ' '+ l[i2];
		}

		str += ' ('+arr[i].userData.id +')';
		
		for ( var i2 = 0; i2 < r.length; i2++ )
		{
			str += ' '+ r[i2];
		}		
	}	
	console.log(str);		
}



// показываем линии скелетона
function showSkeleton(arrP, cycle, roomId)
{
	var n2 = skeleton.cycle.length;
	skeleton.cycle[n2] = { num : cycle, p : [] };
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var i2 = (i == arrP.length - 1) ? 0 : i + 1;
		
		skeleton.point[skeleton.point.length] = createPoint( arrP[i].position, arrP[i].userData.id );
		
		skeleton.cycle[n2].p[skeleton.cycle[n2].p.length] = arrP[i].position;		
		
		skeleton.line[skeleton.line.length] = createOneWall_4( arrP[i].position, arrP[i2].position, 0x0000FF );						
	}	
}

// показываем линии скелетона
function showSkeleton2(arrLine, cycle, roomId)
{
	
	for ( var i = 0; i < arrLine.length; i++ )
	{
		var f1 = true, f2 = true;
		for ( var i2 = 0; i2 < skeleton.point.length; i2++ )
		{
			if(skeleton.point[i2].position == arrLine[i].p[0].position) f1 = false;
			if(skeleton.point[i2].position == arrLine[i].p[1].position) f2 = false;
		}
		
		skeleton.point[skeleton.point.length] = createPoint( arrLine[i].p[0].position, arrLine[i].p[0].userData.id );
		//if(f2) skeleton.point[skeleton.point.length] = createPoint( arrLine[i].p[1].position, arrLine[i].p[1].userData.id );
		
		skeleton.line[skeleton.line.length] = createOneWall_4( arrLine[i].p[1].position, arrLine[i].p[0].position, 0x0000FF );						
	}	
}



// находим новые зоны
function detectRoomZone_2(arrP, zone)
{			
	for ( var i = 0; i < arrP.length; i++ )
	{
		for ( var m = 0; m < arrP[i].p.length; m++ )
		{
			var p = getContour_3([arrP[i], arrP[i].p[m]]);
			
			if(p.length < 2){ continue; }
			if(p[0] != p[p.length - 1]){ continue; }	
			//if(p.length > 5){ if(p[1] == p[p.length - 2]) continue; }  		
			if(checkClockWise_2(p) <= 0){ continue; }				
			
			
			var flag = false;
			for ( var i2 = 0; i2 < zone.length; i2++ )
			{
				var num = 0;
				for ( var i3 = 0; i3 < p.length - 1; i3++ )
				{
					for ( var i4 = 0; i4 < zone[i2].length; i4++ )
					{
						if(zone[i2][i4] == p[i3]) { num++; break; }
					}			
				}
				if(num == p.length - 1) { flag = true; break; }
			}
			if(flag) { continue; }

			
			var n = zone.length;
			zone[n] = [];
			for ( var i2 = 0; i2 < p.length - 1; i2++ )
			{
				zone[n][i2] = p[i2];
			}						
		}
	}

	//console.log(zone);
	
	return zone;
}


// ищем замкнутый контур (рекурсия)
function getContour_3(arr)
{
	var point = arr[arr.length - 1];	
	

	if(1==1)
	{
		
		for ( var i = 0; i < point.p.length; i++ )
		{
			
			
			if(arr[0] == point.p[i]) { arr[arr.length] = point.p[i]; break; }
			else 
			{  	
				var flag = false;
				for ( var i2 = 0; i2 < arr.length; i2++ )
				{
					if(arr[i2] == point.p[i]) { flag = true; break; }
				}
				if(flag) continue;
				
				var arr2 = [];
				for ( var i2 = 0; i2 < arr.length; i2++ ) { arr2[i2] = arr[i2]; }
				arr2[arr2.length] = point.p[i]; 
				//console.log(i, arr[0].userData.id, point.p[i].userData.id, arr.length);
				arr2 = getContour_3(arr2);
				if(arr2.length > 1) if(arr2[0] == arr2[arr2.length - 1]) { arr = arr2; break; };
			}						
		}
	}
	
	return arr;
}




//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
function checkClockWise_2( arrP )
{  
	var res = 0;
	var n = arrP.length;
	
	for (var i = 0; i < n; i++) 
	{		
		var p1 = arrP[i].position;
		
		if (i == 0)
		{
			var p2 = arrP[n-1].position;
			var p3 = arrP[i+1].position;					
		}
		else if (i == n-1)
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[0].position;			
		}
		else
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[i+1].position;			
		}
		
		res += p1.x*(p2.z - p3.z);
	}
	
	
	res = res / 2;
	//res = Math.round(res * 10) / 10;
	
	return res;
}




var cccc1 = new THREE.Color('#aaf0d1');
var cccc2 = 0x808080;
var cccc3 = cccc1;


// создание визуальных точек
function createPoint_2( pos, id )
{
	var point = {};		

	point.position = pos;
	point.p = [];
	
	
	if(id == 0) { id = countId; countId++; }
	point.userData = {};	
	point.userData.id = id;	
	point.userData.tag = 'point';		
	
	return point;
}


// создание визуальных линий
function createOneWall_4( pos1, pos2, cccc3 ) 
{	
	var d = pos1.distanceTo( pos2 );	
	
	var material = new THREE.MeshLambertMaterial( { color : 0xedded4, clippingPlanes : [ clippingMaskWall ], lightMap : lightMap_1 } );		
	var materials = [ new THREE.MeshLambertMaterial( { color: cccc3, clippingPlanes: [ clippingMaskWall ], lightMap : lightMap_1 } ), material.clone(), material.clone() ];		
	var geometry = createGeometryWall(d, 1, 0.04, 0);	
	var wall = new THREE.Mesh( geometry, materials ); 
	
	wall.position.copy( pos1 );
	
	var dir = new THREE.Vector3().subVectors( pos1, pos2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);			
	
	scene.add( wall );
	
	return wall;
}


 