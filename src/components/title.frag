#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 u_resolution;

uniform sampler2D u_texture;
uniform vec2 u_textureResolution;

void main()
{    
    vec2 uv = (2.* gl_FragCoord.xy / u_resolution.xy - vec2(1.)) * u_resolution / u_textureResolution;

    // Apply stretch effect
    const float stretchFactor = 0.7;
    vec2 curvedUV = vec2(uv.x, stretchFactor * uv.y);
    
    // Apply curve effect
    const float curveHeight = .3; // Starting height of the curve
    const float curveStrength = .15; 
    const float curveExponent = 2.0; // Controls how much the curve increases with distance from the center
    curvedUV.y -= curveStrength * (1. - pow(curvedUV.x, curveExponent)) * (1. - (curvedUV.y + curveHeight));
    
    // Apply perspective effect
    const float tiltEffect = .05;
    curvedUV *= (tiltEffect * uv.y + 1.);

    gl_FragColor = texture2D(u_texture, (curvedUV + vec2(1.)) / 2.);
}