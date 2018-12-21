/**
 * @fileoverview Intent unit testing.
 * @author
 */

/*jslint node: true, esversion: 6 */

const WELCOME_MESSAGE = "";
const HELP_MESSAGE = "";
const STOP_MESSAGE = "Would you like to keep playing?";
const CANCEL_MESSAGE = 'Thanks for playing and Merry Christmas!';

const chai = require('chai');
chai.use(require('chai-string'));
const should = chai.should,
  assert = chai.assert,
  expect = chai.expect,
  bst = require('bespoken-tools');

let server = null;
let alexa = null;

//TODO: ask or search about the following two parts
beforeEach(function(done) {
  this.timeout(10000);
  server = new bst.LambdaServer('./index.js', 10000, true);
  alexa = new bst.BSTAlexa('http://localhost:10000',
    './speechAssets/IntentSchema.json',
    './speechAssets/Utterances.txt',
    'amzn1.ask.skill.bd754c14-5bdd-4df8-bb1d-3d131cce7052');
  server.start(function() {
    alexa.start(function(error) {
      if (error !== undefined) {
        console.error('Error: ' + error);
      } else {
        done();
      }
    });
  });
});

afterEach(function(done) {
  this.timeout(10000);
  alexa.stop(function() {
    server.stop(function() {
      done();
    });
  });
});


/*Done testing*/

it('Launch the game', function(done) {
  this.timeout(30000);
  // Launch the skill via sending it a LaunchRequest
  alexa.launched(function(error, payload) {
    // Check that the welcome response is correct.
    console.log('Welcome>>>>>>');
    assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
    assert.equal(payload.response.outputSpeech.type, 'SSML');
    done();
    });

    //Emulate the user said lets go.
    alexa.intended('LetsGoIntent',{},
      function(error, payload) {
      console.log('user said lets go>>>>>', payload);
      // Ensure the right response is returned
      assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
      assert.equal(payload.response.outputSpeech.type, 'SSML');
    });


    //Emulate the first question response.
    alexa.intended('AnswerIntent', {
      "Answer": '4'
    }, function(error, payload) {
      console.log('First Answer!!!', payload);
      assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
      assert.equal(payload.response.outputSpeech.type, 'SSML');
      done();
    });


    // //Emulate the second question response.
    // alexa.intended('AnswerIntent', {
    //   "Answer": '3'
    // }, function(error, payload) {
    //   console.log('First Answer!!!', payload);
    //   assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
    //   assert.equal(payload.response.outputSpeech.type, 'SSML');
    // });

    // //Emulate the third question response.
    // alexa.intended('AnswerIntent', {
    //   "Answer": '2'
    // }, function(error, payload) {
    //   console.log('First Answer!!!', payload);
    //   assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
    //   assert.equal(payload.response.outputSpeech.type, 'SSML');
    // });



    // // //Emulate the user saying, "yes"
    // // alexa.intended('AMAZON.YesIntent', {},
    // //   function(error, payload) {
    // // // Ensure the right response is returned
    // //   assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
    // //   assert.equal(payload.response.outputSpeech.type, 'SSML');

    // //   });

    // //Emulate the third question response.
    // alexa.intended('AnswerIntent', {
    //   "Answer": '2'
    // }, function(error, payload) {
    //   console.log('First Answer!!!', payload);
    //   assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
    //   assert.equal(payload.response.outputSpeech.type, 'SSML');
    //   done();
    // });


});


/* Done testing */

// it('Testing HelpIntent and AMAZON.StartOverIntent after Welcome message', function(done) {
  // this.timeout(10000);
  // // Launch the skill via sending it a LaunchRequest
  // alexa.launched(function(error, payload) {
  //   // Check that the welcome response is correct
  //   // console.log('payload>>>>>', payload);
  //   assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ' + WELCOME_MESSAGE);
  //   assert.equal(payload.response.outputSpeech.type, 'SSML');

  //   // Emulate the user saying, "help"
  //   alexa.intended('AMAZON.HelpIntent', {},
  //     function(error, payload) {
  //       // Ensure the right response is returned
  //       assert.equal(payload.response.outputSpeech.ssml, '<speak> ' + HELP_MESSAGE + ' </speak>');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//       });

//     //Emulate the user saying, "start"
//     alexa.intended('AMAZON.StartOverIntent', {},
//       function(error, payload) {
//         // Ensure the right response is returned
//         assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//         done();
//       });
//   });
// });

