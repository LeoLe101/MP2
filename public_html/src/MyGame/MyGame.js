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


    // variables to save all drawable objects
    this.mAllObjects = [];

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

    // Initialize the red renderable TRIANGLE
    this.mTriangle = new Renderable(this.mConstTriangleColorShader);
    this.mTriangle.setColor([1, 0, 0, 1]);
    this.mTriangle.getXform().setPosition(80, 100);
    this.mTriangle.getXform().setSize(5, 5);

    // Initialize the red renderable POLYGON
    this.mPolygon = new Renderable(this.mConstPolygonColorShader);
    this.mPolygon.setColor([1, 0, 0, 1]);
    this.mPolygon.getXform().setPosition(80, 20);
    this.mPolygon.getXform().setSize(5, 5);

    // Initialize the red renderable START
    this.mStar = new Renderable(this.mConstStarColorShader);
    this.mStar.setColor([1, 0, 0, 1]);
    this.mStar.getXform().setPosition(50, 100);
    this.mStar.getXform().setSize(5, 5);

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
    for (var i = 0; i < this.mAllObjects.length; i++)
        this.mAllObjects[i].draw(this.mCamera.getVPMatrix());
    
    // Draw red square cursor
    this.mRedSq.draw(this.mCamera.getVPMatrix());
    // Draw triangle
    this.mTriangle.draw(this.mCamera.getVPMatrix());
    // Draw polygon
    this.mPolygon.draw(this.mCamera.getVPMatrix());
    // Draw start
    this.mStar.draw(this.mCamera.getVPMatrix());

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // For this very simple game, let's move the white square and pulse the red
    var xf = this.mRedSq.getXform();
    var delta = 1;

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
        }
    }

    if (this.mAllObjects.length === 0)
        this.mDeleteStartTime = 0;
};

MyGame.prototype.createObjectsAt = function (xf) {
    var n = 10 + 10 * Math.random();
    var i = 0;

    if (this.mAllObjects.length === 0)
        this.mStartTime = Date.now();

    for (i = 0; i < n; i++) {
        var x = xf.getXPos() + 10 * (Math.random() - 0.5);
        var y = xf.getYPos() + 10 * (Math.random() - 0.5);
        var size = 1 + 5 * Math.random();
        var rot = Math.random() * 180;
        var creationDelta = Date.now() - this.mStartTime;
        var obj = new Renderable(this.mConstSquareColorShader, creationDelta);
        obj.setColor([
            Math.random(), Math.random(), Math.random(), 1]);
        obj.getXform().setPosition(x, y);
        obj.getXform().setSize(size, size);
        obj.getXform().setRotationInDegree(rot);
        this.mAllObjects.push(obj);
    }
};