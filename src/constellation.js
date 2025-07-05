(() => {
  /* ===== Setup =================================================== */
  const canvas  = document.getElementById('drawCanvas');
  const field   = document.getElementById('starfield');
  const ctx     = canvas.getContext('2d');
  const DPR     = window.devicePixelRatio || 1;

  /* --- sprinkle stars ------------------------------------------- */
  const stars = [
    { x:18, y:30, href:'/about',    title:'Reconnaissances territoriales' },
    { x:26, y:42, href:'/projects', title:'Strategies décoloniales' },
    { x:34, y:55, href:'/shop',     title:'Alliances et collaborations' },
    { x:42, y:43, href:'/contact',  title:'Appropriation et protocols dans les arts autochtones' },
    { x:55, y:35, href:'/blog',     title:'Luttes antiracistes' },
    { x:66, y:27, href:'/blog',     title:'Relationnalité et souveraineté autochtone(safe space)' },
    { x:77, y:18, href:'/blog',     title:'Projets d’alliance (allo-autochtone)' },
    { x:83, y:12, href:'/blog',     title:'Arts autochtones' },
    { x:72, y:10, href:'/blog',     title:'Autres ressources' },
    { x:60, y:15, href:'/blog',     title:'Culture wendat' },
  ];
  stars.forEach(({x,y,href,title})=>{
    const a = Object.assign(document.createElement('a'), {
      href, className:'star'
    });
    a.dataset.title = title; 
    a.style.left = x + '%';
    a.style.top  = y + '%';
    field.appendChild(a);
  });

  /* --- size canvas to the section ------------------------------- */
  function resize(){
    const { width, height } = field.getBoundingClientRect();
    canvas.width  = width  * DPR;
    canvas.height = height * DPR;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';

    ctx.resetTransform();
    ctx.scale(DPR, DPR);
    ctx.lineWidth   = 1.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.strokeStyle = 'rgba(160,153,102,1)';
  }
  resize();
  window.addEventListener('load', resize);
  window.addEventListener('resize', resize);

  /* --- helper: pointer pos inside the canvas, scroll-proof ------- */
  const pos = e => {
    const r = canvas.getBoundingClientRect();      // viewport box
    const offsetX = r.left + window.scrollX;       // doc-space
    const offsetY = r.top  + window.scrollY;
    return { x: e.pageX - offsetX, y: e.pageY - offsetY };
  };

  /* --- drawing state -------------------------------------------- */
  let drawing = false;
  let prev    = null;

  window.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;        // left button only
    drawing = true;
    prev    = pos(e);
  }, true);

  const stop = () => { drawing = false; prev = null; };
  window.addEventListener('pointerup',     stop, true);
  window.addEventListener('pointercancel', stop, true);
  window.addEventListener('pointerleave',  stop, true);

  window.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = pos(e);
    if (prev){
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x,   p.y);
      ctx.stroke();
    }
    prev = p;
  }, true);

  field.addEventListener('dblclick', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prev = null;
  });
})();