<? 




$array = json_decode($_POST['myarray'], true); 

$height_wall = floatToInt( $array['height_wall']);

$xml=new DomDocument('1.0','utf-8');
$v1 = $xml->appendChild($xml->createElement('CommonFlatConf'));
$v2 = $v1->appendChild($xml->createElement('floors'));
$v3 = $v2->appendChild($xml->createElement('PFloor'));
$v3->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($array['levelFloor']));
$v4 = $v3->appendChild($xml->createElement('points'));

for ($i = 0; $i < count($array['point']); $i++) 
{
	$v5 = $v4->appendChild($xml->createElement('PPoint'));
	$v5->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($array['point'][$i]['id']));
	$v6 = $v5->appendChild($xml->createElement('pos'));
	$v6->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($array['point'][$i]['pos']['x']) )); 
	$v6->appendChild($xml->createElement('z'))->appendChild($xml->createTextNode( floatToInt($array['point'][$i]['pos']['z']) ));
	$v5->appendChild($xml->createElement('height'))->appendChild($xml->createTextNode( $height_wall ));
}

$v7 = $v3->appendChild($xml->createElement('walls'));

for ($i = 0; $i < count($array['walls']); $i++) 
{
	$v8 = $v7->appendChild($xml->createElement('PWall'));
	$v8->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($array['walls'][$i]['id']));
	$v8->appendChild($xml->createElement('pointStart'))->appendChild($xml->createTextNode($array['walls'][$i]['points'][0]));
	$v8->appendChild($xml->createElement('pointEnd'))->appendChild($xml->createTextNode($array['walls'][$i]['points'][1]));
	$v8->appendChild($xml->createElement('width'))->appendChild($xml->createTextNode( floatToInt($array['walls'][$i]['width']) ));
	$v8->appendChild($xml->createElement('height'))->appendChild($xml->createTextNode( floatToInt($array['walls'][$i]['height']) ));
	$v8->appendChild($xml->createElement('splinePoint'))->appendChild($xml->createTextNode(''));
		
	$v10 = $v8->appendChild($xml->createElement('startShift'));
	$v11 = $v8->appendChild($xml->createElement('endShift'));
	
	if(empty($array['walls'][$i]['offsetZ'])) 
	{ 
		$v10->appendChild($xml->createTextNode(''));
		$v11->appendChild($xml->createTextNode(''));
	}
	else 
	{
		$v10 ->appendChild($xml->createElement('x'))-> appendChild($xml->createTextNode( floatToInt($array['walls'][$i]['offsetZ']['x']) )); 
		$v10 ->appendChild($xml->createElement('z'))-> appendChild($xml->createTextNode( floatToInt($array['walls'][$i]['offsetZ']['z']) ));
		$v11 ->appendChild($xml->createElement('x'))-> appendChild($xml->createTextNode( floatToInt($array['walls'][$i]['offsetZ']['x']) ));
		$v11 ->appendChild($xml->createElement('z'))-> appendChild($xml->createTextNode( floatToInt($array['walls'][$i]['offsetZ']['z']) ));		
	} 
	
	
	$windows = $array['walls'][$i]['windows'];
	
	if(count($windows) > 0){ $v9 = $v8->appendChild($xml->createElement('windows')); }
	
	for ($i2 = 0; $i2 < count($windows); $i2++)
	{
		$v10 = $v9->appendChild($xml->createElement('PWindow'));
		$v10->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($windows[$i2]['id']));
		$v10->appendChild($xml->createElement('lotid'))->appendChild($xml->createTextNode($windows[$i2]['lotid']));
		$v10->appendChild($xml->createElement('width'))->appendChild($xml->createTextNode( floatToInt($windows[$i2]['width'])) );
		$v10->appendChild($xml->createElement('height'))->appendChild($xml->createTextNode( floatToInt($windows[$i2]['height'])) );
		$v10->appendChild($xml->createElement('startPointDist'))->appendChild($xml->createTextNode( floatToInt($windows[$i2]['startPointDist'])) );
		$v10->appendChild($xml->createElement('over_floor'))->appendChild($xml->createTextNode( floatToInt($windows[$i2]['over_floor'])) );
	}
	
	
	$doors = $array['walls'][$i]['doors'];
	
	if(count($doors) > 0){ $v9 = $v8->appendChild($xml->createElement('doors')); }
	
	for ($i2 = 0; $i2 < count($doors); $i2++)
	{
		$v10 = $v9->appendChild($xml->createElement('PDoor'));
		$v10->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($doors[$i2]['id']));
		$v10->appendChild($xml->createElement('lotid'))->appendChild($xml->createTextNode($doors[$i2]['lotid']));
		$v10->appendChild($xml->createElement('width'))->appendChild($xml->createTextNode( floatToInt($doors[$i2]['width'])) );
		$v10->appendChild($xml->createElement('height'))->appendChild($xml->createTextNode( floatToInt($doors[$i2]['height'])) );
		$v10->appendChild($xml->createElement('startPointDist'))->appendChild($xml->createTextNode( floatToInt($doors[$i2]['startPointDist'])) );
		$v10->appendChild($xml->createElement('over_floor'))->appendChild($xml->createTextNode( floatToInt($doors[$i2]['over_floor'])) );		
		$v10->appendChild($xml->createElement('doState'))->appendChild($xml->createTextNode( $doors[$i2]['doState']) );
		
		if(isset($doors[$i2]['open_type']))
		{
			$v10->appendChild($xml->createElement('open_type'))->appendChild($xml->createTextNode( $doors[$i2]['open_type']) );
		}
		if($doors[$i2]['options'] != '')
		{
			$v10->appendChild($xml->createElement('options'))->appendChild($xml->createTextNode($doors[$i2]['options']));
		}
	}	

	$v9 = $v8->appendChild($xml->createElement('colors'));
	
	$mat = $array['walls'][$i]['material'];
	
	for ($i2 = 0; $i2 < count($mat); $i2++)
	{
		$v10 = $v9->appendChild($xml->createElement('PSurface')); 
		
		$v10->appendChild($xml->createElement('containerID'))->appendChild($xml->createTextNode($mat[$i2]['containerID']));		
		$v10->appendChild($xml->createElement('lot'))->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($mat[$i2]['lotid']));
		
		$v11 = $v10->appendChild($xml->createElement('matMod'));
		
		$v12 = $v11->appendChild($xml->createElement('colorsets'))->appendChild($xml->createElement('PColorSet'))->appendChild($xml->createElement('color'));
		$v12->appendChild($xml->createElement('r'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['r']) ));
		$v12->appendChild($xml->createElement('g'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['g']) ));
		$v12->appendChild($xml->createElement('b'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['b']) ));
		$v12->appendChild($xml->createElement('a'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['a']) ));
		
		$v12 = $v11->appendChild($xml->createElement('texScale'));
		$v12->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['scale']['x']) ));
		$v12->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['scale']['y']) ));
		
		if(isset($mat[$i2]['offset']))
		{
			$v12 = $v11->appendChild($xml->createElement('texOffset'));
			$v12->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['offset']['x']) ));
			$v12->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['offset']['y']) ));			
		}
		
		if(isset($mat[$i2]['rot']))
		{
			$v11->appendChild($xml->createElement('mapingRotate'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['rot']) ));
		}		
	}	
}


