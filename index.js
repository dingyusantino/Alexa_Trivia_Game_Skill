/* Christmas_Trivia_Skill */
/* Author: Yu Ding */

'use strict';

const Alexa = require('alexa-sdk');
require('dotenv').config();
// const questions = require('./question');
const lvloneQuestions = require('./level1Question');
const lvltwoQuestions = require('./level2Question');
const lvlthreeQuestions = require('./level3Question');
const lvlfourQuestions = require('./level4Question');
const lvlfiveQuestions = require('./level5Question');

const ANSWER_COUNT = 4; // The number of possible answers per trivia question.
const GAME_LENGTH = 10; // The number of questions per trivia game.

const GAME_STATES = {
  TRIVIA: '_TRIVIAMODE', // Asking trivia questions.
  START: '_STARTMODE', // Entry point, start the game.
  HELP: '_HELPMODE', // The user is asking for help.
};

const APP_ID = 'amzn1.ask.skill.bd754c14-5bdd-4df8-bb1d-3d131cce7052';

const messageMetadata = {
  'account_id': process.env.ACCOUNT_ID,
  'platform': 'AMZN',
  'message_type': 'incoming',
};

const dmpConfig = {
  'mode': process.env.DMP_MODE,
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRET,
};

const dmp = require('dmp_external_sdk')(messageMetadata, dmpConfig);
/**
 * When editing your questions pay attention to your punctuation. Make sure you
 * use question marks or periods.
 * Make sure the first answer is the correct one. Set at least ANSWER_COUNT
 * answers, any extras will be shuffled in.
 */

const BAD_RESULT_MESSAGE = 'You can do much better than that! How about another round of punch and good ol\' Christmas Trivia with Alexa by saying start over?';
const MID_RESULT_MESSAGE = 'That wasn\'t too bad. You deserve all the jingly, jolly joys of Christmas. Care to say start over for another round of Christmas Trivia? ';
const GOOD_RESULT_MESSAGE = 'Well done! Glory to the new Christmas Trivia Quiz Champion.  You deserve to eat, drink and be merry. But you can say start over to challenge yourself again.';
const REPROMPT_MESSAGE = 'What are you waiting for, Christmas? ';
const FIRST_TIME_DONT_KNOW_MESSAGE = 'Give it a try. ';
const SECOND_TIME_DONT_KNOW_MESSAGE = 'Sorry, try to guess a number. ';

const ANSWER_CORRECT_MESSAGES = [ //Correct response array starts
  'Hey, how did you know that, ',
  'That\'s right, ',
  'That was an easy one. ',
  'You got it, ',
  'Spot on! ',
  'Great job! ',
  'Yaaaasss! ',
  'You\'re a genius! ',
  'That\'s correct! You\'re making Santa proud. ',
  'We\'ll play our drums for you! ',
  'Correct! If kisses were snowflakes, I\'d send you a blizzard. ',
  'Yes! It\'s beginning to look a lot like Christmas. ',
  'Joy to the world. That was right. ',
  'Every time you give the right answer, an angel gets its wings. ',
]; //Correct response array ends

const ANSWER_WRONG_MESSAGES = [ //Wrong response array starts
  'oops! ',
  'better luck next time! ',
  'Oooh, sorry that\'s incorrect! ',
  'Nice try, but no! ',
  'Study harder next time. ',
  'Bah, humbug. Someone needs to work on their Christmas Spirit. ',
  'Wrong. You get a lump of coal. ',
  'Incorrect, but you\'d better not pout and get the next one right! ',
  'That was incorrect, you seem to have your tinsel in a tangle. ',
  'Sorry, that\'s not right. If I could wish a wish for you, ' +
  'it would be for you to get the next one right. ',
]; //Wrong reponse array ends

