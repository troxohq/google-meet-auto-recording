javascript: (() => {
  let recordOnlyIfIncludes = ('undefined' === typeof(recordOnlyIfIncludes)) ? '' : recordOnlyIfIncludes;
	let useCamera = ('undefined' === typeof(useCamera)) ? true : useCamera;
  /**
   * Record if Google Meet title includes "recordOnlyIfIncludes" value or leave empty for any
	 * Turn Camera ON/OFF if "useCamera" is true/false (default is true => ON)
   */

  const clickElement = (element) => {
    if (element) {
      document.body.click.apply(element);
    }
  };
  /**
   * Configuration of actions to auto start Google Meet recordings
   * Actions are started in a hronological order - previous action need to be completed before the next actions
   * isCompleted() - Check if an action has finished successfully
   * clickExecuteOn() - Return element(s) to execute click event
   */
  const configActions = {
    'Join Meeting': {
      isCompleted: () => !document.body.innerText.includes('Getting ready') && !document.body.innerText.includes('Join now'),
      clickExecuteOn: () => {
        const buttons = document.querySelectorAll('button');
        const btnJoinNow = Array.from(buttons).filter(button => 'Join now' === button.innerText);
        return btnJoinNow[0] || !document.body.innerText.includes('Getting ready');
      }
    },
    'Microphone ON': {
      isCompleted: () => document.body.innerText.includes('Turn off microphone'),
      clickExecuteOn: () => {
        const btnsMicrophone = document.querySelectorAll('button[role="button"][aria-label*="Turn on microphone"]');
        return btnsMicrophone[0];
      }
      },
    'Camera ON': {
      isCompleted: () => !useCamera || document.body.innerText.includes('Turn off camera'),
      clickExecuteOn: () => {
        const btnsCamera = document.querySelectorAll('button[role="button"][aria-label*="Turn on camera"]');
        return btnsCamera[0];
      }
    },
    'Camera OFF': {
      isCompleted: () => useCamera || document.body.innerText.includes('Turn on camera'),
      clickExecuteOn: () => {
        const btnsCamera = document.querySelectorAll('button[role="button"][aria-label*="Turn off camera"]');
        return btnsCamera[0];
      }
    },
    'Present Now': {
      isCompleted: () => document.body.innerText.includes('You are presenting'),
      clickExecuteOn: () => {
        const buttons = document.querySelectorAll('button[role="button"][aria-label]');
        const btnsPresentNow = Array.from(buttons).filter(button => button.getAttribute('aria-label') == 'Present now');
        return btnsPresentNow[0];
      }
    },
    'More Options': {
      isCompleted: () => document.body.innerText.includes('Manage recording')
        || configActions['Manage Recording'].isCompleted(),
      clickExecuteOn: () => {
        const buttons = document.querySelectorAll('button[role="button"][aria-label="More options"]:not([jslog])');
        const btnsMoreOptions = Array.from(buttons).filter(button => ('more_vert' === button.innerText));
        return btnsMoreOptions[0];
      }
    },
    'Manage Recording': {
      isCompleted: () => document.body.innerText.includes('Start recording')
        || configActions['Configure Transcription'].isCompleted(),
      clickExecuteOn: () => {
        const menuitems = document.querySelectorAll('li[role="menuitem"]');
        const itemsManageRecording = Array.from(menuitems).filter(menuitem => menuitem.innerText.includes('Manage recording'));
        return itemsManageRecording[0];
      }
    },
    'Configure Transcription': {
      isCompleted: () => (
          document.body.innerText.includes('Select the language for captions')
          && !document.body.innerText.includes('None (no captions')
          && !configActions['Configure Transcription'].clickExecuteOn()[1]
        ) || configActions['Start Recording'].isCompleted(),
      clickExecuteOn: () => {
        const options = document.querySelectorAll('ul[role="listbox"][aria-label="Select the language for captions"] li[role="option"');
        const optsCaptions = Array.from(options).filter(option => ('English' === option.innerText));

        const labels = document.querySelectorAll('label');
        const lblsTranscript = Array.from(labels).filter(label => ('Also start a transcript (English only)' === label.innerText));
        const cboxTranscriptID = lblsTranscript[0].getAttribute('for');
        const cboxTranscript = document.getElementById(cboxTranscriptID);

        /* If already Transcribing is checked, do not click on it again, and set isCompleted() to true for this action */
        return [optsCaptions[0], cboxTranscript.checked ? null : cboxTranscript];
      }
    },
    'Start Recording': {
      isCompleted: () => document.body.innerText.includes('Make sure everyone is ready')
        || document.body.innerText.includes('Stop recording')
        || document.body.innerText.includes('Recording is starting')
        || document.body.innerText.includes('Recording will start soon')
        || document.body.innerText.includes('Transcribing')
        || document.body.innerText.includes('This call is being recorded')
        || document.body.innerText.includes('This call is being transcribed'),
      clickExecuteOn: () => {
        const buttons = document.querySelectorAll('button[aria-label="Start recording"]');
        const btnsStartRecording = Array.from(buttons).filter(button => ('Start recording' === button.innerText));
        return btnsStartRecording[0];
      }
    }
  };

  /* Trigger recording only for Google Meet URLs */
  if (document.location.href.includes('meet.google.com')) {
    const start = Date.now();
    /* Start an interval to execute for actions from a configuration list  */
    const intervalActionExecute = setInterval(() => {
      try {
        /* Record if Google Meet title includes "recordOnlyIfIncludes" value if not empty */
        if (recordOnlyIfIncludes && !document.title.includes(recordOnlyIfIncludes)) {
          /* Wait for 5s that "recordOnlyIfIncludes" appears */
          if ((Date.now() - start) > 5000) {
            clearInterval(intervalActionExecute);
            console.log(`Missing "${recordOnlyIfIncludes}" title. Auto recording cancelled.`);
          } else {
            console.log(`Waiting for "${recordOnlyIfIncludes}" title...`);
          }
          return;
        }

        /* Start only to initially Join the meeting */
        if (document.body.innerText.includes('Rejoin')
         || document.body.innerText.includes('New meeting')) {
          clearInterval(intervalActionExecute);

          console.log(`Cannot rejoin or start a new meeting. Auto recording cancelled.`);
          return;
        }

        console.log('--------------------------');
        /* Execute action sequentially - previous action is finished if removed from the configuration */
        const action = Object.keys(configActions)[0];
        if (action) {
          /* Start the action handler from the next one in the execution list */
          const configAction = configActions[action];
          if (!configAction.isCompleted()) {
            /* If action is not completed and is ready, trigger the execution on returned element(s) */
            let elements = configAction.clickExecuteOn();
            /* Make an array out of returned elements if not already */
            elements = Array.isArray(elements) ? elements : [elements];
            elements.forEach(element => {
              /* An element from an array can be empty (null) */
              clickElement(element);
              console.log(action, '-', element ? `"${element.innerText}" clicked` : 'waiting');
            });
          } else {
            /* Remove completed actions from an execution list */
            delete configActions[action];
            console.log(action, '-', 'completed');
          }
        } else {
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

          /* If all actions are finished, stop the interval for executing actions */
          if (!document.body.innerText.includes('Start streaming')
          && !document.body.innerText.includes('Select the language for captions')
          && !document.body.innerText.includes('infinity mirror')
          && !document.body.innerText.includes('Make sure everyone is ready')) {
            clearInterval(intervalActionExecute);
          }

          console.log('======== FINISHED ========');
        }
      } catch (error) {
        console.error(error);
        clearInterval(intervalActionExecute);
      }
    }, 100);
  } else {
      console.log('======== URL is not a Google Meet (https://meet.google.com) ========')
  }
})();