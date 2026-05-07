import { autoscroll, liveStatus, clearField, statusElem, thepage, inputField, showToast } from './component/updateHandler.js';
import { createMsg, formatCodeMsg, loadMsg, logErr } from './component/renderMessage.js';
import { handlePrompt } from './component/responseHandler.js';
import { base_uri, local_base_uri, method } from './lib/api.js';

marked.setOptions({
  breaks: true,
  gfm: true
});

lucide.createIcons()

export let isActive= true
export let memory = JSON.parse(localStorage.getItem('chats'))

const header = document.querySelector("header");
const textarea = document.querySelector('textarea')
export const sendbtn = document.querySelector('#sendBtn')

//

// load state //auto
document.addEventListener('DOMContentLoaded', (e) => {
  statusElem.innerText = "Connecting..." 
  statusElem.style.color = 'black'
  sendbtn.disabled = true

  try {
    fetch(base_uri)
    .then(res => {
      if (!res.ok) {
        showToast('Please try reloading the page');
        liveStatus(false)
        return;
      }
      return res.json();
    })
    .then(data => {
      if(!data.success) {
        showToast('Unable to connect to the sever');
        liveStatus(false)
        return
      }
      // sendbtn.disabled = false
      loadOldChat(); 
      formatCodeMsg(document.querySelectorAll('.jarvis .message'))
      liveStatus(true)
    })
    .catch((err) => {
      logErr('System', "Poor or No internet connection.");
      liveStatus(false)
      console.log(err)
    });
  } catch (error) {
    liveStatus(false)
    logErr('System', error.message)
  }
  
});

//change state //manual
sendbtn.addEventListener('click', (e) => {
  e.preventDefault()
  // const time = new Date().toLocaleTimeString()
  const text = inputField.value
  // console.log(text)
  if(!text) return
  
  // user messagge
  createMsg('You', text)
  textarea.style.height = '33px'

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

function loadOldChat() {
  try {
    const prevChat = JSON.parse(localStorage.getItem('chats'));
    const isArr = Array.isArray(prevChat);

    const nId = `user-${crypto.randomUUID()}`;

    if (!localStorage.getItem('jarvisToken')) {
      memory = {
        userId: nId,
        messages: isArr ? prevChat : [],
      };

      localStorage.setItem('jarvisToken', nId);
      localStorage.setItem('chats', JSON.stringify(memory));
    }

    const oldChat = JSON.parse(localStorage.getItem('chats'));

    if (!oldChat.messages || oldChat.messages.length === 0) {
      showToast('No previous chat found. Starting fresh.')
      console.log('No previous chat found.');
      return;
    }

    oldChat.messages.forEach((chat) => {
      const ai = chat.role === 'assistant';
      const sender = ai ? 'Jarvis' : 'You';
      loadMsg(sender, chat.content, chat.time);
    });
  } catch (error) {
    showToast('Error loading previous chat.')
    logErr('System', 'Error loading previous chat. Continue while i fix that.')
    console.error('Error loading previous chat:', error);
  }
}

function dothisNow(){
  const prevChat = JSON.parse(localStorage.getItem('chats'))

  prevChat.forEach((chat, i) => {
    Object.assign(chat, {time: `5:28:${i}`})
  });

  console.log(prevChat)
  localStorage.setItem('chats', JSON.stringify(prevChat))
}

//control header
window.visualViewport.addEventListener("resize", () => {
  header.style.top = "1px";
});

// control textarea height
textarea.addEventListener('input', ()=>{
  textarea.style.height = '34px'
  // form.style.height = '60px'

  textarea.style.height = textarea.scrollHeight + 'px';
  // form.style.height = form.scrollHeight + 'px';
})