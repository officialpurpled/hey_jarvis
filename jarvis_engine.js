let human;
let isSpeaking = false;
let isAwake = true;
let silenceTimer = null;
let lastRequestTime = 0;
let memory = [];

const ui = document.querySelector('.result');
const synth = window.speechSynthesis;

const MAX_MEMORY_ENTRIES = 20;
const MAX_LOG_LINES = 40;

//update jarvis status
function updateStatus(param) {
  const status = document.querySelector('.status');

  status.textContent = param ? 'Active' : 'Inactive';
  status.style.color = param ? 'lightgreen' : 'red';
}

//UI handler with scroll management
function appendLog(label, message) {
  if (!message) return;

  // const entry = document.createElement(`div id="${label}"`);
  // entry.textContent = `
    // ${label}: 
    // ${message}
  // `;
  // ui.appendChild(entry);

  ui.innerHTML += `
    <div id="${label}">
      ${label}:${message}
    </div>
  `

  while (ui.children.length > MAX_LOG_LINES) {
    ui.removeChild(ui.firstChild);
  }

  ui.scrollTop = ui.scrollHeight;
}

//Jarvis Memory handler
function addMemory(role, content) {
  memory.push({ role, content });
  if (memory.length > MAX_MEMORY_ENTRIES) {
    memory.splice(0, memory.length - MAX_MEMORY_ENTRIES);
  }
}

//allowed comands
const commandMap = {
  'open notepad': 'notepad',
  'open camera': 'camera',
  'open settings': 'settings',
  'open vs code': 'vscode',
  'open visual studio code': 'vscode',
  'open microsoft word': 'msword',
  'open calculator': 'calculator',
  'open chrome': 'chrome',
  'open explorer': 'explorer',
  'open task manager': 'taskmanager',
  'open command prompt': 'cmd',
  'open powershell': 'powershell',
  'open desktop': 'desktop',
  'open documents': 'documents',
  'open downloads': 'downloads',
  'open pictures': 'pictures',
  'open music': 'music',
  'open videos': 'videos',
  'open vlc': 'vlc',
  'open edge': 'edge',
  'open microsoft edge': 'edge',
  'open excel': 'excel',
  'open powerpoint': 'powerpnt',
  'open wordpad': 'wordpad',
  'open onenote': 'onenote',
  'open teams': 'teams'
};


/*speak Function*/
function speak(text) {
  if (!text) return;

  // 1. Clear any stuck speech queue
  synth.cancel(); 

  isSpeaking = true;
  if (human) {
    try { human.stop(); } 
    catch(e) {
      console.log(e)
    }
  }

  const utter = new SpeechSynthesisUtterance(text);
   utter.rate = 1.1;
  
  // 2. Pick a voice explicitly (helps Edge/Chrome find the engine)
  const voices = synth.getVoices();
  if (voices.length > 0) {
    // Try to find a Google or Microsoft English voice, else use the first one
    utter.voice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft')) || 
      voices[0];
  }

  utter.onend = () => {
    isSpeaking = false;
    // Small delay before listening again to avoid feedback
    if (human && !human.stopped) {
      setTimeout(() => { 
        try { human.start();} 
        catch(e) {
          console.log(e.message)
        } 
      }, 400);
    }
  };

  synth.speak(utter);
}

// command processesor
let serverFail = 0
function com(command) {
  const now = Date.now();

  if (now - lastRequestTime < 5000) { // Wait 5 seconds between questions
    speak("Please hold on, while i process your request.");
    return;
  }
  lastRequestTime = now;

  fetch('https://jarvis-brain-api.onrender.com/api/jarvis', {
    method: 'POST',
    headers: { 
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      command, 
      memory 
    })
  })
  .then(res => res.json())
  .then(data => {
    addMemory('user', command);
    addMemory('assistant', data.message);
    appendLog('Jarvis', data.message);
    speak(data.message);
  })
  .catch((err) => {
    appendLog('System', 'Internal server error, please restart Jarvis.');
    if(serverFail === 5) {
      stopJarvis()
      console.log(serverFail, 'Max server fail limit hit')
    }
    else {
      serverFail = serverFail + 1
      speak('Server error occurred');
      console.log(err);
    };
  });
}

