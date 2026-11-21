'use strict';

const themeToggle = document.querySelector('#theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let selectedTheme = null;
try {selectedTheme=localStorage.getItem('lakeglamp-theme');} catch {}
function applyTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed',String(dark));
  themeToggle.setAttribute('aria-label',dark?'Включить светлую тему':'Включить тему хаки');
  themeToggle.title = dark?'Светлая тема':'Тема хаки';
  document.querySelector('meta[name="theme-color"]').content = dark?'#3f4634':'#f5f5f7';
}
applyTheme(document.documentElement.dataset.theme || 'light');
themeToggle.addEventListener('click',()=>{selectedTheme=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme(selectedTheme);try{localStorage.setItem('lakeglamp-theme',selectedTheme);}catch{}});
systemTheme.addEventListener('change',e=>{if(selectedTheme!=='light'&&selectedTheme!=='dark')applyTheme(e.matches?'dark':'light');});

const houses = {
  light: {name: 'Белый Бохо', description: 'Светлый двухуровневый домик с панорамным остеклением. Внизу — гостиная с диваном, кухня и санузел с душем. Под крышей — уютная спальня. На террасе — кресла для неспешного отдыха.', photos: [ ['light-living', 'Гостиная с панорамными окнами'], ['light-bedroom', 'Спальня под крышей'], ['light-kitchen', 'Кухня и обеденная зона'], ['light-bathroom', 'Душевая кабина и санузел'], ['terrace-light', 'Терраса Белого Бохо'] ]},
  wood: {name: 'Лофт', description: 'Двухуровневый домик с отделкой из натурального дерева. Гостиная с диваном, своя кухня и санузел с душем — на первом уровне, спальня — под скатами крыши. Большие окна и деревянная терраса добавляют ощущение простора.', photos: [ ['wood-living', 'Гостиная с деревянной отделкой'], ['wood-bedroom', 'Спальня на втором уровне'], ['wood-kitchen', 'Кухня и обеденная зона'], ['wood-bathroom', 'Душевая кабина и санузел'], ['terrace', 'Терраса домика Лофт'] ]}
};
Object.assign(houses, {"sauna":{"name":"Баня на дровах","description":"Парная с дровяной печью, душевая и комната отдыха. Стоимость и время посещения согласуем при бронировании.","photos":[["spa-sauna-1","Парная с дровяной печью"],["spa-sauna-2","Баня снаружи"],["spa-sauna-3","Душевая бани"],["spa-sauna-4","Комната отдыха"]]},"tub":{"name":"Банный чан","description":"Банный чан под открытым небом рядом с озером. Стоимость и время подготовки уточняйте перед приездом.","photos":[["spa-tub-1","Чан с видом на озеро"],["spa-tub-2","Банный чан крупным планом"],["spa-tub-3","Чан под открытым небом"]]}});
const gallery = [
  {image:'light-living', caption:'Светлая гостиная · Белый Бохо', category:'interior'},
  {image:'terrace', caption:'Утро на террасе · Лофт', category:'outside'},
  {image:'wood-bedroom', caption:'Спальня под крышей · Лофт', category:'interior'},
  {image:'wood-kitchen', caption:'Кухня и обеденная зона · Лофт', category:'interior'},
  {image:'house-light', caption:'Домик Белый Бохо', category:'outside'},
  {image:'light-bedroom', caption:'Спальня · Белый Бохо', category:'interior'},
  {image:'hot-tub', caption:'Банный чан рядом с домиком', category:'outside'},
  {image:'lake', caption:'Озеро рядом с LakeGlamp', category:'outside'},
  {image:'sauna-steam-room', caption:'Парная бани на дровах · LakeGlamp', category:'interior'},
  {image:'sauna-lounge', caption:'Комната отдыха в бане', category:'interior'},
  {image:'terrace-light', caption:'Отдых на террасе · Белый Бохо', category:'outside'}
];

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','Открыть меню');}
menuToggle.addEventListener('click', () => {const open = mobileNav.hidden; mobileNav.hidden = !open; menuToggle.setAttribute('aria-expanded',String(open)); menuToggle.setAttribute('aria-label',open ? 'Закрыть меню' : 'Открыть меню');});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});
window.matchMedia('(min-width: 951px)').addEventListener('change', e => {if(e.matches) closeMenu();});

