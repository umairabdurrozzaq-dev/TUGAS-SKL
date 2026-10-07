console.log ("=== app-rewind-part2-rombel1.js ===");
// Ambil formulir pencarian berdasarkan id yang ada di index.html.
const $searchform = document.getElementById('search-form');
// Ambil kotak input pencarian berdasarkan id.
const $searchinput = document.getElementById('search-input');
// Ambil elemen berdasarkan class; getElementById hanya menerima nilai id.
const $heroTag = document.querySelector('.eyebrow');
// Ambil judul utama berdasarkan nama tag HTML.
const $heroTitle = document.querySelector('h1');
//console.log($searchform);
//console.log($searchinput);
//console.log($heroTag);
//console.log($heroTitle);
// mengganti konten text element DOM
//$heroTag.textContent = 'RECIPE FINDER APP';
//$heroTitle.textContent = 'Find your favorite recipe all over theworld'; 
// Ubah tampilan teks penanda dan judul di bagian hero.
$heroTag.style.color = '#000';
$heroTag.style.backgroundColor = '#fff';
$heroTitle.style.color = 'gold';
// Tangani pengiriman formulir tanpa memuat ulang halaman.
$searchform.addEventListener('submit', function (e) {
  e.preventDefault(); // Mencegah halaman dimuat ulang saat formulir dikirim.
  console.log('>> formulir search dikirim');
  alert('Lakukan pencarian resep: ' + $searchinput.value);
});