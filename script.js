// Contadores de votos
let votesMenina = parseInt(localStorage.getItem('votesMenina')) || 0;
let votesMenino = parseInt(localStorage.getItem('votesMenino')) || 0;
let hasVoted = localStorage.getItem('hasVoted') === 'true';

// Timer de 5 segundos para suspense
let countdownSeconds = 5;
let countdownInterval = null;

// Atualiza os contadores na tela
function updateVoteCounts() {
    document.getElementById('countMenina').textContent = votesMenina;
    document.getElementById('countMenino').textContent = votesMenino;
    
    // Habilita o botão de continuar se pelo menos um voto foi dado
    const nextBtn1 = document.getElementById('nextBtn1');
    if (votesMenina > 0 || votesMenino > 0) {
        nextBtn1.disabled = false;
    }
}

// Função para votar
function vote(option) {
    if (hasVoted) {
        alert('Você já votou! Obrigado pela participação! 💕');
        return;
    }
    
    if (option === 'menina') {
        votesMenina++;
        localStorage.setItem('votesMenina', votesMenina);
    } else if (option === 'menino') {
        votesMenino++;
        localStorage.setItem('votesMenino', votesMenino);
    }
    
    hasVoted = true;
    localStorage.setItem('hasVoted', 'true');
    localStorage.setItem('lastVote', option);
    
    // Animação de confete
    createVoteConfetti(option);
    
    // Atualiza os contadores
    updateVoteCounts();
    
    // Feedback visual
    const button = event.target.closest('.vote-btn');
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 300);
}

// Cria confetes ao votar
function createVoteConfetti(option) {
    const colors = option === 'menina' 
        ? ['#ff6b9d', '#ff8fab', '#ffb6c1', '#ffc0cb']
        : ['#4a90e2', '#87ceeb', '#b0e0e6', '#add8e6'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `confettiFall ${(Math.random() * 2 + 1)}s linear`;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// Adiciona animação de confete ao CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navegação entre steps
function goToStep(stepNumber) {
    // Esconde todos os steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.add('hidden');
        step.classList.remove('active');
    });
    
    // Mostra o step selecionado
    const targetStep = document.getElementById(`step${stepNumber}`);
    targetStep.classList.remove('hidden');
    targetStep.classList.add('active');
    
    // Se for o step 2, destaca a opção escolhida
    if (stepNumber === 2) {
        highlightSelectedOption();
    }
    
    // Se for o step 3, inicia o countdown
    if (stepNumber === 3) {
        startCountdown();
    }
}

// Destaca a opção escolhida no Step 2
function highlightSelectedOption() {
    // Remove destaque anterior
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Verifica qual foi a última opção votada
    const lastVote = localStorage.getItem('lastVote');
    if (lastVote === 'menina') {
        const pinkCard = document.querySelector('.option-pink');
        if (pinkCard) {
            pinkCard.classList.add('selected');
        }
    } else if (lastVote === 'menino') {
        const blueCard = document.querySelector('.option-blue');
        if (blueCard) {
            blueCard.classList.add('selected');
        }
    }
}

// Timer de contagem regressiva de 5 segundos
function startCountdown() {
    const secondsEl = document.getElementById('seconds');
    
    // Reset do contador
    countdownSeconds = 5;
    
    function updateCountdown() {
        if (countdownSeconds <= 0) {
            secondsEl.textContent = '00';
            
            // Mostra a revelação
            showRevelation();
            
            // Limpa o intervalo
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            return;
        }
        
        // Mostra os segundos
        secondsEl.textContent = String(countdownSeconds).padStart(2, '0');
        
        // Animação quando os segundos mudam
        secondsEl.style.transform = 'scale(1.3)';
        secondsEl.style.color = '#b58863';
        setTimeout(() => {
            secondsEl.style.transform = 'scale(1)';
        }, 300);
        
        countdownSeconds--;
    }
    
    // Atualiza imediatamente
    updateCountdown();
    
    // Atualiza a cada segundo
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Função para mostrar a revelação final (quando o timer chegar a zero)
// ALTERE AQUI: escolha qual revelação mostrar (0 = menina, 1 = menino)
const revealResult = 0; // 0 = Menina, 1 = Menino

function showRevelation() {
    const countdownContainer = document.querySelector('.countdown-container');
    
    if (revealResult === 0) {
        // É MENINA
        countdownContainer.innerHTML = `
            <h2 style="font-size: 3.5rem; color: #ff6b9d; margin-bottom: 30px; font-family: 'Funnel Display', sans-serif;">🎉 É uma MENINA! 🎉</h2>
            <div style="margin: 30px 0;">
                <img src="ursinho_menina.png" alt="Ursinho Menina" style="max-width: 250px; width: 100%; height: auto; animation: bearBounce 2s ease-in-out infinite;">
            </div>
            <h3 style="font-size: 2.5rem; color: #ff6b9d; margin: 20px 0; font-family: 'Funnel Display', sans-serif;">Maria Helena</h3>
            <p style="font-size: 1.5rem; color: #8b5a7a; font-style: italic; margin-top: 20px; font-family: 'Funnel Display', sans-serif;">Parabéns pela nova jornada! 💕</p>
        `;
    } else {
        // É MENINO
        countdownContainer.innerHTML = `
            <h2 style="font-size: 3.5rem; color: #4a90e2; margin-bottom: 30px; font-family: 'Funnel Display', sans-serif;">🎉 É um MENINO! 🎉</h2>
            <div style="margin: 30px 0;">
                <img src="ursinho_menino.png" alt="Ursinho Menino" style="max-width: 250px; width: 100%; height: auto; animation: bearBounce 2s ease-in-out infinite;">
            </div>
            <h3 style="font-size: 2.5rem; color: #4a90e2; margin: 20px 0; font-family: 'Funnel Display', sans-serif;">José Henrique</h3>
            <p style="font-size: 1.5rem; color: #8b5a7a; font-style: italic; margin-top: 20px; font-family: 'Funnel Display', sans-serif;">Parabéns pela nova jornada! 💙</p>
        `;
    }
    
    // Cria muitos confetes
    createFinalConfetti();
}

// Cria confetes finais
function createFinalConfetti() {
    const colors = ['#b58863', '#d4a574', '#e8c9a8', '#f0ddd0', '#4a90e2', '#87ceeb', '#b0e0e6'];
    
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `confettiFall ${(Math.random() * 3 + 2)}s linear`;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 30);
    }
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', function() {
    updateVoteCounts();
    
    // Cria corações flutuantes no background
    createFloatingHearts();
});

// Cria corações flutuantes no background
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-background');
    const hearts = ['💕', '💖', '💗', '💓', '💝'];
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 15 + 15 + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.opacity = Math.random() * 0.3 + 0.2;
        heart.style.animation = `floatHeart ${(Math.random() * 10 + 10)}s infinite ease-in-out`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartsContainer.appendChild(heart);
    }
}