if(count($array['obj']) > 0){ $v7 = $v3->appendChild($xml->createElement('furn')); }

for ($i = 0; $i < count($array['obj']); $i++)
{
	$v10 = $v7->appendChild($xml->createElement('PFurniture'));
	$v10->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($array['obj'][$i]['id']));
	$v10->appendChild($xml->createElement('lotid'))->appendChild($xml->createTextNode($array['obj'][$i]['lotid']));
	
	$v11 = $v10->appendChild($xml->createElement('pos'));
	$v11->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['pos']['x']) ));  
	$v11->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['pos']['y']) ));
	$v11->appendChild($xml->createElement('z'))->appendChild($xml->createTextNode( floatToInt(-$array['obj'][$i]['pos']['z']) ));
		
	$v11 = $v10->appendChild($xml->createElement('overFloor'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['pos']['y']) ));
	
	$v11 = $v10->appendChild($xml->createElement('rot'));
	$v11->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['rot']['x']) ));
	$v11->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['rot']['y']) ));
	$v11->appendChild($xml->createElement('z'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['rot']['z']) ));
	
	$v11 = $v10->appendChild($xml->createElement('size')); 
	$v11->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['size']['x']) ));
	$v11->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['size']['y']) ));
	$v11->appendChild($xml->createElement('z'))->appendChild($xml->createTextNode( floatToInt($array['obj'][$i]['size']['z']) ));

	
	$v11 = $v10->appendChild($xml->createElement('colors'));
	
	$mat = $array['obj'][$i]['material'];
	
	for ($i2 = 0; $i2 < count($mat); $i2++)
	{
		$v12 = $v11->appendChild($xml->createElement('PSurface')); 
		
		$v12->appendChild($xml->createElement('containerID'))->appendChild($xml->createTextNode($mat[$i2]['containerID']));		
		$v12->appendChild($xml->createElement('lot'))->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($mat[$i2]['lotid']));
		
		$v13 = $v12->appendChild($xml->createElement('matMod'));
		
		$v14 = $v13->appendChild($xml->createElement('colorsets'))->appendChild($xml->createElement('PColorSet'))->appendChild($xml->createElement('color'));
		$v14->appendChild($xml->createElement('r'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['r']) ));
		$v14->appendChild($xml->createElement('g'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['g']) ));
		$v14->appendChild($xml->createElement('b'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['b']) ));
		$v14->appendChild($xml->createElement('a'))->appendChild($xml->createTextNode( floatToInt(1) ));
		
		$v14 = $v13->appendChild($xml->createElement('texScale'));
		$v14->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['scale']['x']) ));
		$v14->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['scale']['y']) ));
	}	
}



