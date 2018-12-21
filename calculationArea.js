

// подсчитываем площадь стены
function calculationSpaceWall( wall, index )
{
	wall.updateMatrixWorld();
	
	var v = wall.userData.wall.v;		
	
	var h = v[1].y;	
	
	if(index == 1)
	{
		var x = v[v.length - 6].x - v[0].x;
	}
	else if(index == 2)
	{
		var x = v[v.length - 2].x - v[4].x;
	}	
	
	var space = Math.round((x * h) * 100) / 100;
	
	var length = x;
	var spaceArrO = 0;
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var v = wall.userData.wall.arrO[i].geometry.vertices;
		var h = v[1].y;
		var x = Math.abs(v[0].x * 2);
		spaceArrO += Math.round((x * h) * 100) / 100;
	}
	
	space = space - spaceArrO;	
	
	return { area : space, length : length }; 
}
 

 



// считаем и показываем длину стены
function upLabelPlan_1(arrWall, Zoom)
{
	
	if(Zoom){}
	else if(typeof Zoom !== "undefined") { Zoom = false; }
	
	for ( var i = 0; i < arrWall.length; i ++ )
	{
		var wall = arrWall[i];
		
		if(infProject.type == 1)
		{
			var label_1 = wall.label[0]; 
		}
		else
		{
			var label_2 = wall.label[0];
			var label_1 = wall.label[1];			
		}
		
		
		if(Zoom) { var v = wall.userData.wall.v; }		// если это zoom, то берем старые значения	
		else { var v = wall.geometry.vertices; }
		
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;
		
		
		if(!Zoom)
		{
			if(infProject.type == 1)
			{
				var dist = p1.distanceTo( p2 );			
				
				upLabelCameraWall({label : label_1, text : Math.round(dist * 100) * 10, sizeText : 85, color : 'rgba(0,0,0,1)'});
			}
			else
			{
				var v = wall.geometry.vertices;
				var d1 = Math.abs( v[6].x - v[0].x );		
				var d2 = Math.abs( v[10].x - v[4].x );

				upLabelCameraWall({label : label_1, text : Math.round(d1 * 100) * 10, sizeText : 85, color : 'rgba(0,0,0,1)'});
				upLabelCameraWall({label : label_2, text : Math.round(d2 * 100) * 10, sizeText : 85, color : 'rgba(0,0,0,1)'});				
			}			
		}		
		
		var dir = new THREE.Vector3().subVectors( p2, p1 );
		var rotY = Math.atan2(dir.x, dir.z);
		var pos = dir.divideScalar ( 2 ).add( p1 );
		
		if(rotY <= 0.001){ rotY += Math.PI / 2;  }
		else { rotY -= Math.PI / 2; }
		
		 
		var v1 = wall.label[0].geometry.vertices;
		
		var x1 = p2.z - p1.z;
		var z1 = p1.x - p2.x;		 
		 
		 
		if(infProject.type == 1)
		{
			label_1.rotation.set( 0, rotY, 0 );

			if(wall.userData.wall.room.side == 1)
			{ 
				var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z + (v1[1].z - v1[0].z) / 2 );
			}
			else
			{
				var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z - (v1[1].z - v1[0].z) / 2 );
			}
			
			dir.y = 0.05;
			label_1.position.copy( new THREE.Vector3().addVectors( pos, dir ) );				
		}
		else
		{
			label_1.rotation.set( 0, rotY, 0 );
			label_2.rotation.set( 0, rotY, 0 );

			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z - (v1[1].z - v1[0].z) / 2 );
			dir.y = 0.05;
			label_1.position.copy( new THREE.Vector3().addVectors( pos, dir ) );

			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z + (v1[1].z - v1[0].z) / 2 );
			dir.y = 0.05;
			label_2.position.copy( new THREE.Vector3().addVectors( pos, dir ) );			
		}		 


		if(!Zoom)	// если это не zoom, то обновляем значения
		{
			var v = wall.geometry.vertices; wall.geometry.verticesNeedUpdate = true;
			for ( var i2 = 0; i2 < v.length; i2++ ) { wall.userData.wall.v[i2] = v[i2].clone(); }	// обновляем vertices			
		}
		
		if(infProject.type == 2) { getWallAreaTop( wall ); }
	}
	
	

}



