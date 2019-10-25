const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: 'uCQ0hy2IXk54GflkzFh7u7M8ep_rCUS7XEzmOKqqxrBp',
  }),
  url: 'https://gateway-lon.watsonplatform.net/tone-analyzer/api',
});

exports.tokenAnalyzer = (msg_text)=>{
  const toneParams = {
    toneInput: { 'text': msg_text },
    contentType: 'application/json',
  };

  return toneAnalyzer.tone(toneParams);
}
