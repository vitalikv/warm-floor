



var skeleton = { line : [], point : [], cycle : [] };

// сдвиг массива на count позиций
// если count = отрицательный => удаляем с конца массива заданное кол-во элементов и добавляем в начало
// если count = положительный => удаляем из массива все элементы начиная с count и добавляем в начало
function shiftArray(cdm)
{
	var arr = cdm.arr;
	var count = cdm.count;

	var arr2 = [];
	for ( var i = 0; i < arr.length; i++ ){ arr2[i] = arr[i]; }	
	
	var arr2 = arr2.splice(count).concat(arr2);
	
	console.log(arr2);

	return arr2;
}


shiftArray({arr : [1,2,3,45,8,9,7,10], count : 1});


function getSkeleton_1(arrRoom)
{	
	for ( var i = 0; i < skeleton.line.length; i ++ ){ scene.remove( skeleton.line[i] ); }
	for ( var i = 0; i < skeleton.point.length; i ++ ){ scene.remove( skeleton.point[i] ); }
	
	var arrPoint = [];
	skeleton.line = [];	
	skeleton.point = [];		
	
	
	for ( var s = 0; s < arrRoom.length; s++ )
	{		
		skeleton.cycle = [];
		arrPoint = [];
		for ( var i = 0; i < arrRoom[s].p.length - 1; i++ ) 
		{ 		
			arrPoint[i] = createPoint_2(arrRoom[s].p[i].position.clone(), arrRoom[s].p[i].userData.id);				
		}
		
		
		for ( var i = 0; i < arrPoint.length; i++ ) 
		{ 				
			var i2 = (i == 0) ? arrPoint.length - 1 : i - 1;
			var i3 = (i == arrPoint.length - 1) ? 0 : i + 1;
			
			arrPoint[i].p[0] = arrPoint[i2];			
			arrPoint[i].p[1] = arrPoint[i3];		
		}			
		
		getSkeleton_2(arrPoint, 0, arrRoom[s].userData.id);

		
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
	
	console.log(skeleton);
	
	
	// меняем положение старта
	if(1==1)
	{
		for ( var i = 0; i < skeleton.cycle.length; i++ )
		{
			var line_1 = skeleton.cycle[i].line;
			
			var arrL = [];
			
			for ( var i2 = 0; i2 < skeleton.cycle[i].line.length; i2++ )
			{
				//var n = (i2==0) ? skeleton.cycle[i].line.length - 1 : i2 - 1;
				var n = (i2 == skeleton.cycle[i].line.length - 1) ? 0 : i2 + 1;
				
				arrL[arrL.length] = skeleton.cycle[i].line[n];
			}
			
			skeleton.cycle[i].line = arrL;
		}		
	}
	
	
	// ресивер
	if(1==2)
	{
		for ( var i = 0; i < skeleton.cycle.length; i++ )
		{
			var line_1 = skeleton.cycle[i].line;
			
			var arrL = [];
			
			for ( var i2 = skeleton.cycle[i].line.length - 1; i2 >= 0; i2-- )
			{
				var line = skeleton.cycle[i].line[i2];
				
				//line.p = [line.p[1], line.p[0]];
				
				arrL[arrL.length] = line;
			}
			
			skeleton.cycle[i].line = arrL;
		}		
	}	
	
	

	
	var p = findEquallyPipe({ line_1 : { p : [skeleton.cycle[0].p1[0].point, skeleton.cycle[0].p1[1].point]} });
	
	var p1 = p;  
	
	for ( var i = 0; i < skeleton.cycle[0].line.length; i++ )
	{
		if(skeleton.cycle[0].line[i].p[1] == p[0])
		{
			var p = skeleton.cycle[0].line[i].p; break;
		}
	}	
	console.log(99999, p[0].userData.id, p[1].userData.id);
	var p = findEquallyPipe({ line_1 : { p : p } });
	
	var p2 = p; console.log(99999, p2[0].userData.id, p2[1].userData.id);
	
	
	
	
	
	
	for ( var i = 0; i < skeleton.cycle.length; i++ )
	{
		var i2 = i + 2;	
		
		if(i2 > skeleton.cycle.length - 1) continue;
		
		var line_1 = null;
		var line_2 = null;
		
		for ( var m = 0; m < skeleton.cycle[i].line.length; m++ )
		{
			if(skeleton.cycle[i].line[m].p[0].userData.id == p2[0].userData.id)
			{
				var line_1 = skeleton.cycle[i].line[m]; break;
			}
		}					
		
		for ( var m = 0; m < skeleton.cycle[i2].line.length; m++ )
		{
			if(skeleton.cycle[i2].line[m].p[0].userData.id == p1[0].userData.id)
			{
				var line_2 = skeleton.cycle[i2].line[m]; break;
			}
		}

		if(!line_1 || !line_2) continue;
		
		p2 = [line_1.p[0], line_1.p[1]];
		p1 = [line_2.p[0], line_2.p[1]];
		
		var pos = crossPointTwoLine(p1[0].position, p1[1].position, p2[0].position, p2[1].position);
		
		//skeleton.point[skeleton.point.length] = createPoint( pos, 0 );
		
		p2[1].position.copy(pos);			
		line_2.obj.position.copy(pos);
		
		var d1 = p2[0].position.distanceTo( pos );
		var d2 = p1[1].position.distanceTo( pos );
		
		
		var v = line_1.obj.geometry.vertices; 
		v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = d1;
		line_1.obj.geometry.verticesNeedUpdate = true;

		var v = line_2.obj.geometry.vertices; 
		v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = d2;
		line_2.obj.geometry.verticesNeedUpdate = true;	  		
		
	console.log(p1[0].userData.id, p1[1].userData.id, p2[0].userData.id, p2[1].userData.id);
	}
}







function findEquallyPipe(cdm)
{
	
	var level_1 = skeleton.cycle[0];
	var level_2 = skeleton.cycle[1];
	
	var line_1 = cdm.line_1;		
	
	var p = line_1.p;	
	
	var equally = [-1, -1];
	for ( var i = 0; i < level_2.p1.length; i++ )
	{
		if(line_1.p[0].userData.id == level_2.p1[i].point.userData.id) { equally[0] = level_2.p1[i].point.userData.id; }
		if(line_1.p[1].userData.id == level_2.p1[i].point.userData.id) { equally[1] = level_2.p1[i].point.userData.id; }
	}
	
	
	if(equally[0] == -1 || equally[1] == -1)
	{
		var point = (line_1.p[0].userData.id != equally[0]) ? line_1.p[0] : line_1.p[1];
		
		var arrP_1 = level_1.p1;
		var arrP_2 = level_1.p2;			
		
		var num = 0;
		for ( var m = 0; m < level_1.p1.length; m++ ) { if(point == level_1.p1[m].point) { num = m; break; } }		
		if(num > 0) { arrP_1 = shiftArray({arr : level_1.p1, count : num}); }

		var num = 0;
		for ( var m = 0; m < level_1.p2.length; m++ ) { if(point == level_1.p2[m].point) { num = m; num = (level_1.p2.length - 1) - num; break; } }		
		if(num > 0) { arrP_2 = shiftArray({arr : level_1.p2, count : -num}); }		
		
		
		for ( var m = 0; m < arrP_1.length; m++ ) { console.log(arrP_1[m].point.userData.id); }
		console.log('----------'); 
		for ( var m = 0; m < arrP_2.length; m++ ) { console.log(arrP_2[m].point.userData.id); }
		console.log('----------'); 	

		var p = [];
		
		for ( var m = 0; m < arrP_1.length; m++ )
		{
			var exist = false;
			for ( var m2 = 0; m2 < level_2.p1.length; m2++ )
			{
				if(arrP_1[m].point.userData.id == level_2.p1[m2].point.userData.id)
				{
					exist = true; 
					p[1] = arrP_1[m].point;
					break;
				}
			}
			if(exist) break;
		}
		
		for ( var m = arrP_2.length - 1; m >= 0; m-- )
		{
			var exist = false;
			for ( var m2 = 0; m2 < level_2.p1.length; m2++ )
			{
				if(arrP_2[m].point.userData.id == level_2.p1[m2].point.userData.id)
				{
					exist = true;
					p[0] = arrP_2[m].point;
					break;
				}
			}
			if(exist) break;
		}					
	}
	
	
	console.log('pId1 : ', p[0].userData.id, 'pId2 : ', p[1].userData.id);
	
	return p;
}




function floorPipe_1(point)
{
	var dir = new THREE.Vector3().subVectors( point[1].position, point[0].position ).normalize();
	dir = new THREE.Vector3().addScaledVector( dir, -0.3 );
	
	point[1].position.add(dir);
	
	var line_1 = skeleton.cycle[i].line[skeleton.cycle[i].line.length - 1];	
	
	var v = line_1.obj.geometry.vertices; 
	
	var d = v[11].x - 0.6;
	
	
	if(d < 0) { d2 = d; d = 0; }

		
	v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = d;
	line_1.obj.geometry.verticesNeedUpdate = true;
	
	line_1.obj.updateMatrixWorld();
	var pos = line_1.obj.localToWorld(new THREE.Vector3(d, 0, 0));			


	
	line_1.p[1].position.copy(pos);
	
	return pos;
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
		
		var x1 = arrP[i2].position.z - arrP[i].position.z;
		var z1 = arrP[i].position.x - arrP[i2].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
		dir = new THREE.Vector3().addScaledVector( dir, 0.3 );
		
		var pos1 = arrP[i].position.clone();
		var pos2 = arrP[i2].position.clone();
		pos1.add( dir );
		pos2.add( dir );
		
		var dir = new THREE.Vector3().subVectors( pos2, pos1 ).normalize();
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);
		
		arrLine[arrLine.length] = { p : [ { position : pos1 }, { position : pos2 }], dir : dir, cross : [] };		
	}
	
	
	// 2. создаем точки в местах пересечения математических линий
	var arr = [];
	for ( var i = 0; i < arrLine.length; i++ )
	{
		var i2 = (i == arrLine.length - 1) ? 0 : i + 1;					
		
		var id = arrP[ i2 ].userData.id;
		
		arr[arr.length] = createPoint_2( crossPointTwoLine(arrLine[i].p[0].position, arrLine[i].p[1].position, arrLine[i2].p[0].position, arrLine[i2].p[1].position), id );
	}
	
	
	// 3. назначаем точки линиям (в свойства), чтобы понимать, из каких точек состоит отрезок 
	for ( var i = 0; i < arr.length; i++ )
	{
		var i2 = (i == arr.length - 1) ? 0 : i + 1;	
		
		arrLine[i2].p[0] = arr[i];
		arrLine[i2].p[1] = arr[i2];
	}
	//showSkeleton2(arrLine, cycle, roomId);
	


	for ( var i = 0; i < arrLine.length; i++ )
	{		
		var dir = new THREE.Vector3().subVectors( arrLine[i].p[1].position, arrLine[i].p[0].position ).normalize();		
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);	

		
		if(!comparePos(arrLine[i].dir, dir)) 
		{			
			var i2 = (i == 0) ? arrLine.length - 1 : i - 1;
			var i3 = (i == arrLine.length - 1) ? 0 : i + 1;	

			var dir1 = new THREE.Vector3().subVectors( arrLine[i3].p[1].position, arrLine[i3].p[0].position ).normalize();
			if(roomId == 6) console.log(999, arrLine[i].p[0].userData.id, arrLine[i].p[1].userData.id, ' | ', arrLine[i3].p[0].userData.id, arrLine[i3].p[1].userData.id, comparePos(arrLine[i3].dir, dir) )
					
		}
	}
	
	
	// 4. находим линии, которые после пересечения перевернулись
	// удаляем эти линии, объединяем соседнии линии (если они не параллельны) 
	for ( var i = 0; i < arrLine.length; i++ )
	{		
		var dir = new THREE.Vector3().subVectors( arrLine[i].p[1].position, arrLine[i].p[0].position ).normalize();		
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);	

		if(roomId == 6) console.log(i, arrLine[i].p[0].userData.id, arrLine[i].p[1].userData.id);
		if(!comparePos(arrLine[i].dir, dir)) 
		{			
			var i2 = (i == 0) ? arrLine.length - 1 : i - 1;
			var i3 = (i == arrLine.length - 1) ? 0 : i + 1;
			
			var saveDir = arrLine[i2].dir;
			
			var res = crossPointTwoLine_2(arrLine[i2].p[0].position, arrLine[i2].p[1].position, arrLine[i3].p[0].position, arrLine[i3].p[1].position);	


			var dirA1 = new THREE.Vector3().subVectors( arrLine[i2].p[1].position, arrLine[i2].p[0].position ).normalize();
			var dirB1 = new THREE.Vector3().subVectors( arrLine[i3].p[1].position, arrLine[i3].p[0].position ).normalize();
			
			
			var dirA2 = new THREE.Vector3().subVectors( res[0], arrLine[i2].p[0].position ).normalize();
			var dirB2 = new THREE.Vector3().subVectors( arrLine[i3].p[1].position, res[0] ).normalize();				
			
			arrLine.splice(i, 1);
			
			if(arrLine.length < 3) return; // если после удаления линий, в зоен осталось, только 2 точки, то прекращаем строить
			
			if(!comparePos(dirA1, dirA2))  { i--; continue; }
			if(!comparePos(dirB1, dirB2))  { i--; continue; }
			
			if(res[1]) { i--; continue; }	// линии НЕ пересеклись (параллельны), пропускаем и идем дальше по циклу
			
			// линии пересеклись, объединяем линии (делаем их соседями)
			var i2 = (i2 > arrLine.length - 1) ? i2-1 : i2;  
			var i3 = (i > arrLine.length - 1) ? 0 : i;	
			
			arrLine[i3].p[0].position = res[0].clone();
			arrLine[i2].p[1] = arrLine[i3].p[0];
			arrLine[i2].dir = saveDir;

			i = -1;			
		}
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
 			

			if( CrossLine(arrLine[i].p[0].position, arrLine[i].p[1].position, arrLine[i2].p[0].position, arrLine[i2].p[1].position) )
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
					var pos = crossPointTwoLine(arrLine[i].p[0].position, arrLine[i].p[1].position, arrLine[i2].p[0].position, arrLine[i2].p[1].position);	
					
					var point = createPoint_2( pos, 0 );					

					arrLine[i].cross[arrLine[i].cross.length] = { wall : arrLine[i2], point : point };
					arrLine[i2].cross[arrLine[i2].cross.length] = { wall : arrLine[i], point : point };						
				}
			}
		}
	}



	// 6. находим отрезки, которые пересеклись и делим эти отрезки
	for ( var i = arrLine.length - 1; i >= 0; i-- )
	{		


		if(arrLine[i].cross.length == 1)
		{
			var line = { p : [arrLine[i].cross[0].point, arrLine[i].p[1]] };
			
			arrLine.splice(i+1, 0, line);
			
			arrLine[i].p[1] = arrLine[i].cross[0].point;
		}
		else if(arrLine[i].cross.length > 1)
		{
			var arrP = [];
			
			arrP[0] = { p : arrLine[i].p[0], dist : 0 };
			arrP[1] = { p : arrLine[i].p[1], dist : arrLine[i].p[0].position.distanceTo( arrLine[i].p[1].position ) };
			
			for ( var i2 = 0; i2 < arrLine[i].cross.length; i2++ )
			{
				arrP[arrP.length] = { p : arrLine[i].cross[i2].point, dist : arrLine[i].p[0].position.distanceTo( arrLine[i].cross[i2].point.position ) };
			}
			
			arrP.sort(function (a, b) { return b.dist - a.dist; });	// сортируем поубыванию
			
			for ( var i2 = 0; i2 < arrP.length - 2; i2++ )
			{
				var line = { p : [arrP[i2 + 1].p, arrP[i2].p] };
				
				arrLine.splice(i + 1, 0, line);
			}			
			
			arrLine[i].p[1] = arrP[arrP.length - 2].p;
		}			
	}


	// вытаскиваем из отрезков точки и переносим в массив
	var arrP = [];
	var arrP2 = [];		// точки которые относятся к 2 и более отрезкам
	for ( var i = 0; i < arrLine.length; i++ )
	{  //if(roomId == 6) console.log(arrLine[i].p[0].userData.id, arrLine[i].p[1].userData.id);
		var n = -1;
		for ( var i2 = 0; i2 < arrP.length; i2++ ) 
		{ 
			if(arrP[i2] == arrLine[i].p[0]) { n = i2; break; }
		}
		
		if(n == -1) 
		{ 		
			var i2 = arrP.length;
			arrP[i2] = arrLine[i].p[0]; 
			arrP[i2].p = [arrLine[i].p[1]];
		}
		else 
		{
			arrP[i2].p[arrP[i2].p.length] = arrLine[i].p[1];

			var flag = true;
			for ( var i3 = 0; i3 < arrP2.length; i3++ )
			{
				if(arrP2[i3] == arrP[i2]) { flag = false; break; }
			}
			if(flag) { arrP2[arrP2.length] = arrP[i2]; }
		}
	}	
	
	
	if(arrP2.length == 0) { var zone = [arrP]; }
	else { var zone = detectRoomZone_2(arrP2, []); }
	
	
	cccc3 = (cccc3 == cccc1) ? cccc2 : cccc1;
	console.log('--------------');
	for ( var i = 0; i < zone.length; i++ ) { showSkeleton(zone[i], cycle, roomId); getSkeleton_2(zone[i], cycle + 1, roomId); }


	
}



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
	skeleton.cycle[n2] = { num : cycle, p : [], line : [], p1 : [], p2 : [] };
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var i2 = (i == arrP.length - 1) ? 0 : i + 1;
		
		var point = createPoint( arrP[i].position, arrP[i].userData.id );
		
		skeleton.point[skeleton.point.length] = point;
		
		skeleton.cycle[n2].p[skeleton.cycle[n2].p.length] = arrP[i].position;		
		
		var line = createOneWall_4( arrP[i].position, arrP[i2].position, 0x0000FF );

		skeleton.line[skeleton.line.length] = line;

		skeleton.cycle[n2].line[i] = { obj : line, p : [point] };
		
		skeleton.cycle[n2].p1[i] = { point : point, line : line };
	}	
	
	
	
	for ( var i = 0; i < skeleton.cycle[n2].line.length; i++ )
	{
		var i2 = (i == skeleton.cycle[n2].line.length - 1) ? 0 : i + 1;
		
		skeleton.cycle[n2].line[i].p[1] = skeleton.cycle[n2].line[i2].p[0];
		
		skeleton.cycle[n2].p2[i] = { point : skeleton.cycle[n2].line[i2].p[0], line : skeleton.cycle[n2].line[i] };
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




//var cccc1 = new THREE.Color('#aaf0d1');
var cccc1 = 0xff0000;
var cccc2 = 0x0037ff;
var cccc3 = cccc2;


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
function createOneWall_4( pos1, pos2, color ) 
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




function showWarmF_1()
{
	
	for ( var i = 0; i < skeleton.cycle.length; i++ )
	{
		var i2 = i + 2;	

		if(i+2 > skeleton.cycle.length - 1) 
		{
			var line_1 = skeleton.cycle[i].line[skeleton.cycle[i].line.length - 1];
			
			var d = (i+1 > skeleton.cycle.length - 1) ? 0.4 : 0.7;
			
			var v = line_1.obj.geometry.vertices; 
			v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = v[11].x - d;
			line_1.obj.geometry.verticesNeedUpdate = true;	

			var dir = new THREE.Vector3().subVectors( line_1.p[1].position, line_1.p[0].position ).normalize();
			dir = new THREE.Vector3().addScaledVector( dir, -d );
			
			line_1.p[1].position.add(dir);	
			continue;
		}
		
		if(i2 > skeleton.cycle.length - 1) continue;
		
		var line_1 = skeleton.cycle[i].line[skeleton.cycle[i].line.length - 1];		
		var line_2 = skeleton.cycle[i2].line[0];
		
		var pos = crossPointTwoLine(line_1.p[0].position, line_1.p[1].position, line_2.p[0].position, line_2.p[1].position);
		
		//skeleton.point[skeleton.point.length] = createPoint( pos, 0 );
		
		line_1.p[1].position.copy(pos);			
		line_2.obj.position.copy(pos);
		
		var d1 = line_1.p[0].position.distanceTo( pos );
		var d2 = line_2.p[1].position.distanceTo( pos );
		
		
		var v = line_1.obj.geometry.vertices; 
		v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = d1;
		line_1.obj.geometry.verticesNeedUpdate = true;

		var v = line_2.obj.geometry.vertices; 
		v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = d2;
		line_2.obj.geometry.verticesNeedUpdate = true;			
		
	console.log(line_1.p[0].userData.id, line_1.p[1].userData.id, line_2.p[0].userData.id, line_2.p[1].userData.id);
	}
		
				
}




 