const languageString = {
  'en': {
    'translation': {
      'LVLONEQUESTION': lvloneQuestions['QUESTIONS_EN_US'],
      'LVLTWOQUESTION': lvltwoQuestions['QUESTIONS_EN_US'],
      'LVLTHREEQUESTION': lvlthreeQuestions['QUESTIONS_EN_US'],
      'LVLFOURQUESTION': lvlfourQuestions['QUESTIONS_EN_US'],
      'LVLFIVEQUESTION': lvlfiveQuestions['QUESTIONS_EN_US'],
      'GAME_NAME': 'Chrismas Trivia Quiz', // Be sure to change this for your skill.
      'HELP_MESSAGE': 'I will ask you %s multiple choice questions. Respond with the number of the answer. ' +
        'For example, say one, two, three, or four. To start a new game at any time, say, start over. ',
      'REPEAT_QUESTION_MESSAGE': 'To repeat the last question, say, repeat. ',
      'ASK_MESSAGE_START': 'Would you like to start playing?',
      'HELP_REPROMPT': 'I will ask you 5 multiple choice questions. Respond with the number of the answer.' +
        'For example, say one, two, three, or four. To start a new game at any time, say, start over.',
      'STOP_MESSAGE': 'Would you like to keep playing?',
      'CANCEL_MESSAGE': 'Thanks for playing and Merry Christmas!',
      'NO_MESSAGE': 'Thanks for playing and Merry Christmas!',
      'RETURN_MESSAGE': 'Welcome back to Christmas Trivia! Do you want to start where you left off last time, or do you want to start over? Say saved or start over',
      'RETURN_REPROMPT': 'Say saved to start where you left off last time, or say start over to start a new game',
      'TRIVIA_UNHANDLED': 'Try saying a number between 1 and %s to answer the trivia questions',
      'HELP_UNHANDLED': 'Say yes to continue, or no to end the game.',
      'START_UNHANDLED': 'Say start over to start a new game.',
      'NEW_GAME_MESSAGE': 'Ho Ho Ho, how much Christmas trivia do you know? ',
      'WELCOME_MESSAGE': 'Here is how it works. I will ask you a question and give you four choices. You tell me the number, and I will tell you if your answer is correct. If you get it right, you\'ll be holly jolly. If you get it wrong, watch out for that lump of coal. Can you handle it? If so, say Let\'s go!',
      'ENTER_NEXT_LEVEL_MESSAGE': 'Say yes to enter next level or say no to end the game. ',
      'CORRECT_ANSWER_MESSAGE': '',
      'ANSWER_IS_MESSAGE': '',
      'NOT_ENOUGH_SCORE': 'Sorry, you don\'t have enough score to enter next level, why not try another round of Christmas Trivia Quiz by saying start over?',
      'TELL_QUESTION_MESSAGE': 'Question %s. %s ',
      'GAME_END_MESSAGE': 'That\'s it! Cheer begins now. Let\'s see how you did. You scored %s out of 50. ', //Game reach ends
      'LEVELFIVE_FINISHED_CONGRATZ': 'You\'ve competed level 5. You have now reached Christmas Nirvana. ',

      'LEVELTWO_START_MESSAGE' : 'No lump of coal for you! You go %s right out of 10. Are you ready to take your knowledge to the next level?',
      'LEVELTHREE_START_MESSAGE' : 'Wow, with a score of %s out of 20, you\'ve completed level 2. You\'re giving Santa a run for his sleigh. Are you ready to tighten that black belt up a notch and take it to the next level? ',
      'LEVELFOUR_START_MESSAGE' : 'Congrats! You\'ve completed level 3! Well aren\'t you a jolly ol\' elf! Let\'s see if you can one up yourself to the third degree. ',
      'LEVELFIVE_START_MESSAGE' : 'Well I\'ll be Santa\'s beard. You really do know your stuff! If you can complete this next level, you\'ll be right up there with Rudolph in Santa\'s book. ',
      'GAME_OVER_MESSAGE': 'Thanks for playing and Merry Christmas!',
      'SCORE_IS_MESSAGE': 'Your score is %s. ',
    },
  },
  'en-US': {
    'translation': {
      'LVLONEQUESTION': lvloneQuestions['QUESTIONS_EN_US'],
      'LVLTWOQUESTION': lvltwoQuestions['QUESTIONS_EN_US'],
      'LVLTHREEQUESTION': lvlthreeQuestions['QUESTIONS_EN_US'],
      'LVLFOURQUESTION': lvlfourQuestions['QUESTIONS_EN_US'],
      'LVLFIVEQUESTION': lvlfiveQuestions['QUESTIONS_EN_US'],
      'GAME_NAME': 'Chrismas Trivia Quiz', // Be sure to change this for your skill.
    },
  },
};

