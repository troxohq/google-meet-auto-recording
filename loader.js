let recordOnlyIfIncludes = 'Daily video';
let useCamera = true;
/**
 * Auto record if Google Meet title includes "recordOnlyIfIncludes" value
 * Turn Camera ON/OFF if "useCamera" is true/false
 */

const start = Date.now();
const intervalActionExecute = setInterval(() => {
  if (!document.title.includes(recordOnlyIfIncludes)) {
    /* Wait for 5s that "recordOnlyIfIncludes" appears */
    if ((Date.now() - start) > 5000) {
      clearInterval(intervalActionExecute);
      console.log(`Missing "${recordOnlyIfIncludes}" title. Auto recording cancelled.`);
    } else {
      console.log(`Waiting for "${recordOnlyIfIncludes}" title...`);
    }
    return;
  }

  /* Dynamically load the automation recording script */
  var scriptURL = 'https://raw.githubusercontent.com/troxohq/google-meet-auto-recording/main/process.js';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', scriptURL, true);
  xhr.onreadystatechange = function() {
    if ((4 === xhr.readyState) && (200 === xhr.status)) {
      var scriptElement = document.createElement('script');
      scriptElement.textContent = `const recordOnlyIfIncludes = '${recordOnlyIfIncludes}'; ${xhr.responseText}`;
      document.body.appendChild(scriptElement);
    }
  };
  xhr.send();
}, 100);