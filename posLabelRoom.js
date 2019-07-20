



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
		p.line = [];
		arr[arr.length] = p;
		
		geometry.vertices.push(p.pos);

		skeleton.point[skeleton.point.length] = createPoint( p.pos, p.id );
	}
	
	
	color = (color == 0xff0000) ? 0x0422c9 : 0xff0000;
	var line = skeleton.line[skeleton.line.length] = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({color: color }));
	scene.add(line);

		
	
	
	console.log('--------------');
	
	
	
	// 3. создаем виртуальные линии
	for ( var i = 0; i < arr.length; i++ )
	{
		var i2 = (i == arr.length - 1) ? 0 : i + 1;	
		
		arrLine[i2].p[0] = arr[i];
		arrLine[i2].p[1] = arr[i2];
		
		arr[i].line[arr[i].line.length] = arrLine[i2];
		arr[i2].line[arr[i2].line.length] = arrLine[i2];	
	}	
	
	
	var exist = false;
	
	// 4. находим пересечения линий (если есть) и создаем точки
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
					
					var point = skeleton.point[skeleton.point.length] = createPoint( pos, 0 );					
					
					var p = {pos: point.position.clone(), id: point.userData.id, line: []};
					arr[arr.length] = p;
					
					arrLine[i].cross[arrLine[i].cross.length] = { wall : arrLine[i2], point : p };
					arrLine[i2].cross[arrLine[i2].cross.length] = { wall : arrLine[i], point : p };

					p.line[0] = arrLine[i];
					p.line[1] = arrLine[i2];
					
					exist = true;
				}
			}
		}
	}



	for ( var i = 0; i < arr.length; i++ )
	{
		var p = arr[i];	
		
		if(!p.p) { p.p = []; }
		
		for ( var i2 = 0; i2 < p.line.length; i2++ )
		{
			var line = p.line[i2];
			
			if(line.cross.length > 0)
			{
				var max = 999999;
				var pp = null;
				
				for ( var i3 = 0; i3 < line.cross.length; i3++ )
				{
					if(p == line.cross[i3].point) continue;
					
					var d = p.pos.distanceTo( line.cross[i3].point.pos );
					
					if(max > d) { pp = line.cross[i3].point; max = d; console.log(p.id, pp.id, d); }
				}
				
				var p2 = (line.p[0] == p) ? line.p[1] : line.p[0];
				
				p.p[p.p.length] = pp;
			}
			else
			{ 
				var p2 = (line.p[0] == p) ? line.p[1] : line.p[0];
				
				p.p[p.p.length] = p2;
			}
		}
	}		
	
	
	
	if(exist)
	{
		for ( var i = 0; i < arr.length; i++ )
		{
			console.log(arr[i].id, arr[i].p);
		}
		
	}
	
	
	
	return arr;
}
var color = 0xff0000;



















 