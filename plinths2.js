




// создаем плинтуса
// 1. выставляем плинтуса (положение и поворот)
// 2. находим одинаковые (равные) точки с одной стороны и с другой (находим торцы плинтуса)
// 3. находим координаты прямой, которая проходит вдоль плинтуса
// 4. последняя стадия соединения 2 плинтусов 
// 4.1 находим (точку) пересечении 2 прямых (плинтусов)
// 4.2 зная точку пересечении 2 прямых, находим пересения точек торцов обоих плинтусов
function getLengthPlinths( room, arrShape, lotid, matId, preview ) 
{		
	
	if(!arrShape) return;
	if(arrShape.length == 0) return;
	
	var plint = [];

	room.plinth.o = true;
	room.plinth.v = arrShape;
	room.plinth.lotid = lotid;
	room.plinth.preview = preview;
	
	
	var shape = new THREE.Shape( arrShape );
	var material = new THREE.MeshLambertMaterial( {
		//color: 0xff0000,
		color: 0xffffff,
		polygonOffset: true,
		polygonOffsetFactor: 1, // positive value pushes polygon further away
		polygonOffsetUnits: 1
	} );	

	
		
	// 1
	for (i = 0; i < room.w.length; i++) 
	{
		room.w[i].updateMatrixWorld();		
		
		var v = room.w[i].geometry.vertices;		
		
		if(room.s[i] == 0) 
		{ 
			var n1 = 4; 
			var n2 = v.length - 2;
			var pos = room.w[i].localToWorld( v[n1].clone() );
			var pi = Math.PI;
		}
		else 
		{ 
			var n1 = 0; 
			var n2 = v.length - 6;
			var pos = room.w[i].localToWorld( v[n2].clone() );
			var pi = -Math.PI; 
		}
		
		var res = v[n2].x - v[n1].x; 
		
		var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: res } ), material );	
		obj.userData.tag = 'plinths';
		obj.room = room;
		obj.visible = false;
		obj.position.set(pos.x, 0, pos.z);
		obj.rotation.set(0, room.w[i].rotation.y + pi / 2, 0);		
		plint[plint.length] = obj;				

		room.plinth.obj[i] = obj;
		
		upUvs_1( obj );
		
		if(room.plinth.mat) { obj.material = room.plinth.mat; }
		else { loadPopObj_1([{ obj: obj, lotid: matId, start : 'new', containerID : '' }]); }
		
		scene.add( obj );
	}

	if(camera == camera3D) { for (i = 0; i < plint.length; i++) { plint[i].visible = true; } }
	
	//plint[plint.length - 1].material.wireframe = true;

	// 2
	var v = plint[plint.length - 1].geometry.vertices;
	var arrN = [];
	
	for (i = 0; i < v.length/2; i++) 
	{
		for (i2 = v.length/2; i2 < v.length; i2++) 
		{
			if(v[i].x == v[i2].x && v[i].y == v[i2].y)
			{
				//console.log(i, i2, [v[i], v[i2]]);
				arrN[i] = i2;
				break;
			}			
		}		
	}
 
	for (i = 0; i < plint.length; i++) { plint[i].point = arrN; }  
	
	
	// 3
	var dirPlint = [];
	for (i = 0; i < plint.length; i++)
	{
		plint[i].updateMatrixWorld();
		
		if(i == 0) { var n2 = i; var n1 = plint.length - 1; }
		else { var n2 = i; var n1 = i - 1; }
		
		var x1 = plint[n2].position.z - plint[n1].position.z;
		var z1 = plint[n1].position.x - plint[n2].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	

		dir.multiplyScalar( 0.5 );
		var pos2 = new THREE.Vector3().addVectors(plint[n2].position, dir);  		
		var pos1 = new THREE.Vector3().addVectors(plint[n1].position, dir); 
		dirPlint[i] = [pos1, pos2];
	}	
	dirPlint[dirPlint.length] = [dirPlint[0][1], dirPlint[0][0]];
	
	
	// 4
	for (i = 0; i < dirPlint.length - 1; i++)
	{
		var res = crossPointTwoLine_2(dirPlint[i][0], dirPlint[i][1], dirPlint[i + 1][0], dirPlint[i + 1][1]);
		
		if(res[1]) continue;
		
		var pos = res[0];	// 4.1
				
		
		var posW = plint[i].worldToLocal( pos.clone() );  
		var v = plint[i].geometry.vertices;
				
		
		for (i2 = 0; i2 < v.length/2; i2++)
		{
			var y = v[i2].y; 
			v[i2]  = crossPointTwoLine_2(new THREE.Vector3(), posW, v[i2], v[arrN[i2]])[0];		// 4.2
			v[i2].y = y;  
		}		
		
		var n3 = (i == 0) ? plint.length - 1 : i - 1;		
		var posW = plint[n3].worldToLocal( pos.clone() );  
		var v = plint[n3].geometry.vertices;
		var z = v[arrN[0]].z;
		
		for (i2 = 0; i2 < v.length/2; i2++)
		{
			var y = v[arrN[i2]].y;   
			v[arrN[i2]] = crossPointTwoLine_2(new THREE.Vector3(0, 0, z), posW, v[i2], v[arrN[i2]])[0];  // 4.2
			v[arrN[i2]].y = y;
			
			//v[arrN[i2]].z = crossPointTwoLine_2(new THREE.Vector3(0, 0, z), posW, v[i2], v[arrN[i2]])[0].z;
		}	
	}	
}



