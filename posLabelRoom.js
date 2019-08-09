



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
	
	p = [];
	for ( var i = 0; i < arrRoom[0].p.length - 1; i++ ) 
	{ 		
		p[i] = {pos: arrRoom[0].p[i].position.clone(), id: arrRoom[0].p[i].userData.id};			
	}			
	
	var p = getSkeleton_2(p, 0, arrRoom[0].userData.id, offset);	
	
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

	
	
	
	
	if(!exist && arr.length > 2)
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
	
	
	
	
	var inf = intersectTubeBoxWF({ pos: new THREE.Vector3(-1, 0, -3), arrPoint: skeleton.arrP, offset: offset, num: 0 });

	entryOutlineTool({pos: new THREE.Vector3(-1, 0, -3)});
	
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

			var dir = new THREE.Vector3().subVectors( pos, pointPos ).normalize();
			var v1 = new THREE.Vector3().addScaledVector( dir, 10.2 );
			var p3 = new THREE.Vector3().addVectors( pos, v1 );	

			var replacePoint = false;
			if(comparePos(pos, arrPoint[i].pos)) { replacePoint = true; }
			else if(comparePos(pos, arrPoint[i].p.pos)) { replacePoint = true; }
			else if(!CrossLine(arrPoint[i].pos, arrPoint[i].p.pos, pointPos, p3))		// определяем, точка попала за пределы отрезка
			{
				replacePoint = true;
				
				var d1 = pos.distanceTo(arrPoint[i].pos);
				var d2 = pos.distanceTo(arrPoint[i].p.pos);	
				
				pos = (d1 < d2) ? arrPoint[i].pos : arrPoint[i].p.pos;
			}
			
			p[p.length] = { pos: pos, dist: pos.distanceTo(pointPos), line: {p1: arrPoint[i], p2: arrPoint[i].p}, replacePoint: replacePoint };  
			
		}	
	
		// ищем саму ближайшую точку
		if(p.length > 0)
		{
			var dist = p[0].dist;
			var point = p[0];
			for(var i = 0; i < p.length; i++)
			{
				//console.log('p', num, p[i]);
				if(dist > p[i].dist) { dist = p[i].dist; point = p[i]; }			
			}

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
		if(!stP) return cdm;
		
		
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
		
		// точка пересечения находится на другой точки. поэтому новую точку не создаем
		if(stP.replacePoint)
		{
			var d1 = stP.pos.distanceTo(stP.line.p1.pos);
			var d2 = stP.pos.distanceTo(stP.line.p2.pos);	
			
			if(d1 < d2) { var p = stP.line.p1; }
			else { var p = stP.line.p2; }
		}
		
		var arr = offsetArray_1({arr: arrPoint, val: p, reverse: reverse});
		
		if(!stP.replacePoint) 
		{
			arr[arr.length - 1].loopP = stP.pos;
		
			arr.unshift({ p: null, pos: stP.pos, id: countId++ });		// точка вход в контур
			//arr.unshift({ p: null, pos: pointPos, id: countId++ });		// точка начала трубы, которая подключается к точки входа
		}

		
		
		// получаем смещение для последней точки в цикле
		if(1==1) 
		{			
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
		
		// соединяем линии между конечными и начальными точками соседних контуров 
		if(cdm.num1 != undefined)
		{
			skeleton.arrP[cdm.num1][skeleton.arrP[cdm.num1].length - 1].p = arr[0];
		}
		
		
		skeleton.arrP[num] = arr;		
		
		
		if(cdm.arrPoint.length - 1 >= num + 1)
		{ 
			var num2 = (cdm.arrPoint.length - 1 >= num + 2)? num + 2 : num + 1;
						
			cdm.pos = arr[arr.length - 1].pos;
			cdm.num = num2;
			cdm.num1 = num;
			cdm.reverse = reverse;  
			intersectTubeBoxWF(cdm);
		}
		
		return cdm;
	}
		
	


	//var arrP = skeleton.arrP;	
	var arrP = [];
	for ( var i = 0; i < skeleton.arrP.length; i+=2 )
	{
		arrP[arrP.length] = skeleton.arrP[i];
	}
	
	

	
	arrP[arrP.length - 1] = checkAngle_2(arrP[arrP.length - 1]);
	
	// удаляем точку, если у нее острый угол
	function checkAngle_1(p)
	{
		for ( var i = 0; i < p.length; i++ )
		{
			var p1 = p[i];
			
			var p2 = p1.p;
			if(!p2) continue;		
			
			var p3 = p2.p;
			if(!p3) continue;
			
			var dir1 = new THREE.Vector3().subVectors( p1.pos, p2.pos ).normalize();
			var dir2 = new THREE.Vector3().subVectors( p3.pos, p2.pos ).normalize();
			
			var angle = dir1.angleTo( dir2 );
			console.log(angle, p1.id, p2.id, p3.id);
			
			if(angle < 0.03) 
			{
				p1.p = p3;
				var pN = [];
				for( var i2 = 0; i2 < p.length; i2++ ) 
				{ 
					if(p2 == p[i2]) continue; 
					
					pN[pN.length] = p[i2];
				}
				console.log('-000-');
				p = checkAngle_1(pN);
			}
		}	
		
		return p;
	}
	


	// добавляем точку, если острый угол
	function checkAngle_2(p)
	{
		for ( var i = 0; i < p.length; i++ )
		{
			var p1 = p[i];
			
			var p2 = p1.p;
			if(!p2) continue;		
			
			var p3 = p2.p;
			if(!p3) continue;
			
			var dir1 = new THREE.Vector3().subVectors( p1.pos, p2.pos ).normalize();
			var dir2 = new THREE.Vector3().subVectors( p3.pos, p2.pos ).normalize();
			
			var angle = dir1.angleTo( dir2 );
			console.log(angle, p1.id, p2.id, p3.id);
			
			if(angle < 0.5) 
			{
				var dir = new THREE.Vector3().subVectors( dir2, dir1 ).normalize();
				var dir1 = new THREE.Vector3().addScaledVector( dir, 0.025 );
				var dir2 = new THREE.Vector3().addScaledVector( dir, -0.025 );
				
				var p4 = {p: null, pos: p2.pos.clone().add(dir1), id: countId++};
				p2.pos.add(dir2);
				
				p2.p = p4;
				p4.p = p3;
				
				p.splice(i+2, 0, p4);
				

				console.log('-000-');
				p = checkAngle_2(p);
			}
		}	
		
		return p;
	}
	
	


	
	// создаем обратку
	offsetTube_2({arrP: arrP, reverse: inf.reverse});
	
	
	
	// конвертируем из точек в линии 
	var arrLine = [];
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var arr = arrP[i];		
		arrLine[i] = [];
		
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{ 
			if(arr[i2].p) arrLine[i][arrLine[i].length] = { p1: arr[i2], p2: arr[i2].p };
			
			skeleton.point[skeleton.point.length] = createPoint( arr[i2].pos, arr[i2].id );
		}
		
	}
	
	
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



