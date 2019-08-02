



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





offsetArray_1({arr: [0,1,2,3,4,5,6], val:2, reverse: true});


// смещаем массив так, чтобы искомое значение было на 0 месте, а затем все последовательны шли за ним
// arr = [0,1,2,3,4,5,6]; val = 2; результат смещения массива => [ 2, 3, 4, 5, 6, 0, 1 ]
// если вкл reverse, то в обратную сторону arr = [0,1,2,3,4,5,6]; val = 2; результат смещения массива => [ 2, 1, 0, 6, 5, 4, 3 ]
function offsetArray_1(cdm)
{
	var newArrTgt = [];
	
	var arr = cdm.arr;
	var val = cdm.val;
	
	var num = -1;

	for( var i = 0; i < arr.length; i++ )
	{
		if(val == arr[i]) { num = i; break; }
	}

	if(num != -1)
	{
		
		var flag = true;

		if(cdm.reverse)
		{
			var end = 0;
			
			for( var i = num; i >= end; i-- )
			{
				newArrTgt[newArrTgt.length] = arr[i];
				
				if(i == 0 && flag) { end = num + 1; i = arr.length; flag = false; }
			}					
		}
		else
		{
			var count = arr.length;
			
			for( var i = num; i < count; i++ )
			{
				newArrTgt[newArrTgt.length] = arr[i];
				
				if(i == count - 1 && flag) { count = num; i = -1; flag = false; }
			}					
		}
	}

	//console.log(newArrTgt);
	
	return newArrTgt;
}




