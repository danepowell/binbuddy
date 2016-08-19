# binbuddy
Bin Buddy for Alexa tells you where to put trash using Whatbin.com. This project is not affiliated with Whatbin or Recology.

## How to use (developers)
Follow the steps in the following tutorial to create an AWS Lambda function and Alexa Skill (I am not affiliated with this site): http://tobuildsomething.com/2015/08/14/Amazon-Echo-Alexa-Tutorial-The-Definitive-Guide-to-Coding-an-Alexa-Skill/

- Upload assets in the `src` directory to your AWS Lambda function.
- Copy the speech assets into your Alexa Skill.
- (optional) use `create_values.js` to update the list of items using values from Whatbin.

## How to use (end users)
Enable the skill and try asking Alexa:

- “Alexa, ask Bin Buddy where to put envelopes?”
- “Alexa, ask Bin Buddy where apple cores go?”
- “Alexa, ask Bin Buddy what bin to put aluminum cans in?”

## Known issues
Alexa’s custom slot types are heavily biased towards the pre-defined terms. Thus, the “search” functionality on Whatbin will almost never be used, since Alexa will either choose a known term or abort. I tried using AMAZON.LITERAL as the slot type but Alexa then failed most requests.

Bin Buddy currently only returns results for San Francisco. I’d love to extend this to all of the other areas covered by Whatbin (most of the Bay Area and Seattle it seems) but Whatbin uses an annoying stateful architecture that makes it difficult to query other cities.

Pull requests are welcome to address any of these or other issues!
