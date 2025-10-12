(() => {
  /* ===== Setup =================================================== */
  const page = document.querySelector('[page-url="constellation"]');
  const section = document.createElement('section');
  section.id = 'constellationSection';
  page.appendChild(section);
  const field = document.createElement('div');
  field.id = 'starfield';
  section.appendChild(field);
  const canvas = document.createElement("canvas");
  canvas.id = 'drawCanvas';
  field.appendChild(canvas);

  const ctx     = canvas.getContext('2d');
  const DPR     = window.devicePixelRatio || 1;

  /* --- sprinkle stars ------------------------------------------- */
  const stars = [
    { x:18, y:50, href:'/about',    title:'Reconnaissances territoriales' },
    { x:26, y:62, href:'/projects', title:'Stratégies décoloniales' },
    { x:34, y:75, href:'/shop',     title:'Alliances et collaborations' },
    { x:42, y:63, href:'/contact',  title:'Appropriation et protocoles dans les arts autochtones' },
    { x:55, y:55, href:'/blog',     title:'Luttes antiracistes' },
    { x:66, y:57, href:'/blog',     title:'Relationnalité et souveraineté autochtone (safe space)' },
    { x:77, y:58, href:'/blog',     title:'Projets d’alliance (allo-autochtone)' },
    { x:77, y:32, href:'/blog',     title:'Arts autochtones' },
    { x:72, y:20, href:'/blog',     title:'Autres ressources' },
    { x:60, y:25, href:'/blog',     title:'Culture wendat' },
  ];
  stars.forEach(({x,y,href,title})=>{
    const a = Object.assign(document.createElement('a'), { href, className:'star' });
    a.dataset.title = title; 
    a.style.left = x + '%';
    a.style.top  = y + '%';
    field.appendChild(a);
  });

  /* --- size canvas ---------------------------------------------- */
  function resize(){
    const { width, height } = field.getBoundingClientRect();
    canvas.width  = width  * DPR;
    canvas.height = height * DPR;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.lineWidth   = 1.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.strokeStyle = 'rgba(160,153,102,1)';
  }
  resize();
  window.addEventListener('load', resize);
  window.addEventListener('resize', resize);

  /* --- helper ---------------------------------------------------- */
  const pos = e => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /* ===== Cursor Indicator ======================================= */
  const indicator = document.createElement('div');
  indicator.id = 'cursor-indicator';
  indicator.className = 'hidden';
  field.style.position = field.style.position || 'relative';
  field.appendChild(indicator);

  let promptMode = 'click'; // 'click' | 'dbl'
  const updatePrompt = () => {
    indicator.textContent = promptMode === 'click' ? 'Cliquez pour dessiner' : 'Double-cliquez pour effacer';
  };
  updatePrompt();

  canvas.addEventListener('pointerenter', e => {
    updatePrompt();
    indicator.classList.remove('hidden');
    const { x, y } = pos(e);
    indicator.style.left = `${x}px`;
    indicator.style.top  = `${y}px`;
  });

  canvas.addEventListener('pointerleave', () => {
    indicator.classList.add('hidden');
  });

  canvas.addEventListener('pointermove', e => {
    if (!indicator.classList.contains('hidden')) {
      const { x, y } = pos(e);
      indicator.style.left = `${x}px`;
      indicator.style.top  = `${y}px`;
    }
  });

  /* ===== Drawing logic ========================================== */
  let drawing = false;
  let prev = null;

  window.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    drawing = true;
    prev = pos(e);
    promptMode = 'dbl';
    updatePrompt();
  });

  const stop = () => { drawing = false; prev = null; };
  window.addEventListener('pointerup', stop);
  window.addEventListener('pointercancel', stop);

  window.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = pos(e);
    if (prev) {
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    prev = p;
  });

  field.addEventListener('dblclick', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prev = null;
    promptMode = 'click';
    updatePrompt();
  });
})();