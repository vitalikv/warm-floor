<?


 
$arr = array();

$file = 't/planoplan_4.xml'; 

if(!empty($_POST['file'])) 
{ 
	$file = $_POST['file'];
	$code_server = get_http_response_code($file); 
}
else
{
	$code_server = 200;
}



// ��� ������ ������� 
function get_http_response_code($theURL) 
{
	$headers = get_headers($theURL);
	return substr($headers[0], 9, 3);
}




if($code_server != 200)
{
	$arr["code_server"] = $code_server;
	
	echo json_encode($arr);
	return;
}

$file = file_get_contents($file);
$file = preg_replace('/[\x00-\x1F\x7F-\xFF]/','',$file);


$xml = simplexml_load_string($file, "SimpleXMLElement", LIBXML_NOCDATA);
//$xml = simplexml_load_string(file_get_contents('https://planoplan.com/upload/projects/files/planoplan/201707/48b84803.u3d'));
//$xml = simplexml_load_string(file_get_contents('https://planoplan.com/view/getProjectData/?id=e889d8b866478468770546dcd2c2c0fc'));
$xml = json_decode( json_encode($xml) , true);


$arr["points"] = array();
$arr["walls"] = array();
$arr["rooms"] = array();
$arr["furn"] = array();



if($xml["floors"]["PFloor"]["points"])
{
	$point = $xml["floors"]["PFloor"]["points"]["PPoint"];
	for ($i = 0; $i < count($point); $i++) 
	{
		$arr["points"][$i]["id"] = $point[$i]["id"];
		$arr["points"][$i]["pos"]["x"] = intToFloat($point[$i]["pos"]["x"]); 
		$arr["points"][$i]["pos"]["z"] = intToFloat($point[$i]["pos"]["z"]);	
	}


	$wall = $xml["floors"]["PFloor"]["walls"]["PWall"];
	if(!isset($wall[0]["id"])) 
	{ 
		$w = $wall;
		$wall = array();
		$wall[0] = $w;		
	}

	 
	for ($i = 0; $i < count($wall); $i++) 
	{	
		$arr["walls"][$i]["id"] = $wall[$i]["id"];
		$arr["walls"][$i]["pointStart"] = $wall[$i]["pointStart"];
		$arr["walls"][$i]["pointEnd"] = $wall[$i]["pointEnd"];
		$arr["walls"][$i]["width"] = intToFloat($wall[$i]["width"]);
		$arr["walls"][$i]["height"] = intToFloat($wall[$i]["height"]);
		
		$arr["walls"][$i]["startShift"]["x"] = (isset($wall[$i]["startShift"]["x"])) ? intToFloat($wall[$i]["startShift"]["x"]) : 0;
		$arr["walls"][$i]["startShift"]["z"] = (isset($wall[$i]["startShift"]["z"])) ? intToFloat($wall[$i]["startShift"]["z"]) : 0;	
		
		
		$psurface = $wall[$i]["colors"]["PSurface"];
		
		$arr["walls"][$i]["colors"] = array();		
		
		
		for ($i2 = 0; $i2 < count($psurface); $i2++)
		{			
			$arr["walls"][$i]["colors"][$i2]["containerID"] = $psurface[$i2]["containerID"];
			if(isset($psurface[$i2]["lot"]["id"])) { $arr["walls"][$i]["colors"][$i2]["lot"]["id"] = $psurface[$i2]["lot"]["id"]; } 			
			
			$color = $psurface[$i2]["matMod"]["colorsets"]["PColorSet"]["color"];
			
			if(isset($color))
			{
				$arr["walls"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["r"] = intToFloat($color["r"]);
				$arr["walls"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["g"] = intToFloat($color["g"]);
				$arr["walls"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["b"] = intToFloat($color["b"]);
				$arr["walls"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["a"] = intToFloat($color["a"]);
			}
			
			$color = $psurface[$i2]["matMod"]["texScale"];
			
			if(isset($color))
			{
				$arr["walls"][$i]["colors"][$i2]["matMod"]["texScal"]["x"] = intToFloat($color["x"]);
				$arr["walls"][$i]["colors"][$i2]["matMod"]["texScal"]["y"] = intToFloat($color["y"]);
			}
			
			$color = $psurface[$i2]["matMod"]["texOffset"];
			
			if(isset($color))
			{
				$arr["walls"][$i]["colors"][$i2]["matMod"]["texOffset"]["x"] = (isset($color["x"])) ? intToFloat($color["x"]) : 0; 
				$arr["walls"][$i]["colors"][$i2]["matMod"]["texOffset"]["y"] = (isset($color["y"])) ? intToFloat($color["y"]) : 0; 
			}			

			$color = $psurface[$i2]["matMod"]["mapingRotate"];
			
			if(isset($color))
			{
				$arr["walls"][$i]["colors"][$i2]["matMod"]["mapingRotate"] = intToFloat($color); 
			}			
		}		
				
		
		$arr["walls"][$i]["doors"] = array();
		$arr["walls"][$i]["windows"] = array();
		
		if($wall[$i]["doors"])
		{
			if(!isset($wall[$i]["doors"]["PDoor"][0]["startPointDist"])) 
			{ 
				$w = $wall[$i]["doors"]["PDoor"];
				$wall[$i]["doors"]["PDoor"] = array();
				$wall[$i]["doors"]["PDoor"][0] = $w;
			}
			
			for ($i2 = 0; $i2 < count($wall[$i]["doors"]["PDoor"]); $i2++)
			{
				$arr["walls"][$i]["doors"][$i2]["id"] = $wall[$i]["doors"]["PDoor"][$i2]["id"];
				$arr["walls"][$i]["doors"][$i2]["lotid"] = $wall[$i]["doors"]["PDoor"][$i2]["lotid"];
				//$arr["walls"][$i]["doors"][$i2]["type"] = 'door'; 
				$arr["walls"][$i]["doors"][$i2]["startPointDist"] = intToFloat($wall[$i]["doors"]["PDoor"][$i2]["startPointDist"]);
				$arr["walls"][$i]["doors"][$i2]["over_floor"] = intToFloat($wall[$i]["doors"]["PDoor"][$i2]["over_floor"]);
				$arr["walls"][$i]["doors"][$i2]["width"] = intToFloat($wall[$i]["doors"]["PDoor"][$i2]["width"]);
				$arr["walls"][$i]["doors"][$i2]["height"] = intToFloat($wall[$i]["doors"]["PDoor"][$i2]["height"]);
				

				if(isset($wall[$i]["doors"]["PDoor"][$i2]["open_type"]))
				{
					$arr["walls"][$i]["doors"][$i2]["open_type"] = $wall[$i]["doors"]["PDoor"][$i2]["open_type"];
				}
				
				if(isset($wall[$i]["doors"]["PDoor"][$i2]["options"]))
				{
					$arr["walls"][$i]["doors"][$i2]["options"] = $wall[$i]["doors"]["PDoor"][$i2]["options"];
				}
			}
		}

		if($wall[$i]["windows"])
		{ 
			if(!isset($wall[$i]["windows"]["PWindow"][0]["id"])) 
			{ 
				$w = $wall[$i]["windows"]["PWindow"]; 
				$wall[$i]["windows"]["PWindow"] = array();
				$wall[$i]["windows"]["PWindow"][0] = $w;			
			}
			
			for ($i2 = 0; $i2 < count($wall[$i]["windows"]["PWindow"]); $i2++)
			{
				$arr["walls"][$i]["windows"][$i2]["id"] = $wall[$i]["windows"]["PWindow"][$i2]["id"];
				$arr["walls"][$i]["windows"][$i2]["lotid"] = $wall[$i]["windows"]["PWindow"][$i2]["lotid"];
				//$arr["walls"][$i]["windows"][$i2]["type"] = 'window';
				$arr["walls"][$i]["windows"][$i2]["startPointDist"] = intToFloat($wall[$i]["windows"]["PWindow"][$i2]["startPointDist"]);
				$arr["walls"][$i]["windows"][$i2]["over_floor"] = intToFloat($wall[$i]["windows"]["PWindow"][$i2]["over_floor"]);
				$arr["walls"][$i]["windows"][$i2]["width"] = intToFloat($wall[$i]["windows"]["PWindow"][$i2]["width"]);
				$arr["walls"][$i]["windows"][$i2]["height"] = intToFloat($wall[$i]["windows"]["PWindow"][$i2]["height"]);
			}
		}
	}	
}


if($xml["floors"]["PFloor"]["rooms"])
{
	$room = $xml["floors"]["PFloor"]["rooms"]["PRoom"];

	if(!isset($room[0]["id"])) 
	{ 
		$w = $room;
		$room = array(); 
		$room[0] = $w;
	}

	for ($i = 0; $i < count($room); $i++)
	{
		$arr["rooms"][$i]["id"] = $room[$i]["id"];
		$arr["rooms"][$i]["name"] = $room[$i]["name"];
		$arr["rooms"][$i]["roomSType"] = $room[$i]["roomSType"];
		$arr["rooms"][$i]["pointid"] = $room[$i]["pointid"]["int"];
		$arr["rooms"][$i]["plinthLot"]["id"] = (isset($room[$i]["plinthLot"])) ? $room[$i]["plinthLot"]["id"] : null;
		$arr["rooms"][$i]["plinthCeilLot"]["id"] = (isset($room[$i]["plinthCeilLot"])) ? $room[$i]["plinthCeilLot"]["id"] : null;
		$arr["rooms"][$i]["colors"] = array();
		
		
		
		$psurface = $room[$i]["colors"]["PSurface"];
		
		for ($i2 = 0; $i2 < count($psurface); $i2++)
		{
			$arr["rooms"][$i]["colors"][$i2]["containerID"] = $psurface[$i2]["containerID"];
			$arr["rooms"][$i]["colors"][$i2]["lot"]["id"] = $psurface[$i2]["lot"]["id"];			
			
			$color = $psurface[$i2]["matMod"]["colorsets"]["PColorSet"]["color"];
			
			if(isset($color))
			{
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["r"] = intToFloat($color["r"]);
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["g"] = intToFloat($color["g"]);
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["b"] = intToFloat($color["b"]);
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["a"] = intToFloat($color["a"]);
			}
			
			$color = $psurface[$i2]["matMod"]["texScale"];
			
			if(isset($color))
			{
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["texScal"]["x"] = intToFloat($color["x"]);
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["texScal"]["y"] = intToFloat($color["y"]);
			}	

			
			$color = $psurface[$i2]["matMod"]["texOffset"];
			
			if(isset($color))
			{
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["texOffset"]["x"] = (isset($color["x"])) ? intToFloat($color["x"]) : 0; 
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["texOffset"]["y"] = (isset($color["y"])) ? intToFloat($color["y"]) : 0; 
			}			

			$color = $psurface[$i2]["matMod"]["mapingRotate"];
			
			if(isset($color))
			{
				$arr["rooms"][$i]["colors"][$i2]["matMod"]["mapingRotate"] = intToFloat($color); 
			}			
		}		
	}	
}




if($xml["floors"]["PFloor"]["furn"])
{
	$obj = $xml["floors"]["PFloor"]["furn"]["PFurniture"];

	if(!isset($obj[0]["id"])) 
	{ 
		$w = $obj;
		$obj = array();
		$obj[0] = $w;		
	}
	
	
	for ($i = 0; $i < count($obj); $i++)
	{
		$arr["furn"][$i]["id"] = $obj[$i]["id"];
		$arr["furn"][$i]["lotid"] = $obj[$i]["lotid"]; 
		$arr["furn"][$i]["pos"]["x"] = intToFloat($obj[$i]["pos"]["x"]); 
		$arr["furn"][$i]["pos"]["y"] = intToFloat($obj[$i]["pos"]["y"]);
		$arr["furn"][$i]["pos"]["z"] = intToFloat($obj[$i]["pos"]["z"]);	
		
		$arr["furn"][$i]["rot"]["x"] = (isset($obj[$i]["rot"]["x"])) ? intToFloat($obj[$i]["rot"]["x"]) : 0; 
		$arr["furn"][$i]["rot"]["y"] = (isset($obj[$i]["rot"]["y"])) ? intToFloat($obj[$i]["rot"]["y"]) : 0;
		$arr["furn"][$i]["rot"]["z"] = (isset($obj[$i]["rot"]["z"])) ? intToFloat($obj[$i]["rot"]["z"]) : 0;
		
		$arr["furn"][$i]["size"]["x"] = intToFloat($obj[$i]["size"]["x"]); 
		$arr["furn"][$i]["size"]["y"] = intToFloat($obj[$i]["size"]["y"]);
		$arr["furn"][$i]["size"]["z"] = intToFloat($obj[$i]["size"]["z"]);	
		
		$arr["furn"][$i]["overFloor"] = intToFloat($obj[$i]["overFloor"]);
		if(isset($obj[$i]["roomId"])) { $arr["furn"][$i]["roomId"] = $obj[$i]["roomId"]; }
		
		$psurface = $obj[$i]["colors"]["PSurface"];
		
		if($psurface["containerID"]) { $ps = $psurface; $psurface = array(); $psurface[0] = $ps; }
		
		
		for ($i2 = 0; $i2 < count($psurface); $i2++)
		{
			$arr["furn"][$i]["colors"][$i2]["containerID"] = $psurface[$i2]["containerID"];
			$arr["furn"][$i]["colors"][$i2]["lot"]["id"] = $psurface[$i2]["lot"]["id"];
			
			$color = $psurface[$i2]["matMod"]["colorsets"]["PColorSet"]["color"];
			
			if(isset($color))
			{
				$arr["furn"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["r"] = intToFloat($color["r"]);
				$arr["furn"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["g"] = intToFloat($color["g"]);
				$arr["furn"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["b"] = intToFloat($color["b"]);
				$arr["furn"][$i]["colors"][$i2]["matMod"]["colorsets"][0]["color"]["a"] = intToFloat($color["a"]);
			}
			
			$color = $psurface[$i2]["matMod"]["texScale"];
			
			if(isset($color))
			{
				$arr["furn"][$i]["colors"][$i2]["matMod"]["texScal"]["x"] = intToFloat($color["x"]);
				$arr["furn"][$i]["colors"][$i2]["matMod"]["texScal"]["y"] = intToFloat($color["y"]);
			}			
		}		
	}	
}


$arrC = array();
if($xml["cams"]["PCamera"])
{
	$cams = $xml["cams"]["PCamera"];

	if(!isset($cams[0]["id"])) 
	{ 
		$w = $cams;
		$cams = array();
		$cams[0] = $w;		
	}


	for ($i = 0; $i < count($cams); $i++)
	{
		$arrC["cams"][$i]["id"] = $cams[$i]["name"];
		$arrC["cams"][$i]["position"]["x"] = (isset($cams[$i]["position"]["x"])) ? intToFloat($cams[$i]["position"]["x"]) : 0; 
		$arrC["cams"][$i]["position"]["y"] = (isset($cams[$i]["position"]["x"])) ? intToFloat($cams[$i]["position"]["y"]) : 0;
		$arrC["cams"][$i]["position"]["z"] = (isset($cams[$i]["position"]["x"])) ? intToFloat($cams[$i]["position"]["z"]) : 0;	
		
		$arrC["cams"][$i]["target_position"]["x"] = (isset($cams[$i]["target_position"]["x"])) ? intToFloat($cams[$i]["target_position"]["x"]) : 0; 
		$arrC["cams"][$i]["target_position"]["y"] = (isset($cams[$i]["target_position"]["x"])) ? intToFloat($cams[$i]["target_position"]["y"]) : 0;
		$arrC["cams"][$i]["target_position"]["z"] = (isset($cams[$i]["target_position"]["x"])) ? intToFloat($cams[$i]["target_position"]["z"]) : 0;	
	}	
}




$arr["height"] = intToFloat($xml["floors"]["PFloor"]["height"]);
$arr["id"] = $xml["floors"]["PFloor"]["id"];
$arr["name"] = $xml["settings"]["projName"];


$floors = array();
$floors["floors"][0] = $arr;
$floors["version"] = $xml["version"];
$floors["code_server"] = $code_server;

if(count($arrC) > 0) { $floors["cams"] = $arrC["cams"]; }


echo json_encode( $floors );








// converter ---------------------



function intToFloat($int)
{		
	// binary from integer
	$int = trim($int);
	$bin1 = decbin( $int ); $bin1 = trim($bin1);
	if($int < 0) { $bin1 = substr($bin1,32 - strlen($bin1),strlen($bin1)); } 	// �����, ����� �������� � ������� �������� ����� �����������
	$bin1 = substr("00000000000000000000000000000000",0,32 - strlen($bin1)).$bin1;  

	// float from binary
	$floatFromBin = binToFloat($bin1); 

	
	
	return $floatFromBin;	
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



