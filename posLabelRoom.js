



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
		p = [];
		for ( var i = 0; i < arrRoom[s].p.length - 1; i++ ) 
		{ 		
			p[i] = {pos: arrRoom[s].p[i].position.clone(), id: arrRoom[s].p[i].userData.id};			
		}			
		
		var p = getSkeleton_2(p, 0, arrRoom[s].userData.id);

		console.log(skeleton);
	}
	
	enterTubeBoxWF();
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
		
		if(!comparePos(arrLine[i].dir, dir)&& 1==1) 
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

	
	
	
	
	if(!exist)
	{
		color = (color == 0xff0000) ? 0x0422c9 : 0xff0000;
		
		var geometry = new THREE.Geometry();
		
		for ( var i = 0; i < arr.length; i++ )
		{ 
			skeleton.point[skeleton.point.length] = createPoint( arr[i].pos, arr[i].id );
			geometry.vertices.push(arr[i].pos);
		}
		
		var line = skeleton.line[skeleton.line.length] = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({color: color, depthTest: false, transparent: true }));
		scene.add(line);	
		
		getSkeleton_2(arr, cycle++, roomId);
	}
	
	
	return arr;
}
var color = 0xff0000;





function enterTubeBoxWF()
{
	var offset = 0.3;
	
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, 0, -4));
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	var line_1 = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2, depthTest: false, transparent: true }) );
	scene.add( line_1 );

	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(offset, 0, -4));
	geometry.vertices.push(new THREE.Vector3(offset, 0, 0));
	var line_2 = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0x0422c9, linewidth: 2, depthTest: false, transparent: true }) );
	scene.add( line_2 );


	intersectTubeBoxWF(line_1, skeleton.line[0]);
	intersectTubeBoxWF(line_2, skeleton.line[1]);


	function intersectTubeBoxWF(line, contour)
	{
		var v = contour.geometry.vertices;
		
		for ( var i = 0; i < v.length; i++ ) 
		{ 
			var i2 = (i == v.length - 1) ? 0 : i + 1;
			
			if( CrossLine(v[i], v[i2], line.geometry.vertices[0], line.geometry.vertices[1]) )
			{
				var pos = crossPointTwoLine(v[i], v[i2], line.geometry.vertices[0], line.geometry.vertices[1]);
				
				skeleton.point[skeleton.point.length] = createPoint( pos, 0 );
			}
			
		}		
	}
	
}



 