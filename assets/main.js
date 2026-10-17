const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=u=>fetch(u).then(r=>r.json()),ok=u=>fetch(u,{method:'HEAD'}).then(r=>r.ok).catch(()=>false);
const sv=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},ld=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
let th=ld('th')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.dataset.theme=th;
let lang=ld('lang')||(navigator.language||'en').slice(0,2);if(!['es','en','ko'].includes(lang))lang='en';
let I,S,PB,PJ,TU,hasCV,hasPh,q='',yr='';
const t=k=>I[lang][k]??I.en[k]??k,Lo=o=>o[lang]||o.en;
const NAV=[['home','index.html'],['research','research.html'],['publications','publications.html'],['tutorials','tutorials.html']];
const sec=(h,b)=>b?`<section class="rv"><h2>${h}</h2>${b}</section>`:'';
const pubH=p=>{const u='https://doi.org/'+esc(p.doi);return `<div class="item"><strong>${p.title?esc(p.title):`<em>${t('pending')}</em>`}</strong><br>${p.authors.length?`<span>${p.authors.map(a=>a.includes('Ramirez-Gomez')?`<b>${esc(a)}</b>`:esc(a)).join(', ')}</span><br>`:''}<span class="meta">${[p.journal,p.year,p.volume&&'vol. '+p.volume,p.pages].filter(Boolean).map(esc).join(', ')} · <a href="${u}">${u}</a></span></div>`};
const projH=p=>`<div class="item"><strong>${esc(p.title)}</strong><p>${esc(Lo(p.desc))}</p><p class="meta">${t('methods')}: ${p.methods.map(m=>`<span class="tag">${esc(m)}</span>`).join('')}</p><p class="meta"><a href="https://doi.org/${esc(p.doi)}">doi:${esc(p.doi)}</a></p></div>`;
function draw(){
 document.documentElement.lang=lang;const pg=$('#app').dataset.page,cur=location.pathname.split('/').pop()||'index.html';
 $('#hdr').innerHTML=`<div class="wrap"><a href="index.html" class="brand">${esc(S.name)}</a><nav aria-label="Main">${NAV.map(n=>`<a href="${n[1]}"${n[1]==cur?' aria-current="page"':''}>${t(n[0])}</a>`).join('')}</nav><span class="ctl">${[['es','ES'],['en','EN'],['ko','한국어']].map(l=>`<button data-l="${l[0]}" aria-pressed="${l[0]==lang}" lang="${l[0]}">${l[1]}</button>`).join('')}<button id="tg" aria-label="Theme">◐</button></span></div>`;
 document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{lang=b.dataset.l;sv('lang',lang);draw()});
 $('#tg').onclick=()=>{th=th=='dark'?'light':'dark';document.documentElement.dataset.theme=th;sv('th',th)};
 const links=Object.entries(S.social).filter(e=>e[1]),ct=`${S.email?`<a href="mailto:${esc(S.email)}">${esc(S.email)}</a> · `:''}${links.map(l=>`<a href="${esc(l[1])}">${l[0]}</a>`).join(' · ')}`;
 $('#ftr').innerHTML=`© ${new Date().getFullYear()} ${esc(S.name)}. ${t('copyright')}`;
 let h='';
 if(pg=='home'){
  h=`<section class="hero rv"><div><p class="meta">${esc(t('headline'))}</p><h1>${esc(S.name)}</h1>${I[lang].intro.map(x=>`<p>${esc(x)}</p>`).join('')}${hasCV?`<a class="btn p" href="${esc(S.cv_file)}" download>${t('cv')}</a>`:`<span class="btn dis" aria-disabled="true">${t('cvsoon')}</span>`}</div><div>${hasPh?`<img class="ph" src="${esc(S.photo)}" alt="${esc(t('photo'))}" width="300" height="375">`:`<div class="ph" role="img" aria-label="${esc(t('photo'))}">SR</div>`}</div></section>`
  +sec(t('education'),`<div class="tl">${[['ms',1],['ug',0]].map(e=>`<p><strong>${t(e[0]+'i')}</strong><br>${t(e[0]+'p')}<br><span class="meta">${t(e[0]+'l')}${e[1]?` · <span class="tag">${t('ongoing')}</span>`:` · ${t('gpa')}`} · ${t(e[0])}</span></p>`).join('')}</div>`)
  +sec(t('selres'),`<div class="grid">${PJ.map(p=>`<div class="item"><strong>${esc(p.title)}</strong><p class="meta">${esc(Lo(p.desc))}</p><p class="meta">${p.methods.map(m=>`<span class="tag">${esc(m)}</span>`).join('')}</p><a href="research.html">${t('more')} →</a></div>`).join('')}</div>`)
  +sec(t('contact'),`<p>${ct}</p>`);
 }else if(pg=='research'){
  h=`<section><h1>${t('research')}</h1></section>`+sec(t('rint'),`<div class="grid">${I[lang].ints.map(i=>`<div class="item"><strong>${esc(i[0])}</strong><br><span class="meta">${esc(i[1])}</span></div>`).join('')}</div>`)
  +sec(t('cm'),I[lang].meths.map(m=>`<div class="item"><strong>${esc(m[0])}</strong><p>${esc(m[1])}</p></div>`).join(''))+sec(t('rproj'),PJ.map(projH).join(''));
 }else if(pg=='pubs'){
  const sel=PB.filter(p=>p.selected),yrs=[...new Set(PB.map(p=>p.year))].sort().reverse();
  const f=PB.filter(p=>(!yr||p.year==yr)&&JSON.stringify(p).toLowerCase().includes(q.toLowerCase()));
  h=`<section><h1>${t('publications')}</h1></section>`+sec(t('selpubs'),sel.length?sel.map(pubH).join(''):`<p class="meta">${t('selnote')}</p>`)
  +`<section class="rv"><div class="filters"><input id="q" type="search" value="${esc(q)}" placeholder="${esc(t('search'))}" aria-label="${esc(t('search'))}"><select id="y" aria-label="Year"><option value="">${t('all')}</option>${yrs.map(y=>`<option${y==yr?' selected':''}>${y}</option>`).join('')}</select></div>${f.map(pubH).join('')}</section>`;
 }else if(pg=='tut'){
  h=`<section><h1>${t('tutorials')}</h1>${TU.length?TU.map(x=>`<div class="item"><strong>${esc(Lo(x.title))}</strong><br><span class="meta">${esc(x.category||'')} ${esc(x.date||'')} ${x.minutes?x.minutes+' min':''}</span><p>${esc(Lo(x.desc))}</p></div>`).join(''):`<p>${t('soon')}</p>`}</section>`;
 }else h=`<section><h1>${t('nf')}</h1><p><a href="index.html">${t('home')}</a></p></section>`;
 $('#app').innerHTML=h;
 if(pg=='pubs'){const qi=$('#q');qi.oninput=()=>{q=qi.value;const p=qi.selectionStart;draw();$('#q').focus();$('#q').setSelectionRange(p,p)};$('#y').onchange=e=>{yr=e.target.value;draw()}}
 const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))));document.querySelectorAll('.rv').forEach(e=>io.observe(e));
}
(async()=>{try{[I,S,PB,PJ,TU]=await Promise.all(['i18n','site','publications','projects','tutorials'].map(n=>get(`data/${n}.json`)));
 PB.sort((a,b)=>b.date.localeCompare(a.date));[hasCV,hasPh]=await Promise.all([ok(S.cv_file),ok(S.photo)]);draw()}
 catch(e){$('#app').innerHTML='<p>Could not load data. Serve over http (GitHub Pages or <code>python -m http.server</code>).</p>'}})();
