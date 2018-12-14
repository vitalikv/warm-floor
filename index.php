<? 

$url = $_SERVER['REQUEST_URI'];

$path = "/";

$title = 'калькулятор площади пола онлайн';
$type = 1;
	
if($url == '/calculator/area_apartment')	{ $title = 'калькулятор площади квартиры онлайн 3D'; }
if($url == '/calculator/lentochnii_fundament')	{ $title = 'калькулятор ленточного фундамента 3D'; $type = 2; }
if($url == '/calculator/monolit_fundament')	{ $title = 'калькулятор монолитного фундамента 3D'; }
?>


<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$title?></title>

	<link rel="stylesheet" href="<?=$path?>css/style.css"> 
</head>

<body>


  <?php $vrs = '=1' ?>
	
    <script>
	var vr = "<?=$vrs ?>";
	
	var infProject = { type : <?=$type?> };
	
	console.log('version '+ vr);
    console.log('infProject ', infProject);
	
    </script>
    <script src="<?=$path?>js/three.min.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/jquery.js"></script>
    <script src="<?=$path?>js/ThreeCSG.js"></script>       
    
    <script src="<?=$path?>calculationArea.js?<?=$vrs?>"></script>
    
    <script src="<?=$path?>crossWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>addPoint.js?<?=$vrs?>"></script>
    <script src="<?=$path?>addWindowDoor.js?<?=$vrs?>"></script>
    <script src="<?=$path?>mouseClick.js?<?=$vrs?>"></script>
	<script src="<?=$path?>changeCamera.js?<?=$vrs?>"></script>
    <script src="<?=$path?>moveCamera.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickChangeWD.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMovePoint.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMoveWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMoveWD.js?<?=$vrs?>"></script>
    <script src="<?=$path?>deleteObj.js?<?=$vrs?>"></script>
    <script src="<?=$path?>floor.js?<?=$vrs?>"></script>
    <script src="<?=$path?>detectZone.js?<?=$vrs?>"></script>
	

    <script src="<?=$path?>inputWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>label.js?<?=$vrs?>"></script>
  	<script src="<?=$path?>loadPopObj.js?<?=$vrs?>"></script>
	
	<script src="<?=$path?>clickActiveObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>activeHover2D.js?<?=$vrs?>"></script>
    
    <script src="<?=$path?>undoRedo.js?<?=$vrs?>"></script>
    <script src="<?=$path?>saveLoad.js?<?=$vrs?>"></script>
		
	
    <script src="<?=$path?>script.js?<?=$vrs?>"></script>
    	
	<script src="<?=$path?>eventKey.js?<?=$vrs?>"></script>
	

	<script src="<?=$path?>js/ui.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/postmessage.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/overlay.js?<?=$vrs?>"></script>
	
	
	
	<div class="top_panel_1" data-action ='top_panel_1'>
		<div class="input-height">
			<div class="text_1">объем</div>
			<input type="text" data-action ='input-height' value = 0.2>
		</div> 	
	</div>
	
	
	<div class="side_panel" data-action ='side_panel' hidden='true'>
		<div class="side_panel-camera">
			<div data-action ='2D' class="button1">2D</div>
			<div data-action ='3D' class="button1">3D</div>		
		</div> 
		<div class="side_panel-button">			
			<div class="button2" data-action ='form_0'><img src="/img/f0.png"></div>
			<div class="button2" data-action ='form_1'><img src="/img/f1.png"></div>
			<div class="button2" data-action ='form_2'><img src="/img/f2.png"></div>
			<div class="button2" data-action ='form_3'><img src="/img/f3.png"></div>	
			<div class="button3" data-action ='wall'>создать<br>свою<br>форму</div>
		</div> 
		<div class="input-height">
			<div class="text_1">высота</div>
			<input type="text" data-action ='input-height' value = 0.2>
		</div> 
	</div>
	
	
	<div class="left_panel_1" data-action ='left_panel_1'>			
		<a href="<?=$path?>calculator/lentochnii_fundament" class="link_page_1">калькулятор<br>ленточного<br>фундамента</a>
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