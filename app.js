(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progress = document.getElementById('progress');
  const count = document.getElementById('count');
  let i = 0;

  function show(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
      s.classList.toggle('past', idx < i);
    });
    progress.style.width = ((i + 1) / slides.length * 100) + '%';
    count.textContent = (i + 1) + ' / ' + slides.length;
    history.replaceState(null, '', '#' + (i + 1));
  }

  document.getElementById('next').onclick = () => show(i + 1);
  document.getElementById('prev').onclick = () => show(i - 1);

  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); show(i + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { show(i - 1); }
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
    else if (e.key.toLowerCase() === 'f') {
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    }
  });

  let startX = null;
  document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  document.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // --- Next-word demo ---
  const start = 'The cat sat on the';
  const probs = { mat: 55, sofa: 20, roof: 12, floor: 8, moon: 5 };
  const sentence = document.getElementById('sentence');
  const bars = document.getElementById('bars');
  let picked = null;

  function render() {
    sentence.innerHTML = start + (picked ? ' <em>' + picked + '</em>' : ' <em>…</em>');
    bars.innerHTML = Object.entries(probs).map(([w, p]) =>
      '<div class="bar"><span>' + w + '</span><i style="width:' + p * 1.6 + '%"></i><span>' + p + '%</span></div>'
    ).join('');
  }

  document.getElementById('gen').onclick = () => {
    let r = Math.random() * 100, acc = 0;
    for (const [w, p] of Object.entries(probs)) { acc += p; if (r < acc) { picked = w; break; } }
    render();
  };
  document.getElementById('reset').onclick = () => { picked = null; render(); };
  render();

  const fromHash = parseInt(location.hash.slice(1), 10);
  show(isNaN(fromHash) ? 0 : fromHash - 1);
})();
      
