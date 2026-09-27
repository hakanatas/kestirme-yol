/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Kenardan mı, çaprazdan mı?', en: 'Along the edges or across?',
      note: 'Parkın A köşesinden C köşesine gideceğiz. Kenarlardan mı yürüyelim, çaprazdan mı? Çapraz yol ne kadar kısa?' },
    { scene: 2, start: 10.8, end: 19.2, tr: 'Bilinen ve aranan', en: 'What we know, what we want',
      note: 'Parkın kenarları 16 ve 12 metre. Aradığımız çapraz yol AC. B köşesi dik açı, yani ABC bir dik üçgen.' },
    { scene: 2, start: 19.4, end: 27.8, tr: 'Kenardan 28 m', en: '28 m along the edges',
      note: 'Kenarlardan yürürsek 16 artı 12, 28 metre. Üçgen eşitsizliğine göre çapraz yol bundan kısa olmalı.' },
    { scene: 3, start: 28.8, end: 36.2, tr: 'AC² = 400', en: 'AC² = 400',
      note: 'Dik üçgende Pisagor: AC kare, 16 kare artı 12 kare; 256 artı 144, 400.' },
    { scene: 3, start: 36.4, end: 45.8, tr: 'Çapraz yol 20 m', en: 'The diagonal is 20 m',
      note: '20 çarpı 20, 400; AC 20 metre. 28 eksi 20: kestirme yol 8 metre kısa.' },
    { scene: 4, start: 46.8, end: 55.0, tr: 'Kısa yol: 4 × (3, 4, 5)', en: 'A shortcut: 4 × (3, 4, 5)',
      note: '20, 28 den küçük: üçgen eşitsizliği sağlanıyor. Kenarlar 4, 3, 5 in 4 katı; küçük üçgen hesabı doğruluyor.' },
    { scene: 4, start: 55.2, end: 63.8, tr: 'Sonuç mantıklı', en: 'The answer makes sense',
      note: 'En büyük açı B, dik açı. Karşısındaki AC de en uzun kenar. Sonuç mantıklı.' },
    { scene: 5, start: 64.8, end: 72.0, tr: 'Merdiven problemi', en: 'A ladder problem',
      note: '2,5 metrelik merdivenin dibi duvardan 0,7 metre uzakta. Merdiven hipotenüs; yüksekliği bulmak için çıkarırız.' },
    { scene: 5, start: 72.2, end: 79.8, tr: 'h = 2,4 m', en: 'h = 2.4 m',
      note: 'h kare 6,25 eksi 0,49, 5,76. h 2,4 metre. Kontrol: 2,4 merdivenden kısa.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Anla, çöz, kontrol et', en: 'Understand, solve, check',
      note: 'Aklında kalsın: bilinenleri ayır, dik üçgeni bul, bağıntıyı yaz, hesapla ve kontrol et.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Kestirme 8 m kısa!', en: 'The shortcut is 8 m shorter!',
      note: 'Kestirme yol 8 metre kısa!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
