import { clearField, autoscroll, addMemory } from "./updateHandler.js"

const chatBox = document.querySelector('.chat-UI')

//Adds new Message
export function createMsg(from, text){
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
  chatBox.innerHTML += `
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
export function loadMsg(from, text, time){
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
  chatBox.innerHTML += `
    <div class="${user? 'me': 'jarvis'}">
      ${user ? '' : img}
      ${msgSec}
      ${user ? img : ''}
    </div>
  `
  autoscroll();
}