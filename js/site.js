
const header=document.querySelector('.site-header');const toggle=document.querySelector('.nav-toggle');if(toggle){toggle.addEventListener('click',()=>header.classList.toggle('open'));}
function bindSearch(inputId,containerId,itemSel){const input=document.getElementById(inputId);const box=document.getElementById(containerId);if(!input||!box)return;input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();box.querySelectorAll(itemSel).forEach(el=>{const t=(el.dataset.search||el.innerText).toLowerCase();el.style.display=!q||t.includes(q)?'':'none';});});}
bindSearch('songSearch','songList','.song-item');bindSearch('posterSearch','posterGrid','.poster-card');
