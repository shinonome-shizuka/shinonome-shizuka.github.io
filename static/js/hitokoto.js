// hitokoto.js · 一言 API · 失败回退李白
(() => {
  const FALLBACK = "弃我去者，昨日之日不可留。";
  const targets = document.querySelectorAll('[data-hitokoto]');
  if (!targets.length) return;
  fetch('https://v1.hitokoto.cn?encode=json&charset=utf-8', { method: 'GET', cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(j => {
      const text = (j && (j.hitokoto || '')).trim();
      targets.forEach(el => { if (text) el.textContent = text + (j.from ? `（${j.from}）` : ''); });
    })
    .catch(() => {
      targets.forEach(el => { el.textContent = FALLBACK; });
    });
})();