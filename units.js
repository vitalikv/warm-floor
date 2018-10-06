var units = 1000;
var unitSymbols = 0;
var unitsValue = 'мм';


function setUnits( value )
{

  switch ( value )
  {
    case 'mm':
      units = 1000;
      unitSymbols = 0;
      unitsValue = 'мм';
      break;
    case 'cm':
      units = 100;
      unitSymbols = 1;
      unitsValue = 'см';
      break;
    case 'm':
      units = 1;
      unitSymbols = 2;
      unitsValue = 'м';
      break;
  }

  upLabelPlan_1(obj_line);
  
}


function getValueInCurrentUnits( value, current, destUnits, newUnitSymbols )
{

  var u = destUnits ? destUnits : units;
  var resultUnits = u / current;
  var val = parseFloat( value );
  var uSymbols = newUnitSymbols ? newUnitSymbols : unitSymbols;

  return ( val * resultUnits ).toFixed( uSymbols ).replace( /\.0+$/ig, '' );

}


function setUIDoorSize( obj )
{

  if ( obj && obj.userData.door.size )
  {
    UI( 'door_size' ).val(
      getValueInCurrentUnits( obj.userData.door.size.x, 1, 1, 2 ) + 'x'
      + getValueInCurrentUnits( obj.userData.door.size.y, 1, 1, 2 ) + 'x'
      + getValueInCurrentUnits( obj.userData.door.size.z, 1, 1, 2 ) );
  }

}