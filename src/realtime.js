'use strict';

const mic = require('mic');
const speech = require('@google-cloud/speech');

const projectId = 'symbolic-envoy-163901';
const speechClient = speech({
  projectId: projectId
});

const languageCode = 'ja-JP';

let request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 16000,
    languageCode: languageCode
  },
  singleUtterance: false,
  interimResults: false,
  timeout: 10   // somehow this option is not working
};

let micInstance = mic({ 'rate': '16000', 'channels': '1', 'debug': false });
let micInputStream = micInstance.getAudioStream();

const duration = 20000;

micInputStream
  .on('startComplete', function() {
    console.log("[Recording started]");
  })
  .on('stopComplete', function() {
    console.log("[Recording stopped]");
  })
  .pipe(speechClient.createRecognizeStream(request))
  .on('error', console.error)
  .on('data', function(data) {
    if (data.results && data.results.length > 0) {
      console.log(data.results);
    }
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

process.on('SIGINT', () => {
  micInstance.stop();
  console.log('Program stopped.');
});

micInstance.start();

