/* ═══════════════════════════════════════════════════════
   Flip the Coin — script.js
   Minimal: one coin, one button, one result
   ═══════════════════════════════════════════════════════ */

const coin     = document.getElementById('coin');
const flipBtn  = document.getElementById('flipBtn');
const resultEl = document.getElementById('result');

let isFlipping = false;

// ─── Random outcome ─────────────────────────────────────
function tossCoin() {
  return Math.random() < 0.5 ? 'heads' : 'tails';
}

// ─── Flip handler ───────────────────────────────────────
async function handleFlip() {
  if (isFlipping) return;
  isFlipping = true;
  flipBtn.disabled = true;

  // On the first flip, remove the pristine class so that
  // the H / T letters become visible during the spin.
  coin.classList.remove('pristine');

  // Clear previous result
  resultEl.textContent = '';
  resultEl.className   = 'result';

  // Decide outcome
  const outcome = tossCoin();

  // ── Reset: remove old animation class AND inline style,
  //    then force a reflow so the browser restarts cleanly.
  coin.classList.remove('flip-heads', 'flip-tails');
  coin.style.transform = '';
  void coin.offsetHeight;

  // ── Start the spin animation
  coin.classList.add(outcome === 'heads' ? 'flip-heads' : 'flip-tails');

  // Wait for animation to finish
  await new Promise(resolve => {
    function onEnd() {
      coin.removeEventListener('animationend', onEnd);
      resolve();
    }
    coin.addEventListener('animationend', onEnd);
  });

  // ── KEY FIX: After animation ends, remove the animation class
  //    and set a clean, explicit transform so the browser renders
  //    the correct face without any ambiguity from large angles.
  coin.classList.remove('flip-heads', 'flip-tails');
  coin.style.transform = outcome === 'heads'
    ? 'rotateY(0deg)'
    : 'rotateY(180deg)';

  // Show result text
  resultEl.textContent = outcome === 'heads' ? "It's HEADS!" : "It's TAILS!";
  resultEl.classList.add(outcome, 'pop');

  isFlipping = false;
  flipBtn.disabled = false;
}

// ─── Bind ───────────────────────────────────────────────
flipBtn.addEventListener('click', handleFlip);
