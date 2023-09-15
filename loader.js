var recordOnlyIfIncludes = 'Daily video';
var useCamera = true;
/**
 * Auto record if Google Meet title includes "recordOnlyIfIncludes" value
 * Turn Camera ON/OFF if "useCamera" is true/false
 */
function startAutoRecording() {
  if (!document.title.includes(recordOnlyIfIncludes)) {
    /* Wait for 5s that "recordOnlyIfIncludes" appears */
    if ((Date.now() - start) < 10000) {
      console.log('=== Loader ===', `Waiting for "${recordOnlyIfIncludes}" title...`);
      setTimeout(startAutoRecording, 500);
    } else {
      console.log('=== Loader ===', `Missing "${recordOnlyIfIncludes}" title. Auto recording cancelled!`);
    }
  } else {
    /* Meeting Title elibible for Auto-recording script  */
		loadAutoRecordingScript();
  }
}

console.log('=== Loader ===', 'Auto recording check started');
let requestInProgress = false;
const start = Date.now();
startAutoRecording();

/* Add content of the GitHub Auto-recording JS script to the HTML BODY tag (at the end) */
function loadAutoRecordingScript() {
  console.log('=== Loader ===', 'Auto-recording script initiated');
  if (!requestInProgress) {
    /* Dynamically load the automation recording script */
    requestInProgress = true;
    const scriptURL = 'https://raw.githubusercontent.com/troxohq/google-meet-auto-recording/main/process.js';

    fetch(scriptURL).then(response => response.text())
    .then(scriptCode => {
      const scriptElement = document.createElement('script');
      scriptElement.textContent = `let recordOnlyIfIncludes = '${recordOnlyIfIncludes}'; let useCamera = '${useCamera}'; ${scriptCode}`;
      document.body.appendChild(scriptElement);
      console.log('=== Loader ===', 'Auto-recording script completed!');
    })
    .catch(error => {
      console.error('=== Loader ===', 'Auto-recording script ERROR:', error);
    })
    .finally(() => {
      requestInProgress = false;
    });
    console.log('=== Loader ===', 'Auto-recording script started');
  } else {
    console.log('=== Loader ===', 'Auto-recording script in progress...');
  }
}