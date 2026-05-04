import { autoscroll, liveStatus, clearField, statusElem, thepage, inputField, showToast } from './component/updateHandler.js';
import { createMsg, loadMsg } from './component/renderMessage.js';
import { handlePrompt } from './component/responseHandler.js';

lucide.createIcons()

export let isActive= true
export let memory = JSON.parse(localStorage.getItem('chats'))||{
  userId: '',
  messages: []
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


function loadOldChat () {
  const oldChat = JSON.parse(localStorage.getItem('chats')) || memory

  if(!oldChat || (!oldChat.messages || oldChat.messages == []) || !oldChat.userId) {
    localStorage.removeItem('chats')
    const newId = `user-${Math.floor(100000 + Math.random()*900000).toString()}`
    Object.assign(oldChat, {userId: newId})

    console.log(oldChat)
    localStorage.setItem('jarvisToken', newId)
    localStorage.setItem('chats', JSON.stringify(oldChat))
    return
  }

  oldChat.messages.forEach(chat => {
    const ai = chat.role === 'assistant'
    const sender = ai? 'Jarvis': 'You'
    loadMsg(sender, chat.content, chat.time)
  });


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