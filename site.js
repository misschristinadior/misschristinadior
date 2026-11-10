const header=document.querySelector('.site-header');
const toggle=document.querySelector('.nav-toggle');
if(toggle){toggle.addEventListener('click',()=>header.classList.toggle('open'));}

function bindSearch(inputId,containerId,itemSel){
  const input=document.getElementById(inputId);
  const box=document.getElementById(containerId);
  if(!input||!box)return;
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    box.querySelectorAll(itemSel).forEach(el=>{
      const t=(el.dataset.search||el.innerText).toLowerCase();
      el.style.display=!q||t.includes(q)?'':'none';
    });
  });
}
bindSearch('songSearch','songList','.song-item');
bindSearch('posterSearch','posterGrid','.poster-card');

// V1.03: rolling Christina lineup. Only the visible run plus ~5 upcoming looks
// receive image src values. Off-screen slots are recycled as they leave the stage.
const CHRISTINA_LINEUP_IMAGES = [
  "assets/img/lineup/christina-22.png",
  "assets/img/lineup/christina-new-01.png",
  "assets/img/lineup/christina-12.png",
  "assets/img/lineup/christina-new-02.png",
  "assets/img/lineup/christina-20.png",
  "assets/img/lineup/christina-new-03.png",
  "assets/img/lineup/christina-28.png",
  "assets/img/lineup/christina-new-04.png",
  "assets/img/lineup/christina-26.png",
  "assets/img/lineup/christina-new-05.png",
  "assets/img/lineup/christina-03.png",
  "assets/img/lineup/christina-new-06.png",
  "assets/img/lineup/christina-30.png",
  "assets/img/lineup/christina-new-07.png",
  "assets/img/lineup/christina-14.png",
  "assets/img/lineup/christina-new-08.png",
  "assets/img/lineup/christina-21.png",
  "assets/img/lineup/christina-new-09.png",
  "assets/img/lineup/christina-08.png",
  "assets/img/lineup/christina-new-10.png",
  "assets/img/lineup/christina-32.png",
  "assets/img/lineup/christina-new-11.png",
  "assets/img/lineup/christina-07.png",
  "assets/img/lineup/christina-new-12.png",
  "assets/img/lineup/christina-17.png",
  "assets/img/lineup/christina-new-13.png",
  "assets/img/lineup/christina-05.png",
  "assets/img/lineup/christina-new-14.png",
  "assets/img/lineup/christina-24.png",
  "assets/img/lineup/christina-new-15.png",
  "assets/img/lineup/christina-01.png",
  "assets/img/lineup/christina-new-16.png",
  "assets/img/lineup/christina-31.png",
  "assets/img/lineup/christina-new-17.png",
  "assets/img/lineup/christina-25.png",
  "assets/img/lineup/christina-new-18.png",
  "assets/img/lineup/christina-15.png",
  "assets/img/lineup/christina-new-19.png",
  "assets/img/lineup/christina-29.png",
  "assets/img/lineup/christina-new-20.png",
  "assets/img/lineup/christina-04.png",
  "assets/img/lineup/christina-new-21.png",
  "assets/img/lineup/christina-16.png",
  "assets/img/lineup/christina-new-22.png",
  "assets/img/lineup/christina-23.png",
  "assets/img/lineup/christina-new-23.png",
  "assets/img/lineup/christina-13.png",
  "assets/img/lineup/christina-new-24.png",
  "assets/img/lineup/christina-02.png",
  "assets/img/lineup/christina-new-25.png",
  "assets/img/lineup/christina-06.png",
  "assets/img/lineup/christina-new-26.png",
  "assets/img/lineup/christina-18.png",
  "assets/img/lineup/christina-new-27.png",
  "assets/img/lineup/christina-19.png",
  "assets/img/lineup/christina-new-28.png",
  "assets/img/lineup/christina-10.png",
  "assets/img/lineup/christina-new-29.png",
  "assets/img/lineup/christina-11.png",
  "assets/img/lineup/christina-new-30.png",
  "assets/img/lineup/christina-new-31.png",
  "assets/img/lineup/christina-new-32.png"
];

