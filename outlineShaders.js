
var edgeDetectionMaterial = function ()
{

  return new THREE.ShaderMaterial( {
    uniforms: {
      "maskTexture": { value: null },
      "texSize": { value: new THREE.Vector2( 0.5, 0.5 ) },
      "visibleEdgeColor": { value: new THREE.Vector3( 0.0, 1.0, 0.0 ) },
      "hiddenEdgeColor": { value: new THREE.Vector3( 0.0, 1.0, 0.0 ) },
    },

    vertexShader:
      "varying vec2 vUv;\n\
    void main() {\n\
      vUv = uv;\n\
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
    }",

    fragmentShader:
      "varying vec2 vUv;\
    uniform sampler2D maskTexture;\
    uniform vec2 texSize;\
    uniform vec3 visibleEdgeColor;\
    uniform vec3 hiddenEdgeColor;\
    \
    void main() {\n\
      vec2 invSize = 1.0 / texSize;\
      vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);\
      vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);\
      vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);\
      vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);\
      vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);\
      float diff1 = (c1.r - c2.r)*0.9;\
      float diff2 = (c3.r - c4.r)*0.9;\
      float d = length( vec2(diff1, diff2) );\
      float a1 = min(c1.g, c2.g);\
      float a2 = min(c3.g, c4.g);\
      float visibilityFactor = min(a1, a2);\
      vec3 edgeColor = 1.0 - visibilityFactor > 0.001 ? visibleEdgeColor : hiddenEdgeColor;\
      gl_FragColor = vec4(edgeColor, 1.0) * vec4(d);\
    }",
    // blending: THREE.Multiply,
    // depthTest: false,
    // depthWrite: false,
    transparent: true
  } );
}

var maskMaterial = function ()
{
  return new THREE.ShaderMaterial( {

    uniforms: {
      "depthTexture": { value: null },
      "cameraNearFar": { value: new THREE.Vector2( 0.5, 0.5 ) },
      "textureMatrix": { value: new THREE.Matrix4() }
    },

    vertexShader:
      "varying vec2 vUv;\
    varying vec4 projTexCoord;\
    varying vec4 vPosition;\
    uniform mat4 textureMatrix;\
    void main() {\
      vUv = uv;\
      vPosition = modelViewMatrix * vec4( position, 1.0 );\
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\
      projTexCoord = textureMatrix * worldPosition;\
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
    }",

    fragmentShader:
      "#include <packing>\
    varying vec2 vUv;\
    varying vec4 vPosition;\
    varying vec4 projTexCoord;\
    uniform sampler2D depthTexture;\
    uniform vec2 cameraNearFar;\
    \
    void main() {\
      float depthTexture = unpackRGBAToDepth(texture2DProj( depthTexture, projTexCoord ));\
      float viewZ = -perspectiveDepthToViewZ( depthTexture, cameraNearFar.x, cameraNearFar.y );\
      float depthTest = (-vPosition.z > viewZ) ? 1.0 : 0.0;\
      gl_FragColor = vec4(0.0, depthTest, 1.0, 1.0);\
    }"
  } );
}