/* Done testing */

// it('Testing StopIntent and CancelIntent after Welcome message', function(done) {
//   this.timeout(30000);
//   // Launch the skill via sending it a LaunchRequest
//   alexa.launched(function(error, payload) {
//     // Check that the welcome response is correct
//     assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ' + WELCOME_MESSAGE);
//     assert.equal(payload.response.outputSpeech.type, 'SSML');

//     // Emulate the user saying, "stop"
//     alexa.intended('AMAZON.StopIntent', {},
//       function(error, payload) {
//         // Ensure the right response is returned
//         assert.equal(payload.response.outputSpeech.ssml, '<speak> ' + STOP_MESSAGE + ' </speak>');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//       });

//     // Emulate the user saying, "cancel"
//     alexa.intended('AMAZON.CancelIntent', {},
//       function(error, payload) {
//         // Ensure the right response is returned
//         assert.equal(payload.response.outputSpeech.ssml, '<speak> ' + CANCEL_MESSAGE + ' </speak>');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//         done();
//       });
//   });
// });


/*Done Testing*/

// it('Testing when user said repeat', function(done) {
//   this.timeout(30000);
//   console.log('payload>>>>>>');
//   // Launch the skill via sending it a LaunchRequest
//   alexa.launched(function(error, payload) {
//     // Check that the welcome response is correct
//     console.log('payload>>>>>', payload);
//     assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ' + WELCOME_MESSAGE);
//     assert.equal(payload.response.outputSpeech.type, 'SSML');

//     //Emulate the first question response.
//     alexa.intended('AnswerIntent', {
//       "Answer": '3'
//     }, function(error, payload) {
//       console.log('second payload', payload);
//       assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
//       assert.equal(payload.response.outputSpeech.type, 'SSML');
//     });

//     //Emulate the user saying "repeat"
//     alexa.intended('AMAZON.RepeatIntent', {},
//       function(error, payload) {
//         // Ensure the right response is returned
//         assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//         done();
//       });
//   });
// });


/*Dont Testing*/


// it('Testing StopIntent and NoIntent', function(done) {
//   this.timeout(10000);
//   // Launch the skill via sending it a LaunchRequest
//   alexa.launched(function(error, payload) {
//     // Check that the welcome response is correct
//     // console.log('payload>>>>>', payload);
//     assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ' + WELCOME_MESSAGE);
//     assert.equal(payload.response.outputSpeech.type, 'SSML');

//     // Emulate the user saying, "stop"
//     alexa.intended('AMAZON.StopIntent', {},
//       function(error, payload) {
//         // Ensure the right response is returned
//         assert.equal(payload.response.outputSpeech.ssml, '<speak> ' + STOP_MESSAGE + ' </speak>');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//       });

//     // //Emulate the user saying, "Yes"
//     alexa.intended('AMAZON.YesIntent', {},
//       function(error, payload) {
//         // Ensure the right response is returned
//         assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//         done();
//       });
//   });
// });







/*Done Testing*/

// it('Testing when user said I dont know', function(done) {
//   this.timeout(30000);
//   // Launch the skill via sending it a LaunchRequest
//   alexa.launched(function(error, payload) {
//     // Check that the welcome response is correct
//     assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ' + WELCOME_MESSAGE);
//     assert.equal(payload.response.outputSpeech.type, 'SSML');

//     //Emulate the first question response.
//     alexa.intended('AnswerIntent', {
//       "Answer": '3'
//     }, function(error, payload) {
//       console.log('second payload', payload);
//       assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
//       assert.equal(payload.response.outputSpeech.type, 'SSML');
//     });

//     //Emulate the user first time say "I dont know".
//     alexa.intended('DontKnowIntent',{},
//       function(error,payload){
//         console.log('first call DontKnowIntent<<<<', payload)
//         assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//       })

//     //Emulate the user second time say "I dont know".
//     alexa.intended('DontKnowIntent', {},
//       function(error, payload) {
//         console.log('second call DontKnowIntent>>>>', payload)
//         // Ensure the right response is returned
//         assert.startsWith(payload.response.outputSpeech.ssml, '<speak> ');
//         assert.equal(payload.response.outputSpeech.type, 'SSML');
//         done();
//       });
//   });
// });