function offsetTube_2(cdm)
{
	var arrP = cdm.arrP;
	var arrP_2 = [];
	
	for ( var i = arrP.length - 1; i > 0; i-- )
	{
		var arr = arrP[i];		
		
		for ( var i2 = arr.length - 1; i2 > -1; i2-- )
		{ 
			arrP_2[arrP_2.length] = arr[i2];			
		}		
	}
	console.log('reverse', cdm.reverse);
	arrP_2.push(arrP[0][arrP[0].length - 1]);
	arrP = arrP_2;
	var offset = 0.3;
	// 1. создаем контур из линий, который смещен во внутрь помещения
	// создаем 2 точки смещенные во внутрь помещения (имитация прямой линии)
	var arrLine = [];
	
	for ( var i = 0; i < arrP.length - 1; i++ )
	{
		var i2 = i + 1;
		
		var x1 = arrP[i2].pos.z - arrP[i].pos.z;
		var z1 = arrP[i].pos.x - arrP[i2].pos.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
		
		var kof = (cdm.reverse) ? -1 : 1;
		dir = new THREE.Vector3().addScaledVector( dir, offset * kof );
		
		var pos1 = arrP[i].pos.clone();
		var pos2 = arrP[i2].pos.clone();
		pos1.add( dir );
		pos2.add( dir );
				
		arrLine[arrLine.length] = { p : [ { pos : pos1, id: arrP[i].id }, { pos : pos2, id: arrP[i2].id }] };
	}
	
	
	// 2. создаем точки в местах пересечения математических линий	
	var arr = [];
	for ( var i = 0; i < arrLine.length - 1; i++ )
	{
		var i2 =  i + 1;					
		
		var p = { p: [], pos: new THREE.Vector3(), id: 0 };
		p.pos = crossPointTwoLine(arrLine[i].p[0].pos, arrLine[i].p[1].pos, arrLine[i2].p[0].pos, arrLine[i2].p[1].pos);
		p.id = arrP[ i2 ].id;
		p.line = [];
		arr[arr.length] = p;
	}


	arr.unshift(arrLine[0].p[0]);
	arr.push(arrLine[arrLine.length - 1].p[1]);
	
	
	// рисуем линии
	for ( var i = 0; i < arr.length-1; i++ )
	{		
		var color = 0x000000;
		
		var geometry = new THREE.Geometry();		
		geometry.vertices.push(arr[i].pos);
		geometry.vertices.push(arr[i+1].pos);
		
		var line = skeleton.line[skeleton.line.length] = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: color, depthTest: false, transparent: true }));
		scene.add(line);
	}	
	
}