const newSessionHandlers = {
  'LaunchRequest': function() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState('BeforeGame', true);
  },
  'Unhandled': function() {
    const speechOutput = this.t('START_UNHANDLED');
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(':responseReady');
  },
};

function populateGameQuestions(translatedQuestions) {
  const gameQuestions = [];
  const indexList = [];
  let index = translatedQuestions.length;

  if (GAME_LENGTH > index) {
    throw new Error('Invalid Game Length.');
  }

  for (let i = 0; i < translatedQuestions.length; i++) {
    indexList.push(i);
  }

  // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
  for (let j = 0; j < GAME_LENGTH; j++) {
    const rand = Math.floor(Math.random() * index);
    index -= 1;

    const temp = indexList[index];
    indexList[index] = indexList[rand];
    indexList[rand] = temp;
    gameQuestions.push(indexList[index]);
  }
  return gameQuestions;
}
/**
 * Get the answers for a given question, and place the correct answer at the spot marked by the
 * correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
 * only ANSWER_COUNT will be selected.
 * */
function populateRoundAnswers(gameQuestionIndexes, correctAnswerIndex, correctAnswerTargetLocation, translatedQuestions) {
  const answers = [];
  let answersCopy = translatedQuestions[gameQuestionIndexes[correctAnswerIndex]][Object.keys(translatedQuestions[gameQuestionIndexes[correctAnswerIndex]])[1]].slice();
  // console.log('translatedQuestions >>>', translatedQuestions);
  // console.log('gameQuestionIndexes >>>', gameQuestionIndexes);
  // console.log('correctAnswerIndex >>>', correctAnswerIndex);
  let index = answersCopy.length;

  if (index < ANSWER_COUNT) {
    throw new Error('Not enough answers for question.');
  }

  // Shuffle the answers, excluding the first element which is the correct answer.
  for (let j = 1; j < answersCopy.length; j++) {
    const rand = Math.floor(Math.random() * (index - 1)) + 1;
    index -= 1;

    const swapTemp1 = answersCopy[index];
    answersCopy[index] = answersCopy[rand];
    answersCopy[rand] = swapTemp1;
  }

  // Swap the correct answer into the target location
  for (let i = 0; i < ANSWER_COUNT; i++) {
    answers[i] = answersCopy[i];
  }
  const swapTemp2 = answers[0];
  answers[0] = answers[correctAnswerTargetLocation];
  answers[correctAnswerTargetLocation] = swapTemp2;
  return answers;
}

//Helper function determines the speech output at the end of the quiz
//depends on the currentScore.
function finalResultOutput(savedScore) {
  if (savedScore <= 30) {
    return BAD_RESULT_MESSAGE;
  } else if (savedScore <= 40) {
    return MID_RESULT_MESSAGE;
  } else {
    return GOOD_RESULT_MESSAGE;
  }
}


function isAnswerSlotValid(intent) {
  const answerSlotFilled = intent && intent.slots && intent.slots.Answer && intent.slots.Answer.value;
  const answerSlotIsInt = answerSlotFilled && !isNaN(parseInt(intent.slots.Answer.value, 10));
  return answerSlotIsInt &&
    parseInt(intent.slots.Answer.value, 10) < (ANSWER_COUNT + 1) &&
    parseInt(intent.slots.Answer.value, 10) > 0;
}

