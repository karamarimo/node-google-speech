'use strict';

const minimist = require('minimist');
const rec = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');

const options = {
  default: {
    'sample-rate': 16000,
    'language-code': 'en-US',   // list: https://cloud.google.com/speech/docs/languages
  },
  alias: {
    o: 'output',          // output file for transcription
    k: 'key-file',       // google cloud api key file
    p: 'project-name',  // google cloud project name for speech api
    l: 'language-code',
    s: 'sample-rate',
  }
};

const argv = minimist(process.argv.slice(2), options);

let speechClient = speech({
  projectId: argv.p,
  keyFile: argv.k
});

let request = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: argv.s,
    languageCode: argv.l
  },
  singleUtterance: false,
  interimResults: false,
};

let outStream;
if (argv.o) {
  const fs = require('fs');
  outStream = fs.createWriteStream(argv.o);
}

let recognizeStream = speechClient.createRecognizeStream(request);
let recordStream;
recognizeStream
  .on('error', (error) => {
    console.error(`Error happened: ${error}`);
  })
  .on('data', (data) => {
    console.log(data);
    if (data.error) {
      console.error('Error response returned from Google Speech API.');
      console.error(`Error code: ${data.error.code}\nError message: ${data.error.message}`);
      recognizeStream.name = 'imma recognize@!!!!!!!!!';
      recordStream.name = 'imma record!!!!!!!!!';
      recordStream.unpipe();
      recognizeStream.unpipe();
      recognizeStream.end();
      if (argv.o) {
        outStream.end();
      }
      setTimeout(() => {
        console.log(process._getActiveRequests());
        console.log(process._getActiveHandles());
      }, 1000);
    } else if (data.results && data.results.length > 0) {
      console.log('[Transcription] ' + data.results);
      if (argv.o) {
        outStream.write(data.results + '\n');
      }
    }
  });
  // .on('end', () => {
  //   console.log('All response returned.');
  //   if (argv.o) {
  //     outStream.end();
  //   }
  // });

process.on('exit', (code) => {
  if (argv.o) {
    outStream.end();
  }
  console.log(`Process stopped.`);
});

recordStream = rec.start({
  sampleRate : argv.s,
  verbose: true,
  silence: "1.0"
});
// recordStream.pipe(recognizeStream);

// let firstSIGINT = true;
// process.on('SIGINT', () => {
//   if (firstSIGINT) {
//     rec.stop();
//     console.log('Recording stopped. Ctrl-C again to force stop.');
//     firstSIGINT = false;
//   } else {
//     recognizeStream.end();
//     if (argv.o) {
//       outStream.end();
//       console.log(process._getActiveHandles().indexOf(outStream));
//     }
//     console.log('Killed.');
//   }
// });
console.log('Listening... Ctrl-C to stop.');
