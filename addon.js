var recordOnlyIfIncludes = 'Daily video';
var useCamera = true;
var scriptType = '=== Addon: ===';
/**
 * Auto record if Google Meet title includes "recordOnlyIfIncludes" value
 * Turn Camera ON/OFF if "useCamera" is true/false
 * Necessary to have "var" for the configuration, because we need to redefine them in bookmark.js
 */
function startAutoRecording() {
  if (!document.title.includes(recordOnlyIfIncludes)) {
    /* Wait for 5s that "recordOnlyIfIncludes" appears */
    if ((Date.now() - start) < 10000) {
      console.log(scriptType, `Waiting for "${recordOnlyIfIncludes}" title...`);
      setTimeout(startAutoRecording, 500);
    } else {
      console.log(scriptType, `Missing "${recordOnlyIfIncludes}" title. Auto recording cancelled!`);
    }
  } else {
    /* Meeting Title elibible for Auto-recording script  */
    loadAutoRecordingScript();
  }
}

console.log(scriptType, 'Auto recording check started');
let requestInProgress = false;
const start = Date.now();
startAutoRecording();

/* Add content of the GitHub Auto-recording JS script to the HTML BODY tag (at the end) */
function loadAutoRecordingScript() {
  console.log(scriptType, 'Auto-recording script initiated');
  if (!requestInProgress) {
    /* Dynamically load the automation recording script */
    requestInProgress = true;
    const scriptURL = 'https://raw.githubusercontent.com/troxohq/google-meet-auto-recording/main/bookmark.js';

    fetch(scriptURL).then(response => response.text())
    .then(scriptCode => {
      const scriptElement = document.createElement('script');
      /* Necessary to have "var" for the configuration, because we need to redefine them in bookmark.js */
      scriptElement.textContent = scriptCode.replace(
        'javascript: (() => {',
        'javascript: (() => {'+
        `  var recordOnlyIfIncludes = '${recordOnlyIfIncludes}';` +
        `  var useCamera = ${useCamera};` +
        `  var scriptType = 'Script';`
      );
      document.body.appendChild(scriptElement);
      console.log(scriptType, 'Auto-recording script completed!');
    })
    .catch(error => {
      console.error(scriptType, 'Auto-recording script ERROR:', error);
    })
    .finally(() => {
      requestInProgress = false;
    });
    console.log(scriptType, 'Auto-recording script started');
  } else {
    console.log(scriptType, 'Auto-recording script in progress...');
  }
}