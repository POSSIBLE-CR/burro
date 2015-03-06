// POSSIBLE Costa Rica - FID
// February 2015

var burroFID2015 = burroFID2015 || {};

(function (context) {

    /* ------------------------------------------------------------------------------------
     * Global Variables */
    vars = {
        gameOver        : false,
   
        windowHeight    : window.innerHeight,
        windowWidth     : window.innerWidth,
        skins           : ['estefaniaTastan','pabloMontero','pazUlloa','fabioCastro','gaboMurillo'],
        skinPosition    : 0,

        beepSound       : new Audio('audio/beep.mp3'),
        donkeySound     : new Audio('audio/donkey.mp3'),
        pigSound        : new Audio('audio/pig.mp3'),
        chickenSound    : new Audio('audio/chicken.mp3'),
        clapSound       : new Audio('audio/win.mp3'),

        fabioFirstTimeDown : true,
        obstacle1       : {},
        obstacle2       : {},
        obstacle3       : {},
        obstacles       : [],
        tail            : {},
        donkey : {},


        donkeyDirection : 'down',
        donkeyWidth     : 345,
        donkeyPositionX : (window.innerWidth-345),
        donkeyPositionY : 0,
        donkeyElement   : document.getElementById("outer-dropzone"),
    };

    /* ------------------------------------------------------------------------------------
     * Creates Elements Objects */
    // var skin = vars.skins[vars.skinPosition];
    function createElements(){
        var skin = vars.skins[vars.skinPosition];

        vars.obstacle1 = { 
            obstacleWidth: 150,
            obstacleHeight: 150,
            posX: 140,
            posY: 250,
            elementID: 'obstacle1',
            direction: 'right'
        },
        vars.obstacle2 = {
            obstacleWidth: 150,
            obstacleHeight: 250,
            posX: 600,
            posY: 40,
            elementID: 'obstacle2',
            direction: 'down'
        },
        vars.obstacle3 = {
            obstacleWidth: 150,
            obstacleHeight: 150,
            posX: 500,
            posY: 500,
            elementID: 'obstacle3',
            direction: 'top'
        };

        vars.obstacles = [vars.obstacle1, vars.obstacle2, vars.obstacle3];

        vars.donkey = {
            donkeyDirection : 'down',
            donkeyWidth     : 345,
            donkeyPositionX : (window.innerWidth-345),
            donkeyPositionY : 0,
            donkeyElement   : document.getElementById("outer-dropzone"),
        }

        if(skin == 'estefaniaTastan') {
            // vars.obstacle1 = { 
            //     obstacleWidth: 150,
            //     obstacleHeight: 150,
            //     posX: 140,
            //     posY: 250,
            //     elementID: 'obstacle1'
            // },
            // vars.obstacle2 = {
            //     obstacleWidth: 150,
            //     obstacleHeight: 250,
            //     posX: 600,
            //     posY: 40,
            //     elementID: 'obstacle2'
            // },
            // vars.obstacle3 = {
            //     obstacleWidth: 150,
            //     obstacleHeight: 150,
            //     posX: 500,
            //     posY: 500,
            //     elementID: 'obstacle3'
            // }
        }
        else if(skin == 'pabloMontero') {
        }

        else if(skin == 'pazUlloa') {
        }

        else if(skin == 'fabioCastro') {
        }

        else if(skin == 'gaboMurillo') {
        }


    }

    /* ------------------------------------------------------------------------------------
     * Places the 3 obstacles according to the objects' positions */
     //TODO: create an array to store the 3 obstacle objects and loop them on this function
    function placeObstacles(){
        for(var i=0;i<vars.obstacles.length;i++){
            var obstacle = vars.obstacles[i];

            document.getElementById(obstacle.elementID).style.left = obstacle.posX+'px';
            document.getElementById(obstacle.elementID).style.top = obstacle.posY+'px';
        }
    }


    /* ------------------------------------------------------------------------------------
     * Adds draggable functionality. Targets elements with the "draggable" class */
    interact('.draggable')
        .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: parent,
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 
            }
        },
        
        onmove: function (event) { // call this function on every dragmove event
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            
            // translate the element
            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

            // update the position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            vars.tail ={
                tailX : x,
                tailY : y
            }

            checkTailPosition();

            var obstacleLeft = document.getElementsByClassName("obstacle2")[0].style.left,
                obstacleTop = document.getElementsByClassName("obstacle2")[0].style.top;
            // console.log('left '+obstacleLeft+' top '+obstacleTop);

        },
        
        onend: function (event) { // call this function on every dragend event
            /**************************************/
            /***** This is the GAME OVER event ****/
            if(vars.gameOver){
                vars.donkeySound.play();
                vars.gameOver = false;
                 // vars.gameOver = true;
                // vars.donkeySound.play();
                // alert("Game OVER");
                //vars.gameOver = true;
                // resetGame();
            }
        }
      });

    /* ------------------------------------------------------------------------------------
     * Adds dropzone functionality. Enables draggables to be dropped into the dropzone */
    interact('.dropzone').dropzone({
        accept: '#yes-drop', // only accept elements matching this CSS selector
        overlap: 0.65, // Require a 65% element overlap for a drop to be possible

        // Listen for drop related events (Tail dropped inside the Donkey area.)
        ondrop: function (event) {
            var targetClassName = event.target.classList[1];
            
            /************************************/
            /***** This is the GAME WIN event ****/
            if(targetClassName === 'donkey'){
                vars.gameOver = true;
                vars.clapSound.play();
                alert("WIN");
                resetGame();
            }
            else{
                vars.gameOver = false;                
            }
        },

        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        },

        ondragenter: function (event) {
            var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        },

        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });

    /* ------------------------------------------------------------------------------------
     * Inits the selected assets set. */
    function initSkin() {
        var skin = vars.skins[vars.skinPosition],
        //var skin = vars.skins[3],
        wrapper = document.getElementById('mainWrapper');
        wrapper.setAttribute("class", skin);
    }

    /* ------------------------------------------------------------------------------------
     * Triggers all the animations */
     function animateElements(){
        animateDonkey();
        animateObstacles();
     }

    /* ------------------------------------------------------------------------------------
     * Donkey movement animation */
    function animateDonkey () {

        // var donkey = vars.donkey

        if(vars.donkeyDirection==='down'){
            vars.donkeyElement.style.top = vars.donkeyPositionY + 'px';
            vars.donkeyPositionY++;    
        }
        else if(vars.donkeyDirection==='left'){
            vars.donkeyElement.style.left = vars.donkeyPositionX + 'px';
            vars.donkeyPositionX--;    
        }
        else if(vars.donkeyDirection==='top'){
            vars.donkeyElement.style.top = vars.donkeyPositionY + 'px';
            vars.donkeyPositionY--;
        }
        else if(vars.donkeyDirection==='right'){
            vars.donkeyElement.style.left = vars.donkeyPositionX + 'px';
            vars.donkeyPositionX++;    
        }
        else if(vars.donkeyDirection=='topLeft'){
            vars.donkeyElement.style.top = vars.donkeyPositionY + 'px';
            vars.donkeyPositionY--;
            vars.donkeyElement.style.left = vars.donkeyPositionX + 'px';
            vars.donkeyPositionX-=1.3;
        }
        else if(vars.donkeyDirection=='topRight'){
            vars.donkeyElement.style.top = vars.donkeyPositionY + 'px';
            vars.donkeyPositionY--;
            vars.donkeyElement.style.left = vars.donkeyPositionX + 'px';
            vars.donkeyPositionX+=1.3;    
        }

        if(vars.donkeyDirection==='top' && vars.donkeyPositionY <= 0) {
            vars.donkeyDirection='right';
        }
        if(vars.donkeyDirection==='left' && vars.donkeyPositionX <= (0)) {
            vars.donkeyDirection='top';
        }
        if(vars.donkeyDirection==='right' && vars.donkeyPositionX >= (vars.windowWidth-345)) {
            vars.donkeyDirection='down';
        }
        if(vars.donkeyDirection==='down' && vars.donkeyPositionY >= (vars.windowHeight-226)) {
            vars.donkeyDirection='left';
        }

       
        //--------------------------------------------------------------------
        // Fabio Castro's donkey animation.
        var skin = vars.skins[vars.skinPosition];
            // skin = 'fabioCastro';

        if(skin == 'fabioCastro'){
            if(vars.fabioFirstTimeDown){
                if(vars.donkeyDirection==='down' && vars.donkeyPositionY >= (vars.windowHeight-250)) {
                    vars.donkeyDirection='topLeft';
                    vars.fabioFirstTimeDown = false;
                }
                if(vars.donkeyDirection==='topLeft' && vars.donkeyPositionY <= 0 && vars.donkeyPositionX <= 0) {
                    vars.donkeyDirection='down';
                }
            }
            else {
                if(vars.donkeyDirection==='down' && vars.donkeyPositionY >= (vars.windowHeight-250)) {
                    vars.donkeyDirection='topRight';
                }
                if(vars.donkeyPositionY <= 0) {
                    if(vars.donkeyDirection==='topLeft' && vars.donkeyPositionX <= 0){
                        vars.donkeyDirection='down';
                    }
                    if(vars.donkeyDirection==='topRight' && vars.donkeyPositionX >= (vars.windowWidth-345)){
                        vars.donkeyDirection='down';
                        vars.fabioFirstTimeDown = true;
                    }
                }               
            }            
        }
    }

    /* ------------------------------------------------------------------------------------
     * Obstacles movement animation */
     function animateObstacles(){

        for(var i=0;i<vars.obstacles.length;i++){
            var obstacle = vars.obstacles[i],
                wWidth = vars.windowWidth,
                wHeight = vars.windowHeight,
                el = document.getElementById(obstacle.elementID);

            if(obstacle.direction == 'right'){
                obstacle.posX++;
                el.style.left = obstacle.posX+'px';            
            } 
            else if(obstacle.direction == 'left'){
                obstacle.posX--;
                el.style.left = obstacle.posX+'px';
            } 
            else if(obstacle.direction == 'top'){
                obstacle.posY--;
                el.style.top = obstacle.posY+'px';
            }
            else if(obstacle.direction == 'down'){
                obstacle.posY++;
                el.style.top = obstacle.posY+'px';
            }
            else{

                if(obstacle.direction == 'topRight'){
                    obstacle.posY--;
                    obstacle.posX+=1.3;
                } 
                else if(obstacle.direction == 'topLeft'){
                    obstacle.posY--;
                    obstacle.posX-=1.3;
                } 
                else if(obstacle.direction == 'bottomRight'){
                    obstacle.posY++;
                    obstacle.posX+=1.3;
                } 
                else if(obstacle.direction == 'bottomLeft'){
                    obstacle.posY++;
                    obstacle.posX-1.3;
                }

                el.style.top = obstacle.posY+'px';
                el.style.left = obstacle.posX+'px';
            }

            if(obstacle.direction == 'right' && obstacle.posX > (wWidth-obstacle.obstacleWidth)){
                obstacle.direction = 'left';            
            } 
            else if(obstacle.direction == 'left' && obstacle.posX < 0){
                obstacle.direction = 'right';
            } 
            else if(obstacle.direction == 'top' && obstacle.posY < 0){
                obstacle.direction = 'down';
            }
            else if(obstacle.direction == 'down' && obstacle.posY > (wHeight-obstacle.obstacleHeight)){
                obstacle.direction = 'top';
            }

        }
     }

    /* ------------------------------------------------------------------------------------
     * Resets all values to the default state */
    function resetGame(){
        if (!vars.gameOver) {
            alert("Reiniciar el juego");
        }
        else {
            vars.gameOver = false;        
        }

        resetDonkeyPosition();
        resetDonkeyTailPosition();

        vars.skinPosition++;

        if(vars.skinPosition == (vars.skins.length)){
            vars.skinPosition = 0;
        }
        initSkin();
    }

    /* ------------------------------------------------------------------------------------
     * Resets the donkey position and movement direction */
    function resetDonkeyPosition(){
        var donkey = document.getElementById('outer-dropzone');
        vars.donkeyDirection = 'down';
        vars.donkeyPositionX = (window.innerWidth-vars.donkeyWidth);
        vars.donkeyPositionY = 0;

        vars.donkeyElement.style.top = vars.donkeyPositionY+'px';
        vars.donkeyElement.style.left = vars.donkeyPositionX+'px';
    }

    /* ------------------------------------------------------------------------------------
     * Resets the donkey tail position */
    function resetDonkeyTailPosition(){
        var target = document.getElementById('yes-drop');

        target.style.webkitTransform =
        target.style.transform = 'translate(0px, 0px)';

        // Reset the tail posiion attributes
        target.setAttribute('data-x', 0);
        target.setAttribute('data-y', 0);
    }

    /* ------------------------------------------------------------------------------------
     * Get a style property of an element */
    function getStyle(el,styleProp) {
        var style = window.getComputedStyle(el),
            propertyValue = style.getPropertyValue(styleProp);
        return propertyValue;
    }

    /* ------------------------------------------------------------------------------------
     * Check overlap between the tail and the obstacles */
    function checkTailPosition(){
        if(isTailOverObstacle(vars.obstacle1) || isTailOverObstacle(vars.obstacle2) || isTailOverObstacle(vars.obstacle3) ){
            vars.beepSound.play();            
        }
    }

    /* ------------------------------------------------------------------------------------
     * Checks if tail is moving over an obstacle */
    function isTailOverObstacle(obstacleElement){
        var tailX = vars.tail.tailX,
            tailY = vars.tail.tailY,
            obstX = obstacleElement.posX,
            obstY = obstacleElement.posY,
            obstW = obstacleElement.obstacleWidth,
            obstH = obstacleElement.obstacleHeight;

        if( (tailX > obstX) && (tailX < (obstX+obstW)) &&
            (tailY > obstY) && (tailY < (obstY+obstH)) ){
            return true;
        }
        else{
            return false;
        }
    }

    /* ------------------------------------------------------------------------------------
     * Init all required functions */
    function init () {
        var skin = vars.skins[vars.skinPosition];
        
        initSkin(skin);
        createElements();
        placeObstacles();

        // If space bar is hit, reset the game
        window.addEventListener('keydown', function(e){
            if(e.keyCode == 32){ // 32 is the spacebar
                resetGame();
            }
        });

        // Start Doneky movement animation
        setInterval(animateElements, 2);
    }

    init();

}(burroFID2015));