// интсрумент указывающий вход в контур
function entryOutlineTool(cdm)
{
	var arrPoint = [];
	arrPoint[arrPoint.length] = new THREE.Vector2(0, 0);
	arrPoint[arrPoint.length] = new THREE.Vector2(0.2, 0.3);
	arrPoint[arrPoint.length] = new THREE.Vector2(0.08, 0.3);
	arrPoint[arrPoint.length] = new THREE.Vector2(0.08, 1.0);
	arrPoint[arrPoint.length] = new THREE.Vector2(-0.08, 1.0);
	arrPoint[arrPoint.length] = new THREE.Vector2(-0.08, 0.3);
	arrPoint[arrPoint.length] = new THREE.Vector2(-0.2, 0.3);
	
	var shape = new THREE.Shape( arrPoint );
	var material = new THREE.MeshLambertMaterial( { color : 0xff0000, lightMap : lightMap_1 } );
	
	var tool = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: -0.1 } ), material );
	tool.userData.tag = 'tool_strelka_wf';
	scene.add(tool);
	
	var pos = (cdm.pos) ? cdm.pos : new THREE.Vector3();
	
	tool.position.copy(pos); 
	tool.rotation.x = Math.PI/2;
	tool.rotation.z = Math.PI;
}



// перемещение стрелки
function clickToolEntryOutline(intersect)
{
	var obj = intersect.object;
	
	obj_selected = obj;
	
	//offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath2.position.copy( intersect.point );
	planeMath2.rotation.set( 0, 0, 0 );
	
	
}



// перемещение стрелки
function moveToolEntryOutline(event)
{
	var intersects = rayIntersect( event, planeMath2, 'one' );
	
	//var pos = new THREE.Vector3().addVectors( intersects[0].point, offset );
	var pos = intersects[0].point;
	//obj_selected.position.copy( pos );
	
	
	var p = [];
	var arrP = room[0].p; 
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{ 		
		var pos2 = spPoint(arrP[i].position, arrP[i+1].position, pos);				// перпендикуляр от точки на отрезок
		var pos2 = new THREE.Vector3(pos2.x, pos.y, pos2.z);

		var dir = new THREE.Vector3().subVectors( pos2, pos ).normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, 10.2 );
		var p3 = new THREE.Vector3().addVectors( pos, v1 );	

		if(!CrossLine(arrP[i].position, arrP[i+1].position, pos, p3)) continue;		// определяем, точка попала за пределы отрезка	

		p[p.length] = { pos: pos2, dist: pos.distanceTo(pos2) }; 
	}		

	// ищем саму ближайшую точку
	if(p.length > 0)
	{
		var dist = p[0].dist;
		var pos2 = p[0].pos;
		for(var i = 0; i < p.length; i++)
		{
			if(dist > p[i].dist) { dist = p[i].dist; pos2 = p[i].pos; }			
		}			
		
		var dir = new THREE.Vector3().subVectors( pos, pos2 ).normalize();
		var angleDeg = Math.atan2(dir.z, dir.x);
		obj_selected.rotation.z = angleDeg - Math.PI/2;

		obj_selected.position.copy( pos2 );
	}
	
}







 