/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID) {
    // Initialize the webGL Context
    gEngine.Core.initializeEngineCore(htmlCanvasID);

    // variables of the constant color shader for SQUARE
    this.mConstSquareColorShader = null;

    // variables of the constant color shader for TRIANGLE
    this.mConstTriangleColorShader = null;

    // variables of the constant color shader for POLYGON
    this.mConstPolygonColorShader = null;

    // variables of the constant color shader for STAR
    this.mConstStarColorShader = null;


    // variables to save all drawable objects and its types
    this.mAllObjects = [];
    this.mAllObjectsType = [];

    // variables for the squares
    this.mRedSq = null;

    // variables for the triangles
    this.mTriangle = null;

    // variables for the polygons
    this.mPolygon = null;

    // variables for the stars
    this.mStar = null;

    // The camera to view the scene
    this.mCamera = null;

    // Initialize the game
    this.initialize();
}

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5),   // position of the camera
        100,                        // width of camera
        [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
    );
    // sets the background to gray
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    // Step  B: create the shader for SQUARE
    this.mConstSquareColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader of SQUARE
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader    

    // Create the shader for TRIANGLE
    this.mConstTriangleColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleTriVS.glsl",      // Path to the VertexShader of SQUARE
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader    

    // Create the shader for POLYGON
    this.mConstPolygonColorShader = new SimpleShader(
        "src/GLSLShaders/SimplePolVS.glsl",      // Path to the VertexShader of SQUARE
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader    

    // Create the shader for STAR
    this.mConstStarColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleStarVS.glsl",      // Path to the VertexShader of SQUARE
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader    

    // Initialize the red renderable SQUARE
    this.mRedSq = new Renderable(this.mConstSquareColorShader);
    this.mRedSq.setColor([1, 0, 0, 1]);
    this.mRedSq.getXform().setPosition(50, 37.5);
    this.mRedSq.getXform().setSize(1, 1);

    gEngine.GameLoop.start(this);

    this.mStartTime = Date.now();
    this.mDeleteStartTime = 0;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Draw all existing object created from user
    for (var i = 0; i < this.mAllObjects.length; i++) {
        if (this.mAllObjectsType[i] == "triangle") {
            this.mAllObjects[i].drawTriangle(this.mCamera.getVPMatrix());
        } else if (this.mAllObjectsType[i] == "square") {
            this.mAllObjects[i].drawSquare(this.mCamera.getVPMatrix());
        } else if (this.mAllObjectsType[i] == "star") {
            this.mAllObjects[i].drawStar(this.mCamera.getVPMatrix());
        } else if (this.mAllObjectsType[i] == "polygon") {
            this.mAllObjects[i].drawPolygon(this.mCamera.getVPMatrix());
        }
    }
    // Draw red square cursor
    this.mRedSq.drawSquare(this.mCamera.getVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // For this very simple game, let's move the white square and pulse the red
    var xf = this.mRedSq.getXform();
    var delta = 0.5;

    gUpdateObject(this.mAllObjects.length, this.mDeleteStartTime > 0);

    // move the cursor
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (xf.getXPos() < 99) // this is the left-bound of the window
            xf.incXPosBy(delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if (xf.getXPos() > 1) // this is the left-bound of the window
            xf.incXPosBy(-delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (xf.getYPos() < 74) // this is the left-bound of the window
            xf.incYPosBy(delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (xf.getYPos() > 1) // this is the left-bound of the window
            xf.incYPosBy(-delta);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
        this.createObjectsAt(xf);

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D)) {
        if (this.mDeleteStartTime === 0) {
            this.mDeleteStartTime = Date.now();
        }
    }
    if (this.mDeleteStartTime > 0)
        this.updateDelete();
};

MyGame.prototype.updateDelete = function () {
    var t = Date.now() - this.mDeleteStartTime;
    var i = 0;
    for (i = this.mAllObjects.length - 1; i >= 0; i--) {
        if (this.mAllObjects[i].update(t)) {
            this.mAllObjects.splice(i, 1);  // remove one
            this.mAllObjectsType.splice(i, 1);  // remove its type as well
        }
    }
    if (this.mAllObjects.length === 0)
        this.mDeleteStartTime = 0;
};

MyGame.prototype.createObjectsAt = function (xf) {
    var triChecker = false;
    var squareChecker = false;
    var polygonChecker = false;
    var starChecker = false;
    var randShapeGen = Math.floor((Math.random() * 100) + 1);
    if (randShapeGen >= 55) {
        triChecker = true;
    } else if ((randShapeGen < 55) && (randShapeGen >= 10)) {
        polygonChecker = true;
        starChecker = true;
    } else if (randShapeGen < 10) {
        squareChecker = true;
    }
    if (this.mAllObjects.length === 0)
        this.mStartTime = Date.now();

    for (var i = 0; i < 2; i++) {
        var x = xf.getXPos() + 10 * (Math.random() - 0.5);
        var y = xf.getYPos() + 10 * (Math.random() - 0.5);
        var size = 1 + 5 * Math.random();
        var rot = Math.random() * 180;
        var creationDelta = Date.now() - this.mStartTime;
        var obj;
        if (triChecker == true) {
            obj = new Renderable(this.mConstTriangleColorShader, creationDelta);
            this.mAllObjectsType.push("triangle");
        } else if (polygonChecker == true) {
            obj = new Renderable(this.mConstPolygonColorShader, creationDelta);
            polygonChecker = false;
            this.mAllObjectsType.push("polygon");
        } else if (starChecker == true) {
            obj = new Renderable(this.mConstStarColorShader, creationDelta);
            starChecker = false;
            this.mAllObjectsType.push("star");
        } else if (squareChecker == true) {
            obj = new Renderable(this.mConstSquareColorShader, creationDelta);
            this.mAllObjectsType.push("square");
        }
        obj.setColor([Math.random(), Math.random(), Math.random(), 1]);
        obj.getXform().setPosition(x, y);
        obj.getXform().setSize(size, size);
        obj.getXform().setRotationInDegree(rot);
        this.mAllObjects.push(obj);
    }
};