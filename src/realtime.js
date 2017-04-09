'use strict';

const rec = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');

const projectId = 'symbolic-envoy-163901';
const speechClient = speech({
  projectId: projectId
});

const languageCode = 'ja-JP';
const sampleRate = 44100;

let request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: sampleRate,
    languageCode: languageCode
  },
  singleUtterance: false,
  interimResults: false,
  timeout: 10   // somehow this option is not working
};

rec.start({
  sampleRate : sampleRate,
  verbose : false
}).pipe(speechClient.createRecognizeStream(request))
  .on('error', console.error)
  .on('data', function(data) {
    if (data.results && data.results.length > 0) {
      console.log(data.results);
    }
  });

console.log('Ctrl-C(SIGINT) to stop.');
