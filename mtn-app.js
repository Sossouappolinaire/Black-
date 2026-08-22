// MTN MoMo Guinée — mini app (design image)
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  if(el){ el.classList.add('active'); window.scrollTo(0,0); }
}

// ══ Profil utils ══
function _initials(p,n){ return ((p||'?')[0]+(n||'')[0]||'?').toUpperCase(); }
function _fmtNum(p){ p=(p||'').replace(/\D/g,''); const a=p.slice(0,3), r=(p.slice(3).match(/.{1,2}/g)||[]); return ('+224 '+a+' '+r.join(' ')).trim(); }

function applyProfile(u){
  if(!u) return;
  const full = ((u.prenom||'')+' '+(u.nom||'')).trim();
  const ini  = _initials(u.prenom,u.nom);
  const num  = _fmtNum(u.phone);
  const set = (id,val,prop='textContent')=>{ const el=document.getElementById(id); if(el) el[prop]=val; };
  set('h-name', full);
  set('a-name', full);
  set('h-avatar', ini);
  set('a-avatar', ini);
  set('h-num', num);
  set('a-num', num);
}

function loadProfile(){
  try { return JSON.parse(localStorage.getItem('mtn_user')||'null'); } catch(e){ return null; }
}
function saveProfile(u){ localStorage.setItem('mtn_user', JSON.stringify(u)); }

// ══ Solde ══
let balVisible = true;
const balAmount = '1 254 690 000';
function toggleBal(){
  balVisible = !balVisible;
  const amount = window.__bal || balAmount;
  document.getElementById('bal').innerHTML = balVisible ? (amount+' <small>GNF</small>') : '•••••••••• <small>GNF</small>';
}
function refreshBal(){
  const el = document.getElementById('bal');
  el.style.opacity='.4';
  setTimeout(()=>{ el.style.opacity='1'; },600);
}
function fmt(n){ return (n||0).toLocaleString('fr-FR').replace(/,/g,' '); }

// ══ Auto-create demo user ══
(function initDemoUser(){
  if(!loadProfile()){
    const demoUser = {
      prenom: 'Priscille',
      nom: 'import export',
      phone: '620123456',
      pin: '0000'
    };
    saveProfile(demoUser);
    localStorage.setItem('mtn_balance', '1254690000');
  }
  const b = localStorage.getItem('mtn_balance');
  if(b) window.__bal = fmt(parseInt(b));
})();

// ══ Splash → Home direct si profil existe ══
setTimeout(()=>{
  const splash = document.getElementById('s-splash');
  if(splash && splash.classList.contains('active')){
    const u = loadProfile();
    if(u){
      applyProfile(u);
      show('s-home');
    } else {
      show('s-login');
    }
  }
}, 1600);

// ══ Login ══
function doLogin(){
  const p = (document.getElementById('lg-phone').value||'').replace(/\D/g,'');
  const pin = (document.getElementById('lg-pin').value||'').trim();

  // Admin bypass
  if(p === ADMIN_PHONE && pin === ADMIN_PIN){
    show('s-admin');
    return;
  }

  if(p.length<8){ alert('Numéro invalide'); return; }
  if(pin.length<4){ alert('PIN invalide'); return; }

  const u = loadProfile();
  if(u){
    if(u.pin && pin !== u.pin){ alert('PIN incorrect'); return; }
    u.phone = p; saveProfile(u); applyProfile(u);
  } else {
    document.getElementById('h-num').textContent = _fmtNum(p);
    document.getElementById('a-num').textContent = _fmtNum(p);
  }
  show('s-home');
}

// ══ Envoi ══
function calcFees(){
  const v = parseInt((document.getElementById('sd-mt').value||'').replace(/\D/g,''))||0;
  const fee = Math.round(v*0.01);
  document.getElementById('sd-fee').textContent = fmt(fee)+' GNF';
  document.getElementById('sd-tot').textContent = fmt(v+fee)+' GNF';
}
function confirmSend(){
  const num = document.getElementById('sd-num').value.trim();
  const mt = document.getElementById('sd-mt').value.trim();
  const pin = document.getElementById('sd-pin').value.trim();
  if(!num||!mt||!pin){ alert('Veuillez remplir tous les champs.'); return; }
  if(pin.length<4){ alert('PIN invalide'); return; }
  alert('✅ Transfert confirmé de '+fmt(parseInt(mt))+' GNF vers +224 '+num);
  show('s-home');
}

// ══ Factures ══
function openBill(name){
  document.getElementById('bill-title').textContent = name;
  document.getElementById('bill-form').style.display='block';
  document.getElementById('bill-form').scrollIntoView({behavior:'smooth'});
}

// ══ Admin ══
const ADMIN_PHONE = '628000000';
const ADMIN_PIN   = '97531';

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

// Restaurer solde admin
(function(){ const b=localStorage.getItem('mtn_balance'); if(b) setTimeout(()=>setBalanceValue(parseInt(b)),0); })();

// ══ Boot profile ══
(function bootProfile(){
  const u = loadProfile();
  if(u){
    applyProfile(u);
    const lg = document.getElementById('lg-phone'); if(lg && u.phone) lg.value = u.phone;
  }
})();
