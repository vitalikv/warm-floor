<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webgl-editor</title>

  <style type="text/css">
canvas {
  background: #ffffff;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;

}
.toolbar {
  color: #4e4e55;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  display: -webkit-box;
  display: flex;
}
.toolbar ul {
  list-style: none;
  margin: none;
}
.toolbar-wrap {
  position: absolute;
  left: 0;
  width: 100%;
  display: -webkit-box;
  display: flex;
}
.toolbar__group {
  padding: 8px 7px;
  margin: 0;
  display: -webkit-box;
  display: flex;
}
.toolbar__group > li {
  position: relative;
}
.toolbar__group > li.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.button17:hover { cursor: pointer }
.button17 {
  
  font-family: arial,sans-serif;
  font-size: 11px;
  color: rgb(205,216,228);
  text-shadow: 0 -1px rgb(46,53,58);
  text-decoration: none;
  user-select: none;
  -moz-user-select: none;
  line-height: 2em;
  padding: 1px 1.2em;
  outline: none;
  border: 1px solid rgba(33,43,52,1);
  border-radius: 3px;
  background: rgb(81,92,102) linear-gradient(rgb(81,92,102), rgb(69,78,87));
  box-shadow:
   inset 0 1px rgba(101,114,126,1),
   inset 0 0 1px rgba(140,150,170,.8),
   0 1px rgb(83,94,104),
   0 0 1px rgb(86,96,106);
   
  
}
.button17:active {
  box-shadow:
   inset 0 1px 3px rgba(0,10,20,.5),
   0 1px rgb(83,94,104),
   0 0 1px rgb(86,96,106);
}
.button17:focus:not(:active) {
  border: 1px solid rgb(22,32,43);
  border-bottom: 1px solid rgb(25,34,45);
  background: rgb(53,61,71);
  box-shadow:
   inset 0 1px 3px rgba(0,10,20,.5),
   0 1px rgb(83,94,104),
   0 0 1px rgb(86,96,106);
  pointer-events: none;
}
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
    <script src="js/url-polyfill.min.js"></script>
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
	
	
	<div style="display:none">
	<div class="toolbar-wrap">
	<div class="toolbar">
	<ul class="toolbar__group">
	<li data-action ='save' class="button17">сохранить</li>
	<li data-action ='2D' class="button17">2D</li>
	<li data-action ='3D' class="button17">3D</li>
	<li data-action ='wall' class="button17">стена</li>	
	<li data-action ='window' class="button17">окно</li>
	<li data-action ='door' class="button17">дверь</li>		
	</ul>
	</div>
	</div>
	</div>
	
	<script> $('[data-action="2D"]').on('mousedown', function(e) { console.log(22);  UI.setView('2D'); return false; }); </script>	
	<script> $('[data-action="3D"]').mousedown(function () { UI.setView('3D'); return false; }); </script>	
	<script> $('[data-action="wall"]').mousedown(function () { clickO.button = 'create_wall'; return false; }); </script>	
	<script> $('[data-action="window"]').mousedown(function () { createEmptyFormWD({ lotid: 8747 }); return false; }); </script>	
	<script> $('[data-action="door"]').mousedown(function () { createEmptyFormWD({ lotid: 575 }); return false; }); </script>	
	<script> $('[data-action="save"]').mousedown(function () { saveFile(); return false; }); </script>
</body>

</html>