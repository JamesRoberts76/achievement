document.addEventListener('DOMContentLoaded', () => {
    const portal = document.getElementById('immersivePortal');
    const openBtn = document.getElementById('openPortalBtn');
    const closeBtn = document.getElementById('closePortalBtn');
    const input = document.getElementById('portalInput');
    const submitBtn = document.getElementById('portalSubmit');
    const feed = document.getElementById('portalFeed');

    if (!portal) return;

    function togglePortal() {
        portal.classList.toggle('active');
        if (portal.classList.contains('active') && input) {
            input.focus();
        }
    }

    if (openBtn) openBtn.addEventListener('click', togglePortal);
    if (closeBtn) closeBtn.addEventListener('click', togglePortal);

    async function sendMessage() {
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        const userUuid = localStorage.getItem('sovereign_user_uuid') || 'anonymous';

        // Append user message
        const userMsg = document.createElement('div');
        userMsg.className = 'portal-message user';
        userMsg.textContent = text;
        feed.appendChild(userMsg);
        input.value = '';
        portal.scrollTop = portal.scrollHeight;

        // System loading state
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'portal-message system';
        loadingMsg.innerHTML = '<strong>James:</strong> Analyzing execution and milestone architecture...';
        feed.appendChild(loadingMsg);
        portal.scrollTop = portal.scrollHeight;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text,
                    uuid: userUuid,
                    siteId: 'achievement.guide'
                })
            });

            const data = await res.json();
            loadingMsg.remove();

            const sysMsg = document.createElement('div');
            sysMsg.className = 'portal-message system';
            sysMsg.innerHTML = `<strong>James:</strong> ${data.message || data.error || 'Response error.'}`;
            feed.appendChild(sysMsg);
            portal.scrollTop = portal.scrollHeight;
        } catch (err) {
            loadingMsg.remove();
            const errMsg = document.createElement('div');
            errMsg.className = 'portal-message system';
            errMsg.innerHTML = '<strong>James:</strong> Connection error across network matrix.';
            feed.appendChild(errMsg);
            portal.scrollTop = portal.scrollHeight;
        }
    }

    if (submitBtn) submitBtn.addEventListener('click', sendMessage);
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});
