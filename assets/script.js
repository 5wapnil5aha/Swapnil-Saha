const typingText = document.getElementById("typingText");
const aboutTyping = document.getElementById("aboutTyping");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const heroLines = [
  "Frontend Developer_",
  "Cyberpunk UI Crafter_",
  "Security-Minded Builder_",
  "Creative Problem Solver_"
];

const aboutLine = "I create immersive interfaces, secure applications, and polished digital products that feel fast, intentional, and future-ready.";

function loopTyping(element, phrases, typingSpeed = 75, pause = 1500) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];
    element.textContent = phrase.slice(0, charIndex);

    if (!deleting) {
      charIndex += 1;
      if (charIndex > phrase.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      charIndex -= 1;
      if (charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
      }
    }

    const delay = deleting ? typingSpeed / 2 : typingSpeed;
    setTimeout(tick, delay);
  }

  tick();
}

function typeOnce(element, text, speed = 24) {
  let index = 0;

  function tick() {
    element.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      setTimeout(tick, speed);
    }
  }

  tick();
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  }
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  localStorage.setItem("portfolio-theme", body.classList.contains("light-mode") ? "light" : "dark");
});

applySavedTheme();
loopTyping(typingText, heroLines);
typeOnce(aboutTyping, aboutLine);

function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 54;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.8
    };
  }

  function connect() {
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.strokeStyle = `rgba(0, 204, 255, ${0.14 - distance / 900})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -1;
      }

      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -1;
      }

      ctx.beginPath();
      ctx.fillStyle = index % 5 === 0 ? "rgba(255, 0, 51, 0.85)" : "rgba(0, 204, 255, 0.82)";
      ctx.shadowBlur = 12;
      ctx.shadowColor = index % 5 === 0 ? "#ff0033" : "#00ccff";
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    connect();
    requestAnimationFrame(animate);
  }

  resize();
  for (let i = 0; i < particleCount; i += 1) {
    particles.push(createParticle());
  }

  window.addEventListener("resize", resize);
  animate();
}

function initMatrix() {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  const chars = "01<>[]{}=/#@$%^&*";
  let fontSize = 16;
  let columns = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = window.innerWidth < 768 ? 12 : 16;
    columns = Array(Math.floor(canvas.width / fontSize)).fill(1);
  }

  function draw() {
    ctx.fillStyle = body.classList.contains("light-mode")
      ? "rgba(234, 247, 255, 0.1)"
      : "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px Share Tech Mono`;

    columns.forEach((y, index) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = index * fontSize;
      ctx.fillStyle = index % 7 === 0 ? "rgba(255, 0, 51, 0.35)" : "rgba(0, 204, 255, 0.35)";
      ctx.fillText(char, x, y * fontSize);

      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        columns[index] = 0;
      }

      columns[index] += 1;
    });
  }

  resize();
  window.addEventListener("resize", resize);
  setInterval(draw, 70);
}

function initHoverSound() {
  const interactiveElements = document.querySelectorAll("a, button");
  let audioContext;

  function playTone() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.008;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.04);
  }

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", playTone);
  });
}

initParticles();
initMatrix();
initHoverSound();
