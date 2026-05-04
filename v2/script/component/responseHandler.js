import {base_uri, api_key, method} from '../lib/api.js'
import { liveStatus} from './updateHandler.js';
import { createMsg } from './renderMessage.js';
import { isActive, memory } from '../jarvis_engine_v2.js';

//command key
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

//main handler //dynamic
export function aiAgent(prompt) { //command or text
  fetch(base_uri, {
    method: method,
    headers: { 
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      command: prompt, 
      memory: memory.messages
    })
  })
  .then(res => {
    if (!res.ok) {
      createMsg('System', 'There is an annomally within the system. Contact the support team');
      return;
    }
    return res.json();
  })
  .then(data => {
    createMsg('Jarvis', data.message);
  })
  .catch((err) => {
    createMsg('System', "Poor or No internet connection. <br> Please move to a secluded area or subscribe");
    console.log(err)
  });
}

//prompt handler //hardcoded
export function handlePrompt(text) {
  const time = new Date().toLocaleTimeString()

  const forTx1 = text.split(' ')[0]
  const forTx2 = text.split(' ')[1]
  const fullBye = forTx1+forTx2

  if (
    text.toLowerCase() === 'goodbye' ||
    fullBye.toLowerCase() === 'goodbye'
    ) {
    aiAgent(text)
    isActive = false
    liveStatus(false);
    return
  }

  //Personal info
  if (
      text.includes('who is femi') ||  
      text.includes('who femmy')
    ) {
    const msg = `You mean Femi Oduyomi, he is currently a undergraduate Micro Biology student of olabisi onabanjo university`;
    createMsg('Jarvis', msg)
    return
  }

  if (
      text.includes('who is purple dragon') || 
      text.includes('who is olalekan') || 
      text.includes('who is lekan') ||
      text.includes('who is purple') ||
      text.includes('who is eritofunmi') 
    ) {
    const msg = `He is my creator. The GOAT himself. The best of the best programmer in the entirerity of Olabisi Onabanjo Univerity.. And He is address as Comrade Akindeyinde Olalekan Eritofunmi Samuel a.k.a Purple Dragon, Dragon Lord, Purple D and alot more🙂`;
    createMsg('Jarvis', msg)
    return
  }

  if(text.includes('who is stephen')){
    const msg = `Information of the following user is an hotshot. Exclusive info for exclusive user 😁`;
    createMsg('Jarvis', msg)
    return
  }

  // System commands
  for (let key in commandMap) {
    if (text.includes(key)) {
      aiAgent(commandMap[key]);
      return;
    }
  }

  // fall back response
  aiAgent(text);
  
}