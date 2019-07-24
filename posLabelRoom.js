



var skeleton = { line : [], point : [], cycle : [] };





function getSkeleton_1(arrRoom)
{	
	for ( var i = 0; i < skeleton.line.length; i ++ ){ scene.remove( skeleton.line[i] ); }
	for ( var i = 0; i < skeleton.point.length; i ++ ){ scene.remove( skeleton.point[i] ); }
	
	var p = [];
	skeleton.line = [];	
	skeleton.point = [];		
	skeleton.arrP = [];
	var offset = 0.3;
	
	for ( var s = 0; s < arrRoom.length; s++ )
	{		
		p = [];
		for ( var i = 0; i < arrRoom[s].p.length - 1; i++ ) 
		{ 		
			p[i] = {pos: arrRoom[s].p[i].position.clone(), id: arrRoom[s].p[i].userData.id};			
		}			
		
		var p = getSkeleton_2(p, 0, arrRoom[s].userData.id, offset);

		console.log(skeleton);
	}
	
	enterTubeBoxWF(offset);
}






// 1. создаем контур из линий, который смещен во внутрь помещения
// 2. создаем точки в местах пересечения математических линий
// 3. назначаем точки линиям (в свойства), чтобы понимать, из каких точек состоит отрезок
// 4. находим линии, которые после пересечения перевернулись, удаляем эти линии, объединяем соседнии линии (если они не параллельны) 
// 5. после того, как все точки и линии выстроины , ищем пересечения между уже построенными прямыми
// 6. находим отрезки, которые пересеклись и делим эти отрезки
function getSkeleton_2(arrP, cycle, roomId, offset)
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
		dir = new THREE.Vector3().addScaledVector( dir, offset );
		
		var pos1 = arrP[i].pos.clone();
		var pos2 = arrP[i2].pos.clone();
		pos1.add( dir );
		pos2.add( dir );
		
		var dir = new THREE.Vector3().subVectors( pos2, pos1 ).normalize();
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);
		
		arrLine[arrLine.length] = { p : [ { pos : pos1 }, { pos : pos2 }], dir : dir, cross : [] };		
	}
	
	
	// 2. создаем точки в местах пересечения математических линий	
	var arr = [];
	for ( var i = 0; i < arrLine.length; i++ )
	{
		var i2 = (i == arrLine.length - 1) ? 0 : i + 1;					
		
		var p = { p: [], pos: new THREE.Vector3(), id: 0 };
		p.pos = crossPointTwoLine(arrLine[i].p[0].pos, arrLine[i].p[1].pos, arrLine[i2].p[0].pos, arrLine[i2].p[1].pos);
		p.id = arrP[ i2 ].id;
		p.line = [];
		arr[arr.length] = p;
	}
		
	
	
	// 3. создаем виртуальные линии
	for ( var i = 0; i < arr.length; i++ )
	{
		var i2 = (i == arr.length - 1) ? 0 : i + 1;	
		
		arrLine[i2].p[0] = arr[i];
		arrLine[i2].p[1] = arr[i2];	
	}



	// 4. находим линии, которые после пересечения перевернулись
	// удаляем эти линии, объединяем соседнии линии (если они не параллельны) 
	for ( var i = 0; i < arrLine.length; i++ )
	{		
		var dir = new THREE.Vector3().subVectors( arrLine[i].p[1].pos, arrLine[i].p[0].pos ).normalize();		
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);	
		
		if(!comparePos(arrLine[i].dir, dir)) 
		{			
			var i2 = (i == 0) ? arrLine.length - 1 : i - 1;
			var i3 = (i == arrLine.length - 1) ? 0 : i + 1;
			
			var line1 = arrLine[i2];
			var line2 = arrLine[i3];
			
			var saveDir = arrLine[i2].dir;				
			
			var res = crossPointTwoLine_2(arrLine[i2].p[0].pos, arrLine[i2].p[1].pos, arrLine[i3].p[0].pos, arrLine[i3].p[1].pos);				
			
			var num = 0;
			for(var m = 0; m < arr.length; m++) { if(arrLine[i].p[0] == arr[m]) { arr.splice(m, 1); num = m; } }
			for(var m = 0; m < arr.length; m++) { if(arrLine[i].p[1] == arr[m]) arr.splice(m, 1); }
			
			arrLine.splice(i, 1);			
			
			if(res[1]) { i = -1; continue; }	// линии НЕ пересеклись (параллельны), пропускаем и идем дальше по циклу
			
			// линии пересеклись, объединяем линии (делаем их соседями)
			
			var p = { p: [], pos: res[0].clone(), id: countId++ };
			arr.splice(num, 0, p);
			
			line2.p[0] = p;
			line1.p[1] = p;
			line1.dir = saveDir;
			
			console.log(num);
			console.log(line1.p[0].id, line1.p[1].id);
			console.log(line2.p[0].id, line2.p[1].id);				

			i = -1;			
		}
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
					arrLine[i].cross[arrLine[i].cross.length] = { wall : arrLine[i2], point : p };
					arrLine[i2].cross[arrLine[i2].cross.length] = { wall : arrLine[i], point : p };
					
					exist = true;
					break;
				}
			}
		}
		if(exist)break;
	}

	
	
	
	
	if(!exist && arr.length > 0)
	{
		skeleton.arrP[skeleton.arrP.length] = arr;	
		
		getSkeleton_2(arr, cycle++, roomId, offset);
	}
	
	
	return arr;
}
var color = 0xff0000;





