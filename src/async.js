const speech = require('@google-cloud/speech');

const projectId = 'symbolic-envoy-163901';
const speechClient = speech({
  projectId: projectId
});

const fileName = '/Users/ryo/Downloads/voice-jp.flac';

const config = {
  encoding: 'FLAC',
  sampleRate: 44100,
  languageCode: 'ja-JP'
};

const callback = (err, operation) => {
  if (err) {
    console.log('Error occured!')
    console.log(err.message || err);
  } else {
    operation
      .on('error', () => {
        console.log('Error occured while processing.');
      }).on('complete', (transcript) => {
        console.log(`Transcription: ${transcript}`);
      });
  }
}

speechClient.startRecognition(fileName, config, callback);