function initRollingLineup(track){
  if(!track || !CHRISTINA_LINEUP_IMAGES.length || track.dataset.rollingReady==='1') return;
  track.dataset.rollingReady='1';

  const stage=track.closest('.stage-curtain') || track.parentElement;
  const AHEAD_ITEMS=5;
  const BUFFER_ITEMS=1;
  const SPEED_PX_PER_SECOND=27;
  let nextIndex=0;
  let offset=0;
  let slotWidth=100;
  let lastTime=null;

  const nextUrl=()=>{
    const url=CHRISTINA_LINEUP_IMAGES[nextIndex % CHRISTINA_LINEUP_IMAGES.length];
    nextIndex=(nextIndex+1)%CHRISTINA_LINEUP_IMAGES.length;
    return url;
  };

  function makeItem(url){
    const item=document.createElement('div');
    item.className='lineup-item';
    const img=document.createElement('img');
    img.className='lineup-person-img';
    img.alt='';
    img.decoding='async';
    img.fetchPriority='low';
    img.src=url;
    item.appendChild(img);
    return item;
  }

  function setItemSource(item,url){
    const img=item.querySelector('img');
    if(!img) return;
    img.fetchPriority='low';
    img.src=url;
  }

  function measureSlot(){
    const first=track.firstElementChild;
    if(!first) return 100;
    const style=getComputedStyle(track);
    const gap=parseFloat(style.columnGap || style.gap || '0')||0;
    return Math.max(1,first.getBoundingClientRect().width + gap);
  }

  function desiredPoolSize(){
    const width=stage.getBoundingClientRect().width || window.innerWidth;
    return Math.max(8,Math.ceil(width/Math.max(slotWidth,1))+AHEAD_ITEMS+BUFFER_ITEMS);
  }

  function growPool(){
    const wanted=desiredPoolSize();
    while(track.children.length<wanted){
      track.appendChild(makeItem(nextUrl()));
    }
  }

  track.appendChild(makeItem(nextUrl()));
  slotWidth=measureSlot();
  growPool();

  function recycleOne(){
    const firstItem=track.firstElementChild;
    if(!firstItem) return;
    track.appendChild(firstItem);
    setItemSource(firstItem,nextUrl());
  }

  function frame(now){
    if(lastTime===null) lastTime=now;
    const dt=Math.min((now-lastTime)/1000,0.06);
    lastTime=now;

    if(!document.hidden){
      offset+=SPEED_PX_PER_SECOND*dt;
      while(offset>=slotWidth){
        offset-=slotWidth;
        recycleOne();
      }
      track.style.transform=`translate3d(${-offset}px,0,0)`;
    }
    requestAnimationFrame(frame);
  }

  const onResize=()=>{
    slotWidth=measureSlot();
    growPool();
  };
  if('ResizeObserver' in window){
    new ResizeObserver(onResize).observe(stage);
  }else{
    window.addEventListener('resize',onResize,{passive:true});
  }
  document.addEventListener('visibilitychange',()=>{lastTime=null;},{passive:true});
  requestAnimationFrame(frame);
}

document.querySelectorAll('.lineup-track').forEach(initRollingLineup);


// Christina Dior V1.02 — History galleries and lightbox
(() => {
  const galleries = [...document.querySelectorAll('[data-history-gallery]')];
  if (!galleries.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'history-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'History image viewer');
  lightbox.innerHTML = `
    <button class="history-lightbox-close" type="button" aria-label="Close image">×</button>
    <button class="history-lightbox-prev" type="button" aria-label="Previous image">‹</button>
    <div class="history-lightbox-inner"><img alt=""><div class="history-lightbox-caption"></div></div>
    <button class="history-lightbox-next" type="button" aria-label="Next image">›</button>`;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.history-lightbox-caption');
  const closeBtn = lightbox.querySelector('.history-lightbox-close');
  const prevBtn = lightbox.querySelector('.history-lightbox-prev');
  const nextBtn = lightbox.querySelector('.history-lightbox-next');
  let activeGallery = null;
  let activeIndex = 0;

  const galleryItems = gallery => {
    const thumbs = [...gallery.querySelectorAll('.history-thumb')];
    if (thumbs.length) return thumbs.map(t => ({display:t.dataset.display, full:t.dataset.full, caption:t.dataset.caption || ''}));
    const feature = gallery.querySelector('[data-history-open]');
    const img = feature?.querySelector('img');
    return feature && img ? [{display:img.src, full:feature.dataset.full || img.dataset.full || img.src, caption:gallery.querySelector('figcaption')?.textContent || img.alt || ''}] : [];
  };

  const selectGalleryImage = (gallery, index) => {
    const items = galleryItems(gallery);
    if (!items.length) return;
    const item = items[Math.max(0, Math.min(index, items.length - 1))];
    const img = gallery.querySelector('.history-gallery-feature img');
    const featureBtn = gallery.querySelector('[data-history-open]');
    const caption = gallery.querySelector('.history-gallery-feature figcaption');
    if (img) { img.src = item.display; img.dataset.full = item.full; img.alt = item.caption; }
    if (featureBtn) featureBtn.dataset.full = item.full;
    if (caption) caption.textContent = item.caption;
    [...gallery.querySelectorAll('.history-thumb')].forEach((t,i) => t.classList.toggle('is-active', i === index));
  };

  const showLightbox = (gallery, index) => {
    const items = galleryItems(gallery);
    if (!items.length) return;
    activeGallery = gallery;
    activeIndex = (index + items.length) % items.length;
    const item = items[activeIndex];
    lbImg.src = item.full;
    lbImg.alt = item.caption;
    lbCaption.textContent = item.caption;
    const multiple = items.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('history-lightbox-open');
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('history-lightbox-open');
    lbImg.removeAttribute('src');
  };

  galleries.forEach(gallery => {
    const thumbs = [...gallery.querySelectorAll('.history-thumb')];
    thumbs.forEach((thumb,index) => thumb.addEventListener('click', () => selectGalleryImage(gallery,index)));
    const feature = gallery.querySelector('[data-history-open]');
    feature?.addEventListener('click', () => {
      const selected = Math.max(0, thumbs.findIndex(t => t.classList.contains('is-active')));
      showLightbox(gallery, selected);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  prevBtn.addEventListener('click', () => showLightbox(activeGallery, activeIndex - 1));
  nextBtn.addEventListener('click', () => showLightbox(activeGallery, activeIndex + 1));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && !prevBtn.hidden) showLightbox(activeGallery, activeIndex - 1);
    if (e.key === 'ArrowRight' && !nextBtn.hidden) showLightbox(activeGallery, activeIndex + 1);
  });
})();