function enterTubeBoxWF(offset)
{
	if(skeleton.arrP.length == 0) return;
	
	var line = [];	
	line[0] = {p1: new THREE.Vector3(1, 0, -3), p2: new THREE.Vector3(1, 0, 0)};
	line[1] = {p1: new THREE.Vector3(offset + 1, 0, -3), p2: new THREE.Vector3(offset + 1, 0, 0)};
	
	
	//var startline = {p1: new THREE.Vector3(0, 0, -3), p2: new THREE.Vector3(0, 0, 0)};


	console.log(skeleton.arrP.length);
	for ( var i = 0; i < skeleton.arrP.length; i++ )
	{
		var arr = skeleton.arrP[i];		

		// назначаем точка, соседние точки, чтобы можно было построить отдельные отрезки
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			var i3 = (i2 == arr.length - 1) ? 0 : i2 + 1;	
			
			arr[i2].p = arr[i3];
		}
		
	}
	
	
	intersectTubeBoxWF({ pos: new THREE.Vector3(1, 0, -3), arrPoint: skeleton.arrP, offset: offset, num: 0 });

	
	var arrP2 = [];

	
	// находим точку пересечения с контуром линий и находим самую ближайшую 
	function getCrossPoint(cdm)
	{
		var point = null;
		
		var pointPos = cdm.pos;		
		var num = cdm.num;
		var arrPoint = cdm.arrPoint[num];
		
		// перпендикуляр на прямые
		var p = [];		
		for(var i = 0; i < arrPoint.length; i++)
		{
			var pos = spPoint(arrPoint[i].pos, arrPoint[i].p.pos, pointPos);
			var pos = new THREE.Vector3(pos.x, pointPos.y, pos.z);

			var replacePoint = false;
			if(comparePos(pos, arrPoint[i].pos)) { replacePoint = true; }
			else if(comparePos(pos, arrPoint[i].p.pos)) { replacePoint = true; }
			else if(!CrossLine(arrPoint[i].pos, arrPoint[i].p.pos, pointPos, pos)) continue;		// определяем, точка попала в пределы отрезка
			
			p[p.length] = { pos: pos, dist: pos.distanceTo(pointPos), line: {p1: arrPoint[i], p2: arrPoint[i].p}, replacePoint: replacePoint };  			
		}	
	
		// ищем саму ближайшую точку
		if(p.length > 0)
		{
			var dist = p[0].dist;
			var point = p[0];
			for(var i = 0; i < p.length; i++)
			{
				if(dist > p[i].dist) { dist = p[i].dist; point = p[i]; }			
			}			
		}
		else	// нету точки пересечения
		{
			var p = [];
			
			for(var i = 0; i < arrPoint.length; i++)
			{
				p[p.length] = { pos: arrPoint[i].pos, dist: arrPoint[i].pos.distanceTo(pointPos), id: arrPoint[i].id };
			}
			
			var dist = p[0].dist;
			var point = p[0];
			for(var i = 0; i < p.length; i++)
			{
				if(dist > p[i].dist) { dist = p[i].dist; point = p[i]; }			
			}

			console.log('point', point);
			
			var p1 = cdm.arrPoint[cdm.num1][cdm.arrPoint[cdm.num1].length - 1];
			var p2 = cdm.arrPoint[cdm.num1][cdm.arrPoint[cdm.num1].length - 2];
			
			var pos = spPoint(pointPos, p2.pos, point.pos);
			var pos = new THREE.Vector3(pos.x, pointPos.y, pos.z);
			
			p1.pos.copy(pos);
			
			console.log('point2',pointPos, p2.pos);

			cdm.pos = pos;
			return getCrossPoint(cdm);
		}

		return point;
	}


	
	// добавляем врезку, точки подключения к трубам
	function intersectTubeBoxWF(cdm)
	{			
		var pointPos = cdm.pos;		
		var num = cdm.num;
		var arrPoint = cdm.arrPoint[num];
		var offset = cdm.offset;
		
		
		var stP = getCrossPoint(cdm);
console.log('----------');
		if(!stP) return;
		
		
		// находим самую ближнию точку из контура с точкой пересечения
		// полуаем массив начинающийся с точки пересечения
		if(cdm.reverse != undefined)
		{
			var reverse = cdm.reverse;
			var p = (cdm.reverse)? stP.line.p1 : stP.line.p2;  
		}
		else
		{
			var d1 = stP.pos.distanceTo(stP.line.p1.pos);
			var d2 = stP.pos.distanceTo(stP.line.p2.pos);	
			
			if(d1 < d2) { var p = stP.line.p1; var reverse = true; }
			else { var p = stP.line.p2; var reverse = false; }			
		}
		
		
		if(stP.replacePoint)
		{
			var d1 = stP.pos.distanceTo(stP.line.p1.pos);
			var d2 = stP.pos.distanceTo(stP.line.p2.pos);	
			
			if(d1 < d2) { var p = stP.line.p1; }
			else { var p = stP.line.p2; }
		}
		
		var arr = offsetArray_1({arr: arrPoint, val: p, reverse: reverse});
		console.log('-ddd-', arr, p);
		
		if(!stP.replacePoint) 
		{
			arr[arr.length - 1].loopP = stP.pos;
		
			arr.unshift({ p: null, pos: stP.pos, id: countId++ });		// точка вход в контур
			//arr.unshift({ p: null, pos: pointPos, id: countId++ });		// точка начала трубы, которая подключается к точки входа
		}

		
		if(1==1) 
		{
			// получаем смещение для последней точки в цикле
			var offset_2 = (cdm.arrPoint.length - 1 >= num + 1) ? offset * 2 : offset;  
			var dir = new THREE.Vector3().subVectors( arr[arr.length - 1].pos, stP.pos ).normalize();  
			var v1 = new THREE.Vector3().addScaledVector( dir, offset_2 );
			var posEnd = new THREE.Vector3().addVectors( stP.pos, v1 );	
			
			// определяем напрвление, куда смотрит новая точка, относительно последеней
			var dir2 = new THREE.Vector3().subVectors( arr[arr.length - 1].pos, posEnd ).normalize();	
			
			
			// если смотрят в одном направлении, то линия не перевернута, то добавляем последнюю точку
			if(dir.dot(dir2) > 0.98)
			{
				arr.push({ p: null, pos: posEnd, id: countId++ });
			}
			else
			{
				posEnd = arr[arr.length - 1].pos;
			}			
		}
		
		
		// выводим (кусок трубы) конец обратки
		if(cdm.arrPoint.length - 1 < num + 1 && 1==2)
		{
			var x = arr[1].pos.z - arr[0].pos.z;
			var z = arr[0].pos.x - arr[1].pos.x;	
			var dir = new THREE.Vector3(x, 0, z).normalize();		// перпендикуляр стены

			var k = (reverse)? -1 : 1;
			
			var v1 = new THREE.Vector3().addScaledVector( dir, offset * k );
			var pos = new THREE.Vector3().addVectors( arr[0].pos, v1 );
			console.log('222222');
			arr.push({ p: null, pos: pos, id: countId++ });			
		}
		
		
		// назначаем точка, соседние точки, чтобы можно было построить отдельные отрезки
		for ( var i2 = 0; i2 < arr.length - 1; i2++ )
		{
			var i3 = i2 + 1;	
			
			arr[i2].p = arr[i3];
			arr[i3].p = null;
		}
		
		skeleton.arrP[num] = arr;
		//console.log(arr);		
		
		
		if(cdm.arrPoint.length - 1 >= num + 1)
		{
			var num2 = (cdm.arrPoint.length - 1 >= num + 2)? num + 2 : num + 1;
						
			cdm.pos = arr[arr.length - 1].pos;
			cdm.num = num2;
			cdm.num1 = num;
			cdm.reverse = reverse;  
			intersectTubeBoxWF(cdm);
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
			
			skeleton.point[skeleton.point.length] = createPoint( arr[i2].pos, arr[i2].id );
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



 