if(count($array['room']) > 0){ $v7 = $v3->appendChild($xml->createElement('rooms')); }

for ($i = 0; $i < count($array['room']); $i++)
{
	$v10 = $v7->appendChild($xml->createElement('PRoom'));
	$v10->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($array['room'][$i]['id']));
	$v10->appendChild($xml->createElement('name'))->appendChild($xml->createTextNode($array['room'][$i]['name']));
	$v10->appendChild($xml->createElement('roomSType'))->appendChild($xml->createTextNode( $array['room'][$i]['type'] ) );  
	
	$v11 = $v10->appendChild($xml->createElement('pointid'));
	
	for ($i2 = 0; $i2 < count($array['room'][$i]['point']) - 1; $i2++)
	{
		$v11->appendChild($xml->createElement('int'))->appendChild($xml->createTextNode($array['room'][$i]['point'][$i2])); 
	}
	
	if($array['room'][$i]['plinth'] != -1)
	{
		$v11 = $v10->appendChild($xml->createElement('plinthLot'));
		$v11->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($array['room'][$i]['plinth']));
	}
	
	$v11 = $v10->appendChild($xml->createElement('colors'));
	
	$mat = $array['room'][$i]['material'];
	
	for ($i2 = 0; $i2 < count($mat); $i2++)
	{
		$v12 = $v11->appendChild($xml->createElement('PSurface')); 
		
		$v12->appendChild($xml->createElement('containerID'))->appendChild($xml->createTextNode($mat[$i2]['containerID']));		
		$v12->appendChild($xml->createElement('lot'))->appendChild($xml->createElement('id'))->appendChild($xml->createTextNode($mat[$i2]['lotid']));
		
		$v13 = $v12->appendChild($xml->createElement('matMod'));
		
		$v14 = $v13->appendChild($xml->createElement('colorsets'))->appendChild($xml->createElement('PColorSet'))->appendChild($xml->createElement('color'));
		$v14->appendChild($xml->createElement('r'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['r']) ));
		$v14->appendChild($xml->createElement('g'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['g']) ));
		$v14->appendChild($xml->createElement('b'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['b']) ));
		$v14->appendChild($xml->createElement('a'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['color']['a']) ));
		
		$v14 = $v13->appendChild($xml->createElement('texScale'));
		$v14->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['scale']['x']) ));
		$v14->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['scale']['y']) ));
		
		
		if(isset($mat[$i2]['offset']))
		{
			$v14 = $v13->appendChild($xml->createElement('texOffset'));
			$v14->appendChild($xml->createElement('x'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['offset']['x']) ));
			$v14->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['offset']['y']) ));			
		}		
		
		if(isset($mat[$i2]['rot']))
		{
			$v13->appendChild($xml->createElement('mapingRotate'))->appendChild($xml->createTextNode( floatToInt($mat[$i2]['rot']) ));
		}		
	}
}

//var_dump($array['room']);

