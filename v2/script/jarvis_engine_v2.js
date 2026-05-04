import { autoscroll, liveStatus, clearField, statusElem, thepage, inputField, showToast } from './component/updateHandler.js';
import { createMsg, formatCodeMsg, loadMsg } from './component/renderMessage.js';
import { handlePrompt } from './component/responseHandler.js';

marked.setOptions({
  breaks: true,
  gfm: true
});

lucide.createIcons()

export let isActive= true
export let memory = JSON.parse(localStorage.getItem('chats'))

//control header
const header = document.querySelector("header");

window.visualViewport.addEventListener("resize", () => {
  header.style.top = "0px";
});

//

// load state //auto
document.addEventListener('DOMContentLoaded', (e) => {
  statusElem.innerText = "Updating..." 
  statusElem.style.color = 'black'
  
  setTimeout(()=>{loadOldChat()},2500)
  autoscroll()
  formatCodeMsg()
  setTimeout( ()=>{liveStatus(true) },3200) 
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
    // localStorage.setItem('chats', JSON.stringify({
    //     userId: 'user-' + crypto.randomUUID(),
    //     messages: [],
    //   }))
    showToast('Error loading old chat. Starting fresh.')
    console.error('Error loading old chat:', error);
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
// dothisNow()
