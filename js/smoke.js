/* 첫 화면: 향로의 세 향에서 연기가 천천히 오른다. 움직임 줄이기 설정이면 그리지 않는다. */
(function () {
  const cv = document.querySelector('.altar-hero .smoke');
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = cv.parentElement, cx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, tips = [], parts = [], on = true, last = 0;
  // 부드러운 연기 한 점: 미리 그려 둔 흐린 원
  const sp = document.createElement('canvas'); sp.width = sp.height = 64;
  const g = sp.getContext('2d'), rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(226,228,236,1)'); rg.addColorStop(1, 'rgba(226,228,236,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
  function size() {
    const r = hero.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const svg = hero.querySelector('.censer'); if (!svg) return;
    const s = svg.getBoundingClientRect(), k = s.width / 120;
    tips = [[48, 2], [60, 0], [72, 2]].map(([x, y]) => [s.left - r.left + x * k, s.top - r.top + y * k]);
  }
  function spawn() {
    tips.forEach(([x, y], i) => {
      if (Math.random() < .55) parts.push({ x, y, x0: x, age: 0, life: 420 + Math.random() * 160, ph: Math.random() * 6.28 + i, sw: 10 + Math.random() * 16, vy: .95 + Math.random() * .35, r: 3 + Math.random() * 2 });
    });
  }
  function frame(t) {
    if (!on) return;
    requestAnimationFrame(frame);
    if (t - last < 30) return; last = t;
    spawn();
    cx.clearRect(0, 0, W, H);
    parts = parts.filter((p) => p.age < p.life);
    for (const p of parts) {
      p.age++; const k = p.age / p.life;
      p.y -= p.vy; p.x = p.x0 + Math.sin(p.ph + p.age * .018) * p.sw * k * 3 + k * 26;
      const r = p.r + k * 46, a = (1 - k) * Math.min(1, p.age / 30) * .06;
      cx.globalAlpha = a; cx.drawImage(sp, p.x - r, p.y - r, r * 2, r * 2);
    }
    cx.globalAlpha = 1;
  }
  size(); addEventListener('resize', size);
  if (document.fonts) document.fonts.ready.then(size);
  new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) requestAnimationFrame(frame); }).observe(hero);
  requestAnimationFrame(frame);
})();