function handleUserGuess(userGaveUp) {
  const answerSlotValid = isAnswerSlotValid(this.event.request.intent);
  let speechOutput = '';
  let speechOutputAnalysis = '';
  const gameQuestions = this.attributes.questions;
  let correctAnswerIndex = parseInt(this.attributes.correctAnswerIndex, 10);
  let currentScore = parseInt(this.attributes.score, 10);
  let currentQuestionIndex = parseInt(this.attributes.currentQuestionIndex, 10);
  //let gameLevel = parseInt(this.attributes.gameLevel, 10);
  const correctAnswerText = this.attributes.correctAnswerText;
  var translatedQuestions;
  if (this.attributes.gameLevel === 1){
      translatedQuestions = this.t('LVLONEQUESTION');
   }else if (this.attributes.gameLevel === 2){
    translatedQuestions = this.t('LVLTWOQUESTION');
   }else if (this.attributes.gameLevel === 3){
    translatedQuestions = this.t('LVLTHREEQUESTION');
   }else if (this.attributes.gameLevel === 4){
    translatedQuestions = this.t('LVLFOURQUESTION');
   }else if (this.attributes.gameLevel === 5){
    translatedQuestions = this.t('LVLFIVEQUESTION');
   }
  console.log("THIS IS WHATTTTTTTTTT", this.attributes.gameLevel);

  if (answerSlotValid && parseInt(this.event.request.intent.slots.Answer.value, 10) === this.attributes['correctAnswerIndex']) {
    currentScore++;
    speechOutputAnalysis = this.t(ANSWER_CORRECT_MESSAGES[Math.floor(Math.random() * ANSWER_CORRECT_MESSAGES.length)]);
  } else {
    if (!userGaveUp) {
      speechOutputAnalysis = this.t(ANSWER_WRONG_MESSAGES[Math.floor(Math.random() * ANSWER_WRONG_MESSAGES.length)]);
    }
  }

  // Check if we can exit the game session after GAME_LENGTH questions (zero-indexed)
  if (this.attributes['currentQuestionIndex'] === GAME_LENGTH - 1) {
    console.log('CONSOLE AAAAA');
    speechOutput = userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE');
    let rep = this.t(REPROMPT_MESSAGE);
    if(this.attributes.gameLevel === 1 && currentScore.toString() >= 5 ){
      this.attributes.savedScore = currentScore;
      console.log('CONSOLE BBBBBBB', currentScore, this.attributes.savedScore);
      speechOutput += speechOutputAnalysis + this.t('LEVELTWO_START_MESSAGE', this.attributes.savedScore.toString());
  }else if(this.attributes.gameLevel === 2 && currentScore.toString() >= 5 ){
  	this.attributes.savedScore += currentScore;
    console.log('CONSOLE CCCCCCCCC', currentScore, this.attributes.savedScore);
    speechOutput += speechOutputAnalysis + this.t('LEVELTHREE_START_MESSAGE', this.attributes.savedScore.toString());
  }else if(this.attributes.gameLevel === 3 && currentScore.toString() >= 5 ){
  	this.attributes.savedScore += currentScore;
    console.log('CONSOLE DDDDDDD', currentScore, this.attributes.savedScore);
    speechOutput += speechOutputAnalysis + this.t('LEVELFOUR_START_MESSAGE');
  }else if(this.attributes.gameLevel === 4 && currentScore.toString() >= 5 ){
    this.attributes.savedScore += currentScore;
    console.log('CONSOLE EEEEEEE', currentScore, this.attributes.savedScore);
    speechOutput += speechOutputAnalysis + this.t('LEVELFIVE_START_MESSAGE');
  }else{
    if(this.attributes.gameLevel === 5 && currentScore.toString() >= 5){
    this.attributes.savedScore += currentScore;
      console.log('CONSOLE FFFFFFFF', currentScore, this.attributes.savedScore);
      // speechOutput += speechOutputAnalysis + this.t('LEVELFIVE_FINISHED_CONGRATZ') + playMusic + this.t('GAME_END_MESSAGE', currentScore.toString()) + this.t(finalResultOutput(currentScore));
      speechOutput += speechOutputAnalysis + this.t('LEVELFIVE_FINISHED_CONGRATZ') + this.t('GAME_END_MESSAGE', this.attributes.savedScore.toString()) + this.t(finalResultOutput(this.attributes.savedScore));
    }else{
      console.log('CONSOLE GGGGGGG');
      speechOutput += speechOutputAnalysis + this.t('SCORE_IS_MESSAGE', currentScore.toString()) + this.t('NOT_ENOUGH_SCORE');
    }
    this.response.speak(speechOutput).listen(rep);
    this.emit(':responseReady');
  }
    this.response.speak(speechOutput).listen(rep);
    this.emit(':responseReady');

  } else {
    console.log('CONSOLE HHHHHHHHHHHH');
    currentQuestionIndex += 1;
    correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
    const spokenQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]];
    const roundAnswers = populateRoundAnswers.call(this, gameQuestions, currentQuestionIndex, correctAnswerIndex, translatedQuestions);
    const questionIndexForSpeech = currentQuestionIndex + 1;
    let currentQuestion = this.t('TELL_QUESTION_MESSAGE', questionIndexForSpeech.toString(), spokenQuestion);
    let repromptText = this.t(REPROMPT_MESSAGE);

    for (let i = 0; i < ANSWER_COUNT; i++) {
      currentQuestion += `${i + 1}. ${roundAnswers[i]}. `;
    }

    speechOutput += userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE');
    speechOutput += speechOutputAnalysis + this.t('SCORE_IS_MESSAGE', currentScore.toString()) + currentQuestion;
    Object.assign(this.attributes, {
      'speechOutput': currentQuestion,
      'repromptText': repromptText,
      'currentQuestionIndex': currentQuestionIndex,
      'correctAnswerIndex': correctAnswerIndex + 1,
      'questions': gameQuestions,
      'score': currentScore,
      'correctAnswerText': translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[1]][0],
    });

    this.response.speak(speechOutput).listen(repromptText);
    this.response.cardRenderer(this.t('GAME_NAME', repromptText));
    this.emit(':responseReady');
  }
}

