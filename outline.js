var postProcessParameters = {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat
};

var size = renderer.getDrawingBufferSize();
var outlineQuadTexture = new THREE.WebGLRenderTarget( size.width, size.height, postProcessParameters );
var maskTexture = new THREE.WebGLRenderTarget( size.width, size.height, postProcessParameters );
var depthTexture = new THREE.WebGLRenderTarget( size.width, size.height, postProcessParameters );

var maskMaterial = maskMaterial();
var edgeDetectionMaterial = edgeDetectionMaterial();

var postProcessQuad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), edgeDetectionMaterial );
postProcessQuad.frustumCulled = false;

var outlineCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
var outlineScene = new THREE.Scene();
outlineScene.add( postProcessQuad );


function changeVisibilityOfSelectedObjects( bVisible )
{

  function gatherSelectedMeshesCallBack( object )
  {
    if ( object instanceof THREE.Mesh ) object.visible = bVisible;
  }

  for ( var i = 0; i < selectedObjects.length; i++ )
  {
    var selectedObject = selectedObjects[ i ];
    selectedObject.traverse( gatherSelectedMeshesCallBack );
  }

}

function changeVisibilityOfNonSelectedObjects( bVisible )
{

  var selectedMeshes = [];

  function gatherSelectedMeshesCallBack( object )
  {
    if ( object instanceof THREE.Mesh ) selectedMeshes.push( object );
  }

  for ( var i = 0; i < selectedObjects.length; i++ )
  {
    var selectedObject = selectedObjects[ i ];
    selectedObject.traverse( gatherSelectedMeshesCallBack );
  }

  function VisibilityChangeCallBack( object )
  {

    if ( object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite )
    {
      var bFound = false;

      for ( var i = 0; i < selectedMeshes.length; i++ )
      {
        var selectedObjectId = selectedMeshes[ i ].id;

        if ( selectedObjectId === object.id )
        {
          bFound = true;
          break;
        }
      }

      if ( !bFound )
      {
        var visibility = object.visible;

        if ( !bVisible || object.bVisible ) object.visible = bVisible;
        object.bVisible = visibility;
      }
    }
  }

  scene.traverse( VisibilityChangeCallBack );

}




function addSelectedObject( object )
{

  if ( object.userData.tag === 'move_control' || object.userData.tag === 'gizmo' ) return;

  if ( selectedObjects.indexOf( object ) === -1 )
  {
    // selectedObjects.push( object );
    selectedObjects = [ object ];
  }

}

function clearSelectedObjects( tag )
{
  if ( tag )
  {
    for ( var i = 0; i < selectedObjects.length; i++ )
    {
      if ( selectedObjects[ i ].userData.tag === tag )
      {
        selectedObjects.splice( i, 1 );
      }
    }
  } 
  else 
  {
    selectedObjects = [];
  }

}