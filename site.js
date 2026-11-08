
const header=document.querySelector('.site-header');const toggle=document.querySelector('.nav-toggle');if(toggle){toggle.addEventListener('click',()=>header.classList.toggle('open'));}
function bindSearch(inputId,containerId,itemSel){const input=document.getElementById(inputId);const box=document.getElementById(containerId);if(!input||!box)return;input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();box.querySelectorAll(itemSel).forEach(el=>{const t=(el.dataset.search||el.innerText).toLowerCase();el.style.display=!q||t.includes(q)?'':'none';});});}
bindSearch('songSearch','songList','.song-item');bindSearch('posterSearch','posterGrid','.poster-card');

// Build two identical lineup sets for a seamless, one-direction marquee.
document.querySelectorAll('.lineup-track').forEach(track=>{
  if(track.dataset.marqueeReady==='1') return;
  const originals=[...track.children].filter(el=>el.classList.contains('lineup-person-img'));
  if(!originals.length) return;
  const first=document.createElement('div');
  first.className='lineup-set';
  originals.forEach(img=>first.appendChild(img));
  const second=first.cloneNode(true);
  second.setAttribute('aria-hidden','true');
  second.querySelectorAll('img').forEach(img=>{img.alt='';img.removeAttribute('loading');});
  track.append(first,second);
  track.dataset.marqueeReady='1';
});
