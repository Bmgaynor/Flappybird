import {getBirdLivesAgain, setBirdLivesAgain, getPlayer, getScore, setPlayerScore} from '../store/score'

const MainState = {

  // Fuction called after 'preload' to setup the game
  create: function () {
    this.background = this.game.add.tileSprite(0, 0, 800, 487, 'background');
    // Set the physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    setBirdLivesAgain(-1)
    this.createbird1();
    this.createbird2();

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
    var aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    aKey.onDown.add(this.jump2, this);

    // Create a group of 20 pipes
    this.pipes = this.game.add.group();
    this.pipes.enableBody = true;
    this.pipes.createMultiple(20, 'pipe');

    // Timer that calls 'addRowOfPipes' ever 1.5 seconds
    this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

    setPlayerScore(1, 0)
    this.labelScore = this.game.add.text(20, 20, "P1: 0", {font: "30px Arial", fill: "#ffffff"});

    setPlayerScore(2, 0)
    this.labelScore2 = this.game.add.text(200, 20, "P2: 0", {font: "30px Arial", fill: "#ffffff"});

    this.labelLives = this.game.add.text(20, 50, getBirdLivesAgain(), {font: "30px Arial", fill: "#ffffff"});

  },

  // This function is called 60 times per second
  update: function () {

    this.background.tilePosition.x -= 3;
    if (this.bird.inWorld == false)
      this.killbird1();

    if (this.bird.angle < 45) {
      this.bird.angle += 1;
    }

    // If the bird1 overlaps any pipes, call 'restartGame'
    this.game.physics.arcade.overlap(this.bird, this.pipes, this.killbird1, null, this);

    if (this.bird2.inWorld == false)
      this.killbird2();

    if (this.bird2.angle < 45) {
      this.bird2.angle += 1;
    }

    // If the bird overlap any pipes, call killbird
    this.game.physics.arcade.overlap(this.bird2, this.pipes, this.killbird2, null, this);
    if (getBirdLivesAgain() != -1) {
      this.labelLives.text = "BirdLivesAgain! in: " + getBirdLivesAgain();
    } else
      this.labelLives.text = "";
  },

  // Make the bird jump
  jump: function () {
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;
    var animation = this.game.add.tween(this.bird);
    animation.to({angle: -30}, 100);
    animation.start();
  },
  jump2: function () {
    // Add a vertical velocity to the bird2
    this.bird2.body.velocity.y = -350;
    var animation = this.game.add.tween(this.bird2);
    animation.to({angle: -30}, 100);
    animation.start();
  },
  // Restart the game
  restartGame: function () {
    // Start the 'main' state, which restarts the game
    this.game.state.start('menu');
  },
  //adapted from http://blog.lessmilk.com/how-to-make-flappy-bird-in-html5-1/
  // Add a pipe on the screen
  addOnePipe: function (x, y) {
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
  addRowOfPipes: function () {
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++)
      if (i != hole && i != hole + 1)
        this.addOnePipe(400, i * 60 + 10);


    const newScore1 = getScore(1) + 1
    if (this.bird.alive == true) {
      setPlayerScore(1, newScore1)
      this.labelScore.text = "P1: " + newScore1
    } else {
      if (getBirdLivesAgain() == 0) {
        this.createbird1();
      } else {
        setBirdLivesAgain(getBirdLivesAgain() - 1)
      }
    }

    const newScore2 = getScore(2) + 1
    if (this.bird2.alive == true) {
      setPlayerScore(2, newScore2)
      this.labelScore2.text = "P2: " + newScore2;
    } else {
      if (getBirdLivesAgain() == 0) {
        this.createbird2();
      } else {
        setBirdLivesAgain(getBirdLivesAgain() - 1)
      }
    }
  }, render: function () {

    // game.debug.spriteInfo(sprite, 32, 32);
    // game.debug.text('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
    // game.debug.text('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
    //game.debug.text('angularDrag: ' + this.bird.body.angularDrag, 32, 264);
    //game.debug.text('deltaZ: ' + this.bird.body.deltaZ(), 32, 296);

  }, killbird1: function () {
    if (this.bird.alive) {   //if bird was alive and now we are kiiling it set it to 4
      setBirdLivesAgain(4)
    }
    if (this.bird2.alive == true) {
      this.bird.kill();
    } else
      this.restartGame();
  }, killbird2: function () {
    if (this.bird2.alive) {
      setBirdLivesAgain(4)
    }
    if (this.bird.alive == true) {
      this.bird2.kill();

    } else
      this.restartGame();

  }, createbird1: function () {

    if (getBirdLivesAgain() == 0) {
      var birdx = this.bird2.x;
      var birdy = this.bird2.y;

      this.bird = this.game.add.sprite(birdx, birdy, 'bird');
    } else
      this.bird = this.game.add.sprite(100, 245, 'bird');

    this.game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;

    this.bird.animations.add('walk');

    this.bird.animations.play('walk', 100, true);
    this.bird.anchor.setTo(-0.2, 0.5);

    this.bird.scale.x -= 0.7;
    this.bird.scale.y -= 0.7;
  }, createbird2: function () {
    if (getBirdLivesAgain() == 0) {
      var birdx = this.bird.x;
      var birdy = this.bird.y;

      this.bird2 = this.game.add.sprite(birdx, birdy, 'bird');
    } else
      this.bird2 = this.game.add.sprite(100, 245, 'bird');

    this.bird2.tint = 0.5 * 0xffffff;

    this.game.physics.arcade.enable(this.bird2);
    this.bird2.body.gravity.y = 1000;

    this.bird2.animations.add('walk');

    this.bird2.animations.play('walk', 100, true);
    this.bird2.anchor.setTo(-0.2, 0.5);

    this.bird2.scale.x -= 0.7;
    this.bird2.scale.y -= 0.7;
  }

};

export default MainState