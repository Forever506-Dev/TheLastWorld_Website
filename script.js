11// TYPEWRITER EFFECT
function typeWriter(elementId, text, speed = 15) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    if (element.dataset.typing) clearTimeout(element.dataset.typing);
    
    let i = 0;
    document.body.classList.add('typing-active');
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '<') {
                let tagEnd = text.indexOf('>', i);
                if (tagEnd === -1) tagEnd = text.length;
                element.innerHTML += text.substring(i, tagEnd + 1);
                i = tagEnd + 1;
            } else {
                element.innerHTML += text.charAt(i);
                const audio = new Audio('keystroke.mp3');
                audio.volume = 0.15;
                audio.play().catch(e => {});
                i++;
            }
            element.dataset.typing = setTimeout(type, speed);
        } else {
            document.body.classList.remove('typing-active');
        }
    }
    type();
}

// MATRIX RAIN EFFECT
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function draw() {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = fontSize + 'px monospace';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#cf0000';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            const dist = Math.hypot(x - mouseX, y - mouseY);
            if (dist < 100) ctx.fillStyle = '#ff5555';
            else ctx.fillStyle = '#cf0000';

            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 33);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// GLOBAL EFFECTS (Loading, Shake, CRT, Hacking)
function initGlobalEffects() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.style.display = 'none', 1000);
        }, 500);
    }

    // Auto-resize Textarea
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(tx => {
        tx.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
}

// SERVER STATUS FETCH
async function fetchPlayerCount() {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://fivem.thelastworld.ca:30288/players.json')}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        const players = JSON.parse(data.contents);
        return players.length;
    } catch (e) {
        console.log("Status fetch failed", e);
        return null;
    }
}