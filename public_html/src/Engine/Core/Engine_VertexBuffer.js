/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || {};

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    var mTriangleVertexBuffer = null;
    var mPolygonVertexBuffer = null;
    var mStarVertexBuffer = null;

    // First: define the vertices for a square
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // Define the vertices for a triangle
    var verticesOfTriangle = [
        0, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0
    ];

    // Define the vertices for a polygon
    var verticesOfPolygon = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // Define the vertices for a star
    var verticesOfStar = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        mSquareVertexBuffer = gl.createBuffer();
        mTriangleVertexBuffer = gl.createBuffer();
        mPolygonVertexBuffer = gl.createBuffer();
        mStarVertexBuffer = gl.createBuffer();

        // Activate and load vertices into vertexBuffer for SQUARE
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer

        // Activate and load vertices into vertexBuffer for Triangle
        gl.bindBuffer(gl.ARRAY_BUFFER, mTriangleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfTriangle), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer

        // Activate and load vertices into vertexBuffer for Polygon
        gl.bindBuffer(gl.ARRAY_BUFFER, mPolygonVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfPolygon), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer

        // Activate and load vertices into vertexBuffer for Star
        gl.bindBuffer(gl.ARRAY_BUFFER, mStarVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfStar), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer
    };

    var getGLSquareVertexRef = function () { return mSquareVertexBuffer; };
    
    var getGLTriangleVertexRef = function () { return mTriangleVertexBuffer; };
    
    var getGLPolygonVertexRef = function () { return mPolygonVertexBuffer; };
    
    var getGLStarVertexRef = function () { return mStarVertexBuffer; };

    var mPublic = {
        initialize: initialize,
        getGLSquareVertexRef: getGLSquareVertexRef,
        getGLTriangleVertexRef: getGLTriangleVertexRef,
        getGLPolygonVertexRef: getGLPolygonVertexRef,
        getGLStarVertexRef: getGLStarVertexRef
    };

    return mPublic;
}());