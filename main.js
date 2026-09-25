document.querySelectorAll('.copy').forEach(function(btn){
  btn.addEventListener('click',function(){
    var el=document.getElementById(btn.dataset.copy); var t=el.textContent.trim();
    var done=function(){btn.textContent='Copiado';setTimeout(function(){btn.textContent='Copiar'},1600)};
    try{navigator.clipboard.writeText(t).then(done,function(){sel(el)});}catch(e){sel(el)}
  });
});
function sel(el){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);}

/* filtro de casos */
(function(){
  var btns=document.querySelectorAll('.filters button'), cases=document.querySelectorAll('.case');
  var status=document.getElementById('casos-status');
  var label={todos:'todas las prácticas',ds:'Analítica avanzada',bi:'Inteligencia de negocios',td:'Transformación digital',pp:'Política pública'};
  function match(c,f){return f==='todos'||c.dataset.cat.split(' ').indexOf(f)>-1;}
  document.querySelectorAll('.cnt').forEach(function(s){
    var f=s.dataset.c,n=0; cases.forEach(function(c){if(match(c,f))n++;}); s.textContent=n;
  });
  function apply(f,fromClick){
    var first=true,n=0;
    cases.forEach(function(c){
      var show=match(c,f);
      c.hidden=!show; c.classList.toggle('first',show&&first);
      if(show){first=false;n++;c.classList.remove('in');void c.offsetWidth;c.classList.add('in');}
    });
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===f?'true':'false')});
    if(status) status.textContent = f==='todos' ? '' : 'Mostrando '+n+' de '+cases.length+' proyectos · '+label[f];
    if(fromClick){var t=document.querySelector('.filters');var r=t.getBoundingClientRect();if(r.top<0)t.scrollIntoView({behavior:'smooth',block:'start'});}
  }
  btns.forEach(function(b){b.addEventListener('click',function(){apply(b.dataset.f,true)})});
  apply('todos',false);
})();

/* curvas de nivel del cauce */
(function(){
  var c=document.getElementById('contours'); if(!c) return;
  var ctx=c.getContext('2d'); var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W,H;
  function size(){var dpr=Math.min(devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function draw(t){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<16;i++){
      var base=H*(0.18+i*0.052);
      ctx.beginPath();
      for(var x=0;x<=W;x+=8){
        var y=base+Math.sin(x/170+i*0.55+t)*14+Math.sin(x/61-i*0.3+t*1.7)*5+Math.cos(x/340+i)*22;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle= i%5===0 ? 'rgba(124,240,197,.5)' : 'rgba(184,164,255,.16)';
      ctx.lineWidth= i%5===0 ? 1.4 : 1;
      ctx.stroke();
    }
  }
  size(); addEventListener('resize',function(){size();draw(0)});
  if(reduce){draw(0);return;}
  var t0=performance.now();
  (function loop(now){draw((now-t0)/9000);requestAnimationFrame(loop);})(t0);
})();
