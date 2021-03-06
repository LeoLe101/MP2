// This is the vertex shader POLYGON
attribute vec3 aPolygonVertexPosition;  // Vertex shader expects one vertex position

// to transform the vertex position
uniform mat4 uModelTransform;
uniform mat4 uViewProjTransform;

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModelTransform and uViewProjTransform before
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = uViewProjTransform * uModelTransform * vec4(aPolygonVertexPosition, 1.0); 
}
