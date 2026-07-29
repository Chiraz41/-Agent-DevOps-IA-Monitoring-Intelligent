/* =============================================================
   assistant.js — chat simple avec l'agent via POST /agent/ask
   ============================================================= */

const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

function addMsg(text, who, loading = false){
  const div = document.createElement('div');
  div.className = `msg ${who}${loading ? ' loading' : ''}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

async function sendQuestion(question){
  if(!question.trim()) return;
  addMsg(question, 'user');
  chatInput.value = '';
  chatSend.disabled = true;

  const loadingEl = addMsg("L'agent réfléchit…", 'agent', true);
  try{
    const res = await API.askAgent(question);
    loadingEl.remove();
    addMsg(res.answer ?? 'Réponse vide.', 'agent');
  }catch(e){
    loadingEl.remove();
    addMsg(`Erreur : impossible de contacter l'agent (${e.message}). Vérifiez que le backend tourne et que CORS est activé.`, 'agent');
  }
  chatSend.disabled = false;
  chatInput.focus();
}

chatSend.addEventListener('click', () => sendQuestion(chatInput.value));
chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendQuestion(chatInput.value); });
document.querySelectorAll('.suggestion').forEach(s =>
  s.addEventListener('click', () => sendQuestion(s.dataset.q))
);

addMsg("Bonjour, je suis l'agent de surveillance. Posez-moi une question sur les anomalies ou l'état du système.", 'agent');
