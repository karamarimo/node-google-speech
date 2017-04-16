const speech = require('@google-cloud/speech');

const projectId = 'symbolic-envoy-163901';
const speechClient = speech({
  // projectId: projectId
});

const fileName = '/Users/ryo/Downloads/voice-jp.flac';

const config = {
  encoding: 'FLAC',
  sampleRateHertz: 44100,
  languageCode: 'ja-JP'
};

const callback = (err, results) => {
  if (err) {
    console.log('Error occured!')
    console.log(err.message || err);
  } else {
    console.log(`Transcription: ${results}`);
  }
}

speechClient.recognize(fileName, config, callback);
