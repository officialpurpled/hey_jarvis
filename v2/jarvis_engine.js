let human;
let isSpeaking = false;
let isAwake = false;
let silenceTimer = null;
let lastRequestTime = 0;
let memory = [];

const dResult = document.querySelector('.result');
const synth = window.speechSynthesis;

const MAX_MEMORY_ENTRIES = 20;
const MAX_LOG_LINES = 40;

//update status
function updateStatus() {
  const status = document.querySelector('.status');

  status.textContent = isAwake ? 'Active' : 'Inactive';
  status.style.color = isAwake ? 'lightgreen' : 'red';
}

function appendLog(label, message) {
  if (!message) return;
  const entry = document.createElement('div');
  entry.textContent = `${label}: ${message}`;
  dResult.appendChild(entry);
  while (dResult.children.length > MAX_LOG_LINES) {
    dResult.removeChild(dResult.firstChild);
  }
  dResult.scrollTop = dResult.scrollHeight;
}

function addMemory(role, content) {
  memory.push({ role, content });
  if (memory.length > MAX_MEMORY_ENTRIES) {
    memory.splice(0, memory.length - MAX_MEMORY_ENTRIES);
  }
}

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


/* 🔊 IMPROVED SPEAK FUNCTION */
function speak(text) {
  if (!text) return;

  // 1. Clear any stuck speech queue
  synth.cancel(); 

  isSpeaking = true;
  if (human) {
    try { human.stop(); } catch(e) {}
  }

  const utter = new SpeechSynthesisUtterance(text);
   utter.rate = 1.1;
  
  // 2. Pick a voice explicitly (helps Edge/Chrome find the engine)
  const voices = synth.getVoices();
  if (voices.length > 0) {
    // Try to find a Google or Microsoft English voice, else use the first one
    utter.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Microsoft')) || voices[0];
  }

  utter.onend = () => {
    isSpeaking = false;
    // Small delay before listening again to avoid feedback
    if (human && !human.stopped) {
      setTimeout(() => { try { human.start(); } catch(e) {} }, 400);
    }
  };

  synth.speak(utter);
}

/* 🧠 Backend (Same as before) */
function com(command) {
  const now = Date.now();

  if (now - lastRequestTime < 5000) { // Wait 5 seconds between questions
    speak("Please hold on, My processors need a moment.");
    return;
  }
  lastRequestTime = now;

  fetch('https://jarvis-brain-api.onrender.com/api/jarvis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  .catch(() => {
    appendLog('Jarvis', 'Internal server error, please restart Jarvis.');
    speak('Server error occurred');
    // stopJarvis();
  });
}

function handleCommand(text) {
  appendLog('You', text);
  if (/bye|goodbye|exit|stop|shut down/.test(text)) {
    const msg = 'Goodbye, Dragon Lord!';
    appendLog('Jarvis', msg);
    speak(msg);
    stopJarvis();
    return;
  }

  // (Your other hardcoded commands here...)
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
    const msg = `He is the creator of jarvis. The GOAT himself. The best of the best programmer in the entirerity of Olabisi Onabanjo Univerity.. And He is address as Comrade Akindeyinde Olalekan Samuel a.k.a Purple Dragon, Dragon Lord, Purple D and alot more🙂`;
    appendLog('Jarvis', msg);
    speak(msg);
    return;
  }

  if(text.includes('who am i')){
    const msg = `You're the creator of jarvis. The GOAT himself. The best of the best programmer in the entirerity of Olabisi Onabanjo Univerity..Goes by the name Comrade Akindeyinde Olalekan Samuel a.k.a Purple Dragon, Dragon Lord, Purple D and alot more🙂`;
    appendLog('Jarvis', msg);
    speak(msg);
    return;
  }
  
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

  speak("System online. Say hey jarvis to activate me.");// Hello, Purple Dragon.
  
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
        if (transcriptBuffer.includes('jarvis')) {
          isAwake = true;
          updateStatus();
          appendLog('Jarvis', 'Hey Jarvis activated. How can I assist you today?');
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
    updateStatus();
    appendLog('System', 'Session terminated.');
  }
}

document.getElementById('startBtn').addEventListener('click', runJarvis);
document.getElementById('stopBtn').addEventListener('click', stopJarvis);