let returnFocus = null;
function openDialog(dialog) {
  if(!document.activeElement.closest('dialog')) returnFocus = document.activeElement;
  document.querySelectorAll('dialog[open]').forEach(d => d.close());
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {if(e.target === dialog){const r=dialog.getBoundingClientRect(); if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) dialog.close();}});
  dialog.addEventListener('close', () => {if(!document.querySelector('dialog[open]')){document.body.classList.remove('modal-open'); if(returnFocus && returnFocus.isConnected) returnFocus.focus();}});
});

const maxDialog=document.querySelector('#max-dialog');
document.querySelectorAll('[data-max]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#copy-max-status').textContent='';openDialog(maxDialog);}));
document.querySelector('#copy-max').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-max-status');
  try {await navigator.clipboard.writeText('+79872948592');status.textContent='Номер скопирован. Добавьте его в контакты MAX.';}
  catch {status.textContent='Выделите и скопируйте номер: +79872948592';}
});

const bookingDialog = document.querySelector('#booking-dialog');
const arrival = document.querySelector('#arrival');
const departure = document.querySelector('#departure');
function localDate(date) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function nextDay(value) {const d = new Date(`${value}T12:00:00`);d.setDate(d.getDate()+1);return localDate(d);}
function updateDeparture() {departure.min = nextDay(arrival.value || localDate(new Date())); if(departure.value && departure.value <= arrival.value) departure.value = departure.min;}
arrival.min = localDate(new Date());
arrival.addEventListener('change',updateDeparture);
function openBooking(key) {
  if(key==='sauna'||key==='tub') document.querySelector('#booking-form [name="'+key+'"]').checked=true;
  closeMenu();
  document.querySelector('#booking-house').value = (key==='light'||key==='wood') ? houses[key].name : 'Любой домик';
  document.querySelector('#booking-error').textContent = '';
  arrival.min = localDate(new Date());
  updateDeparture();
  openDialog(bookingDialog);
}
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click',() => openBooking(button.dataset.book)));
document.querySelector('#booking-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  if(!form.reportValidity()) return;
  if(arrival.value < localDate(new Date()) || departure.value <= arrival.value){document.querySelector('#booking-error').textContent='Выберите будущие даты: выезд должен быть позже заезда.';return;}
  const data = new FormData(form);
  const format = value => new Date(`${value}T12:00:00`).toLocaleDateString('ru-RU');
  const nights = Math.round((new Date(`${departure.value}T12:00:00`) - new Date(`${arrival.value}T12:00:00`))/86400000);
  const message = `Здравствуйте! Хочу узнать свободные даты в LakeGlamp.\n\nДомик: ${data.get('house')}\nЗаезд: ${format(arrival.value)}\nВыезд: ${format(departure.value)}\nНочей: ${nights}\nГостей: ${data.get('guests')}\nБаня на дровах: ${data.has('sauna') ? 'да, интересует' : 'без бани'}\nБанный чан: ${data.has('tub') ? 'да, интересует' : 'без чана'}\n\nПодскажите, пожалуйста, стоимость и условия бронирования.`;
  const messengerUrl=data.get('messenger')==='whatsapp'?'https://wa.me/79930948592':'https://t.me/alinatur30';
  window.open(`${messengerUrl}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
});

const houseDialog = document.querySelector('#house-dialog');
let activeHouse = 'light';
let housePhotoIndex = 0;
function showHousePhoto(index) {
  const house = houses[activeHouse];
  housePhotoIndex = (index + house.photos.length) % house.photos.length;
  const [file,alt] = house.photos[housePhotoIndex];
  const image = document.querySelector('#house-detail-image');
  image.src = `assets/${file}.jpg`; image.alt = `${alt} — ${house.name}`;
  document.querySelector('#house-counter').textContent = `${housePhotoIndex+1} / ${house.photos.length}`;
  document.querySelectorAll('#house-thumbnails button').forEach((button,i) => {button.classList.toggle('active',i===housePhotoIndex); button.setAttribute('aria-pressed',String(i===housePhotoIndex));});
}
function openHouse(key) {
  activeHouse = key;
  const house = houses[key];
  document.querySelector('#house-dialog .eyebrow').textContent=(key==='sauna'||key==='tub')?'БАНЯ И ЧАН':'ВАШ ДОМ НА ПРИРОДЕ';
  document.querySelector('#house-book').textContent=(key==='sauna'||key==='tub')?'Уточнить стоимость и время ↗':'Узнать свободные даты ↗';
  document.querySelector('#house-detail-title').textContent = house.name;
  document.querySelector('#house-detail-description').textContent = house.description;
  const thumbnails = document.querySelector('#house-thumbnails');
  thumbnails.replaceChildren();
  house.photos.forEach(([file,alt],index) => {const button=document.createElement('button');button.setAttribute('aria-label',alt);const img=document.createElement('img');img.src=`assets/${file}.jpg`;img.alt='';button.append(img);button.addEventListener('click',()=>showHousePhoto(index));thumbnails.append(button);});
  showHousePhoto(0);openDialog(houseDialog);
}
document.querySelectorAll('[data-house]').forEach(button => button.addEventListener('click',() => openHouse(button.dataset.house)));
document.querySelector('#house-prev').addEventListener('click',()=>showHousePhoto(housePhotoIndex-1));
document.querySelector('#house-next').addEventListener('click',()=>showHousePhoto(housePhotoIndex+1));
document.querySelector('#house-book').addEventListener('click',()=>openBooking(activeHouse));

let visibleGallery = gallery;
let lightboxIndex = 0;
const lightbox = document.querySelector('#lightbox');
function showLightboxPhoto(index) {
  lightboxIndex = (index+visibleGallery.length)%visibleGallery.length;
  const item = visibleGallery[lightboxIndex];
  const img = document.querySelector('#lightbox-image');
  img.src=`assets/${item.image}.jpg`;img.alt=item.caption;
  document.querySelector('#lightbox-caption').textContent=`${item.caption} · ${lightboxIndex+1} / ${visibleGallery.length}`;
}
function renderGallery(filter='all') {
  visibleGallery = gallery.filter(item => filter==='all' || item.category===filter);
  const grid=document.querySelector('#gallery-grid');grid.replaceChildren();
  visibleGallery.forEach((item,index)=>{const button=document.createElement('button');button.className='gallery-item';button.setAttribute('aria-label',`Увеличить: ${item.caption}`);const img=document.createElement('img');img.src=`assets/${item.image}.jpg`;img.alt=item.caption;img.loading='lazy';img.width=1600;img.height=1067;button.append(img);button.addEventListener('click',()=>{showLightboxPhoto(index);openDialog(lightbox);});grid.append(button);});
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderGallery(button.dataset.filter);}));
document.querySelector('#lightbox-prev').addEventListener('click',()=>showLightboxPhoto(lightboxIndex-1));
document.querySelector('#lightbox-next').addEventListener('click',()=>showLightboxPhoto(lightboxIndex+1));
document.addEventListener('keydown', e=>{if(e.key!=='ArrowRight' && e.key!=='ArrowLeft') return;const delta=e.key==='ArrowRight'?1:-1;if(lightbox.open){e.preventDefault();showLightboxPhoto(lightboxIndex+delta);}else if(houseDialog.open){e.preventDefault();showHousePhoto(housePhotoIndex+delta);}});
renderGallery();
document.querySelector('#year').textContent = new Date().getFullYear();

// Seasonal decoration stays local to the offer and can be paused.
const holidayCard=document.querySelector('.holiday-card');
const holidayMotion=document.querySelector('.holiday-motion');
if(holidayCard&&holidayMotion){
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let holidayPaused=false;
  try{holidayPaused=localStorage.getItem('lakeglamp-holiday-paused')==='true';}catch{}
  function updateHolidayMotion(){
    const enabled=!holidayPaused&&!reducedMotion.matches;
    holidayCard.dataset.motion=enabled?'on':'off';
    holidayMotion.setAttribute('aria-pressed',String(enabled));
    holidayMotion.textContent=enabled?'Выключить снег и огоньки':'Включить снег и огоньки';
  }
  holidayMotion.addEventListener('click',()=>{holidayPaused=!holidayPaused;try{localStorage.setItem('lakeglamp-holiday-paused',String(holidayPaused));}catch{}updateHolidayMotion();});
  reducedMotion.addEventListener('change',updateHolidayMotion);
  updateHolidayMotion();
}
