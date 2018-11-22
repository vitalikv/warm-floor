<? 

$url = $_SERVER['REQUEST_URI'];
$title = 'калькулятор площади пола онлайн';
	
if($url == '/calculator/area_apartment')	{ $title = 'калькулятор площади квартиры онлайн 3D'; }
?>


<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$title?></title>

	<link rel="stylesheet" href="css/style.css"> 
</head>

<body>


  <?php $vrs = '=1' ?>
	
    <script>
	var vr = "<?=$vrs ?>";
	console.log('version '+ vr);
      
    </script>
    <script src="js/three.min.js?<?=$vrs?>"></script>
    <script src="js/jquery.js"></script>
    <script src="js/ThreeCSG.js"></script>       
    
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
    
  	<script src="loadPopObj.js?<?=$vrs?>"></script>
	
	<script src="clickActiveObj.js?<?=$vrs?>"></script>
	<script src="activeHover2D.js?<?=$vrs?>"></script>
    
    <script src="undoRedo.js?<?=$vrs?>"></script>
    <script src="saveLoad.js?<?=$vrs?>"></script>
		
	
    <script src="script.js?<?=$vrs?>"></script>
    	
	<script src="eventKey.js?<?=$vrs?>"></script>
	

	<script src="js/ui.js?<?=$vrs?>"></script>
    <script src="js/postmessage.js?<?=$vrs?>"></script>
    <script src="js/overlay.js?<?=$vrs?>"></script>
	
	
	
	
	<div class="side_panel" data-action ='side_panel'>
		<div class="side_panel-camera">
			<div data-action ='2D' class="button1">2D</div>
			<div data-action ='3D' class="button1">3D</div>		
		</div> 
		<div class="side_panel-button">			
			<div class="button2" data-action ='form_0'><img src="img/f0.png"></div>
			<div class="button2" data-action ='form_1'><img src="img/f1.png"></div>
			<div class="button2" data-action ='form_2'><img src="img/f2.png"></div>
			<div class="button2" data-action ='form_3'><img src="img/f3.png"></div>	
			<div class="button3" data-action ='wall'>создать<br>свою<br>форму</div>
		</div> 
		<div class="input-height">
			<div class="text_1">высота</div>
			<input type="text" data-action ='input-height' value = 0.2>
		</div> 
	</div>
	
	<script>
	
		$('[data-action="2D"]').on('mousedown', function(e) { UI.setView('2D'); return false; }); 	
		$('[data-action="3D"]').mousedown(function () { UI.setView('3D'); return false; }); 	
		$('[data-action="wall"]').mousedown(function () { clickO.button = 'create_wall'; return false; }); 		
		$('[data-action="save"]').mousedown(function () { saveFile(); return false; }); 
		$('[data-action="side_panel"]').mousedown(function () { return false; });
		$('[data-action="form_0"]').mousedown(function () { resetScene(); }); 
		$('[data-action="form_1"]').mousedown(function () { createForm('shape1'); }); 
		$('[data-action="form_2"]').mousedown(function () { createForm('shape3'); }); 
		$('[data-action="form_3"]').mousedown(function () { createForm('shape5'); }); 
		$('[data-action="input-height"]').mousedown(function () { $(this).focus(); UI.activeInput = $(this).data('action'); editText($(this)); });  


		$('input').on('focus', function () {  });
		$('input').on('focus keyup change', function () { UI.activeInput = $(this).data('action'); });
		$('input').blur(function () { UI.activeInput = ''; });		
  
  
  
  function editText(input) {
    console.log(input[0])
    let length = input[0].value.toString().length
    input[0].setSelectionRange(0, length);
  }	
	</script> 

</body>

<? if($_SERVER['SERVER_NAME']=='remstok.ru') {?>
	<script>console.log('Start Metrika', window.location.hostname)</script>
	<!-- Yandex.Metrika counter --><script type="text/javascript">(function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter11007949 = new Ya.Metrika({id:11007949, webvisor:true, clickmap:true, trackLinks:true, accurateTrackBounce:true}); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");</script><noscript><div><img src="//mc.yandex.ru/watch/11007949" style="position:absolute; left:-9999px;" alt="" /></div></noscript><!-- /Yandex.Metrika counter -->
<?}else{?>
	<script>
	console.log('Stop Metrika', window.location.hostname);
	console.log("<?echo $url?>");
	console.log("<?echo $title?>");
	</script> 
<?}?>

</html>