<? 

$url = $_SERVER['REQUEST_URI'];

$path = "/";

$title = 'калькулятор площади пола онлайн';
$type = 1;
$setting['unlock'] = '';
	
if($url == '/calculator/area_apartment')	{ $title = 'Калькулятор площади квартиры онлайн 3D'; }

if($url == '/calculator/monolit_fundament')	{ $title = 'Калькулятор монолитного фундамента 3D'; $type = 1; }
if($url == '/calculator/lentochnii_fundament')	{ $title = 'Калькулятор ленточного фундамента 3D'; $type = 2; }
if($url == '/calculator/svaynyy_fundament')	{ $title = 'Свайный фундамент калькулятор 3D'; $type = 2; $setting['unlock'] = 1; }
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
	
	var infProject = { type : <?=$type?>, title : '<?=$title?>', unlock : '<?=$setting['unlock']?>', scene : { tool : {} } };
	
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
		<div class="title_1"><h1><?=$title?></h1></div>
	</div>
	
	<!--hidden='true'-->
	<div class="left_panel_1" data-action ='left_panel_1'  >
		<div class="side_panel-camera">
			<div data-action ='2D' class="button1">2D</div>
			<div data-action ='3D' class="button1">3D</div>		
		</div> 
		<div class="side_panel-button">			
			<div class="button2" data-action ='form_1'><img src="/img/f2.png"></div>
			<div class="button2" data-action ='wall'><div class="text_1">создать<br>свою<br>форму</div></div>
		</div> 
		<?if($type == 2){?>
		<div class="input-height">
			<div class="text_1">ширина (см)</div>
			<input type="text" data-action ='input-width' value = 30>
		</div> 
		<?}?>
		<div class="input-height">
			<div class="text_1">высота (см)</div>
			<input type="text" data-action ='input-height' value = 20>
		</div> 
	</div>
	
	
	<div class="right_panel_1" data-action ='right_panel_1'>			
		<a href="<?=$path?>calculator/monolit_fundament" class="link_page_1">монолитный<br>фундамент</a>
		<a href="<?=$path?>calculator/lentochnii_fundament" class="link_page_1">ленточный<br>фундамент</a>
		<a href="<?=$path?>calculator/svaynyy_fundament" class="link_page_1">свайный<br>фундамент</a>
	</div>	
	
	
	
	<div class="modal" data-action ='modal'>
		<div class="modal_wrap">
			<div class="modal_window" data-action ='modal_window'>
				<div class="modal_window_close" data-action ='modal_window_close'>
					+
				</div>
				<div class="modal_header">
					<div class="modal_title">
						<div class="modal_name">
							Выберете форму 
						</div>
					</div>					
				</div>
				<div class='modal_body'>
					<div class='modal_body_content'>
						<div class='modal_body_content_grid'>
						<?
							for ($i=0; $i<6; $i++) 
							{
								echo '
								<div class="block_form_1" link_form = "'.($i+1).'">
									<div class="block_form_1_image_wrap">
										<img src="/img/f1.png">
									</div>
									<div class="block_form_1_desc">
										форма '.($i+1).'
									</div>
								</div>';
							}
						?>
						</div>
					</div>
				</div>
				<div class='modal_footer'>
				</div>
			</div>			
		</div>	
	</div>
	
	<script>
		$('[data-action="top_panel_1"]').mousedown(function () { clickInterface(); return false; });
		$('[data-action="left_panel_1"]').mousedown(function () { clickInterface(); return false; });
		
		$('[data-action="2D"]').on('mousedown', function(e) { clickInterface(); UI.setView('2D'); return false; }); 	
		$('[data-action="3D"]').mousedown(function () { clickInterface(); UI.setView('3D'); return false; }); 	
		$('[data-action="wall"]').mousedown(function () { clickInterface(); clickO.button = 'create_wall'; return false; }); 		
		//$('[data-action="save"]').mousedown(function () { saveFile(); return false; }); 		
		//$('[data-action="form_0"]').mousedown(function () { clickInterface(); resetScene(); }); 
		$('[link_form]').mousedown(function () 
		{ 
			createForm({form : 'shape'+$(this).attr("link_form")}); 
			$('[data-action="modal"]').css({"display":"none"}); 
		}); 
		
		$('[data-action="input-width"]').mousedown(function () { $(this).focus(); UI.activeInput = $(this).data('action'); editText($(this)); });  
		$('[data-action="input-height"]').mousedown(function () { $(this).focus(); UI.activeInput = $(this).data('action'); editText($(this)); });

		$('input').on('focus', function () {  });
		$('input').on('focus keyup change', function () { UI.activeInput = $(this).data('action'); });
		$('input').blur(function () { UI.activeInput = ''; });	

		$('[data-action="form_1"]').mousedown(function () 
		{ 
			clickInterface();
			$('.modal').css({"display":"block"});
		});
		
		$('[data-action="modal_window"]').mousedown(function () { return false; });		
		
		$('[data-action="modal"]').mousedown(function () { clickInterface(); $('[data-action="modal"]').css({"display":"none"}); });			
		$('[data-action="modal_window_close"]').mousedown(function () { $('[data-action="modal"]').css({"display":"none"}); });
  
  
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