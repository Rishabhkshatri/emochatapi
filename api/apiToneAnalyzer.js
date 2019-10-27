const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
var u_socket = require('./resource.js');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: 'uCQ0hy2IXk54GflkzFh7u7M8ep_rCUS7XEzmOKqqxrBp',
  }),
  url: 'https://gateway-lon.watsonplatform.net/tone-analyzer/api',
});

exports.tokenAnalyzer = (con,msg_obj)=>{
  if(msg_obj['chat_id'] !== undefined && msg_obj['chat_id'] !== 0){
    const toneParams = {
      toneInput: { 'text': msg_obj['message'] },
      contentType: 'application/json',
    };

    toneAnalyzer.tone(toneParams).then(toneAnalysis => {
      msg_obj['message_tone'] = "";
      if(toneAnalysis.result.document_tone.tones.length !== 0)
        msg_obj['message_tone'] = toneAnalysis.result.document_tone.tones[0].tone_id;
        updateDB(con,msg_obj);
      })
      .catch(err => {
        msg_obj['message_tone'] = ""; 
        updateDB(con,msg_obj);
      });
  }
}

function updateDB(con,msg_obj){
  if(con !== undefined){
    let update_tone = `UPDATE temo_chat SET message_tone = '${msg_obj['message_tone']}' WHERE chat_id = ${msg_obj['chat_id']}`;
    con.query(update_tone,(err,sql_res)=>{
      if(err){
        msg_obj['message_tone'] = "";
      }
      u_socket.SEvents.emit("newMsg",msg_obj['s_user_id'],msg_obj);
      u_socket.SEvents.emit("newMsg",msg_obj['r_user_id'],msg_obj);
    });
  }
}