function enterTubeBoxWF(offset)
{
	var line = [];	
	line[0] = {p1: new THREE.Vector3(1, 0, -3), p2: new THREE.Vector3(1, 0, 0)};
	line[1] = {p1: new THREE.Vector3(offset + 1, 0, -3), p2: new THREE.Vector3(offset + 1, 0, 0)};


	console.log(skeleton.arrP.length);
	for ( var i = 0; i < skeleton.arrP.length; i++ )
	{
		var arr = skeleton.arrP[i];		
	
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{ 
			skeleton.point[skeleton.point.length] = createPoint( arr[i2].pos, arr[i2].id );
		}

		// назначаем точка, соседние точки, чтобы можно было построить отдельные отрезки
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			var i3 = (i2 == arr.length - 1) ? 0 : i2 + 1;	
			
			arr[i2].p = arr[i3];
		}
		
	}

	
	var arrP2 = [];
	intersectTubeBoxWF(line[0], 1, offset*2);
	intersectTubeBoxWF(line[1], 0, offset*2);

	// добавляем врезку, чтобы могли подключиться к трубам
	function intersectTubeBoxWF(line, num, offset)
	{		
		var arrP = skeleton.arrP[num];
		
		for ( var i = 0; i < arrP.length; i++ ) 
		{ 
			var i2 = (i == arrP.length - 1) ? 0 : i + 1;
			
			if( CrossLine(arrP[i].pos, arrP[i2].pos, line.p1, line.p2) )
			{
				var point = skeleton.point[skeleton.point.length] = createPoint( line.p1, 0 );				
				var p1 = { p: null, pos: line.p1.clone(), id: point.userData.id };
				skeleton.arrP[num][skeleton.arrP[num].length] = p1;				
				
				var pos = crossPointTwoLine(arrP[i].pos, arrP[i2].pos, line.p1, line.p2);
				
				var d1 = pos.distanceTo( arrP[i].pos );
				var d2 = pos.distanceTo( arrP[i2].pos );
				
				var n = (d1 > d2)? i2 : i;					
				var n2 = (d1 > d2)? i : i2;
				
				var point = skeleton.point[skeleton.point.length] = createPoint( pos, 0 );				
				var p = { p: null, pos: pos.clone(), id: point.userData.id };
				skeleton.arrP[num][skeleton.arrP[num].length] = p;
				
				p.p = p1;
				
				arrP[n].p = p;
				
				
				
				if(offset)
				{					
					var dir = new THREE.Vector3().subVectors( arrP[n2].pos, pos ).normalize();  
					var v1 = new THREE.Vector3().addScaledVector( dir, offset );
					var pos2 = new THREE.Vector3().addVectors( pos, v1 );

					var point = skeleton.point[skeleton.point.length] = createPoint( pos2, 0 );
					
					var p = { p: arrP[n2], pos: pos2.clone(), id: point.userData.id };
					
					skeleton.arrP[num][skeleton.arrP[num].length] = p;
					
					arrP2[arrP2.length] = p;
				}
				
				break;
			}
			
		}		
	}
	
	var num = 2;
	
	// пускаем перпендикуляр от точки на прямую
	for(var i = 0; i < arrP2.length; i++)
	{
		var arrP = skeleton.arrP[num];
		
		for(var i2 = 0; i2 < arrP.length; i2++)
		{
			if(!arrP[i2].p) continue;
				
			if(!calScal(arrP[i2].pos, arrP[i2].p.pos, arrP2[i].pos)) continue;	// проверяем попадает ли перпендикуляр от точки на прямую
			
			var pos = spPoint(arrP[i2].pos, arrP[i2].p.pos, arrP2[i].pos);  
			var pos = new THREE.Vector3(pos.x, arrP[i2].pos.y, pos.z);
			
			createPoint( pos, 0 );			
		}
	}
			
	
	var arrLine = [];
	
	for ( var i = 0; i < skeleton.arrP.length; i++ )
	{
		var arr = skeleton.arrP[i];		
		arrLine[i] = [];
		
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{ 
			if(arr[i2].p) arrLine[i][arrLine[i].length] = { p1: arr[i2], p2: arr[i2].p };
		}
		
	}
	
	console.log(arrLine);
	
	// рисуем линии
	for ( var i = 0; i < arrLine.length; i++ )
	{
		var arr = arrLine[i];
		
		color = (color == 0xff0000) ? 0x0422c9 : 0xff0000;
		
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{  
			var geometry = new THREE.Geometry();		
			geometry.vertices.push(arr[i2].p1.pos);
			geometry.vertices.push(arr[i2].p2.pos);
			
			var line = skeleton.line[skeleton.line.length] = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: color, depthTest: false, transparent: true }));
			scene.add(line);
			
		}
	}	
	

		
	
}



 