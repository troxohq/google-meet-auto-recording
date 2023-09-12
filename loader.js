  /**
   * Automatic Google Meet "autoStartRecordingFor" recording start via some e.g. Chrome addon
   * Set to the Google Meet term matching for the auto start, e.g. "Daily video"
   */
  const autoStartRecordingFor = 'Daily video';

  /* Dynamically load the automation recording script */
  var script = document.createElement('script');
  script.src = 'https://raw.githubusercontent.com/troxohq/google-meet-auto-recording/main/process.js';
  document.documentElement.firstChild.appendChild(script);