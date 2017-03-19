const LoadState = {
  // Function called first to load all the assets
  preload: function () {
    // Change the background color of the game
    this.game.load.image('background', 'files/game-background.jpg');

    // Load the bird sprite
    this.game.load.spritesheet('bird', 'files/Birds.gif', 183, 168, 14);

    // Load the pipe sprite
    this.game.load.image('pipe', 'files/Flames.gif');

  },
  create: function () {
    this.game.state.start('menu');
  }

};


export default LoadState