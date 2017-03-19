var score1 = 0;
var score2 = 0;
var player1 = 'default1';
var player2 = 'default2';
var highscore = 0;
var birdLivesAgain = 0

export const getScore = (player) => {
  return player === 1 ? score1 : score2
}

export const getPlayer = (number) => {
  return number === 1 ? player1 : player2
}

export const setPlayerScore = (number, value) => {
  if(number === 1) score1 = value
  score2 = value
}
export const getBirdLivesAgain = () => {
  return birdLivesAgain
}
export const setBirdLivesAgain = (number) => {
  birdLivesAgain = number
}

export const getHighScore = () => {
  return highscore
}
export const setHighScore = (number) => {
  highscore = number
}



