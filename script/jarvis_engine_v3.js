import { statusElem, inputField, showToast, clearField } from './component/updateHandler.js';
import { createMsg, formatCodeMsg, loadMsg, logErr } from './component/renderMessage.js';
import { handlePrompt } from './component/responseHandler.js';
import { base_uri } from './lib/api.js';

marked.setOptions({
  breaks: true,
  gfm: true
});

lucide.createIcons()

export let isActive = false

export function loadStorage() {
  let memory = JSON.parse(localStorage.getItem('chats'))

  if (!memory) {
    const nId = JSON.parse(localStorage.getItem('jarvisToken')) || `user-${crypto.randomUUID()}`;

    memory = {
      userId: nId,
      messages: []
    }


    localStorage.setItem('chats', JSON.stringify(memory))
    localStorage.setItem('jarvisToken', JSON.stringify(memory.userId))
  }

  return memory
}

export const sendbtn = document.querySelector('#sendBtn')

const header = document.querySelector("header");
const textarea = document.querySelector('textarea')


export function liveStatus(param) {
  isActive = param
  statusElem.style.backgroundColor = `${param ? 'green' : 'red'}`
  sendbtn.disabled = param ? false : true
}

// load state //auto
document.addEventListener('DOMContentLoaded', (e) => {
  statusElem.style.backgroundColor = 'orange'
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
        if (!data.success) {
          showToast('Unable to connect to the sever');
          liveStatus(false)
          return
        }

        requestAnimationFrame(() => {
          loadOldChat();
          formatCodeMsg(document.querySelectorAll('.jarvis .message'))
        })
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
    console.log(error)
  }

});

//change state //manual
sendbtn.addEventListener('click', (e) => {
  e.preventDefault()
  const text = inputField.value

  if (!text) return
  // user messagge
  createMsg('You', text)

  // ai message //hardcoded only
  handlePrompt(text)
})

//enter key
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && isActive) {
    e.preventDefault()
    const text = inputField.value

    if (!text) return
    // create user messagge
    createMsg('You', text)

    // then ai message \hardcoded + dynamic/
    handlePrompt(text)
  }
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
    let prevChat = loadStorage();

    if (!prevChat) {
      showToast('No previous chat found. Starting fresh.')
      console.log('No previous chat found.');
      return;
    }

    const isArr = Array.isArray(prevChat);

    if (isArr) {
      const nId = `user-${crypto.randomUUID()}`;
      const savedChat = prevChat.map((chat) => chat)

      console.log(savedChat)

      prevChat = {
        userId: nId,
        messages: savedChat,
      };

      localStorage.setItem('jarvisToken', nId);
      localStorage.setItem('chats', JSON.stringify(prevChat));
    }

    const oldChat = loadStorage()

    if (!oldChat.userId) {
      const nId = `user-${crypto.randomUUID()}`;
      oldChat.userId = nId

      localStorage.setItem('jarvisToken', nId);
      localStorage.setItem('chats', JSON.stringify(oldChat));
    }

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

function dothisNow() {
  const prevChat = JSON.parse(localStorage.getItem('chats'))

  prevChat.forEach((chat, i) => {
    Object.assign(chat, { time: `5:28:${i}` })
  });

  console.log(prevChat)
  localStorage.setItem('chats', JSON.stringify(prevChat))
}

//control header
window.visualViewport.addEventListener("resize", () => {
  header.style.top = "1px";
});

// control textarea height
textarea.addEventListener('input', () => {
  textarea.style.height = '21px'
  // form.style.height = '60px'

  textarea.style.height = textarea.scrollHeight + 'px';
  // form.style.height = form.scrollHeight + 'px';
})
