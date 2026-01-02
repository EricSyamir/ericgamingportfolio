(function(){
    const PROXY_URL = 'api/gemini_proxy.php';
    const PROXY_TOKEN = 'change-this-token'; // match server token if set

    // Collect portfolio context from DOM
    function collectContext(){
        const getText = (sel) => Array.from(document.querySelectorAll(sel)).map(el=>el.innerText.trim()).join('\n');
        const name = document.querySelector('.hero-title')?.innerText || '';
        const role = document.querySelector('.hero-role')?.innerText || '';
        const scholarship = document.querySelector('.hero-scholarship')?.innerText || '';
        const summary = getText('#about .summary-content p');
        const education = getText('#education .education-card');
        const skills = getText('#skills .skill-card');
        const experience = getText('#experience .experience-item');
        const awards = getText('.awards-section .award-card');
        const projects = getText('#projects .project-card');
        const certs = getText('.certifications-section .certification-card');
        return [
            `Name: ${name}`,
            `Role: ${role}`,
            `Scholarship: ${scholarship}`,
            `Summary: ${summary}`,
            `Education: ${education}`,
            `Skills: ${skills}`,
            `Experience: ${experience}`,
            `Awards: ${awards}`,
            `Projects: ${projects}`,
            `Certifications: ${certs}`
        ].join('\n\n');
    }

    const SYSTEM_PROMPT = `You are Eric's portfolio assistant. Answer concisely using ONLY the provided context extracted from the page. If a question is outside the context (e.g., salary, personal data not present), politely say you don't have that information. Use friendly, professional tone. Where relevant, refer users to project buttons or the contact button. Never fabricate details.`;

    // UI elements
    const widget = document.getElementById('chat-widget');
    if (!widget) return;
    const toggleBtn = document.getElementById('chat-toggle');
    const panel = document.getElementById('chat-panel');
    const closeBtn = document.getElementById('chat-close');
    const messagesEl = document.getElementById('chat-messages');
    const inputEl = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    function appendMessage(text, role){
        const div = document.createElement('div');
        div.className = 'chat-msg ' + role;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function extractTextFromGemini(data){
        try {
            const cand = data && data.candidates && data.candidates[0];
            const txt = cand && cand.content && cand.content.parts && cand.content.parts[0] && cand.content.parts[0].text;
            if (typeof txt === 'string' && txt.trim()) return txt.trim();
            // Error shapes
            if (data && data.error) {
                const msg = data.error.message || data.error.status || JSON.stringify(data.error);
                return `Error: ${msg}`;
            }
            return 'Sorry, I could not get a response.';
        } catch(e){
            return 'Sorry, I could not get a response.';
        }
    }

    async function askGemini(question){
        const context = collectContext();
        const body = { prompt: question, system: SYSTEM_PROMPT, context };
        const res = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Proxy-Token': PROXY_TOKEN },
            body: JSON.stringify(body)
        });
        let data;
        try {
            data = await res.json();
        } catch(_) {
            const text = await res.text().catch(()=> '');
            return text || 'The assistant returned an empty response.';
        }
        if (!res.ok) {
            return extractTextFromGemini(data);
        }
        return extractTextFromGemini(data);
    }

    function send(){
        const q = (inputEl.value || '').trim();
        if (!q) return;
        appendMessage(q, 'user');
        inputEl.value = '';
        appendMessage('Thinking...', 'assistant');
        askGemini(q).then(ans => {
            const finalText = (typeof ans === 'string') ? ans : JSON.stringify(ans);
            messagesEl.lastElementChild.textContent = finalText;
        }).catch((e)=>{
            messagesEl.lastElementChild.textContent = 'Error contacting assistant.';
        });
    }

    toggleBtn?.addEventListener('click', ()=>{
        panel.classList.toggle('open');
        panel.setAttribute('aria-hidden', panel.classList.contains('open') ? 'false' : 'true');
    });
    closeBtn?.addEventListener('click', ()=>{
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
    });
    sendBtn?.addEventListener('click', send);
    inputEl?.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') send(); });

    // Auto-greet
    setTimeout(()=>{
        appendMessage('Hi! I\'m Eric\'s assistant. Ask me anything about his skills, projects, or experience.', 'assistant');
    }, 400);
})();
