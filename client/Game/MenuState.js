import { getScore } from '../store/score'
const MenuState = {
  create: function () {
    this.background = this.game.add.tileSprite(0, 0, 800, 487, 'background');
    // Call the 'start' function when pressing the spacebar
    var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(this.start, this);

    // Defining variables
    var style = {font: "30px Arial", fill: "#ffffff"};
    var x = this.game.world.width / 2, y = this.game.world.height / 2;

    // Adding a text centered on the screen
    var text = this.game.add.text(x, y - 50, "Press space to start", style);
    text.anchor.setTo(0.5, 0.5);

    this.labelScore = this.game.add.text(20, 20, "P1 Score: " + getScore(1), {font: "30px Arial", fill: "#ffffff"});
    this.labelScore2 = this.game.add.text(20, 50, "P2 Score: " + getScore(2), {font: "30px Arial", fill: "#ffffff"});

    var outscore = getScore(1) + getScore(2);
    var currentplayer = $("#username").val();
    var coopscore = $("#coopscore").val();
    var score = $("#score").val();

    var currentplayer1 = $("#player1").val();
    if (currentplayer1 == "") {
      currentplayer1 = "DefaultPLayer1"
    }
    var currentplayer2 = $("#player2").val();
    if (currentplayer1 == "") {
      currentplayer1 = "DefaultPLayer2"
    }
    if (outscore > coopscore) {
      var outperson = {
        "username": currentplayer,
        "score": score,
        "coopscore": outscore,
        "type": "single"
      };

      $.ajax({
        url: '/HandleUpdate',
        dataType: "json",
        data: JSON.stringify(outperson),
        type: 'POST',
        success: function (data) {

        }
      });
      $('#coopscore').val(outscore);
      $("#scoreLabel").html("Coopscore: " + outscore + "<br>" + "Score: " + score);
    }

    //this.labelHighScore = this.game.add.text(20, 80,"team Highscore: " + highscore, { font: "30px Arial", fill: "#ffffff" });

  },

  // Start the actual game
  start: function () {
    this.game.state.start('main');
  }

};

export default MenuState