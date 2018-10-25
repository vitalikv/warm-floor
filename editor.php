<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webgl-editor</title>
  
  <link rel="stylesheet" href="css/style.css">

  <style type="text/css">

  </style>  
</head>

<body>



  <?php $vrs = '=48' ?>
	
    <script>
	var vr = "<?=$vrs ?>";
	console.log('version '+ vr);
      if (window.parent === window) window.stop();
    </script>
    <script src="js/three.min.js?<?=$vrs?>"></script>
    <script src="js/jquery.js"></script>
    <script src="js/ThreeCSG.js"></script>    
    
    <script src="stats.min.js?<?=$vrs?>"></script>
    <script src="units.js?<?=$vrs?>"></script>
    <script src="rulerWin.js?<?=$vrs?>"></script>
    
    <script src="calculationArea.js?<?=$vrs?>"></script>
    
    <script src="crossWall.js?<?=$vrs?>"></script>
    <script src="addPoint.js?<?=$vrs?>"></script>
    <script src="addWindowDoor.js?<?=$vrs?>"></script>
    <script src="mouseClick.js?<?=$vrs?>"></script>
	<script src="changeCamera.js?<?=$vrs?>"></script>
    <script src="moveCamera.js?<?=$vrs?>"></script>
    <script src="clickChangeWD.js?<?=$vrs?>"></script>
    <script src="clickMovePoint.js?<?=$vrs?>"></script>
    <script src="clickMoveWall.js?<?=$vrs?>"></script>
    <script src="clickMoveWD.js?<?=$vrs?>"></script>
    <script src="deleteObj.js?<?=$vrs?>"></script>
    <script src="floor.js?<?=$vrs?>"></script>
    <script src="detectZone.js?<?=$vrs?>"></script>
	

    <script src="inputWall.js?<?=$vrs?>"></script>
    <script src="dragWindowDoorUI.js?<?=$vrs?>"></script>
    
  	<script src="loadPopObj.js?<?=$vrs?>"></script>
	
	<script src="clickActiveObj.js?<?=$vrs?>"></script>
	<script src="activeHover2D.js?<?=$vrs?>"></script>
    
    <script src="undoRedo.js?<?=$vrs?>"></script>
    <script src="saveLoad.js?<?=$vrs?>"></script>
	
	
	<script src="posLabelRoom.js?<?=$vrs?>"></script>
	
	
    <script src="script.js?<?=$vrs?>"></script>
    	
	<script src="eventKey.js?<?=$vrs?>"></script>
	

	<script src="js/ui.js?<?=$vrs?>"></script>
    <script src="js/postmessage.js?<?=$vrs?>"></script>
    <script src="js/overlay.js?<?=$vrs?>"></script>
	
	
	
	<div class="toolbar-wrap">
	<div class="toolbar">
	<ul class="toolbar__group">
	<li data-action ='save' class="button17">сохранить</li>
	<li data-action ='2D' class="button17">2D</li>
	<li data-action ='3D' class="button17">3D</li>
	<li data-action ='wall' class="button17">стена</li>	
	<li data-action ='height-wall' class="button17">высота</li>	
	</ul>
	</div>
	</div>
	
	<div class="side_panel" data-action ='side_panel'>
		<div class="side_panel-button">
			<div class="button2" data-action ='form_1'> </div>
			<div class="button2" data-action ='form_2'> </div>
			<div class="button2" data-action ='form_3'> </div>							
		</div> 
		<div class="input-height">
			<input type="text" data-action ='input-height'>
		</div> 
	</div>
	
	<script>
	
		$('[data-action="2D"]').on('mousedown', function(e) { UI.setView('2D'); return false; }); 	
		$('[data-action="3D"]').mousedown(function () { UI.setView('3D'); return false; }); 	
		$('[data-action="wall"]').mousedown(function () { clickO.button = 'create_wall'; return false; }); 	
		$('[data-action="window"]').mousedown(function () { createEmptyFormWD({ lotid: 8747 }); return false; }); 	
		$('[data-action="door"]').mousedown(function () { createEmptyFormWD({ lotid: 575 }); return false; }); 	
		$('[data-action="save"]').mousedown(function () { saveFile(); return false; }); 
		$('[data-action="side_panel"]').mousedown(function () { return false; }); 
		$('[data-action="form_1"]').mousedown(function () { createForm('shape1'); }); 
		$('[data-action="form_2"]').mousedown(function () { createForm('shape3'); }); 
		$('[data-action="form_3"]').mousedown(function () { createForm('shape5'); }); 
		$('[data-action="input-height"]').mousedown(function () { $(this).focus(); });  


		$('input').on('focus keyup change', function () { UI.activeInput = $(this).data('action'); });
		$('input').blur(function () { UI.activeInput = ''; });		
	
	</script> 
</body>

</html>