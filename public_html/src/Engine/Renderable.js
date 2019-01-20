/*
 * File: Renderable.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Renderable(shader, t) {
    this.mShader = shader;         // the shader for shading this object
    this.mXform = new Transform(); // transform that moves this object around
    this.mColor = [1, 1, 1, 1];    // color of pixel
    
    this.mCreationDelta = t;
}

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Renderable.prototype.draw = function (vpMatrix) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, vpMatrix);  // always activate the shader first!
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Renderable.prototype.drawSquare = function (vpMatrix) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, vpMatrix, "square");  // always activate the shader of Square
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Renderable.prototype.drawTriangle = function (vpMatrix) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, vpMatrix, "triangle");  // always activate the shader of Triangle
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

Renderable.prototype.drawPolygon = function (vpMatrix) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, vpMatrix, "polygon");  // always activate the shader of Polygon
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLES, 2, 3);
    gl.drawArrays(gl.TRIANGLES, 4, 3);
};

Renderable.prototype.drawStar = function (vpMatrix) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, vpMatrix, "star");  // always activate the shader of Star
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
};

Renderable.prototype.getXform = function () { return this.mXform; };
Renderable.prototype.setColor = function (color) { this.mColor = color; };
Renderable.prototype.getColor = function () { return this.mColor; };

Renderable.prototype.update = function (deleteDelta) {
    return (deleteDelta > this.mCreationDelta);
};
//--- end of Public Methods
//</editor-fold>
