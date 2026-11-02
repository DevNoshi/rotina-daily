const $=s=>document.querySelector(s),K='rotina.v2';
const CATS={saude:['Saúde','#7ee0a8'],trabalho:['Trabalho','#6fb1ff'],estudo:['Estudo','#8b9cff'],pessoal:['Pessoal','#f59ac2']};
const ST={pendente:'Pendente',concluida:'Concluída',incompleta:'Incompleta'};
const IC={pendente:'○',concluida:'✓',incompleta:'✕'};
const NEXT={pendente:'concluida',concluida:'incompleta',incompleta:'pendente'};
const DN=['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],DS=['seg','ter','qua','qui','sex','sáb','dom'];
const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const today=()=>iso(new Date()),uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wd=k=>(new Date(k+'T12:00:00').getDay()+6)%7;
const addDays=(k,n)=>{const d=new Date(k+'T12:00:00');d.setDate(d.getDate()+n);return iso(d)};
const week=k=>{const m=addDays(k,-wd(k));return[...Array(7)].map((_,i)=>addDays(m,i))};
const fmt=(k,o)=>new Date(k+'T12:00:00').toLocaleDateString('pt-BR',o);
const cap=s=>s.replace(/^./,m=>m.toUpperCase());
let S={items:[],log:{}},cur=today(),filter='all',q='',view='day',compact=false,editing=null,tt;
try{const r=localStorage.getItem(K);if(r)S=JSON.parse(r)}catch(e){}
try{
  if(!S.items.length&&!localStorage.getItem(K+'.seed')){
    S.items=[['Beber 2 litros de água','08:00','',  'saude',[0,1,2,3,4,5,6]],['Treino','07:00','08:00','saude',[0,2,4]],['Estudar programação','20:00','21:30','estudo',[0,1,2,3,4]],['Revisão da semana','19:00','20:00','pessoal',[6]]].map(a=>({id:uid(),title:a[0],start:a[1],end:a[2],cat:a[3],days:a[4]}));
    localStorage.setItem(K+'.seed','1');
  }
}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const st=(i,k)=>(S.log[k]&&S.log[k][i.id])||'pendente';
const dayItems=k=>S.items.filter(i=>i.days.includes(wd(k))).sort((a,b)=>a.start.localeCompare(b.start));
const pct=k=>{const l=dayItems(k);return l.length?l.filter(i=>st(i,k)==='concluida').length/l.length:0};
const setS=(id,k,v)=>{(S.log[k]=S.log[k]||{})[id]=v;save();render()};
function streak(){let n=0,k=today();const full=x=>{const l=dayItems(x);return l.length&&l.every(i=>st(i,x)==='concluida')};if(!full(k))k=addDays(k,-1);while(full(k)){n++;k=addDays(k,-1)}return n}
function tick(){
  const n=new Date(),h=n.getHours();
  $('#hello').textContent=h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';
  $('#clock').textContent=n.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}
function rowHTML(i,now,t){
  const s=st(i,cur),late=cur===t&&s==='pendente'&&(i.end||i.start)<now,ct=CATS[i.cat]||CATS.pessoal;
  return `<div class="row s-${s}" data-id="${i.id}"><div class="info"><span class="t">${esc(i.title)}</span><div class="meta"><span class="${late?'late':''}">${i.start}${i.end?' – '+i.end:''}${late?' · atrasada':''}</span><span><i class="dot" style="background:${ct[1]}"></i>${ct[0]}</span><span>${i.days.length===7?'Todos os dias':i.days.map(d=>DS[d]).join(', ')}</span></div></div>
  <div class="seg">${Object.keys(ST).map(v=>`<button class="${s===v?'a '+v:''}" data-a="set" data-v="${v}" aria-pressed="${s===v}">${IC[v]} ${ST[v]}</button>`).join('')}</div>
  <div class="acts"><button class="ic" data-a="edit" aria-label="Editar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button><button class="ic" data-a="del" aria-label="Excluir"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button></div></div>`;
}
function render(){
  const t=today(),all=dayItems(cur),c={concluida:0,pendente:0,incompleta:0},w=week(cur),wk=view==='week';
  all.forEach(i=>c[st(i,cur)]++);
  const n=all.length,p=n?c.concluida/n:0;
  $('#ring').style.strokeDashoffset=326.7*(1-p);
  $('#dial').classList.toggle('full',n>0&&p===1);
  $('#pct').textContent=Math.round(p*100)+'%';
  $('#c1').textContent=c.concluida;$('#c2').textContent=c.pendente;$('#c3').textContent=c.incompleta;
  $('#b1').style.flex=c.concluida;$('#b2').style.flex=c.pendente;$('#b3').style.flex=c.incompleta;
  $('#streak').textContent=streak();
  $('#date').textContent=cap(fmt(t,{weekday:'long',day:'numeric',month:'long'}));
  $('#tip').textContent=!n?'Nenhuma rotina neste dia. Adicione uma para começar.':p===1?'Dia completo. Ótimo trabalho!':c.pendente?`Faltam ${c.pendente} ${c.pendente>1?'rotinas':'rotina'} para fechar o dia.`:'Tudo marcado. Revise o que ficou incompleto.';
  $('#week').innerHTML=w.map((k,i)=>`<button class="day ${k===cur?'on':''} ${k===t?'td':''}" data-d="${k}" aria-label="${DN[i]}"><small>${DS[i]}</small><b>${+k.slice(8)}</b><i style="--p:${pct(k)}"></i></button>`).join('');
  $('#title').textContent=wk?`Semana de ${fmt(w[0],{day:'numeric',month:'short'})} a ${fmt(w[6],{day:'numeric',month:'short'})}`:cur===t?'Hoje':cur===addDays(t,1)?'Amanhã':cur===addDays(t,-1)?'Ontem':cap(fmt(cur,{weekday:'long',day:'numeric',month:'long'}));
  $('#goto').style.visibility=(wk?w.includes(t):cur===t)?'hidden':'visible';
  document.querySelectorAll('.vt button').forEach(b=>b.classList.toggle('a',b.dataset.v===view));
  $('#tools').style.display=$('#list').style.display=wk?'none':'';
  $('#wk').style.display=wk?'grid':'none';
  $('#compact').textContent=compact?'Mostrar 24 horas':'Ocultar horas vazias';
  if(wk){
    $('#wk').innerHTML=w.map((k,i)=>`<div class="wc"><button class="wh ${k===t?'td':''}" data-d="${k}"><small>${DN[i]}</small><b>${+k.slice(8)}</b><i style="--p:${pct(k)}"></i></button>${dayItems(k).map(x=>{const s=st(x,k);return `<button class="ch ${s}" data-id="${x.id}" data-d="${k}" title="${ST[s]}. Clique para mudar o status."><small>${x.start}${x.end?' – '+x.end:''}</small>${esc(x.title)}</button>`}).join('')||'<span class="none">Dia livre</span>'}</div>`).join('');
    return;
  }
  $('#tabs').innerHTML=[['all','Todas',n],['pendente','Pendentes',c.pendente],['concluida','Concluídas',c.concluida],['incompleta','Incompletas',c.incompleta]].map(a=>`<button class="tab ${filter===a[0]?'on':''}" data-f="${a[0]}">${a[1]} ${a[2]}</button>`).join('');
  const now=new Date().toTimeString().slice(0,5),vis=all.filter(i=>(filter==='all'||st(i,cur)===filter)&&i.title.toLowerCase().includes(q));
  let h='';
  for(let k=0;k<24;k++){
    const hh=String(k).padStart(2,'0'),it=vis.filter(i=>i.start.slice(0,2)===hh);
    if((compact||filter!=='all'||q)&&!it.length)continue;
    h+=`<div class="hr ${cur===t&&hh===now.slice(0,2)?'now':''}"><div class="hl"><span>${hh}:00</span><button class="ic add-h" data-a="addh" data-h="${hh}" aria-label="Adicionar rotina às ${hh}:00">+</button></div><div class="hb">${it.map(i=>rowHTML(i,now,t)).join('')}</div></div>`;
  }
  $('#list').innerHTML=h||`<div class="empty"><b>Nada por aqui</b>Mude o filtro ou a busca, ou crie uma rotina.</div>`;
}
function toast(m,fn){$('#tmsg').textContent=m;$('#undo').style.display=fn?'':'none';$('#undo').onclick=()=>{fn&&fn();$('#toast').classList.remove('on')};$('#toast').classList.add('on');clearTimeout(tt);tt=setTimeout(()=>$('#toast').classList.remove('on'),5000)}
function setDays(a){document.querySelectorAll('#days input').forEach(c=>c.checked=a.includes(+c.value))}
function openDlg(it,h){
  editing=it?it.id:null;$('#dt').textContent=it?'Editar rotina':'Nova rotina';$('#err').textContent='';
  $('#f-t').value=it?it.title:'';$('#f-c').value=it?it.cat:'pessoal';
  $('#f-s').value=it?it.start:h?h+':00':'09:00';
  $('#f-e').value=it?it.end:h?(+h===23?'23:59':String(+h+1).padStart(2,'0')+':00'):'';
  setDays(it?it.days:[wd(cur)]);$('#dlg').showModal();$('#f-t').focus();
}
function commit(){
  const title=$('#f-t').value.trim(),start=$('#f-s').value,end=$('#f-e').value,days=[...document.querySelectorAll('#days input:checked')].map(c=>+c.value),err=m=>{$('#err').textContent=m};
  if(!title)return err('Dê um nome para a rotina.');
  if(!start)return err('Informe o horário de início.');
  if(end&&end<=start)return err('O término precisa ser depois do início.');
  if(!days.length)return err('Escolha ao menos um dia da semana.');
  const v={title,start,end,cat:$('#f-c').value,days};
  if(editing)Object.assign(S.items.find(i=>i.id===editing),v);else S.items.push({id:uid(),...v});
  save();$('#dlg').close();render();toast(editing?'Rotina atualizada':'Rotina criada');
}
$('#f-c').innerHTML=Object.entries(CATS).map(a=>`<option value="${a[0]}">${a[1][0]}</option>`).join('');
$('#days').innerHTML=DS.map((d,i)=>`<label><input type="checkbox" value="${i}"><span>${d}</span></label>`).join('');
document.querySelector('.pre').onclick=e=>{const p=e.target.dataset.p;if(p)setDays(p==='all'?[0,1,2,3,4,5,6]:p==='wk'?[0,1,2,3,4]:[5,6])};
$('#list').onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.a==='addh')return openDlg(null,b.dataset.h);
  const id=b.closest('.row').dataset.id,it=S.items.find(i=>i.id===id);
  if(b.dataset.a==='set')setS(id,cur,b.dataset.v);
  if(b.dataset.a==='edit')openDlg(it);
  if(b.dataset.a==='del'){const pos=S.items.indexOf(it);S.items.splice(pos,1);save();render();toast('Rotina excluída',()=>{S.items.splice(pos,0,it);save();render()})}
};
$('#wk').onclick=e=>{
  const h=e.target.closest('.wh'),c=e.target.closest('.ch');
  if(h){cur=h.dataset.d;view='day';render()}
  if(c)setS(c.dataset.id,c.dataset.d,NEXT[st(S.items.find(i=>i.id===c.dataset.id),c.dataset.d)]);
};
$('#week').onclick=e=>{const b=e.target.closest('.day');if(b){cur=b.dataset.d;render()}};
$('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(b){filter=b.dataset.f;render()}};
document.querySelector('.vt').onclick=e=>{const b=e.target.closest('button');if(b){view=b.dataset.v;render()}};
$('#q').oninput=e=>{q=e.target.value.toLowerCase();render()};
const go=n=>{cur=addDays(cur,n*(view==='week'?7:1));render()};
$('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);
$('#goto').onclick=()=>{cur=today();render()};
$('#compact').onclick=()=>{compact=!compact;render()};
$('#new').onclick=()=>openDlg();$('#cancel').onclick=()=>$('#dlg').close();$('#save').onclick=commit;
$('#f-t').onkeydown=e=>{if(e.key==='Enter')commit()};
document.onkeydown=e=>{
  if(e.target.closest('input,select')||$('#dlg').open)return;
  const k=e.key.toLowerCase();
  if(k==='n'){e.preventDefault();openDlg()}
  if(k==='/'){e.preventDefault();$('#q').focus()}
  if(k==='w'){view=view==='day'?'week':'day';render()}
  if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1);
};
tick();render();setInterval(()=>{tick();render()},30000);
