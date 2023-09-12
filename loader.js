const autoStartRecordingFor = 'Daily video';
/**
 * Automatic Google Meet "autoStartRecordingFor" recording start via some e.g. Chrome addon
 * Set to the Google Meet term matching for the auto start, e.g. "Daily video"
 */

const start = Date.now();
const intervalActionExecute = setInterval(() => {
  if (!document.title.includes(autoStartRecordingFor)) {
    /* Wait for 5s that "autoStartRecordingFor" appears */
    if ((Date.now() - start) > 5000) {
      clearInterval(intervalActionExecute);
      console.log(`Missing "${autoStartRecordingFor}" title. Auto recording cancelled.`);
    } else {
      console.log(`Waiting for "${autoStartRecordingFor}" title...`);
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
      scriptElement.textContent = `const autoStartRecordingFor = '${autoStartRecordingFor}'; ${xhr.responseText}`;
      document.body.appendChild(scriptElement);
    }
  };
  xhr.send();
}, 100);