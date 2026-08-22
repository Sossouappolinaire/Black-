// MTN MoMo Guinée — mini app
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  if(el){ el.classList.add('active'); window.scrollTo(0,0); }
  // sync tabbar
  document.querySelectorAll('.tabbar .tab').forEach(t=>t.classList.remove('active'));
  const map={'s-home':0,'s-history':1,'s-qr':2,'s-favs':3,'s-account':4};
  if(id in map){ const tabs=document.querySelectorAll('.tabbar .tab'); if(tabs[map[id]]) tabs[map[id]].classList.add('active'); }
}

// splash -> login
setTimeout(()=>{ if(document.getElementById('s-splash').classList.contains('active')) show('s-login'); }, 1600);

function doLogin(){
  const p = document.getElementById('lg-phone').value.trim();
  const pin = document.getElementById('lg-pin').value.trim();
  if(p.length<8){ alert('Numéro invalide'); return; }
  if(pin.length<4){ alert('PIN invalide'); return; }
  const u = loadProfile();
  if(u){ u.phone = p; saveProfile(u); applyProfile(u); }
  else {
    document.getElementById('h-num').textContent = _fmtNum(p);
    document.getElementById('r-num').textContent = _fmtNum(p);
    if(document.getElementById('a-num')) document.getElementById('a-num').textContent = _fmtNum(p);
  }
  show('s-home');
}

let balVisible = true;
const balAmount = '1 254 690 000';
function toggleBal(){
  balVisible = !balVisible;
  document.getElementById('bal').innerHTML = balVisible ? (balAmount+' <small>GNF</small>') : '••••••• <small>GNF</small>';
}
function refreshBal(){
  const el = document.getElementById('bal');
  el.style.opacity='.4';
  setTimeout(()=>{ el.style.opacity='1'; },600);
}

function fmt(n){ return (n||0).toLocaleString('fr-FR').replace(/,/g,' '); }
function calcFees(){
  const v = parseInt((document.getElementById('sd-mt').value||'').replace(/\D/g,''))||0;
  const fee = Math.round(v*0.01); // 1%
  document.getElementById('sd-fee').textContent = fmt(fee)+' GNF';
  document.getElementById('sd-tot').textContent = fmt(v+fee)+' GNF';
}
function confirmSend(){
  const num = document.getElementById('sd-num').value.trim();
  const mt = document.getElementById('sd-mt').value.trim();
  const pin = document.getElementById('sd-pin').value.trim();
  if(!num||!mt||!pin){ alert('Veuillez remplir tous les champs.'); return; }
  if(pin.length<4){ alert('PIN invalide'); return; }
  alert('✅ Envoi confirmé de '+fmt(parseInt(mt))+' GNF vers +224 '+num);
  show('s-home');
}

function openBill(name){
  document.getElementById('bill-title').textContent = name;
  document.getElementById('bill-form').style.display='block';
  document.getElementById('bill-form').scrollIntoView({behavior:'smooth'});
}

// ── Inscription & profil utilisateur ────────────────────────────
function _initials(p,n){ return ((p||'?')[0]+(n||'')[0]||'?').toUpperCase(); }
function _fmtNum(p){ p=(p||'').replace(/\D/g,''); const a=p.slice(0,3), r=(p.slice(3).match(/.{1,2}/g)||[]); return ('+224 '+a+' '+r.join(' ')).trim(); }

function applyProfile(u){
  if(!u) return;
  const full = ((u.prenom||'')+' '+(u.nom||'')).trim();
  const ini  = _initials(u.prenom,u.nom);
  const num  = _fmtNum(u.phone);
  const set = (id,val,prop='textContent')=>{ const el=document.getElementById(id); if(el) el[prop]=val; };
  set('h-name', full);
  set('r-name', full);
  set('a-name', full);
  set('h-avatar', ini);
  set('a-avatar', ini);
  set('h-num', num);
  set('r-num', num);
  set('a-num', num);
}

function loadProfile(){
  try { return JSON.parse(localStorage.getItem('mtn_user')||'null'); } catch(e){ return null; }
}
function saveProfile(u){ localStorage.setItem('mtn_user', JSON.stringify(u)); }

