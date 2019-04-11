
// index.js START - version 00
const Alexa = require('ask-sdk-core');

// Helper function for random numbers
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function for APL check
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.hasOwnProperty('Alexa.Presentation.APL');
  return hasDisplay;
}


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Ciao!';
        // ADD APL DIRECTIVE HERE in LaunchRequestHandler
        const imageOutput = 'https://s3-eu-west-1.amazonaws.com/ask-it-test-skills/images/landscape-3779159_1920.jpg';
        if (supportsDisplay(handlerInput))
        {
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: 'any',
                version: '1.0',
                document: require("main_1.json"),
                datasources: {
                  "workshopData": {
                    "type": "object",
                    "properties": {
                      "backgroundImage" : imageOutput
                    }
                  }
                }
            });
        }





        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const PickANumberIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'PickANumberIntent')
        || ( handlerInput.requestEnvelope.request.type ==='Alexa.Presentation.APL.UserEvent' &&  handlerInput.requestEnvelope.request.arguments[0] &&  handlerInput.requestEnvelope.request.arguments[0] ==='newNumber') ;
    },
    handle(handlerInput) {
        const extractedNumber = getRandomIntInclusive(1, 10);
        const speechText = 'Ho estratto il numero ' +  extractedNumber;
        // ADD APL DIRECTIVE HERE


        if (supportsDisplay(handlerInput)) // Device Detection
          {
             // APL Template - Begin
            handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: 'any',
                    version: '1.0',
                    document: require("main_2.json"),
                    datasources: {
                      "workshopData": {
                            "type": "object",
                            "properties": {
                              "backgroundImage": [
                                "https://s3-eu-west-1.amazonaws.com/ask-it-test-skills/images/christmas-motif-3834860_1920.jpg",
                                "https://s3-eu-west-1.amazonaws.com/ask-it-test-skills/images/landscape-3779159_1920.jpg",
                                "https://s3-eu-west-1.amazonaws.com/ask-it-test-skills/images/northern-lights-3847784_1920.jpg"
                              ],
                              "logoImage": "https://s3-eu-west-1.amazonaws.com/ask-it-test-skills/images/sample_logo.png",
                              "karFactSsml": speechText,
                              "primaryText": "Ho estratto il mumero:",
                              "hintString": "chiedi a gatto verde un numero!",
                              "event_1": "newNumber",
                              "event_2": "none",
                              "event_3": "exit",
                              "channel_1": "Nuovo Numero",
                              "channel_2":  extractedNumber,
                              "channel_3": "Esci"
                            },
                            "transformers": [
                              {
                                "inputPath": "hintString",
                                "transformer": "textToHint"
                              },
                              {
                                "inputPath": "karFactSsml",
                                "outputName": "karFactSpeech",
                                "transformer": "ssmlToSpeech"
                               }
                            ]
                          }
                        }
                  });
                    handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.ExecuteCommands',
                    token: 'any',
                    commands: [{
                      type: "Sequential",
                      "commands": [
                        {
                          "type": "AutoPage",//scorrimento inizale
                          "componentId": "backgroundPager",//sta in main2
                          "duration" : 1000
                        },
                        {
                          "type": "SpeakItem",//fa parlare alexa via apl
                          "componentId" : "karFactText",
                          "highlightMode": "line",
                          "align": "center"
                        }
                      ]
                    }]
                });

          }
        else {
             handlerInput.responseBuilder.speak(speechText)
        }
        return handlerInput.responseBuilder.getResponse();


    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'))
            ||  (handlerInput.requestEnvelope.request.type ==='Alexa.Presentation.APL.UserEvent' &&  handlerInput.requestEnvelope.request.arguments[0] &&  handlerInput.requestEnvelope.request.arguments[0] ==='exit');
    },
    handle(handlerInput) {
        const speechText = 'Alla prossima!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};


const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PickANumberIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
        )
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
// index.js END - version 00
