import { liveStatus, isActive, loadStorage } from "../jarvis_engine_v3.js";

export const thepage = document.querySelector('.chatMessages-container');
export const inputField = document.querySelector('#prompt-field')
export const statusElem = document.querySelector('.status')

const MAX_MEMORY_ENTRIES = 50;

//autoscroll up
export function autoscroll() {
  if (!isActive) {
    liveStatus(true)
    console.log('auto wake system')
  } else {
    thepage.scrollTop = thepage.scrollHeight
  }
}

//create memory event
export function addMemory(role, content, time) {
  let chat = loadStorage()

  if (!chat) {
    const userId = localStorage.getItem('jarvisToken')

    chat = {
      userId,
      messages: []
    }

    console.log('if')
    // localStorage.setItem('chats', JSON.stringify(chat))
  }

  chat.messages.push({ role, content, time })

  console.log('else')

  if (chat.messages.length > MAX_MEMORY_ENTRIES) {
    chat.messages.splice(0, chat.messages.length - MAX_MEMORY_ENTRIES);
  }

  localStorage.setItem('chats', JSON.stringify(chat))
  console.log('end')

}

//show toast
export function showToast(msg) {
  const t = document.getElementById('feedback');
  t.innerText = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() =>
    t.classList.remove('show'),
    3000
  );
}

//clear input
export function clearField() {
  inputField.value = ''
}
