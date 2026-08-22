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
  document.getElementById('h-num').textContent = '+224 '+p;
  document.getElementById('r-num').textContent = '+224 '+p;
  show('s-home');
}

let balVisible = true;
const balAmount = '1 250 000';
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
