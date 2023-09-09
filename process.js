javascript: (() => {
  const clickElement = (element) => {
    if (element) {
      document.body.click.apply(element);
    }
  };

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
        const itemsManageRecording = Array.from(menuitems).filter(menuitem => -1 < menuitem.innerText.indexOf('Manage recording'));
        return itemsManageRecording[0];
      },
      actionExecute: itemManageRecording => clickElement(itemManageRecording)
    },
    'Start Recording': {
      isCompleted: () => document.body.innerText.includes('Make sure everyone is ready')
        || configActions['Confirm Recording'].isCompleted(),
      isCheckReady: () => {
        const buttons = document.querySelectorAll('button[aria-label="Start recording"]');
        const btnsStartRecording = Array.from(buttons).filter(button => ('Start recording' === button.innerText));
        return btnsStartRecording[0];
      },
      actionExecute: btnStartRecording => {
        const options = document.querySelectorAll('ul[role="listbox"][aria-label="Select the language for captions"] li[role="option"');
        const optsCaptions = Array.from(options).filter(option => ('English' === option.innerText));
        clickElement(optsCaptions[0])
        
        const labels = document.querySelectorAll('label');
        const lblsTranscript = Array.from(labels).filter(label => ('Also start a transcript (English only)' === label.innerText));
        const cboxTranscriptID = lblsTranscript[0].getAttribute('for');
        const cboxTranscript = document.getElementById(cboxTranscriptID);
        clickElement(cboxTranscript);
        
        clickElement(btnStartRecording);
      }
    },
    'Confirm Recording': {
      isCompleted: () => document.body.innerText.includes('Stop recording')
        || document.body.innerText.includes('Recording is starting')
        || document.body.innerText.includes('Recording will start soon')
        || document.body.innerText.includes('Transcribing')
        || document.body.innerText.includes('This call is being recorded')
        || document.body.innerText.includes('This call is being transcribed'),
      isCheckReady: () => {
        const buttons = document.querySelectorAll('button');
        const btnsConfirmRecording = Array.from(buttons).filter(button => ('Start' === button.innerText));
        return btnsConfirmRecording[0];
      },
      actionExecute: btnConfirmRecording => clickElement(btnConfirmRecording)
    }
  };

  let intervalBookmarklet = setInterval(() => {
    console.log('--------------------------');
    const action = Object.keys(configActions)[0];
    if (action) {
      const configAction = configActions[action];
      if (!configAction.isCompleted()) {
        const el = configAction.isCheckReady();
        if (el) {
          configAction.actionExecute(el);
        }
        console.log(action, el ? `"${el.innerText}" clicked` : 'waiting');
      } else {
        delete configActions[action];
      }
    } else {
      clearInterval(intervalBookmarklet);
      
      const buttons = document.querySelectorAll('button');
      
      const btnsCloseRecording = Array.from(buttons).filter(button => 
        ('close' === button.innerText) && ('Close' === button.getAttribute('aria-label'))
      );
      clickElement(btnsCloseRecording[0]);
      
      const btnsInfinityIgnore = Array.from(buttons).filter(button => 'Ignore' === button.innerText);
      clickElement(btnsInfinityIgnore[0]);

      const btnsStreamingClose = Array.from(buttons).filter(button => 'Close' === button.innerText);
      clickElement(btnsStreamingClose[0]);
      
      console.log('======== FINISHED ========');
    }
  }, 100);
})();