const startStateHandlers = Alexa.CreateStateHandler(GAME_STATES.START, {
  'BeforeGame': function(newStart){
  	//Check endedSessionCount, and enter the return.
  	if(this.attributes.endedSessionCount != undefined){
  		console.log('endedSessionCount iiiiiiiis', this.attributes.endedSessionCount);
  		this.handler.state = GAME_STATES.START;
  		this.emit(':ask', 'RETURN_MESSAGE');
//  		this.emit(':confirmIntent', RETURN_MESSAGE, RETURN_REPROMPT, 'SavedIntent');
  	}else{
  	//Handle new user.
    let speechOutput = newStart ? this.t('NEW_GAME_MESSAGE', this.t('GAME_NAME')) + this.t('WELCOME_MESSAGE') : '';
    let repromptText = this.t(REPROMPT_MESSAGE);
    this.handler.state = GAME_STATES.START;
    this.response.speak(speechOutput).listen(repromptText);
    this.emit(':responseReady');
}
  },

  // 'SavedIntent': function(){
  // 	//TODO : save this.attributes variables.
  // },

  'LetsGoIntent': function() {
  	this.attributes.gameLevel = 1; //reset gameLevel into 1 to initiate the lvl 1 question sheet (value delivered)
  	this.attributes.savedScore = 0; //reset the savedScore into 0;
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', false);
  },

  'StartGame': function(newGame) {
    var gameLevel;
    console.log('Checkkkkkkkk gameLevel', this.attributes.gameLevel);
  	var savedScore;
    var translatedQuestions;
    let speechOutput = newGame ? this.t('NEW_GAME_MESSAGE', this.t('GAME_NAME')) + this.t('WELCOME_MESSAGE') : '';
    // Select GAME_LENGTH questions for the game
    // Identify the gameLevel and select the right question sheet.
   if (this.attributes.gameLevel === 1){
      translatedQuestions = this.t('LVLONEQUESTION');
   }else if (this.attributes.gameLevel === 2){
    speechOutput = "Ok, level 2, ";
    translatedQuestions = this.t('LVLTWOQUESTION');
    savedScore = this.attributes.savedScore; //value passed
    console.log('savedscoreeeeeeeeee', savedScore);
   }else if (this.attributes.gameLevel === 3){
    speechOutput = "Ok, level 3, ";
    translatedQuestions = this.t('LVLTHREEQUESTION');
    savedScore = this.attributes.savedScore; //value passed
    console.log('level3333333333', savedScore);
   }else if (this.attributes.gameLevel === 4){
    speechOutput = "Ok, level 4, ";
    translatedQuestions = this.t('LVLFOURQUESTION');
    savedScore = this.attributes.savedScore; //value passed
    console.log('level444444444', savedScore);
   }else if (this.attributes.gameLevel === 5){
    speechOutput = "Ok, level 5, ";
    translatedQuestions = this.t('LVLFIVEQUESTION');
    savedScore = this.attributes.savedScore; //value passed
    console.log('level5555555', savedScore);
   }

    const gameQuestions = populateGameQuestions(translatedQuestions);
    // Generate a random index for the correct answer, from 0 to 3
    const correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
    // Select and shuffle the answers for each question
    const roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex, translatedQuestions);
    const currentQuestionIndex = 0;
    const spokenQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]];
    let currentQuestion = this.t('TELL_QUESTION_MESSAGE', '1' , spokenQuestion);
    let repromptText = this.t(REPROMPT_MESSAGE);

    for (let i = 0; i < ANSWER_COUNT; i++) {
      currentQuestion += `${i + 1}. ${roundAnswers[i]}. `;
    }
    speechOutput += currentQuestion;

    Object.assign(this.attributes, {
      'speechOutput': currentQuestion,
      'repromptText': repromptText,
      'currentQuestionIndex': currentQuestionIndex,
      'correctAnswerIndex': correctAnswerIndex + 1,
      'questions': gameQuestions,
      'score': 0,
      'saved': savedScore,
      'correctAnswerText': translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[1]][0],
    });

    // Set the current state to trivia mode. The skill will now use handlers defined in triviaStateHandlers
    this.handler.state = GAME_STATES.TRIVIA;

    this.response.speak(speechOutput).listen(repromptText);
    this.response.cardRenderer(this.t('GAME_NAME'), currentQuestion);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function() {
    this.handler.state = GAME_STATES.HELP;
    this.emitWithState('helpTheUser', false);
  },
  'AMAZON.StopIntent': function() {
    this.handler.state = GAME_STATES.HELP;
    const speechOutput = this.t('STOP_MESSAGE');
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(this.t('CANCEL_MESSAGE'));
    this.emit(':responseReady');
  },
});

