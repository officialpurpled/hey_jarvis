import { clearField, autoscroll, addMemory } from "./updateHandler.js"

const chatBox = document.querySelector('.chat-UI')

//format message
export function formatCodeMsg(bodyDiv) {  
  if (!bodyDiv || bodyDiv.length === 0) return 
    
  bodyDiv.forEach(
    boby => boby.querySelectorAll("pre").forEach(pre => {
    // avoid duplicate buttons
      if (pre.querySelector(".copy-btn")) return;

      const button = document.createElement("button");
      button.textContent = "Copy";
      button.className = "copy-btn";

      button.onclick = () => {
        const code = pre.querySelector("code").innerText;
        navigator.clipboard.writeText(code);

        button.textContent = "Copied!";
        setTimeout(() => button.textContent = "Copy", 1500);
      };

      pre.style.position = "relative";
      pre.appendChild(button);
    })
  )
}

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
  //message body
  const bodyDiv = `
    <div class="body">
        ${DOMPurify.sanitize(marked.parse(text))} 
    </div>
  `
  //message body component 
  const msgSec = `
    <div class="message">
      <div class="head">
        <b>${from}</b>
        <i class="time">${time.split(':')[0]}:${time.split(':')[1]}</i>
      </div>
      ${bodyDiv}
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
  formatCodeMsg(document.querySelectorAll('.jarvis .body'))
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

  const bodyDiv = `
    <div class="body">
        ${DOMPurify.sanitize(marked.parse(text))} 
    </div>
  `
  //message component 
  const fullMsg = `
    <div class="message">
      <div class="head">
        <b>${from}</b>
        <i class="time">${time.split(':')[0]}:${time.split(':')[1]}</i>
      </div>
      ${bodyDiv}
    </div>
  `
   
  // build chat
  chatBox.innerHTML += `
    <div class="${user? 'me': 'jarvis'}">
      ${user ? '' : img}
      ${fullMsg}
      ${user ? img : ''}
    </div>
  `
  autoscroll();
}
