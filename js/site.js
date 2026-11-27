/* 공감 추모원 홈페이지 공통 머리말·메뉴·바닥글. 페이지는 <div id="site-top"></div> 와 <div id="site-foot"></div> 만 둔다. */
(function () {
  const MENU = [
    ['/funeral/', '장례 안내'],
    ['/bugo/', '부고장 보내기'],
    ['/create/', '추모관 만들기'],
    ['/search/', '추모관 찾기'],
    ['/hall/', '온라인 분향소'],
    ['/pet/', '반려동물'],
    ['/support/', '고객센터'],
  ];
  /* 글씨 크게: 어르신을 위해 화면 전체를 키운다. 이 브라우저에만 기억한다. */
  let big = false;
  try { big = localStorage.getItem('gg_big') === '1'; } catch (e) {}
  document.documentElement.classList.toggle('big', big);
  const here = location.pathname.replace(/index\.html$/, '');
  const on = (href) => (here === href || (href !== '/' && here.startsWith(href)) ? ' aria-current="page"' : '');
  const links = MENU.map(([h, t]) => `<a href="${h}"${on(h)}>${t}</a>`).join('');
  const top = document.getElementById('site-top');
  if (top) {
    top.outerHTML = `<div class="util"><div class="wrap">
      <span class="util-say">조문과 부고장은 언제나 무료입니다</span>
      <button class="bigtext" type="button" aria-pressed="${big}">글씨 크게</button>
      <a href="https://pf.kakao.com/_kWpvX/chat" target="_blank" rel="noopener">카카오톡 상담</a>
      <a class="tel" href="tel:01063872283">010-6387-2283</a>
    </div></div>
    <header class="top"><div class="wrap">
      <a class="brand" href="/"><img src="/icon.png" alt="">공감 추모원</a>
      <nav class="mainnav" aria-label="주요 메뉴">${links}</nav>
      <a class="acct" id="acct" href="/login/">로그인</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span><b>메뉴</b></button>
    </div>
    <div class="drawer" id="drawer" hidden><nav class="wrap" aria-label="전체 메뉴">${links}<a href="/guide/"${on('/guide/')}>이용안내 · 요금</a><a href="/about/"${on('/about/')}>회사소개</a><a class="dr-acct" id="acct2" href="/login/">로그인 · 회원가입</a></nav></div>
    </header>`;
    const btn = document.querySelector('.menu-btn'), dr = document.getElementById('drawer');
    btn.addEventListener('click', () => { const open = dr.hidden; dr.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
    const bt = document.querySelector('.bigtext');
    bt.addEventListener('click', () => {
      big = !big; document.documentElement.classList.toggle('big', big); bt.setAttribute('aria-pressed', String(big));
      try { localStorage.setItem('gg_big', big ? '1' : '0'); } catch (e) {}
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dr.hidden) { dr.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
  }
  const foot = document.getElementById('site-foot');
  if (foot) {
    foot.outerHTML = `<footer class="foot"><div class="wrap">
      <div class="foot-cols">
        <div><a class="brand" href="/"><img src="/icon.png" alt="">공감 추모원</a><p class="foot-say">그리운 분을 언제든 찾아뵙는 곳</p></div>
        <nav aria-label="바닥 메뉴"><b>찾아뵙기</b><a href="/search/">추모관 찾기</a><a href="/hall/">온라인 분향소</a><a href="/pet/">무지개 정원</a><a href="/funeral/">장례 안내</a></nav>
        <nav aria-label="바닥 메뉴"><b>모시기</b><a href="/create/">추모관 만들기</a><a href="/bugo/">부고장 보내기</a><a href="/create/?target=pet">반려동물 추모관</a><a href="/my/">내 추모관</a></nav>
        <nav aria-label="바닥 메뉴"><b>도움</b><a href="/guide/">이용안내</a><a href="/support/">고객센터</a><a href="/about/">회사소개</a></nav>
      </div>
      <dl class="biz">
        <dt>상호</dt><dd>라도그 (Ra Dog)</dd><dt>대표자</dt><dd>최사무엘</dd>
        <dt>사업자등록번호</dt><dd>794-50-00416</dd><dt>통신판매업 신고</dt><dd>제2020-서울강서-3690호</dd>
        <dt>주소</dt><dd>서울특별시 강서구 화곡로53나길 25 (화곡동)</dd><dt>전화</dt><dd>010-6387-2283</dd>
        <dt>이메일</dt><dd>ellahack94@gmail.com</dd><dt>카카오톡</dt><dd><a href="https://pf.kakao.com/_kWpvX" target="_blank" rel="noopener">공감 추모원 채널</a></dd>
      </dl>
      <div class="links"><a href="/privacy.html"><b>개인정보처리방침</b></a><a href="/terms.html">이용약관</a><a href="/delete.html">계정 삭제 안내</a><a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7945000416" target="_blank" rel="noopener">사업자정보 확인</a></div>
      <p>© 2026 라도그. 공감 추모원.</p>
    </div></footer>`;
  }
  /* 로그인 상태에 따라 오른쪽 위 버튼을 바꾼다 */
  if (window.GG) GG.user().then((u) => {
    const m = GG.isMember(u);
    const a = document.getElementById('acct'), b = document.getElementById('acct2');
    if (a) { a.textContent = m ? '내 추모관' : '로그인'; a.href = m ? '/my/' : '/login/'; }
    if (b) { b.textContent = m ? '내 추모관' : '로그인 · 회원가입'; b.href = m ? '/my/' : '/login/'; }
  });
})();
/* 페이지 공통 도우미 */
window.esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
window.ymd = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '')); return m ? `${+m[1]}. ${+m[2]}. ${+m[3]}.` : ''; };
window.toast = (msg) => {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 3200);
};