function doSignup(){
  const prenom = document.getElementById('su-prenom').value.trim();
  const nom    = document.getElementById('su-nom').value.trim();
  const phone  = document.getElementById('su-phone').value.trim();
  const pin    = document.getElementById('su-pin').value.trim();
  const pin2   = document.getElementById('su-pin2').value.trim();
  if(!prenom || !nom){ alert('Veuillez saisir votre prénom et votre nom.'); return; }
  if(phone.length<8){ alert('Numéro MoMo invalide.'); return; }
  if(pin.length<4){ alert('Le code PIN doit contenir au moins 4 chiffres.'); return; }
  if(pin!==pin2){ alert('Les codes PIN ne correspondent pas.'); return; }
  const u = { prenom, nom, phone, pin };
  saveProfile(u);
  applyProfile(u);
  alert('✅ Compte créé avec succès, '+prenom+' !');
  show('s-home');
}

// Pré-remplir la connexion si un compte existe déjà + appliquer le profil
(function bootProfile(){
  let u = loadProfile();
  if(!u){
    u = { prenom: 'Priscille-import', nom: 'export', phone: '620557799', pin: '12345' };
    saveProfile(u);
  }
  applyProfile(u);
  const lg = document.getElementById('lg-phone'); if(lg && u.phone) lg.value = u.phone;
  window.__bal = '1 254 690 000';
  const bel = document.getElementById('bal');
  if(bel) bel.innerHTML = '1 254 690 000 <small>GNF</small>';
  localStorage.setItem('mtn_balance', '1254690000');
})();

// Mettre à jour le nom quand on se connecte (numéro saisi)
const _origLogin = typeof doLogin==='function' ? doLogin : null;
doLogin = function(){
  const p = document.getElementById('lg-phone').value.trim();
  const pin = document.getElementById('lg-pin').value.trim();
  if(p.length<8){ alert('Numéro invalide'); return; }
  if(pin.length<4){ alert('PIN invalide'); return; }
  const u = loadProfile();
  if(u){ u.phone = p; saveProfile(u); applyProfile(u); }
  else {
    document.getElementById('h-num').textContent = _fmtNum(p);
    document.getElementById('r-num').textContent = _fmtNum(p);
    if(document.getElementById('a-num')) document.getElementById('a-num').textContent = _fmtNum(p);
  }
  show('s-home');
};

// ── Mode administrateur ─────────────────────────────────────────
const ADMIN_PHONE = '628000000';   // +224 628 00 00 00
const ADMIN_PIN   = '97531';       // PIN administrateur

function adminTool(msg){ alert('👑 Admin : '+msg+' ✅'); }

function setBalanceValue(v){
  window.__bal = fmt(v);
  const el = document.getElementById('bal');
  if(el) el.innerHTML = window.__bal+' <small>GNF</small>';
}
function adminSetBalance(){
  const v = parseInt((document.getElementById('ad-bal').value||'').replace(/\D/g,''))||0;
  if(!v){ alert('Montant invalide'); return; }
  setBalanceValue(v);
  localStorage.setItem('mtn_balance', String(v));
  alert('👑 Nouveau solde appliqué : '+fmt(v)+' GNF ✅');
}
function adminCredit(){
  const c = document.getElementById('ad-cli').value.trim();
  const m = parseInt((document.getElementById('ad-mt').value||'').replace(/\D/g,''))||0;
  if(c.length<8 || !m){ alert('Numéro ou montant invalide'); return; }
  alert('👑 Compte +224 '+c+' crédité de '+fmt(m)+' GNF ✅');
}

// Restaurer un solde défini par l'admin
(function(){ const b=localStorage.getItem('mtn_balance'); if(b) setTimeout(()=>setBalanceValue(parseInt(b)),0); })();

// Interception de la connexion : accès administrateur
const _userLogin = doLogin;
doLogin = function(){
  const p = (document.getElementById('lg-phone').value||'').replace(/\D/g,'');
  const pin = (document.getElementById('lg-pin').value||'').trim();
  if(p === ADMIN_PHONE && pin === ADMIN_PIN){
    show('s-admin');
    return;
  }
  return _userLogin.apply(this, arguments);
};

// toggleBal doit respecter le solde courant
toggleBal = function(){
  balVisible = !balVisible;
  const amount = window.__bal || balAmount;
  document.getElementById('bal').innerHTML = balVisible ? (amount+' <small>GNF</small>') : '••••••• <small>GNF</small>';
};
