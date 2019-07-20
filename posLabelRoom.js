



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
		
		var p = { p: [], pos: [], id: 0 };
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
					
					var p = {pos: point.position.clone(), p: [], id: point.userData.id, line: []};
					arr[arr.length] = p;
					
					arrLine[i].cross[arrLine[i].cross.length] = { wall : arrLine[i2], point : p };
					arrLine[i2].cross[arrLine[i2].cross.length] = { wall : arrLine[i], point : p };
					
					exist = true;
				}
			}
		}
	}

	
	
	
	
	if(exist)
	{
		var arrLine2 = [];
		
		// делим точки на отрезки
		for ( var i = 0; i < arrLine.length; i++ )
		{
			var p = [arrLine[i].p[0]];	
			
			//if(!p.p) { p.p = []; }
			
			for ( var i2 = 0; i2 < arrLine[i].cross.length; i2++ )
			{
				p[p.length] = arrLine[i].cross[i2].point; 
			}
			
			p[p.length] = arrLine[i].p[1];
			
			var arrP = [];
			
			
			for ( var i2 = 0; i2 < p.length; i2++ )
			{				
				arrP[i2] = { p: p[i2], dist: (i2 == 0) ? 0 : p[0].pos.distanceTo( p[i2].pos ) };
			}
			
			arrP.sort(function (a, b) { return a.dist - b.dist; });
			
			
			
			for ( var i2 = 0; i2 < arrP.length - 1; i2++ )
			{
				arrLine2[arrLine2.length] = { p1: arrP[i2].p, p2: arrP[i2+1].p };
			}
		}	

		
		// назначаем токам линии к которым они относятся
		for ( var i = 0; i < arr.length; i++ )
		{
			for ( var i2 = 0; i2 < arrLine2.length; i2++ )
			{
				if(arr[i] == arrLine2[i2].p1) { arr[i].line[arr[i].line.length] = arrLine2[i2]; }
				if(arr[i] == arrLine2[i2].p2) { arr[i].line[arr[i].line.length] = arrLine2[i2]; }
			}			
		}


		var list = [];
		
		for ( var i = 0; i < arrLine2.length; i++ )
		{
			var res = getlistPoint(arrLine2[i], arrLine2, [arrLine2[i].p1], 0);
			
			if(!detectSameZone_3( list, res )) { list[list.length] = res; }
			
			
			function getlistPoint(startLine, arrLine, list, num)
			{
				num++;
				//if(num>12) return list;
				

				var arrA = [];
				
				for ( var i = 0; i < startLine.p2.line.length; i++ )
				{
					var line = startLine.p2.line[i];
					
					if(startLine == line) continue;
					
					var p2 = (line.p1 == startLine.p2) ? line.p2 : line.p1;
					
					var dir1 = new THREE.Vector3().subVectors( p2.pos, startLine.p2.pos ).normalize();
					var dir2 = new THREE.Vector3().subVectors( startLine.p1.pos, startLine.p2.pos ).normalize();
					
					var angle = dir1.angleTo( dir2 );
					
					//console.log(angle, p2.id, startLine.p2.id, startLine.p1.id);												
					
					arrA[arrA.length] = { angle: angle, line: line };					
				}

				arrA.sort(function (a, b) { return a.angle - b.angle; });
				
				
				if(arrA[0].line.p1 != list[0]) 
				{
					list[list.length] = arrA[0].line.p1;
					
					getlistPoint(arrA[0].line, arrLine, list, num);
				}
				

				return list;
			}
		}
		
		
		console.log(list);
		
		
		for ( var i = 0; i < arrLine2.length; i++ )
		{
			//console.log(arrLine2[i]);
		}
		
	}
	
	
	
	return arr;
}
var color = 0xff0000;





// проверяем если зона с такими же точками
function detectSameZone_3( arrRoom, arrP )
{
	var flag = false;
	
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		var ln = 0;
		
		if(arrRoom[i].length != arrP.length) { continue; }
			
		for ( var i2 = 0; i2 < arrRoom[i].length; i2++ )
		{
			for ( var i3 = 0; i3 < arrP.length; i3++ )
			{
				if(arrRoom[i][i2] == arrP[i3]) { ln++; }
			}
		}
		
		if(ln == arrP.length) 
		{ console.log(ln, arrP.length, arrRoom[i], arrP);
			//console.log(ln);
			//var txt = '---p---'; for ( var i3 = 0; i3 < arrP.length; i3++ ) { txt += ' | ' + arrP[i3].userData.id; } console.log(txt);	
			//var txt = '---zone---'; for ( var i3 = 0; i3 < arrRoom[i].p.length; i3++ ) { txt += ' | ' + arrRoom[i].p[i3].userData.id; } console.log(txt); 
			flag = true; 
			break; 
		}
	}
	
	return flag;
}













 