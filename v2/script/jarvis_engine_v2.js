let isActive= true
let memory = [];

const MAX_MEMORY_ENTRIES = 20;

const thepage = document.querySelector('.chat-UI');
const inputField = document.querySelector('#prompt-field')
const statusElem = document.querySelector('.status')


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
// inputField.addEventListener('input', (e)=>{
//   liveStatus(true)
//   console.log(e)
// })

// window.addEventListener('message', 
//   event => handleMessage(event), false
// );
// window.addEventListener('error', 
//   (event) => handleError(event), false
// );

function autoscroll() {
  if (!isActive){
    isActive = true
    liveStatus(true)
    console.log('auto wake system')
  } else{
    thepage.scrollTop = thepage.scrollHeight;
  }
}

//update stustus elem
function liveStatus(param){
  statusElem.innerText = `${param ?'Active' :'Inactive'}` 
  statusElem.style.color = `${param ?'green' :'red'}`
}

//Adds Message
function createMsg(from, text){
  const user = from === 'You'
  
  //img component 
  const img = `
    <div class="c-avatar-holder">
      <img src="image/me-img.jpg" alt="icons" class="c-avatar">
    </div>
  `
  //message body component 
  const msgSec = `
    <div class="message">
      <span class="head">
        <b>${from}</b>
        <i class="time">${new Date().toLocaleTimeString()}</i>
      </span>
      <span class="body">
        ${text} 
      </span>
    </div>
  `
  // build chat
  thepage.innerHTML += `
    <div id="${user? 'me': 'jarvis'}">
      ${user ? '' : img}
      ${msgSec}
      ${user ? img : ''}
    </div>
  `
  clearField();
  autoscroll();
}

//prompt handler
function handlePrompt(text) {
  if (/bye|goodbye|exit|stop|shut down/.test(text)) {
    const msg = 'Goodbye, Dragon Lord!';
    createMsg('Jarvis', msg)
    addMemory('assistant', msg);
    isActive = false
    liveStatus(false)
    return
  }
  // Time / Date
  if (text.includes('time')) {
    const msg = `The time is ${new Date().toLocaleTimeString()}`;
    createMsg('Jarvis', msg)
     addMemory('assistant', msg);
    return
  }

  if (text.includes('date')) {
    const msg = `Today is ${new Date().toLocaleDateString()}`;
    createMsg('Jarvis', msg)
    addMemory('assistant', msg)
    return
  }

  //Personal info
  if (
      text.includes('who is femi') ||  
      text.includes('who femmy')
    ) {
    const msg = `You mean Femi Oduyomi, he is currently a undergraduate Micro Biology student of olabisi onabanjo university`;
    createMsg('Jarvis', msg)
    addMemory('assistant', msg);
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
    addMemory('assistant', msg);
    return
  }

  if(text.includes('who is stephen')){
    const msg = `Information of the following user is a big deal`;
    createMsg('Jarvis', msg)
    addMemory('assistant', msg);
    return
  }

  // System commands
  // for (let key in commandMap) {
  //   if (text.includes(key)) {
  //     createMsg('Sytem',`Opening ${commandMap[key]}`);
  //     aiAgent(commandMap[key]);
  //     return;
  //   }
  // }

  // aiAgent(text);
  
  // fall back response
  createMsg('Jarvis', "Unable to respond to your message")
}

// load state //auto
document.addEventListener('DOMContentLoaded', (e) => {
  setTimeout(()=>{
    statusElem.innerText = "loading..." 
    statusElem.style.color = 'white'
  },
    1500
  )
  
  autoscroll()
  setTimeout(
    ()=>{
      liveStatus(true)
    },
    2800
  ) 
});

//change state //manual
document.querySelector('#sendBtn').addEventListener('click', (e) => {
  e.preventDefault()

  const text = inputField.value
  console.log(text)
  addMemory('user', text);
  
  // user messagge
  createMsg('You', text)

  // ai message //hardcoded only
  handlePrompt(text)
})

function addMemory(role, content) {
  memory.push({ role, content });
  if (memory.length > MAX_MEMORY_ENTRIES) {
    memory.splice(0, memory.length - MAX_MEMORY_ENTRIES);
  }
}

function clearField() {
  inputField.value = ''
}