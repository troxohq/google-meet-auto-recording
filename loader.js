var recordOnlyIfIncludes = 'Daily video';
var useCamera = true;
/**
 * Auto record if Google Meet title includes "recordOnlyIfIncludes" value
 * Turn Camera ON/OFF if "useCamera" is true/false
 * Necessary to have "var", because "let" does not work with typeof-undefined check in process.js
 */

let requestInProgress = false;
const start = Date.now();
console.log(`=== Auto recording check started ===`);
function startAutoRecording() {
  if (!document.title.includes(recordOnlyIfIncludes)) {
    /* Wait for 5s that "recordOnlyIfIncludes" appears */
    if ((Date.now() - start) < 10000) {
      console.log(`=== Waiting for "${recordOnlyIfIncludes}" title... ===`);
      setTimeout(startAutoRecording, 100);
    } else {
      console.log(`=== Missing "${recordOnlyIfIncludes}" title. Auto recording cancelled ===`);
    }
  } else {
    loadAutoRecordingScript();
  }
}
setTimeout(startAutoRecording, 200);

function loadAutoRecordingScript() {
  console.log('=== Loading of auto-recording script initiated! ===');
  if (!requestInProgress) {
    /* Dynamically load the automation recording script */
    requestInProgress = true;
    const scriptURL = 'https://raw.githubusercontent.com/troxohq/google-meet-auto-recording/main/process.js';

    fetch(scriptURL).then(response => response.text())
    .then(scriptCode => {
      const scriptElement = document.createElement('script');
      scriptElement.textContent = scriptCode;//`const recordOnlyIfIncludes = '${recordOnlyIfIncludes}'; ${response}`;
      document.body.appendChild(scriptElement);
      console.log('=== Loading of auto-recording script completed! ===');
    })
    .catch(error => {
      console.error('== Loading of auto-recording script ERROR:', error);
    })
    .finally(() => {
      requestInProgress = false;
    });
    console.log('=== Loading of auto-recording script started! ===');
  } else {
    console.log('=== Loading of auto-recording script... ===');
  }
}