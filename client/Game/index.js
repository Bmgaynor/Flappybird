import MainState from './MainState'
import LoadState from './LoadState'
import MenuState from './MenuState'

const setup = () => {
  var game = new Phaser.Game(400, 490, Phaser.AUTO, 'GameDiv');
  var score1 = 0;
  var score2 = 0;
  var player1 = 'default1';
  var player2 = 'default2';
  var highscore = 0;
  var birdLivesAgain = 0;

  game.state.add('load', LoadState);
  game.state.add('menu', MenuState);
  game.state.add('main', MainState);
  game.state.start('load');
}

export default setup