const triviaStateHandlers = Alexa.CreateStateHandler(GAME_STATES.TRIVIA, {
  'AnswerIntent': function() {
    console.log('AnswerIntent');
    handleUserGuess.call(this, false); // By setting boolean to false, the answer passed into slot and being verified by right answer.
  },
  'DontKnowIntent': function() {
    // if(DONT_KNOW_COUNT < 1){
      this.response.speak(this.t(FIRST_TIME_DONT_KNOW_MESSAGE) + this.attributes['speechOutput']).listen(this.attributes['repromptText']);
    this.emit(':responseReady');
      // DONT_KNOW_COUNT = 2;
   // }else {
    // this.emit(':ask', SECOND_TIME_DONT_KNOW_MESSAGE, REPROMPT_MESSAGE);
    // handleUserGuess.call(this, true); // take user's response after user said don't know
  //}
},
  'AMAZON.StartOverIntent': function() {
    this.attributes.gameLevel = 1; //reset gameLevel into 1 to initiate the lvl 1 question sheet (value delivered)
  	this.attributes.savedScore = 0; //reset the savedScore into 0;
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', false);
  },
  'AMAZON.RepeatIntent': function() {
    this.response.speak(this.attributes['speechOutput']).listen(this.attributes['repromptText']);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function() {
    this.handler.state = GAME_STATES.HELP;
    this.emitWithState('helpTheUser', false);
  },
  'AMAZON.NoIntent': function() {
    const speechOutput = this.t('NO_MESSAGE');
    this.response.speak(speechOutput);
    this.emit(':responseReady');
  },
  //YesIntent manage users input to go next level of questions, by adding gameLevel by 1;
  'AMAZON.YesIntent': function() {
    this.attributes.gameLevel += 1;
    console.log('gameLevel equals ================', this.attributes.gameLevel);
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', false);
  },
  'AMAZON.StopIntent': function() {
    this.handler.state = GAME_STATES.HELP;
    const speechOutput = this.t('STOP_MESSAGE');
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(this.t('CANCEL_MESSAGE'));
    this.emit(':responseReady');
  },
  'Unhandled': function() {
    console.log('Unhandled');
    const speechOutput = this.t('TRIVIA_UNHANDLED', ANSWER_COUNT.toString());
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function() {
    console.log("There should not have any error anymore");
//	  this.attributes['endedSessionCount'] += 1;
//  this.emit(':saveState', false); // Be sure to call :saveState to persist your session attributes in DynamoDB
  },
});

const helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
  'helpTheUser': function(newGame) {
    const askMessage = newGame ? this.t('ASK_MESSAGE_START') : this.t('REPEAT_QUESTION_MESSAGE') + this.t('STOP_MESSAGE');
    const speechOutput = this.t('HELP_MESSAGE', GAME_LENGTH) + askMessage;
    const repromptText = this.t('HELP_REPROMPT') + askMessage;

    this.response.speak(speechOutput).listen(repromptText);
    this.emit(':responseReady');
  },
  'AMAZON.StartOverIntent': function() {
    this.attributes.gameLevel = 1; //reset gameLevel into 1 to initiate the lvl 1 question sheet (value delivered)
  	this.attributes.savedScore = 0; //reset the savedScore into 0;
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', true);
  },
  'AMAZON.RepeatIntent': function() {
    const newGame = !(this.attributes['speechOutput'] && this.attributes['repromptText']);
    this.emitWithState('helpTheUser', newGame);
  },
  'AMAZON.HelpIntent': function() {
    const newGame = !(this.attributes['speechOutput'] && this.attributes['repromptText']);
    this.emitWithState('helpTheUser', newGame);
  },
  'AMAZON.YesIntent': function() {
    if (this.attributes['speechOutput'] && this.attributes['repromptText']) {
      this.handler.state = GAME_STATES.TRIVIA;
      this.emitWithState('AMAZON.RepeatIntent');
    } else {
      this.handler.state = GAME_STATES.START;
      this.emitWithState('StartGame', false);
    }
  },
  'AMAZON.NoIntent': function() {
    const speechOutput = this.t('NO_MESSAGE');
    this.response.speak(speechOutput);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function() {
    const speechOutput = this.t('STOP_MESSAGE');
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(this.t('CANCEL_MESSAGE'));
    this.emit(':responseReady');
  },
  'Unhandled': function() {
    const speechOutput = this.t('HELP_UNHANDLED');
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function() {
    console.log("There should not have any error anymore");
  },
});

// function setUp() {
//   return new Promise(function(resolve, reject) {
//     const AWS = require('aws-sdk');
//     AWS.config.update({
//       region: 'us-east-1',
//     });
//     if (process.env.ENV_VARIABLE) {
//       const credentials = new AWS.SharedIniFileCredentials({
//         profile: 'default',
//       });
//       AWS.config.credentials = credentials;
//       let sts = new AWS.STS({
//         apiVersion: '2011-06-15',
//       });
//       let options;
//       let roleparams = {
//         RoleArn: 'arn:aws:iam::679125658632:role/AlexaDeveloperRole',
//         RoleSessionName: 'AlexaDeveloperRole1',
//       };
//       sts.assumeRole(roleparams, function(err, data) {
//         if (err) {
//           console.log(err, err.stack);
//           reject(err);
//         } else {
//           let creds = new AWS.Credentials(data.Credentials.AccessKeyId, data.Credentials.SecretAccessKey, data.Credentials.SessionToken);
//           console.log('this is creds......' + creds);
//           AWS.config.credentials = creds;
//           resolve();
//         }
//       });
//     } else {
//       resolve();
//     }
//   });
// }

exports.handler = dmp.alexa.handler(function(event, context, callback) {
  console.log('EVENT>>', event);
  // console.log('context>>', context);
  console.log('callback>>', callback);
  // setUp().then(function() {
    let alexa = Alexa.handler(event, context);
    // alexa.registerHandlers(newSessionHandlers);
    // console.log(event, callback);
    // setBackground().then(function(result) {
    alexa.appId = APP_ID;
    alexa.resources = languageString;
  alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
    alexa.execute();

// });
});




// exports.handler = dmp.alexa.handler(function(event, context, callback) {
//   const alexa = Alexa.handler(event, context);
//   alexa.appId = APP_ID;
//   // To enable string internationalization (i18n) features, set a resources object.
//   alexa.resources = languageString;
//   alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
//   alexa.execute();
// });
