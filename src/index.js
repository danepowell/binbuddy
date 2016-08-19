console.log("Initializing");

var http = require('http');
var AlexaSkill = require('./AlexaSkill');
var APP_ID = process.env.APP_ID;

var url = function(item) {
  item = item.replace(' ', '+');
  return 'http://whatbin.com/index.php?r=site%2Frequest&search=' + escape(item) + '&yt0=Search';
};

var getHtmlFromWhatbin = function(item, callback) {
  http.get(url(item), function(res){
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function(){
      var result = body;
      callback(result);
    });

  }).on('error', function(e){
    console.log('Error: ' + e);
  });
};

var handleItemRequest = function(intent, session, response) {
  var itemName = intent.slots.Item.value;
  console.log("Handling item request for " + itemName + "...");

  if (!itemName) {
    response.ask("Sorry, I didn't hear an item name. Ask me where to put an item.");
    return;
  }

  getHtmlFromWhatbin(itemName, function(data){
    var re = data.match(/<h2>\s*?(.*?)\s*?<\/h2>/g);
    var message = re[0];
    message = message.replace(/<h2>/g, '');
    message = message.replace(/<\/h2>/g, '');
    message = message.replace(/^\s+|\s+$/g, '');
    if (message.indexOf("Search results for") !== -1){
      var regex = /search=(.*?)">[A-Z]/g;
      var item;
      message = "I can tell you about the following items: ";
      while (item = regex.exec(data)) {
        message = message + item[1] + ",";
      }
    }
    console.log(message);
    response.tellWithCard(message, "Bin Buddy", message);
  });
};

var Item = function() {
  AlexaSkill.call(this, APP_ID);
};

Item.prototype = Object.create(AlexaSkill.prototype);
Item.prototype.constructor = Item;

Item.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

function getHelp(response) {
  var output = 'Bin Buddy can tell you where to put any item.';
  var reprompt = 'Ask me where to put an item.';
  response.ask(output, reprompt);
}

Item.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  getHelp(response);
  console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

Item.prototype.intentHandlers = {
  "GetItemIntent": function(intent, session, response) {
    handleItemRequest(intent, session, response);
  },

  "HelpIntent": function(intent, session, response) {
    getHelp(response);
  },

  "AMAZON.CancelIntent": function(intent, session, response) {
    response.tell('Goodbye.');
  },

  "AMAZON.StopIntent": function(intent, session, response) {
    response.tell('Goodbye.');
  }
};

exports.handler = function(event, context) {
  var skill = new Item();
  skill.execute(event, context);
};
