// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'GameDiv');
var score1 = 0;
var score2 = 0;
var player1 = 'default1';
var player2 = 'default2';
var background;
// Creates a new 'main' state that will contain the game
var mainState = {

    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        background = game.add.tileSprite(0, 0, 800, 490, 'background');

        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.bird2 = this.game.add.sprite(100, 245, 'bird');
        this.bird2.tint = 0.5 * 0xffffff;
        // Add gravity to the bird
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 

        this.bird.animations.add('walk');

        this.bird.animations.play('walk', 100, true);
        this.bird.anchor.setTo(-0.2, 0.5);

        this.bird.scale.x -= 0.7;
        this.bird.scale.y -= 0.7;

        // Gavity for second bird
        game.physics.arcade.enable(this.bird2);
        this.bird2.body.gravity.y = 1000;

        this.bird2.animations.add('walk');

        this.bird2.animations.play('walk', 100, true);
        this.bird2.anchor.setTo(-0.2, 0.5);

        this.bird2.scale.x -= 0.7;
        this.bird2.scale.y -= 0.7;


        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump , this);
        var aKey   = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        aKey.onDown.add(this.jump2, this);



        // Create a group of 20 pipes
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');  

        // Timer that calls 'addRowOfPipes' ever 1.5 seconds
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        // Add a score label on the top left of the screen

        score1 = 0;
        this.labelScore = this.game.add.text(20, 20, "P1: 0", { font: "30px Arial", fill: "#ffffff" });

        score2 = 0;

        this.labelScore2 = this.game.add.text(200, 20, "P2: 0", { font: "30px Arial", fill: "#ffffff" });

    },

    // This function is called 60 times per second
    update: function() {

        background.tilePosition.x -= 3;

        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (this.bird.inWorld == false)
            this.killbird1();


        if(this.bird.angle < 45){
            this.bird.angle  += 1;
        }


        // If the bird1 overlaps any pipes, call 'restartGame'
        game.physics.arcade.overlap(this.bird, this.pipes, this.killbird1, null, this);

        if (this.bird2.inWorld == false)
            this.killbird2();


        if(this.bird2.angle < 45){
            this.bird2.angle  += 1;
        }


        // If the bird overlap any pipes, call 'restartGame'
        game.physics.arcade.overlap(this.bird2, this.pipes, this.killbird2, null, this);
    },

    // Make the bird jump
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
        var animation = game.add.tween(this.bird);
        animation.to({angle: -30}, 100);
        animation.start();
    },
    jump2: function() {
        // Add a vertical velocity to the bird2
        this.bird2.body.velocity.y = -350;
        var animation = game.add.tween(this.bird2);
        animation.to({angle: -30}, 100);
        animation.start();
    },
    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('menu');
    },

    // Add a pipe on the screen
    addOnePipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnePipe(400, i*60+10);   
        if (this.bird.alive == true){
            score1 += 1;
            this.labelScore.text = "P1: " +  score1;
        }


         if (this.bird2.alive == true) {
             score2 += 1;
             this.labelScore2.text = "P2: " + score2;
         }
    }, render: function() {

   // game.debug.spriteInfo(sprite, 32, 32);
    // game.debug.text('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
    // game.debug.text('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
    //game.debug.text('angularDrag: ' + this.bird.body.angularDrag, 32, 264);
    //game.debug.text('deltaZ: ' + this.bird.body.deltaZ(), 32, 296);

    }, killbird1: function(){
        if (this.bird2.alive == true) {
            this.bird.kill();
        }else
            this.restartGame();
    }, killbird2: function(){
        if (this.bird.alive == true){
            this.bird2.kill();
        }else
            this.restartGame();

    }



};
var menu_state = {
    create: function() {
        // Call the 'start' function when pressing the spacebar
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.start, this);

        background = game.add.tileSprite(0, 0, 800, 487, 'background');

        // Defining variables
        var style = { font: "30px Arial", fill: "#ffffff" };
        var x = game.world.width/2, y = game.world.height/2;

        // Adding a text centered on the screen
        var text = this.game.add.text(x, y-50, "Press space to start" , style);
        text.anchor.setTo(0.5, 0.5);

        this.labelScore = this.game.add.text(20, 20, "P1 Score: "+ score1, { font: "30px Arial", fill: "#ffffff" });
        this.labelScore2 = this.game.add.text(20, 50, "P2 Score: " + score2 , { font: "30px Arial", fill: "#ffffff" });

    },

    // Start the actual game
    start: function() {
        this.game.state.start('main');
    }

};

var load_state = {
        // Function called first to load all the assets
    preload: function() {

        game.load.image('background', 'files/game-background.jpg');

        // Load the bird sprite
        game.load.spritesheet('bird', 'files/Birds.gif' ,183 ,168 ,14 );

        // Load the pipe sprite
        game.load.image('pipe', 'files/Flames.gif');

    },
    create: function(){
        this.game.state.start('menu');
    }



};


// Add and start the 'main' state to start the game
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('main', mainState);  
game.state.start('load');