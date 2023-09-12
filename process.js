javascript: (() => {
  /**
   * A configuration for Chrome Addon auto start vs the manual usage via bookmarklet
   * Set to NULL/false/"" for the manual usage
   * Set to the Google Meet term matching for the auto start, e.g. "Daily video"
   */
  const autoStartRecordingFor = 'Daily video';

  const clickElement = (element) => {
    if (element) {
      document.body.click.apply(element);
    }
  };
  /**
   * Configuration of actions to auto start Google Meet recordings
   * Actions are started in a hronological order - previous action need to be completed before the next actions
   * isCompleted() - Check if an action has finished successfully
   * isCheckReady() - Check if an action can be executed
   * actionExecute() - Trigger the action
   */
  const configActions = {
    'Join Meeting': {
      isCompleted: () => !document.body.innerText.includes('Getting ready') && !document.body.innerText.includes('Join now'),
      isCheckReady: () => {
        const buttons = document.querySelectorAll('button');
        const btnJoinNow = Array.from(buttons).filter(button => 'Join now' === button.innerText);
        return btnJoinNow[0] || !document.body.innerText.includes('Getting ready');
      },
      actionExecute: btnJoinNow => clickElement(btnJoinNow)
    },
    'Microphone ON': {
      isCompleted: () => document.body.innerText.includes('Turn off microphone'),
      isCheckReady: () => {
        const btnsMicrophone = document.querySelectorAll('button[role="button"][aria-label*="Turn on microphone"]');
        return btnsMicrophone[0];
      },
      actionExecute: btnMicrophone => clickElement(btnMicrophone)
      },
    'Camera ON': {
      isCompleted: () => document.body.innerText.includes('Turn off camera'),
      isCheckReady: () => {
        const btnsCamera = document.querySelectorAll('button[role="button"][aria-label*="Turn on camera"]');
        return btnsCamera[0];
      },
      actionExecute: btnCamera => clickElement(btnCamera)
    },
    'Camera OFF': {
      isCompleted: () => 1 || document.body.innerText.includes('Turn on camera'),
      isCheckReady: () => {
        const btnsCamera = document.querySelectorAll('button[role="button"][aria-label*="Turn on camera"]');
        return btnsCamera[0];
      },
      actionExecute: btnCamera => clickElement(btnCamera)
    },
    'Present Now': {
      isCompleted: () => document.body.innerText.includes('You are presenting'),
      isCheckReady: () => {
        const buttons = document.querySelectorAll('button[role="button"][aria-label]');
        const btnsPresentNow = Array.from(buttons).filter(button => button.getAttribute('aria-label') == 'Present now');
        return btnsPresentNow[0];
      },
      actionExecute: btnPresentNow => clickElement(btnPresentNow)
    },
    'More Options': {
      isCompleted: () => document.body.innerText.includes('Manage recording')
        || configActions['Manage Recording'].isCompleted(),
      isCheckReady: () => {
        const buttons = document.querySelectorAll('button[role="button"][aria-label="More options"]:not([jslog])');
        const btnsMoreOptions = Array.from(buttons).filter(button => ('more_vert' === button.innerText));
        return btnsMoreOptions[0];
      },
      actionExecute: btnMoreOptions => clickElement(btnMoreOptions)
    },
    'Manage Recording': {
      isCompleted: () => document.body.innerText.includes('Start recording')
        || configActions['Start Recording'].isCompleted(),
      isCheckReady: () => {
        const menuitems = document.querySelectorAll('li[role="menuitem"]');
        const itemsManageRecording = Array.from(menuitems).filter(menuitem => menuitem.innerText.includes('Manage recording'));
        return itemsManageRecording[0];
      },
      actionExecute: itemManageRecording => clickElement(itemManageRecording)
    },
    'Start Recording': {
      isCompleted: () => document.body.innerText.includes('Make sure everyone is ready')
        || document.body.innerText.includes('Stop recording')
        || document.body.innerText.includes('Recording is starting')
        || document.body.innerText.includes('Recording will start soon')
        || document.body.innerText.includes('Transcribing')
        || document.body.innerText.includes('This call is being recorded')
        || document.body.innerText.includes('This call is being transcribed'),
      isCheckReady: () => {
        const buttons = document.querySelectorAll('button[aria-label="Start recording"]');
        const btnsStartRecording = Array.from(buttons).filter(button => ('Start recording' === button.innerText));
        return btnsStartRecording[0];
      },
      actionExecute: btnStartRecording => {
        const options = document.querySelectorAll('ul[role="listbox"][aria-label="Select the language for captions"] li[role="option"');
        const optsCaptions = Array.from(options).filter(option => ('English' === option.innerText));
        clickElement(optsCaptions[0]);

        const labels = document.querySelectorAll('label');
        const lblsTranscript = Array.from(labels).filter(label => ('Also start a transcript (English only)' === label.innerText));
        const cboxTranscriptID = lblsTranscript[0].getAttribute('for');
        const cboxTranscript = document.getElementById(cboxTranscriptID);
        clickElement(cboxTranscript);

        clickElement(btnStartRecording);
      }
    }
  };

  /* Trigger recording only for Google Meet URLs */
  if (document.location.href.includes('meet.google.com')) {
	  const start = Date.now();
    /* Start an interval to execute for actions from a configuration list  */
    const intervalActionExecute = setInterval(() => {
      /* Automatic Google Meet "autoStartRecordingFor" recording start via some e.g. Chrome addon */
      if (autoStartRecordingFor && !document.title.includes(autoStartRecordingFor)) {
        /* Wait for 5s that "autoStartRecordingFor" appears */
        if ((Date.now() - start) > 5000) {
          clearInterval(intervalActionExecute);
          console.log(`Missing "${autoStartRecordingFor}" title. Auto recording cancelled.`);
        } else {
          console.log(`Waiting for "${autoStartRecordingFor}" title...`);
        }
  	  	return;
  	  }

  	  console.log('--------------------------');
      /* Execute action sequentially - previous action is finished if removed from the configuration */
  	  const action = Object.keys(configActions)[0];
  	  if (action) {
        /* Start the action handler from the next one in the execution list */
  	    const configAction = configActions[action];
  	    if (!configAction.isCompleted()) {
          /* If action is not completed and is ready, trigget the execution */
          const el = configAction.isCheckReady();
          if (el) {
            configAction.actionExecute(el);
          }
          console.log(action, el ? `"${el.innerText}" clicked` : 'waiting');
  	    } else {
          /* Remove completed actions from an execution list */
  	  	  delete configActions[action];
  	    }
  	  } else {
        /* If all actions are finished, stop the interval for executing actions */
  	    clearInterval(intervalActionExecute);

  	    const buttons = document.querySelectorAll('button');

        /* Close the recording sidebar */
  	    const btnsCloseRecording = Array.from(buttons).filter(button =>
  	  	  ('close' === button.innerText) && ('Close' === button.getAttribute('aria-label'))
  	    );
  	    clickElement(btnsCloseRecording[0]);

        /* Close the infinity mirror warning (if exists) */
  	    const btnsInfinityIgnore = Array.from(buttons).filter(button => 'Ignore' === button.innerText);
  	    clickElement(btnsInfinityIgnore[0]);

  	    /* Close the streaming warning (if exists) */
        const btnsStreamingClose = Array.from(buttons).filter(button => 'Close' === button.innerText);
  	    clickElement(btnsStreamingClose[0]);

        /* Close warning if everyone is ready (if exists) */
        const btnsConfirmIsReady = Array.from(buttons).filter(button => ('Start' === button.innerText));
        clickElement(btnsConfirmIsReady[0]);

  	    console.log('======== FINISHED ========');
  	  }
    }, 100);
  } else {
	  console.log('======== URL is not a Google Meet (https://meet.google.com) ========')
  }
})();