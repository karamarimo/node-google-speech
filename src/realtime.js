'use strict';

const mic = require('mic');
const speech = require('@google-cloud/speech');

const projectId = 'symbolic-envoy-163901';
const speechClient = speech({
  projectId: projectId
});

let request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 16000,
    languageCode: 'en-US'
  },
  singleUtterance: true,
  interimResults: false,
};

let micInstance = mic({ 'rate': '16000', 'channels': '1', 'debug': false });
let micInputStream = micInstance.getAudioStream();

const duration = 20000;

micInputStream
  .on('startComplete', function() {
    console.log("Got SIGNAL startComplete");
    setTimeout(function() {
      micInstance.stop();
    }, duration);
  })
  .on('stopComplete', function() {
    console.log("Got SIGNAL stopComplete");
  })
  .on('end', function() {
    console.log("ended");
  })
  .on('finish', function() {
    console.log("finished");
  })
  .pipe(speechClient.createRecognizeStream(request))
  .on('error', console.error)
  .on('data', function(data) {
    console.log(data);
    // The first "data" event emitted might look like:
    //   data = {
    //     endpointerType: Speech.endpointerTypes.START_OF_SPEECH,
    //     results: "",
    //     ...
    //   }

    // A later "data" event emitted might look like:
    //   data = {
    //     endpointerType: Speech.endpointerTypes.END_OF_AUDIO,
    //     results: "",
    //     ...
    //   }

    // A final "data" event emitted might look like:
    //   data = {
    //     endpointerType:
    //       Speech.endpointerTypes.ENDPOINTER_EVENT_UNSPECIFIED,
    //     results: "how old is the Brooklyn Bridge",
    //     ...
    //   }
  });

micInstance.start();
