// POSSIBLE Costa Rica - FID
// February 2015

var burroFID2015 = burroFID2015 || {};

(function (context) {

    /***
     * Global Variables 
     */
    vars = {

        wrapper         : {},
        endGameView     : {},
        endGameViewTitle: {},
        endGameViewImage: {},
        win             : false,

        windowHeight    : window.innerHeight,
        windowWidth     : window.innerWidth,
        skins           : ['estefaniaTastan','pabloMontero','pazUlloa','fabioCastro','gaboMurillo','pabloRojas'],
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
        donkey : {}

    };

    /***
     * Creates Elements Objects 
     */
    function createElements(){
        vars.donkey = {
            donkeyDirection : 'down',
            donkeyWidth     : 345,
            donkeyHeight    : 250,
            posX : 0,
            posY : 0,
            elementID   : 'outer-dropzone'
        },
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
    }

    /***
     * Draws all the animated elements on the screen 
     */
    function drawObstacles(){
        for(var i=0;i<vars.obstacles.length;i++){
            var obstacle = vars.obstacles[i];

            document.getElementById(obstacle.elementID).style.left = obstacle.posX+'px';
            document.getElementById(obstacle.elementID).style.top = obstacle.posY+'px';
        }
    }


    /***
     * Adds draggable functionality. Targets elements with the "draggable" class 
     */
    interact('.draggable')
        .draggable({
            // enable inertial throwing
            inertia: false,
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
        },

        onend : function(event){
            endGame();
        }
      });

    /***
     * Adds dropzone functionality. Enables draggables to be dropped into the dropzone 
     */
    interact('.dropzone').dropzone({
        accept: '#tail', // only accept elements matching this CSS selector
        overlap: 0.45, // Percentage of element overlap required for a drop event

        // Listen for drop related events (Tail dropped inside the Donkey area.)
        ondrop: function (event) {
            vars.win = true;
        }
    });

    /***
     * handles the end of the game
     */
    function endGame(){
        document.getElementById('music').pause();

        if (vars.win){
            vars.clapSound.play();
            vars.gameOver = false;
            vars.endGameViewTitle.innerHTML = "WINNER!!!!!!";
            vars.endGameViewImage.src = 'img/themes/'+ vars.skins[vars.skinPosition] + '/donkeyWin.png';
            addClass(vars.wrapper,"hide");
            addClass(vars.endGameView,"winner show");
        }else {
            vars.gameOver = true;
            vars.donkeySound.play();
            vars.endGameViewTitle.innerHTML = "LOSER!!!!!!";
            vars.endGameViewImage.src = 'img/themes/'+ vars.skins[vars.skinPosition] + '/donkeyFail.png';
            addClass(vars.wrapper, "hide");
            addClass(vars.endGameView, "loser show");
        }
    }

    /***
     * Add a class to the element
     * @param element DOM element
     * @param classToAdd class to add
     */
    function addClass(element, classToAdd){
        var currentClass = element.getAttribute("class");
        element.setAttribute("class", currentClass + ' ' + classToAdd);
    }
    
    /***
     * Inits the selected assets set. 
     */
    function initSkin() {        
        var skin = vars.skins[vars.skinPosition],
            donkey = vars.donkey,
            el = document.getElementById(donkey.elementID),
            music = document.getElementById('music');

        vars.wrapper.setAttribute("class", skin);
        vars.endGameView.setAttribute("class", skin);

        if(skin == 'estefaniaTastan'){
            donkey.posY = 500;
            donkey.posX = 600;
            music.src = 'audio/estefaniaTastan.mp3';
        }
        else if(skin == 'pabloMontero'){
            donkey.posY = 500;
            donkey.posX = 100;
            music.src = 'audio/pabloMontero.mp3'
        }
        else if(skin == 'pazUlloa'){
            donkey.posY = 450;
            donkey.posX = 400;
            music.src = 'audio/pazUlloa.mp3'
        }
        if(skin == 'fabioCastro'){
            donkey.posY = 300;
            donkey.posX = 700;
            music.src = 'audio/fabioCastro.mp3'
        }
        else if(skin == 'gaboMurillo'){
            donkey.posY = 100;
            donkey.posX = 750;
            music.src = 'audio/gabrielMurillo.mp3'
        }
        else if(skin == 'pabloRojas'){
            donkey.posY = 278;
            donkey.posX = 720;
            music.src = 'audio/pabloRojas.mp3'
        }

        music.play();
    }

    /***
     * Triggers all the animations 
     */
     function animateElements(){
        //animateDonkey();
        animateObstacles();
     }

    /***
     * Donkey movement animation 
     */
    function animateDonkey () {
        var donkey = vars.donkey,
            direction = donkey.donkeyDirection,
            el = document.getElementById(donkey.elementID);

        if(direction==='down'){
            el.style.top = donkey.posY + 'px';
            donkey.posY++;    
        }
        else if(direction==='left'){
            el.style.left = donkey.posX + 'px';
            donkey.posX--;    
        }
        else if(direction==='top'){
            el.style.top = donkey.posY + 'px';
            donkey.posY--;
        }
        else if(direction==='right'){
            el.style.left = donkey.posX + 'px';
            donkey.posX++;    
        }
        else if(direction=='topLeft'){
            el.style.top = donkey.posY + 'px';
            donkey.posY--;
            el.style.left = donkey.posX + 'px';
            donkey.posX-=1.3;
        }
        else if(direction=='topRight'){
            el.style.top = donkey.posY + 'px';
            donkey.posY--;
            el.style.left = donkey.posX + 'px';
            donkey.posX+=1.3;    
        }


        if(donkey.donkeyDirection==='top' && donkey.posY <= 0) {
            donkey.donkeyDirection='right';
        }
        if(donkey.donkeyDirection==='left' && donkey.posX <= (0)) {
            donkey.donkeyDirection='top';
        }
        if(donkey.donkeyDirection==='right' && donkey.posX >= (vars.windowWidth-donkey.donkeyWidth)) {
            donkey.donkeyDirection='down';
        }
        if(donkey.donkeyDirection==='down' && donkey.posY >= (vars.windowHeight-donkey.donkeyHeight)) {

            donkey.donkeyDirection='left';
        }
    }

    /***
     * Obstacles movement animation 
     */
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

    /***
     * Resets all values to the default state 
     */
    function resetGame(){
        vars.skinPosition++;

        if(vars.skinPosition == vars.skins.length){
            vars.skinPosition = 0;
        }
        
        initSkin();
        resetDonkey();
        resetDonkeyTailPosition();
        
        vars.win = false;

    }

    /***
     * Resets the donkey position and movement direction 
     */
    function resetDonkey(){
        var donkey = vars.donkey,
            el = document.getElementById(donkey.elementID);

        el.style.top = donkey.posY+'px';
        el.style.left = donkey.posX+'px';
    }

    /***
     * Resets the donkey tail position 
     */
    function resetDonkeyTailPosition(){
        var target = document.getElementById('tail');

        target.style.webkitTransform =
        target.style.transform = 'translate(0px, 0px)';

        // Reset the tail posiion attributes
        target.setAttribute('data-x', 0);
        target.setAttribute('data-y', 0);
    }

    /***
     * Get a style property of an element 
     */
    function getStyle(el,styleProp) {
        var style = window.getComputedStyle(el),
            propertyValue = style.getPropertyValue(styleProp);
        return propertyValue;
    }

    /***
     * Check overlap between the tail and the obstacles 
     */
    function checkTailPosition(){
        if(isTailOverObstacle(vars.obstacle1) || isTailOverObstacle(vars.obstacle2) || isTailOverObstacle(vars.obstacle3) ){
            vars.beepSound.play();            
        }
    }

    /***
     * Checks if tail is moving over an obstacle 
     */
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

    /***
     * Init all required functions 
     */
    function init () {
        var skin = vars.skins[vars.skinPosition];
        vars.wrapper = document.getElementById('mainWrapper');
        vars.endGameView = document.getElementById('endGameView');

        createElements();
        initSkin();
        drawObstacles();

        // If space bar is hit, reset the game
        window.addEventListener('keydown', function(e){
            if(e.keyCode == 32){ // 32 is the spacebar
                resetGame();
            }
        });

        vars.endGameViewTitle = document.getElementById("endGameViewTitle");
        vars.endGameViewImage = document.getElementById("endGameViewImage");

        var endGameView = document.getElementById("endGameView");
        endGameView.addEventListener("touchend", resetGame, false);
        endGameView.addEventListener("click", resetGame, false);

        // Start Donkey movement animation
        setInterval(animateElements, 20);
        document.getElementById('music').play();
    }

    init();

}(burroFID2015));