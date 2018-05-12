'use strict';

const Alexa = require('ask-sdk-core');
const rp = require('request-promise-native');

// Generates a URL used to search for an item and return a list of possible matches.
const searchUrl = function (itemName) {
    itemName = itemName.replace(' ', '+');
    return 'https://recollect.net/api/areas/recology-1051/services/waste/pages?suggest=' + escape(itemName) + '&type=material&set=default&include_links=true&locale=en-US&accept_list=true';
};

// Generates a URL used to return a specific item.
const itemUrl = function (itemId) {
    return 'https://recollect.net/api/areas/recology-1051/services/waste/pages/en-US/' + itemId + '.json';
}

// Generates options for request-promise.
const searchOptions = function (itemName) {
    return {
        method: 'GET',
        uri: searchUrl(itemName),
        json: true
    }
}

// Generates options for request-promise.
const itemOptions = function (itemId) {
    return {
        method: 'GET',
        uri: itemUrl(itemId),
        json: true
    }
}
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Bin Buddy can tell you where to put any item.';
        const repromptText = 'Ask me where to put an item.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard('Bin Buddy', speechText)
            .getResponse();
    }
};

const GetItemIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetItemIntent';
    },
    async handle(handlerInput) {
        const itemSlot = handlerInput.requestEnvelope.request.intent.slots.Item;
        let itemName;
        let binName = 'unknown';
        if (!itemSlot || !itemSlot.value) {
            return handlerInput.responseBuilder
                .speak("Sorry, I didn't hear an item name. Ask where to put an item.")
                .getResponse();
        }
        itemName = itemSlot.value.toLowerCase();
        console.log('Item name is ' + itemName);
        await rp(searchOptions(itemName))
            .then(function (items) {
                if (!items || !items[0] || !items[0].id) {
                    console.log('No item found');
                    return;
                }
                const itemId = items[0].id;
                console.log('Item ID is ' + itemId);
                return rp(itemOptions(itemId))
                    .then(function (item) {
                        binName = item.sections[1].title;
                        console.log('Bin name is ' + binName);
                    });
            });
        let speechText = "Sorry, I don't know where to put " + itemName;
        if (binName != 'unknown') {
            const speechText = 'Please put ' + itemName + ' in the ' + binName + ' bin';
        }
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Bin Buddy', speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Bin Buddy can tell you where to put any item.';
        const repromptText = 'Ask me where to put an item.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard('Bin Buddy', speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Bin Buddy', speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler,
        GetItemIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .lambda();