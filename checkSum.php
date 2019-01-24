<?


$pos1 = $_POST['pos1'];
$pos2 = $_POST['pos2'];

$res = [];
$res['x'] = $pos1['x'] - $pos2['x'];
$res['y'] = $pos1['y'] - $pos2['y'];
$res['z'] = $pos1['z'] - $pos2['z'];

echo json_encode( $res );

?>
