import { clearField, autoscroll, addMemory } from "./updateHandler.js"

const chatBox = document.querySelector('.chatMessages-container')

function buildHtml(user, text, time) {
  //img component 
  const img = `
      <img src="../image/${user ? 'avatar.png' : 'jarvis-wt.png'}" alt="icons" class="c-avatar">
    `
  //message component 
  const body = `
      <div class="message">
        <div class="text">
          ${DOMPurify.sanitize(marked.parse(text))}
        </div>
        <div class="time">
          <i>${time.split(':')[0]}:${time.split(':')[1]} ${(time.split(' ')[1]).toLowerCase()}</i>
        </div>
      </div>
    `
  return `
    <div class="${user ? 'user' : 'jarvis'}">
      ${user ? '' : img}
      ${body}
      ${user ? img : ''}
    </div>
  `
}

//error msg
export function logErr(from, error) {
  const time = new Date().toLocaleTimeString()

  const ui1 = `
    <div class="system">
      <div class="jarvis-avatar-holder">
        <img src="image/avatar.png" alt="icons" class="c-avatar">
      </div>
      <div class="message">
        <div class="head">
          <b>${from}</b>
          <i class="time">${time.split(':')[0]}:${time.split(':')[1]}</i>
        </div>
        <div class="body">
          ${DOMPurify.sanitize(marked.parse(error))} 
        </div>
      </div>
    </div>
  `
  const ui2 = `
    <div class="system">
      ${from}: ${DOMPurify.sanitize(marked.parse(error))}
    </div>
  `

  // build chat
  chatBox.innerHTML += ui2

  autoscroll();
}

// Language normalization
const LANGUAGE_ALIASES = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  html: "markup",
  htm: "markup",
  py: "python",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  cs: "csharp",
  rb: "ruby",
  cpp: "cpp"
};

// Normalize language names for Highlight.js
function normalizeLanguage(lang) {
  if (!lang) return "plaintext";
  const normalized = lang.trim().toLowerCase();
  return LANGUAGE_ALIASES[normalized] || normalized;
}

// Extract language from code element
function extractLanguage(codeElement) {
  const classList = codeElement.className || "";
  const langMatch = classList.match(/language-(\w+)/);
  return langMatch ? langMatch[1] : null;
}

// Check if language is supported by Highlight.js
function isSupportedLanguage(lang) {
  if (!lang || typeof hljs === 'undefined') return false;
  try {
    return hljs.getLanguage(lang) !== undefined;
  } catch {
    return false;
  }
}

// Escape HTML for safe insertion
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// format message with enhanced code blocks
export function formatCodeMsg(bodyDiv) {
  if (!bodyDiv || bodyDiv.length === 0) return

  bodyDiv.forEach(
    container => container.querySelectorAll("pre").forEach(pre => {
      // avoid duplicate processing
      if (pre.classList.contains("code-block-processed")) return;
      pre.classList.add("code-block-processed");

      const codeElement = pre.querySelector("code");
      if (!codeElement) return;

      const rawCode = codeElement.innerText;
      const detectedLang = extractLanguage(codeElement);
      const normalizedLang = normalizeLanguage(detectedLang);

      // Get highlighted code or auto-detect
      let highlightedCode;
      if (isSupportedLanguage(normalizedLang)) {
        try {
          highlightedCode = hljs.highlight(rawCode, { language: normalizedLang }).value;
        } catch {
          highlightedCode = hljs.highlightAuto(rawCode).value;
        }
      } else {
        highlightedCode = hljs.highlightAuto(rawCode).value;
      }

      // Display language
      const displayLanguage = detectedLang?.trim() || "code";

      // Generate unique ID for code block
      const blockId = `code-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Create wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      wrapper.setAttribute("data-code-id", blockId);

      // Create header with language label
      const header = document.createElement("div");
      header.className = "code-block-header";
      header.innerHTML = `
        <span class="code-language">${escapeHTML(displayLanguage)}</span>
        <button type="button" class="copy-code-btn" data-code-id="${blockId}">
          <span class="copy-icon">Copy</span>
        </button>
      `;

      // Update code element with highlighting
      codeElement.innerHTML = highlightedCode;
      codeElement.className = `hljs language-${escapeHTML(normalizedLang)}`;

      // Build wrapper structure
      wrapper.appendChild(header);
      wrapper.appendChild(pre.cloneNode(true));

      // Replace old pre with new wrapper
      pre.replaceWith(wrapper);

      // Attach copy button handler
      const copyBtn = wrapper.querySelector(".copy-code-btn");
      if (copyBtn && !copyBtn.dataset.initialized) {
        copyBtn.dataset.initialized = "true";
        copyBtn.addEventListener("click", async () => {
          const codeEl = wrapper.querySelector("code");
          if (!codeEl) return;

          try {
            await navigator.clipboard.writeText(codeEl.innerText);
            copyBtn.classList.add("copied");
            copyBtn.querySelector(".copy-icon").textContent = "Copied!";

            setTimeout(() => {
              copyBtn.classList.remove("copied");
              copyBtn.querySelector(".copy-icon").textContent = "Copy";
            }, 2000);
          } catch (error) {
            console.error("Copy failed:", error);
          }
        });
      }
    })
  )
}
//Adds new Message
export function createMsg(from, text) {
  const user = from === 'You'
  const time = new Date().toLocaleTimeString()

  if (text === '') return;

  // build chat
  chatBox.innerHTML += buildHtml(user, text, time)
  addMemory(
    user ? 'user' : 'assistant',
    text,
    time
  )
  clearField();

  // Wait for DOM to settle, format code blocks, then scroll to final height
  requestAnimationFrame(() => {
    formatCodeMsg(document.querySelectorAll('.jarvis .message'))
    autoscroll();
  })
}

//Adds Old Message
export function loadMsg(from, text, time) {
  const user = from === 'You';

  // build chat
  chatBox.innerHTML += buildHtml(user, text, time)
  requestAnimationFrame(() => {
    autoscroll();
  })
}