function handleCommand(text) {
  appendLog('You', text);
  if (/bye|goodbye|exit|stop|shut down/.test(text)) {
    const msg = 'Shutting Down...';
    appendLog('Jarvis', msg);
    speak(msg);
    stopJarvis();
    return;
  }

  // hardcoded commands
  // Time / Date
  if (text.includes('time')) {
    const msg = `The time is ${new Date().toLocaleTimeString()}`;
    appendLog('Jarvis', msg);
    speak(msg);
    return;
  }

  if (text.includes('date')) {
    const msg = `Today is ${new Date().toLocaleDateString()}`;
    appendLog('Jarvis', msg);
    speak(msg);
    return;
  }

  //Personal info
  if (
      text.includes('who is femi') || 
      text.includes('who is phemy') ||
      text.includes('who is phemmy') || 
      text.includes('who is femmy') ||
      text.includes('who is femy')
    ) {
    const msg = `He goes by the name Femi Oduyomi, currently a Micro Biology undergraduate of olabisi onabanjo university`;
    appendLog('Jarvis', msg);
    speak(msg);
    return;
  }

  if (
      text.includes('who is purple dragon') || 
      text.includes('who is olalekan') || 
      text.includes('who is lekan') ||
      text.includes('who is purple') ||
      text.includes('who is eritofunmi') 
    ) {
    const msg = `He is my creator. The GOAT himself. The best of the best programmer in the entirerity of Olabisi Onabanjo Univerity.. And He is address as Comrade Akindeyinde Olalekan Eritofunmi Samuel a.k.a Purple Dragon, Dragon Lord, Purple D and alot more🙂`;
    appendLog('Jarvis', msg);
    speak(msg);
    return;
  }

  // if(text.includes('who is stephen')){
  //   const msg = ``;
  //   appendLog('Jarvis', msg);
  //   speak(msg);
  //   return;
  // }
  
  // System commands
  for (let key in commandMap) {
    if (text.includes(key)) {
      speak(`Opening ${commandMap[key]}`);
      com(commandMap[key]);
      return;
    }
  }

  com(text);
}

/* 🎙 RUN JARVIS (Fixed for Edge/Chrome Delay) */
function runJarvis() {
  // 3. PRIME THE ENGINE: Speak nothing immediately to wake up the audio context
  synth.cancel();
  const primer = new SpeechSynthesisUtterance("");
  synth.speak(primer);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('Speech recognition not supported');

  human = new SpeechRecognition();
  human.continuous = true;
  human.interimResults = true;
  human.lang = 'en-US';

  // speak("Hi, i'm jarvis. How can i be of help to you?")
  speak("Hi, i'm jarvis. How can i be of help to you?");
  // updateStatus(true)
  
  let transcriptBuffer = '';

  human.onresult = (event) => {
    if (isSpeaking) return;
    transcriptBuffer = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcriptBuffer += event.results[i][0].transcript;
    }

    transcriptBuffer = transcriptBuffer.toLowerCase();

    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      if (!isAwake) {
        if (transcriptBuffer.includes('hey jarvis')) {
          isAwake = true;
          updateStatus(true);
          appendLog('Jarvis', 'Hey there!');
          speak('Yes? I am listening.');
        }
        return;
      }
      handleCommand(transcriptBuffer.trim());
      transcriptBuffer = '';
    }, 900);
  };

  // human.onerror = () => speak('Error in speech recognition');
  human.start();
}

function stopJarvis() {
  if (human) {
    human.stopped = true;
    human.stop();
    isAwake = false;
    updateStatus(false);
    appendLog('System', 'Session terminated.');
  }
}

document.getElementById('startBtn').addEventListener('click', runJarvis);
document.getElementById('stopBtn').addEventListener('click', stopJarvis);
