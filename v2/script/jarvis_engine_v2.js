import {base_uri, api_key, method} from '../lib/api.js'
lucide.createIcons()

let isActive= true
let memory = [];


const MAX_MEMORY_ENTRIES = 10;

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

function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => 
    t.classList.remove('show'), 
    3000
  );
}

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

function aiAgent(prompt) { //command or text
  fetch(api_key, {
    method: method,
    headers: { 
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      command: prompt, 
      memory 
    })
  })
  .then(res => {
    if (!res.ok) {
      createMsg('System', 'There is an annomally within the system. Contact the support team');
    }
    return res.json();
  })
  .then(data => {
    createMsg('Jarvis', data.message);
  })
  .catch((err) => {
    createMsg('System', "Slow/Poor internet connection. Please move to a secluded area");
    console.log(err)
  });
}

function storeMemory() {
  const oldChat = JSON.parse(localStorage.getItem('chats')) || []
  const newChat = [
    ...oldChat,
    ...memory
  ]

  console.log(newChat)
  localStorage.setItem('chats', JSON.stringify(newChat))

  memory = []
}

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

//Adds new Message
function createMsg(from, text){
  const user = from === 'You'
  const time = new Date().toLocaleTimeString()
  
  //img component 
  const img = `
    <div class="${user? 'me': 'jarvis'}-avatar-holder">
      <img src="image/${user ?'me-img.jpg' :'avatar.jpg'}" alt="icons" class="c-avatar">
    </div>
  `

  //message body component 
  const msgSec = `
    <div class="message">
      <div class="head">
        <b>${from}</b>
        <i class="time">${time.split(':')[0]}:${time.split(':')[1]}</i>
      </div>
      <div class="body">
        ${DOMPurify.sanitize(marked.parse(text))} 
      </div>
    </div>
  `

  // build chat
  thepage.innerHTML += `
    <div class="${user? 'me': 'jarvis'}">
      ${user ? '' : img}
      ${msgSec}
      ${user ? img : ''}
    </div>
  `
  addMemory(
    user? 'user': 'assistant',
    text,
    time
  )
  clearField();
  autoscroll();
}

//Adds Old Message
function loadMsg(from, text, time){
  const user = from === 'You';
  
  //img component 
  const img = `
    <div class="${user? 'me': 'jarvis'}-avatar-holder">
      <img src="image/${user? 'me-img.jpg': 'avatar.jpg'}" alt="icons" class="c-avatar">
    </div>
  `

  //message body component 
  const msgSec = `
    <div class="message">
      <div class="head">
        <b>${from}</b>
        <i class="time">${time.split(':')[0]}:${time.split(':')[1]}</i>
      </div>
      <div class="body">
        ${DOMPurify.sanitize(marked.parse(text))} 
      </div>
    </div>
  `
  // build chat
  thepage.innerHTML += `
    <div class="${user? 'me': 'jarvis'}">
      ${user ? '' : img}
      ${msgSec}
      ${user ? img : ''}
    </div>
  `
  autoscroll();
}
//prompt handler
function handlePrompt(text) {
  const time = new Date().toLocaleTimeString()

  if (/bye|goodbye|exit|stop|shut down/.test(text)) {
    const msg = 'Goodbye, Dragon Lord!';
    createMsg('Jarvis', msg)
    isActive = false
    liveStatus(false);
    return
  }
    if (
      text.toLowerCase() === 'hi'||
      text.toLowerCase() ==='hello'||
      text.toLowerCase() === 'sup'|| 
      text.toLowerCase() === 'wassup' ||
      text.toLowerCase() === 'hey jarvis'||
      text.toLowerCase() === 'hello jarvis'|| 
      text.toLowerCase() === 'wassup jarvis' ||
      text.toLowerCase() === 'xup jarvis'|| 
      text.toLowerCase() === 'sup jarvis'
    ){
    const msg = 'Hey there, how can i be of help to you? 😌';
    createMsg('Jarvis', msg)
    liveStatus(true)
    return
  }
  // Time / Date
  if (text.includes('time')) {
    const msg = `The time is ${time}`;
    createMsg('Jarvis', msg)
    return
  }

  if (text.includes('date')) {
    const msg = `Today is ${new Date().toLocaleDateString()}`;
    createMsg('Jarvis', msg)
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
    const msg = `Information of the following user is a big deal`;
    createMsg('Jarvis', msg)
    return
  }

  // System commands
  for (let key in commandMap) {
    if (text.includes(key)) {
      // createMsg('Sytem',`Opening ${commandMap[key]}`);
      aiAgent(commandMap[key]);
      return;
    }
  }

  // fall back response
  aiAgent(text);
  
}

// load state //auto
document.addEventListener('DOMContentLoaded', (e) => {
  setTimeout(()=>{
    statusElem.innerText = "Updating..." 
    statusElem.style.color = 'black'
  },
    2000
  )

  autoscroll()
  loadOldChat()
  // const vv = loadOldChat()
  // if (!vv) {
  //   liveStatus(true)
  //   showToast('No previously saved chat found')
  // }

  setTimeout(
    ()=>{
      liveStatus(true)
    },
    4200
  ) 
});

//change state //manual
document.querySelector('#sendBtn').addEventListener('click', (e) => {
  e.preventDefault()

  const time = new Date().toLocaleTimeString()

  const text = inputField.value
  // console.log(text)
  if(!text) return
  
  // user messagge
  createMsg('You', text)

  // ai message //hardcoded only
  handlePrompt(text)
})

document.querySelector('#addFileBtn').addEventListener('click', (e) => {
  e.preventDefault()
  const msg = 'Feature coming soon..'
  showToast(msg)
})
document.querySelector('#notisBtn').addEventListener('click', (e) => {
  e.preventDefault()
  const msg = 'Feature coming soon..'
  showToast(msg)
})
function addMemory(role, content, time) {
  memory.push({ role, content, time });
  if (memory.length > MAX_MEMORY_ENTRIES) {

    storeMemory()
    memory = []
    // memory.splice(0, memory.length - MAX_MEMORY_ENTRIES);
  }
}

function loadOldChat () {
  const prevChat = JSON.parse(localStorage.getItem('chats')) || []
  
  if(!prevChat || prevChat == []) return

  prevChat.forEach(chat => {
    const ai = chat.role === 'assistant'
    const sender = ai? 'Jarvis': 'You'

  loadMsg(sender, chat.content, chat.time)
  });

  // return true
}

function clearField() {
  inputField.value = ''
}

function dothisNow(){
  const prevChat = JSON.parse(localStorage.getItem('chats'))

  prevChat.forEach((chat, i) => {
    Object.assign(chat, {time: `5:28:${i}`})
  });

  console.log(prevChat)
  localStorage.setItem('chats', JSON.stringify(prevChat))
}
// dothisNow()