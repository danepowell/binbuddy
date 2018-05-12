# Bin Buddy
Bin Buddy for Alexa tells you where to put trash using the Whatbin / Recollect API. Currently it only works for San Francisco but could easily be extended to other areas covered by Recollect. This project is not affiliated with Whatbin, Recology, or Recollect.

## Live demo
Install and try the Alexa Skill yourself: https://www.amazon.com/Dane-Powell-Bin-Buddy/dp/B01KNAPS5I

Enable the skill and try asking:

- “Alexa, ask Bin Buddy where to put envelopes?”
- “Alexa, ask Bin Buddy where food scraps go?”
- “Alexa, ask Bin Buddy what bin to put aluminum cans in?”

## How to develop with this skill
To actually run this skill on Alexa, you’ll need to host it as an AWS Lambda function and create a corresponding Alexa skill.

- Run `npm install` in the `src` directory to install the Node dependencies.
- Upload assets in the `src` directory to your AWS Lambda function.
- Copy the speech assets into your Alexa Skill.
- (optional) use `create_values.js` to update the list of items using values from Whatbin.

## Known issues
Alexa’s custom slot types are heavily biased towards the pre-defined terms. Thus, the “search” functionality on Whatbin will almost never be used, since Alexa will either choose a known term or abort. I tried using AMAZON.LITERAL as the slot type but Alexa then failed most requests.

Bin Buddy currently only returns results for San Francisco. I’d love to extend this to all of the other areas covered by Recollect. This would just require mapping the available areas and allowing users to select them.

I also need to clean up / refresh the speech model following the switch to Recollect, and maybe reorganize the project structure to use the ASK CLI.

Pull requests are welcome to address any of these or other issues!

## Terms of Use and Privacy
This application doesn’t collect any personal information. See LICENSE for terms of use. I only request that you don't publish live skills based on this code that would directly compete with Bin Buddy. If you think you can improve on Bin Buddy, please submit a pull request!
