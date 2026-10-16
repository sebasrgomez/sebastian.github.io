const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=u=>fetch(u).then(r=>r.json());
let th='light';try{th=localStorage.getItem('th')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){}
document.documentElement.dataset.theme=th;
const P=[['Home','index.html'],['Research','research.html'],['Publications','publications.html'],['Blog & Notes','blog.html'],['CV','cv.html'],['Contact','contact.html']];
const sec=(t,h)=>h?`<section class="rv"><h2>${t}</h2>${h}</section>`:'';
const doi=p=>p.doi?` <a href="https://doi.org/${esc(p.doi)}">doi:${esc(p.doi)}</a>`:'';
const pub=(p,me)=>`<div class="item"><strong>${esc(p.title)}</strong>${p.example?' <span class="tag">example</span>':''}<br>${p.authors.map(a=>a.includes(me)?`<b>${esc(a)}</b>`:esc(a)).join(', ')}<br><span class="meta">${esc(p.journal)}, ${esc(p.year)}${p.volume?', '+esc(p.volume):''}${p.pages?', '+esc(p.pages):''}${doi(p)}${p.url?` <a href="${esc(p.url)}">link</a>`:''}</span><br>${(p.topics||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}${p.abstract?`<details><summary class="meta">Abstract</summary>${esc(p.abstract)}</details>`:''}</div>`;
const proj=p=>`<div class="item"><strong>${esc(p.title)}</strong> <span class="tag">${esc(p.status)}</span><br><span class="meta">${esc(p.category)}</span><p>${esc(p.motivation)}</p><p class="meta">Question: ${esc(p.question)}<br>Methods: ${esc(p.methods)}</p>${p.findings?`<p>Findings: ${esc(p.findings)}</p>`:''}</div>`;
async function init(){
 const s=await get('data/site.json'),pg=$('#app').dataset.page,links=Object.entries(s.social).filter(e=>e[1]);
 $('#hdr').innerHTML=`<div class="wrap"><a href="index.html" style="text-decoration:none;color:inherit;font-family:system-ui">${esc(s.name)}</a><nav aria-label="Main">${P.map(p=>`<a href="${p[1]}"${location.pathname.endsWith(p[1])||(p[1]=='index.html'&&pg=='home')?' aria-current="page"':''}>${p[0]}</a>`).join('')}</nav><button id="tg" aria-label="Toggle dark mode">◐</button></div>`;
 $('#ftr').innerHTML=`© ${new Date().getFullYear()} ${esc(s.name)}${s.email?` · <a href="mailto:${esc(s.email)}">${esc(s.email)}</a>`:''}${links.map(l=>` · <a href="${esc(l[1])}">${l[0]}</a>`).join('')}`;
 $('#tg').onclick=()=>{th=th=='dark'?'light':'dark';document.documentElement.dataset.theme=th;try{localStorage.setItem('th',th)}catch(e){}};
 const [pubs,projs,posts]=await Promise.all(['publications','projects','posts'].map(n=>get(`data/${n}.json`)));
 let h='',me=s.name.split(' ')[1]||s.name;
 if(pg=='home'){
  h=`<section class="rv"><p class="meta">${esc(s.headline)}</p><h1>${esc(s.name)}</h1><p>${esc(s.intro)}</p><p class="meta">${esc(s.subtitle)}</p><a class="btn p" href="research.html">Research</a><a class="btn" href="publications.html">Publications</a>${s.cv_file?`<a class="btn" href="${esc(s.cv_file)}" download>Download CV</a>`:''}</section>`
  +sec('About',s.bio.map(b=>`<p>${esc(b)}</p>`).join(''))
  +sec('Research interests',`<div class="grid">${s.interests.map(i=>`<div class="item"><strong>${esc(i.t)}</strong><br><span class="meta">${esc(i.d)}</span></div>`).join('')}</div>`)
  +sec('Timeline',`<div class="tl">${s.timeline.map(t=>`<p><span class="meta">${esc(t.date)}</span><br><strong>${esc(t.title)}</strong>, ${esc(t.inst)}<br>${esc(t.desc)}</p>`).join('')}</div>`)
  +sec('Selected research',projs.filter(p=>p.featured).map(proj).join(''))
  +sec('Featured publications',pubs.filter(p=>p.featured).map(p=>pub(p,me)).join(''));
 }else if(pg=='research'){
  const cats=[...new Set(projs.map(p=>p.category))];
  h=`<section><h1>Research</h1></section>`+cats.map(c=>sec(esc(c),projs.filter(p=>p.category==c).map(proj).join(''))).join('');
 }else if(pg=='pubs'){
  const u=k=>[...new Set(pubs.flatMap(p=>[].concat(p[k])))].sort(),opt=a=>a.map(x=>`<option>${esc(x)}</option>`).join('');
  $('#app').innerHTML=`<section><h1>Publications</h1><p class="meta">${pubs.length} entries, ${pubs.filter(p=>p.authors[0]&&p.authors[0].includes(me)).length} with you as first author (counted from this dataset, example entries included).</p><div class="filters"><input id="q" type="search" placeholder="Search title, author, keyword" aria-label="Search"><select id="y" aria-label="Year"><option value="">All years</option>${opt(u('year'))}</select><select id="t" aria-label="Type"><option value="">All types</option>${opt(u('type'))}</select><select id="k" aria-label="Topic"><option value="">All topics</option>${opt(u('topics'))}</select></div><div id="l"></div></section>`;
  const r=()=>{const q=$('#q').value.toLowerCase();$('#l').innerHTML=pubs.filter(p=>(!$('#y').value||p.year==$('#y').value)&&(!$('#t').value||p.type==$('#t').value)&&(!$('#k').value||p.topics.includes($('#k').value))&&JSON.stringify([p.title,p.authors,p.topics]).toLowerCase().includes(q)).map(p=>pub(p,me)).join('')||'<p class="meta">No matches.</p>'};
  ['q','y','t','k'].forEach(i=>$('#'+i).oninput=r);r();return;
 }else if(pg=='blog'){
  $('#app').innerHTML=`<section><h1>Blog &amp; Notes</h1><input id="q" type="search" placeholder="Search posts" aria-label="Search posts"><div id="l"></div></section>`;
  const r=()=>{const q=$('#q').value.toLowerCase();$('#l').innerHTML=posts.filter(p=>JSON.stringify(p).toLowerCase().includes(q)).map(p=>`<div class="item"><strong>${esc(p.title)}</strong><br><span class="meta">${esc(p.date)} · ${esc(p.category)} · ${p.minutes} min</span><p>${esc(p.excerpt)}</p><details><summary class="meta">Read</summary>${esc(p.body)}</details></div>`).join('')};$('#q').oninput=r;r();return;
 }else if(pg=='cv'){
  const tg=a=>a.map(x=>`<span class="tag">${esc(x)}</span>`).join('');
  h=`<section><h1>${esc(s.name)}</h1><p>${esc(s.affiliation)}</p><button class="np" onclick="print()">Print / save as PDF</button>${s.cv_file?` <a class="np" href="${esc(s.cv_file)}" download>Download CV</a>`:''}</section>`
  +sec('Profile',`<p>${esc(s.intro)}</p>`)+sec('Education &amp; experience',s.timeline.map(t=>`<p><span class="meta">${esc(t.date)}</span><br><strong>${esc(t.title)}</strong>, ${esc(t.inst)}</p>`).join(''))
  +sec('Publications',pubs.map(p=>pub(p,me)).join(''))+sec('Research interests',tg(s.interests.map(i=>i.t)))
  +sec('Technical skills',tg(s.skills))+sec('Computational tools',tg(s.tools))+sec('Languages',tg(s.languages))+sec('Awards',s.awards.map(x=>`<p>${esc(x)}</p>`).join(''));
 }else if(pg=='contact'){
  h=`<section><h1>Contact</h1><p>Open to research collaboration and professional inquiries.</p><p>${esc(s.affiliation)}</p>${s.email?`<a class="btn p" href="mailto:${esc(s.email)}">Email me</a>`:'<p class="meta">Add your email in data/site.json.</p>'}<p>${links.map(l=>`<a href="${esc(l[1])}">${l[0]}</a>`).join(' · ')}</p></section>`;
 }else h='<section><h1>Page not found</h1><p><a href="index.html">Back to Home</a></p></section>';
 $('#app').innerHTML=h;
 const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))));
 document.querySelectorAll('.rv').forEach(e=>io.observe(e));
}
init().catch(e=>{$('#app').innerHTML='<p>Could not load data files. Serve the site over http (GitHub Pages or <code>python -m http.server</code>).</p>'});