// подсчитваем объем у ленточного фундамента
function calculationAreaFundament_2()
{
	if(infProject.type == 2)
	{
		var sum = 0;
		for ( var i = 0; i < obj_line.length; i++ )
		{
			sum += obj_line[i].userData.wall.area.top;
		}
		
		sum = Math.round(sum * 100)/100;


		var pos = new THREE.Vector3();
		
		for (i = 0; i < obj_point.length; i++) { pos.x += obj_point[i].position.x; pos.z += obj_point[i].position.z; }				
		
		floorLabel.position.set(pos.x / obj_point.length, 0.2, pos.z / obj_point.length);		
		
		upLabelArea2(floorLabel, sum, '80', 'rgba(255,255,255,1)', true);
	}	
}



//площадь стены сверху
function getWallAreaTop( wall ) 
{	
	var res = 0;
	var v = wall.userData.wall.v; 
	
	var v = [v[0], v[6], v[8], v[10], v[4], v[2]];
	
	for (var i = 0; i < v.length - 1; i++)
	{
		var n1 = i - 1;
		var n2 = i + 1;
		
		if(i == 0) { n1 = v.length - 1; n2 = i + 1; }
		else if(i == v.length - 1) { n1 = i - 1; n2 = 0; }
		
		
		var sum = v[i].x*(v[n1].z - v[n2].z); 
		sum = Math.round(sum * 100) / 100;
		res += sum;			
	}
	
	res = Math.abs( res ) / 2;
	//res = Math.round(res * 100) / 100;			
	
	wall.userData.wall.area.top = res;
}



//площадь помещения ( номер зон получаем из массива )
function getYardageSpace( room ) 
{	
	
	
	for (var u = 0; u < room.length; u++)
	{  
		var arrW = room[u].w; 
		var arrP = room[u].p;  
		var arrS = room[u].s;
		var n = arrW.length;
		var res = 0;
		
		
		for (i = 0; i < arrW.length; i++)
		{
			var p1 = (arrS[i] == 0) ? arrW[i].userData.wall.p[0].position : arrW[i].userData.wall.p[1].position;	
			
			if (i == 0) 
			{
				var p2 = (arrS[ n-1 ] == 0) ? arrW[n-1].userData.wall.p[0].position : arrW[n-1].userData.wall.p[1].position; 
				var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position;						
			}
			else if (i == n-1) 
			{
				var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position;
				var p3 = (arrS[ 0 ] == 0) ? arrW[0].userData.wall.p[0].position : arrW[0].userData.wall.p[1].position;								
			}
			else 
			{
				var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position; 
				var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position; 						
			}
			
			var sum = p1.x*(p2.z - p3.z); 
			sum = Math.round(sum * 100) * 10;
			res += sum;				
		}
		

		
		res = Math.abs( res ) / 2;
		res = Math.round(res / 10) / 100;
		
		var sumX = 0;
		var sumZ = 0;
		for (i = 0; i < n; i++) { sumX += arrP[i].position.x; }
		for (i = 0; i < n; i++) { sumZ += arrP[i].position.z; }		
		
		
		room[u].label.position.set(sumX / n, 0.2, sumZ / n);
		
		room[u].userData.room.areaTxt = res;
		
		if(res < 0.5) { res = ''; }
		
		upLabelArea2(room[u].label, res, '80', 'rgba(255,255,255,1)', true);
		
		room[u].label.visible = true;
	}	
}



//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
function checkClockWise( arrP )
{  
	var res = 0;
	var n = arrP.length;
	
	for (i = 0; i < n; i++) 
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
	res = Math.round(res * 10) / 10;
	
	return res;
}






// room
function upLabelArea2(label, area, text2, size, color, border) 
{		
	if(!label){ return; }
	var canvs = label.material.map.image; 
	var ctx = canvs.getContext("2d");
	
	ctx.clearRect(0, 0, canvs.width, canvs.height);
	ctx.font = size + 'pt Arial';
	
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0, 0, canvs.width, canvs.height);
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);	
	
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillText('площадь : '+area+ ' m2', canvs.width / 2, canvs.height / 2 - 10 );

	ctx.fillText('объем : '+Math.round((area * height_wall) * 100) / 100 +' m3', canvs.width / 2, canvs.height / 2 + 110 );	
	
	label.material.map.needsUpdate = true;
}



 


