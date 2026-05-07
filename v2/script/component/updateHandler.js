import { memory, isActive, sendbtn } from "../jarvis_engine_v2.js";

export const thepage = document.querySelector('.chat-UI');
export const inputField = document.querySelector('#prompt-field')
export const statusElem = document.querySelector('.status')

const MAX_MEMORY_ENTRIES = 50;

//update stustus elem
export function liveStatus(param){
  statusElem.innerText = `${param ?'Active' :'Inactive'}` 
  statusElem.style.color = `${param ?'green' :'red'}`
  sendbtn.disabled = param? false: true
}

//autoscroll up
export function autoscroll() {
  if (!isActive){
    isActive = true
    liveStatus(true)
    console.log('auto wake system')
  } else{
    thepage.scrollTop = thepage.scrollHeight;
  }
}

//create memory event
export function addMemory(role, content, time) {
  const chat = memory.messages

  chat.push({ role, content, time });


  if (chat.length > MAX_MEMORY_ENTRIES) {
    chat.splice(0, chat.length - MAX_MEMORY_ENTRIES);
  }
  localStorage.setItem('chats', JSON.stringify(memory))
}

//show toast
export function showToast(msg) {
  const t = document.getElementById('toast');
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
