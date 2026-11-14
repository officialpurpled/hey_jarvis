import { statusElem, inputField, showToast, clearField } from './component/updateHandler.js';
import { createMsg, formatCodeMsg, loadMsg, logErr } from './component/renderMessage.js';
import { handlePrompt } from './component/responseHandler.js';
import { base_uri } from './utils/api.js';
import generateId from './utils/genId.js';

marked.setOptions({
  breaks: true,
  gfm: true
});

lucide.createIcons()

export let isActive = false

export const sendbtn = document.querySelector('#sendBtn')

const header = document.querySelector("header");
const textarea = document.querySelector('textarea')

export function loadStorage() {
  let raw = localStorage.getItem('chats');
  let oldMemory;
  try {
    oldMemory = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Corrupted chats entry, will reset.', e);
    oldMemory = null;
  }

  if (!oldMemory || typeof oldMemory !== 'object' || Array.isArray(oldMemory)) {
    const savedId = localStorage.getItem('jarvisToken');
    const uId = savedId ? savedId : `user-${generateId()}`;

    const memory = {
      userId: uId,
      messages: Array.isArray(oldMemory) ? oldMemory : []
    };

    localStorage.setItem('chats', JSON.stringify(memory));
    localStorage.setItem('jarvisToken', uId);
    return memory;
  }

  return oldMemory;
}


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

function loadOldChat() {
  try {
    const prevChat = loadStorage();

    if (prevChat.messages.length === 0) {
      showToast('No previous chat found. Starting fresh.')
      return;
    }

    prevChat.messages.forEach((chat) => {
      const sender = chat.role === 'assistant' ? 'Jarvis' : 'You';
      const time = chat.time ?? new Date().toLocaleTimeString();
      const content = chat.content ?? '';
      loadMsg(sender, content, time);
    });

  } catch (error) {
    showToast('Error loading previous chat.')
    logErr('System', error.message)
    console.error('Error loading previous chat:', error);
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('#notisBtn');
  const themeKey = 'jarvisTheme';

  let isDark = localStorage.getItem(themeKey) === 'dark';

  if (isDark) {
    document.body.classList.add('dark');
    toggle.innerHTML = `<i data-lucide="sun" class="hicon"></i>`;
    lucide.createIcons();
  }

  function toggleTheme() {
    isDark = !isDark;
    localStorage.setItem(themeKey, isDark ? 'dark' : 'light');

    if (isDark) {
      document.body.classList.add('dark');
      toggle.innerHTML = `<i data-lucide="sun" class="hicon"></i>`;
    } else {
      document.body.classList.remove('dark');
      toggle.innerHTML = `<i data-lucide="moon" class="hicon"></i>`;
    }

    lucide.createIcons();
  }

  document.querySelector('#addFileBtn')
    .addEventListener('click', e => {
      e.preventDefault();
      showToast('Feature coming soon..');
    });

  toggle.addEventListener('click', toggleTheme);
});