$v3->appendChild($xml->createElement('height'))->appendChild($xml->createTextNode( $height_wall ));
$v3->appendChild($xml->createElement('startWalkPosition'))->appendChild($xml->createTextNode(''));
$v3->appendChild($xml->createElement('startWalkRotation'))->appendChild($xml->createTextNode(''));
$v3->appendChild($xml->createElement('name'))->appendChild($xml->createTextNode('Этаж 1'));


$v11 = $v1->appendChild($xml->createElement('settings'));
$v11->appendChild($xml->createElement('projName'))->appendChild($xml->createTextNode($array['projName']));
$v11->appendChild($xml->createElement('autosave'))->appendChild($xml->createTextNode('true'));
$v11->appendChild($xml->createElement('asTimeInterval'))->appendChild($xml->createTextNode('1114636288'));
$v11->appendChild($xml->createElement('showHints'))->appendChild($xml->createTextNode('true'));
$v11->appendChild($xml->createElement('lastSaveTime'))->appendChild($xml->createTextNode('1499434303'));



$v1->appendChild($xml->createElement('editedFloorid'))->appendChild($xml->createTextNode('9'));
$v1->appendChild($xml->createElement('sunRotation'))->appendChild($xml->createTextNode(''));
$v1->appendChild($xml->createElement('version'))->appendChild($xml->createTextNode($array['version']));
$v1->appendChild($xml->createElement('PNorthDir'))->appendChild($xml->createTextNode('0'));
$v1->appendChild($xml->createElement('sunIntensity'))->appendChild($xml->createTextNode('1028443341'));
$v1->appendChild($xml->createElement('camHeightinWalk'))->appendChild($xml->createTextNode('0'));
$v1->appendChild($xml->createElement('projectState'))->appendChild($xml->createTextNode('1'));

$v12 = $v1->appendChild($xml->createElement('camera2DPosition'));
$v12->appendChild($xml->createElement('y'))->appendChild($xml->createTextNode('1091865515'));
$v12->appendChild($xml->createElement('z'))->appendChild($xml->createTextNode('856829496'));
	
$v1->appendChild($xml->createElement('camera2DZoom'))->appendChild($xml->createTextNode('1082130432'));
	



$xml->formatOutput = true;
$xml->save('t/planoplan_4.xml');   //сохранение файла в папку

$file = $xml->saveXML();



//$actual_link = 'https://planoplan.com/ru/view/getProjectData/?id=d408576f3d11a6df697c327a9f4535e0';
$actual_link = $_POST['url'];
$parts = parse_url($actual_link);
parse_str($parts['query'], $query);
		
 
//echo json_encode(array('855554', unpack('C*', $file), md5($file)));
echo json_encode(array($query['id'], $file, md5($file)));






// converter ---------------------




function floatToInt($float)
{
	// binary from float
	$bin2 = floatToBinStr($float);

	// integer from  binary
	$intFromBin = bindec($bin2);  
	$intFromBin = intval32bits($intFromBin);		

	return $intFromBin;
}


// конверитруем в 32бит версию
function intval32bits($value)
{
    $value = ($value & 0xFFFFFFFF);
    if ($value & 0x80000000)
        $value = -((~$value & 0xFFFFFFFF) + 1);
    return $value;
}


// float to binary
function floatToBinStr($value) {
   $bin = '';
    $packed = pack('f', $value); // use 'f' for 32 bit
    foreach(str_split(strrev($packed)) as $char) {
        $bin .= str_pad(decbin(ord($char)), 8, 0, STR_PAD_LEFT);
    }
    return $bin;
}




// binary to float
function binToFloat($bin) {
	if(strlen($bin) > 32) {
		return false;
	} else if(strlen($bin) < 32) {
		$bin = str_repeat('0', (32 - strlen($bin))) . $bin;
	}

	$sign = 1;
	if(intval($bin[0]) == 1) {
		$sign = -1;
	}

	$binExponent = substr($bin, 1, 8);
	$exponent = -127;
	for($i = 0; $i < 8; $i++) {
		$exponent += (intval($binExponent[7 - $i]) * pow(2, $i));
	}

	$binBase = substr($bin, 9);           
	$base = 1.0;
	for($x = 0; $x < 23; $x++) {
		$base += (intval($binBase[$x]) * pow(0.5, ($x + 1)));
	}

	$float = (float) $sign * pow(2, $exponent) * $base;

	return $float;
} 



