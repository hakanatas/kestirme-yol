/* SAHNE 1 — PARK (0–10 s)  Kenardan mı, çaprazdan mı?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function dashL(ctx, p, q, a, seed, color, w = 2.5) {
    if (a <= 0) return; const n = Math.max(6, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 14));
    for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w, alpha: a, seed: seed + j, taper: [0, 0], color });
  }
  function seg2(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]], { w, alpha: a, seed, taper: [0, 0], color }); }
  function dot(ctx, p, a, color) { if (a <= 0) return; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = color ? `rgba(${color},${a})` : `rgba(${LI.INK_RGB},${a})`; ctx.fill(); }
  function txt(ctx, env, p, s, a, hot, sz = 0.8) { if (a > 0) F().T(ctx, s, p[0], p[1], { size: KD.L(env).G.s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function arcAt(ctx, C, r, u0, u1, a, seed, color) {
    if (a <= 0) return; const P = []; for (let j = 0; j <= 16; j++) { const u = lerp(u0, u1, j / 16); P.push([C[0] + r * Math.cos(u), C[1] + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 2.5, alpha: a, seed, taper: [0, 0], color });
  }
  const lerpP = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  function poly(ctx, P, fill) { ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  function line(ctx, p, q, a, k, seed, color, w = 4) { if (a > 0 && k > 0) Ink.path(ctx, [p, lerpP(p, q, k)], { w, alpha: a, seed, taper: [0, 0], color }); }
  function rightMark(ctx, V, P, Q, a, seed, color, r = 20) {
    if (a <= 0) return; const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]], nu = Math.hypot(...u), nw = Math.hypot(...w);
    const p1 = [V[0] + u[0] / nu * r, V[1] + u[1] / nu * r], p3 = [V[0] + w[0] / nw * r, V[1] + w[1] / nw * r], p2 = [p1[0] + w[0] / nw * r, p1[1] + w[1] / nw * r];
    Ink.path(ctx, [p1, p2, p3], { w: 3, alpha: a, seed, taper: [0, 0], color: color || LI.AMBER_RGB });
  }
  function tick(ctx, p, q, k, a, seed) {
    if (a <= 0) return; const m = lerpP(p, q, k), d = [q[0] - p[0], q[1] - p[1]], n = Math.hypot(...d), o = [-d[1] / n * 10, d[0] / n * 10];
    Ink.path(ctx, [[m[0] - o[0], m[1] - o[1]], [m[0] + o[0], m[1] + o[1]]], { w: 3, alpha: a, seed, taper: [0, 0], color: LI.AMBER_RGB });
  }
  function field(env) {
    const F_ = KD.L(env).FL, u = F_.u, A0 = [F_.x0, F_.y0];
    return { A: A0, B: [A0[0] + 16 * u, A0[1]], C: [A0[0] + 16 * u, A0[1] - 12 * u], D: [A0[0], A0[1] - 12 * u], u };
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Parkın bir köşesinden karşı köşesine'],
      [10.6, 27.8, 'Anlayalım: ne biliyoruz, ne arıyoruz?'],
      [28.4, 45.8, 'Çözelim: çapraz yol kaç metre?'],
      [46.4, 63.8, 'Kontrol edelim'],
      [64.4, 79.8, 'Aynı yol, başka bir problem'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t), s = KD.L(env).G.s, P = field(env);
    const aF = a * win(t, 5.0, 63.8);
    if (aF > 0) {
      const k = seg(t, 5.2, 6.8);
      line(ctx, P.A, P.B, aF, k, 2801); line(ctx, P.B, P.C, aF, k, 2802); line(ctx, P.C, P.D, aF, k, 2803); line(ctx, P.D, P.A, aF, k, 2804);
      poly(ctx, [P.A, P.B, P.C, P.D], `rgba(${LI.INK_RGB},${0.04 * aF * k})`);
      const L = (n, p, dx, dy, al, hot) => { if (al > 0) F().T(ctx, n, p[0] + dx, p[1] + dy, { size: s * 0.6, alpha: al, halo: true, color: hot ? A.amber : undefined }); };
      const nl = aF * seg(t, 6.8, 7.2); L('A', P.A, -24, 22, nl); L('B', P.B, 24, 22, nl); L('C', P.C, 24, -20, nl); L('D', P.D, -24, -20, nl);
      // walking the edges vs cutting across
      const w = aF * seg(t, 7.4, 7.8); if (w > 0) { dashL(ctx, [P.A[0], P.A[1] + 14], [lerp(P.A[0], P.B[0], seg(t, 7.4, 8.4)), P.A[1] + 14], w * 0.7, 2805); if (t > 8.4) dashL(ctx, [P.B[0] + 14, P.B[1]], [P.B[0] + 14, lerp(P.B[1], P.C[1], seg(t, 8.4, 9.2))], w * 0.7, 2806); }
      line(ctx, P.A, P.C, aF * seg(t, 9.2, 9.6), seg(t, 9.2, 10.0), 2807, LI.AMBER_RGB, 4.5);
      // S2: data
      const d = aF * seg(t, 11.2, 11.6);
      L('16 m', [(P.A[0] + P.B[0]) / 2, P.A[1]], 0, 46, d); L('12 m', [P.B[0], (P.B[1] + P.C[1]) / 2], 58, 0, d);
      const q = aF * seg(t, 12.6, 13.0) * (1 - seg(t, 33.6, 34.0)); L('?', lerpP(P.A, P.C, 0.5), -26, -26, q, true);
      rightMark(ctx, P.B, P.A, P.C, aF * seg(t, 14.4, 14.8), 2808);
      const tri = aF * win(t, 15.6, 27.8) ; if (tri > 0) poly(ctx, [P.A, P.B, P.C], `rgba(${LI.AMBER_RGB},${0.14 * tri})`);
      // S3: the answer
      L('20 m', lerpP(P.A, P.C, 0.5), -40, -30, aF * seg(t, 34.0, 34.4), true);
      // S4: quarters and a small 3-4-5 triangle
      const k4 = aF * win(t, 49.4, 63.8);
      if (k4 > 0) {
        [0.25, 0.5, 0.75].forEach((f, i) => { const v = k4 * seg(t, 49.4 + i * 0.3, 49.8 + i * 0.3); tick(ctx, P.A, P.B, f, v, 2810 + i); tick(ctx, P.B, P.C, f, v, 2820 + i); tick(ctx, P.A, P.C, f, v, 2830 + i); });
        const Q1 = lerpP(P.A, P.B, 0.25), Q2 = lerpP(P.A, P.C, 0.25), v = k4 * seg(t, 50.8, 51.4);
        if (v > 0) { poly(ctx, [P.A, Q1, Q2], `rgba(${LI.AMBER_RGB},${0.35 * v})`); Ink.path(ctx, [Q1, Q2], { w: 3, alpha: v, seed: 2840, taper: [0, 0], color: LI.AMBER_RGB }); L('4', lerpP(P.A, Q1, 0.5), 0, 26, v, true); L('3', lerpP(Q1, Q2, 0.5), 18, 0, v, true); L('5', lerpP(P.A, Q2, 0.5), -8, -22, v, true); }
      }
    }
    tally(ctx, env, t, [[11.2, 27.8, 'Bilinen: 16 m ve 12 m'], [12.8, 27.8, 'Aranan: çapraz yol AC'], [14.6, 27.8, 'B köşesi dik açı: ABC dik üçgen'], [17.4, 27.8, 'Kenardan: 16 + 12 = 28 m', true]]);
    tally(ctx, env, t, [[29.4, 45.8, 'AC² = 16² + 12²'], [31.0, 45.8, 'AC² = 256 + 144 = 400'], [33.6, 45.8, 'AC = √400 = 20 m'], [36.4, 45.8, '28 − 20 = 8 m kısa', true]]);
    tally(ctx, env, t, [[47.0, 63.8, '20 < 16 + 12 = 28: eşitsizlik ✓'], [49.4, 63.8, 'Kısa yol: 16, 12, 20 = 4 × (4, 3, 5)'], [53.6, 63.8, 'En büyük açı B, karşısı AC en uzun ✓'], [56.4, 63.8, 'Sonuç mantıklı ✓', true]]);
    // S5: the ladder
    const k5 = a * win(t, 64.8, 79.8);
    if (k5 > 0) {
      const F_ = KD.L(env).FL, m = F_.m, G = [F_.x0 + 20, F_.y0], Wx = F_.x0 + 300, top = [Wx, F_.y0 - 2.4 * m], foot = [Wx - 0.7 * m, F_.y0];
      line(ctx, G, [Wx + 60, F_.y0], k5, seg(t, 65.0, 65.8), 2850);
      line(ctx, [Wx, F_.y0], [Wx, F_.y0 - 3.0 * m], k5, seg(t, 65.4, 66.2), 2851, undefined, 6);
      line(ctx, foot, top, k5, seg(t, 66.4, 67.4), 2852, LI.AMBER_RGB, 5);
      rightMark(ctx, [Wx, F_.y0], foot, top, k5 * seg(t, 67.6, 68.0), 2853);
      const L = (n, p, dx, dy, al, hot) => { if (al > 0) F().T(ctx, n, p[0] + dx, p[1] + dy, { size: s * 0.6, alpha: al, halo: true, color: hot ? A.amber : undefined }); };
      const v = k5 * seg(t, 67.8, 68.2);
      L('2,5 m', lerpP(foot, top, 0.5), -64, 0, v, true); L('0,7 m', lerpP(foot, [Wx, F_.y0], 0.5), 0, 32, v); L('h', lerpP([Wx, F_.y0], top, 0.5), 30, 0, v * (1 - seg(t, 73.0, 73.4)));
      L('2,4 m', lerpP([Wx, F_.y0], top, 0.5), 54, 0, k5 * seg(t, 73.4, 73.8), true);
    }
    tally(ctx, env, t, [[66.8, 79.8, 'Merdiven 2,5 m, dibi duvardan 0,7 m'], [69.0, 79.8, 'h² = 2,5² − 0,7² = 6,25 − 0,49'], [71.4, 79.8, 'h² = 5,76 → h = 2,4 m'], [74.4, 79.8, 'Kontrol: 2,4² + 0,7² = 6,25 = 2,5² ✓', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Kenarlardan mı yürüyelim, çaprazdan mı?'],
      [11.4, 27.8, 'Bilinenleri ve arananı ayıralım'],
      [29.4, 45.8, 'Dik üçgende Pisagor bağıntısını kullanalım'],
      [47.4, 63.8, 'Sonucu farklı yollarla sınayalım'],
      [65.4, 79.8, 'Dik kenarı bulmak için çıkarırız']]);
    exprs(ctx, t, at(W, 1), [[18.6, 27.8, 'Çapraz yol 28 m’den kısa olmalı: üçgen eşitsizliği'],
      [34.2, 45.8, '20 · 20 = 400: karekök 20'],
      [51.4, 63.8, 'Küçük 3, 4, 5 üçgeninin 4 katı'],
      [72.0, 79.8, 'Hipotenüs her zaman en uzun kenardır']]);
    exprs(ctx, t, at(W, 2), [[22.4, 27.8, 'Dik açı var: Pisagor işe yarar', true], [38.0, 45.8, 'Kestirme yol 8 m kısa', true],
      [58.0, 63.8, 'Sonuç mantıklı', true], [76.0, 79.8, 'Dik üçgen görünce: a² + b² = c²', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Anla: ne biliniyor, ne aranıyor?', 80.6], ['Dik üçgeni bul, bağıntıyı yaz', 81.6], ['Hesapla, sonra kontrol et', 82.6], ['Kestirme yol 8 m kısa!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'The park', nameTr: 'Park', concept: 'Edges or across?', conceptTr: 'Kenardan mı, çaprazdan mı?', render });
})(window.LI = window.LI || {});
