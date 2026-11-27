/* 공감 추모원 홈페이지 공통: Firebase 로그인·서버 호출 (앱과 같은 계정) */
(function () {
  if (!window.firebase) return;
  firebase.initializeApp({
    apiKey: 'AIzaSyCQcSmk4bielcfI_pnhSbd3vezUypyKvR8',
    authDomain: 'gonggam-chumowon.firebaseapp.com',
    projectId: 'gonggam-chumowon',
    appId: '1:196589039125:web:e605f80940432225fb681c',
  });
  const auth = firebase.auth();
  const fns = firebase.app().functions('asia-northeast3');
  const API = 'https://asia-northeast3-gonggam-chumowon.cloudfunctions.net/web';
  let ready;
  const first = new Promise((r) => { ready = r; });
  auth.onAuthStateChanged((u) => ready(u));
  window.GG = {
    auth, API,
    /** 처음 한 번 로그인 상태를 알 때까지 기다린다 */
    user: () => first.then(() => auth.currentUser),
    /** 카카오·네이버·구글로 가입한 회원인가(익명은 아님) */
    isMember: (u) => !!u && !u.isAnonymous,
    async call(name, data) {
      await first;
      if (!auth.currentUser) await auth.signInAnonymously();
      try { return (await fns.httpsCallable(name)(data || {})).data; }
      catch (e) { throw new Error(e.message || '잠시 뒤 다시 시도해 주세요.'); }
    },
    async get(q) {
      const r = await fetch(API + '?' + new URLSearchParams(q));
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || '잠시 뒤 다시 시도해 주세요.');
      return j;
    },
    /** 로그인이 필요한 페이지: 회원이 아니면 로그인 페이지로 보낸다 */
    async requireMember() {
      const u = await GG.user();
      if (GG.isMember(u)) return u;
      location.replace('/login/?next=' + encodeURIComponent(location.pathname + location.search));
      return new Promise(() => {});
    },
    providerName(u) {
      if (!u) return '';
      if (u.providerData.some((p) => p.providerId === 'google.com')) return '구글';
      return '';
    },
  };
})();
