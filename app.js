/**
 * Coin Flip // Simple & Clean 3D Coin Toss
 */

(() => {
  'use strict';

  // Game State
  const state = {
    isFlipping: false,
    soundEnabled: true,
    heads: 0,
    tails: 0,
    total: 0
  };

  // DOM Elements
  const coin = document.getElementById('coin');
  const coinWrapper = document.getElementById('coin-wrapper');
  const flipBtn = document.getElementById('flip-btn');
  const resetBtn = document.getElementById('reset-btn');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const resultStatus = document.getElementById('result-status');
  const resultTitle = document.getElementById('result-title');
  const headsCountEl = document.getElementById('heads-count');
  const tailsCountEl = document.getElementById('tails-count');
  const totalCountEl = document.getElementById('total-count');

  // Web Audio Procedural Sounds
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playWhoosh() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, audioCtx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.41);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  function playClink() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1800, now);
      osc1.frequency.exponentialRampToValueAtTime(1500, now + 0.3);

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(3200, now);

      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.36);
      osc2.stop(now + 0.21);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Flip Action
  function flipCoin() {
    if (state.isFlipping) return;

    initAudio();
    state.isFlipping = true;
    flipBtn.disabled = true;

    playWhoosh();

    // Random Outcome (50/50)
    const isHeads = Math.random() >= 0.5;
    const animationName = isHeads ? 'flip-heads' : 'flip-tails';
    const duration = 1500; // 1.5 seconds

    // Reset current animation & trigger reflow
    coin.style.animation = 'none';
    coinWrapper.classList.remove('flipping');
    void coin.offsetHeight;

    // Start flip animation
    coin.style.animation = `${animationName} ${duration}ms cubic-bezier(0.2, 0.8, 0.3, 1) forwards`;
    coinWrapper.classList.add('flipping');

    resultStatus.textContent = 'IN THE AIR...';
    resultTitle.textContent = 'Flipping...';
    resultTitle.className = 'result-title';

    // On Landing
    setTimeout(() => {
      playClink();

      if (isHeads) {
        state.heads++;
        resultTitle.textContent = "It's Heads!";
        resultTitle.className = 'result-title is-heads';
      } else {
        state.tails++;
        resultTitle.textContent = "It's Tails!";
        resultTitle.className = 'result-title is-tails';
      }

      state.total++;
      resultStatus.textContent = `TOSS #${state.total} COMPLETE`;

      updateScoreUI();

      state.isFlipping = false;
      flipBtn.disabled = false;
    }, duration);
  }

  function updateScoreUI() {
    headsCountEl.textContent = state.heads;
    tailsCountEl.textContent = state.tails;
    totalCountEl.textContent = state.total;
  }

  function resetScore() {
    state.heads = 0;
    state.tails = 0;
    state.total = 0;
    updateScoreUI();
    resultStatus.textContent = 'SCORE RESET';
    resultTitle.textContent = 'Ready?';
    resultTitle.className = 'result-title';
  }

  function toggleSound() {
    initAudio();
    state.soundEnabled = !state.soundEnabled;
    soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
  }

  // Event Listeners
  flipBtn.addEventListener('click', flipCoin);
  coin.addEventListener('click', flipCoin);
  resetBtn.addEventListener('click', resetScore);
  soundBtn.addEventListener('click', toggleSound);

  // Keyboard Accessibility
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      flipCoin();
    } else if (e.code === 'KeyM') {
      e.preventDefault();
      toggleSound();
    }
  });

  // Initial State
  updateScoreUI();
})();