function movePointPlinths( walls, zone ) 
{
	
	for (i = 0; i < walls.length; i++)
	{
		for (i2 = 0; i2 < walls[i].arrP.length; i2++)
		{
			if(!walls[i].arrP[i2]) continue;		
			
			if(i2 == 0) { var n1 = 4; var pi = Math.PI / 2; }
			else { var n1 = walls[i].geometry.vertices.length - 6; var pi = -Math.PI / 2; }
			
			var res = walls[i].geometry.vertices[10].x - walls[i].geometry.vertices[4].x; 			
			var plint = walls[i].arrP[i2];			
			var arrN = plint.point;
			
			for (i3 = 0; i3 < arrN.length; i3++)
			{
				plint.geometry.vertices[i3].z = 0;
			}
			for (i3 = arrN.length; i3 < arrN.length + arrN.length; i3++)
			{
				plint.geometry.vertices[i3].z = res;
			}			
			
			var pos = walls[i].localToWorld( walls[i].geometry.vertices[n1].clone() );
			walls[i].arrP[i2].position.set(pos.x, 0, pos.z);
			walls[i].arrP[i2].rotation.set(0, walls[i].rotation.y + pi, 0);				
		}
	} 
	
	
	var dirPlint = [];
	for (i = 0; i < pl_wall.length; i++)
	{
		dirPlint[i] = [];
		var plint = zone[i].plinth;
		
		for (i2 = 0; i2 < pl_wall[i].length; i2++)
		{
			var k = pl_wall[i][i2];
			
			if(!plint[k]) continue;
			
			plint[k].updateMatrixWorld(); 
			
			if(k == 0) { var n2 = k; var n1 = plint.length - 1; }
			else { var n2 = k; var n1 = k - 1; }
			
			var x1 = plint[n2].position.z - plint[n1].position.z;
			var z1 = plint[n1].position.x - plint[n2].position.x;	
			var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	

			dir.multiplyScalar( 0.5 );
			var pos2 = new THREE.Vector3().addVectors(plint[n2].position, dir);  		
			var pos1 = new THREE.Vector3().addVectors(plint[n1].position, dir); 
			
			dirPlint[i][i2] = [pos1, pos2, plint[n1], plint[n2]];
		}
	}
	
	
	for (i = 0; i < dirPlint.length; i++)
	{
		for (i2 = 0; i2 < dirPlint[i].length - 1; i2++)
		{
			var res = crossPointTwoLine_2(dirPlint[i][i2][0], dirPlint[i][i2][1], dirPlint[i][i2 + 1][0], dirPlint[i][i2 + 1][1]);
			
			if(res[1]) continue;
			
			var pos = res[0];	// 4.1
			
					
			var plint = dirPlint[i][i2][3]; 
			var posW = plint.worldToLocal( pos.clone() );  
			var v = plint.geometry.vertices;
			
			var arrN = plint.point;
			
			for (i3 = 0; i3 < arrN.length; i3++)
			{
				var y = v[i3].y; 
				v[i3] = crossPointTwoLine_2(new THREE.Vector3(), posW, v[i3], v[arrN[i3]])[0];		// 4.2
				v[i3].y = y;
			}		
			
			var plint = dirPlint[i][i2][2];		
			var posW = plint.worldToLocal( pos.clone() );  
			var v = plint.geometry.vertices;
			var z = v[arrN[0]].z;
			
			if(i2 == 0) { var n1 = 4; var pi = Math.PI / 2; }
			else { var n1 = walls[i].geometry.vertices.length - 6; var pi = -Math.PI / 2; }			
			var posZ = walls[i].localToWorld( walls[i].geometry.vertices[n1].clone() );
			
			for (i3 = 0; i3 < arrN.length; i3++)
			{
				var y = v[arrN[i3]].y;   
				v[arrN[i3]] = crossPointTwoLine_2(new THREE.Vector3(0, 0, z), posW, v[i3], v[arrN[i3]])[0];  // 4.2
				v[arrN[i3]].y = y;
				
				//v[arrN[i2]].z = crossPointTwoLine_2(new THREE.Vector3(0, 0, z), posW, v[i2], v[arrN[i2]])[0].z;
			}

			dirPlint[i][i2][2].geometry.verticesNeedUpdate = true; 	
			dirPlint[i][i2][2].geometry.elementsNeedUpdate = true; 	
			dirPlint[i][i2][2].geometry.computeBoundingSphere(); 
			
			dirPlint[i][i2][3].geometry.verticesNeedUpdate = true; 	
			dirPlint[i][i2][3].geometry.elementsNeedUpdate = true; 	
			dirPlint[i][i2][3].geometry.computeBoundingSphere(); 			
		}			
	}
}



function deletePlinths(floor, flag)
{
	if(!floor) return;
	
	if(floor.plinth.o) 
	{ 
		for ( var i2 = 0; i2 < floor.plinth.obj.length; i2++ ) { scene.remove(floor.plinth.obj[i2]); } 
		
		if(!flag) { floor.plinth = {o : flag, lotid : '', v : [], mat : null, obj : [], preview : '' }; }
		
		floor.plinth.o = flag; 
	}
}



