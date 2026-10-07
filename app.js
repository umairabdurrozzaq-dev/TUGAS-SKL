console.log("Hello Bang!");
// camelCase = koyokPuntukUnta (v)
// snake_case = koyok_ular_memanjang
let firstName = "Jhon"; // let boleh diubah
let lastName = "Doe"; // diganti ke let agar bisa diubah di bawah

// beri bracket (kurung kurawal) di awal dan akhir
// untuk keperluan debug variabel beserta isinya
firstName = 1000;
console.log({ firstName, lastName });

// macam-macam tipe data
const age = 25; // number
const isAdult = true; // boolean
const height = 175; // number (float/double/decimal)
const typeDataAge = typeof age; // cek tipe data
console.log({ age, isAdult, height, typeDataAge });

// operator aritmatika
let totalStudents = 50 + 70;
console.log({ totalStudents });
totalStudents += 10; // nilai total sebelumnya di tambahkan dengan nilai 10
totalStudents *= 5; // nilai total sebelumnya di kalikan dengan nilai 5
console.log({ totalStudents });

// operator perbandingan true atau false
const isAgeAdult = age >= 18;
const equalAge = age == 20;
const notEqualAge = age != 20;
// === atau !== lebih strict sampai ke tipe data yg dicek
console.log({ isAgeAdult, equalAge, notEqualAge });

// operator logika
const statusBebasNarkoba = true;
const accaptedArmyStatus = isAdult && height >= 170 && statusBebasNarkoba;
if (accaptedArmyStatus) {
  console.log("Anda diterima di TNI AD");
} else {
  console.log("Anda tidak diterima di TNI AD");
}

const statusRanking = "A";
if (statusRanking === "A" || statusRanking === "B" || statusRanking === "C") {
  console.log("Anda lulus");
} else {
  console.log("Anda tidak lulus");
}

// dasar looping
// 3 bagian (awal, syarat, langkah)
console.log('-- ini baris awal mulai --');
for (let i = 1; i <= 5; i++) {
  console.log(`index ke-${i}`);
  console.log('>> ini baris terakhir...');
}

console.log('-- ini baris awal mulai mundur --');
for (let i = 5; i >= 1; i--) {
  console.log(`index mundur ke-${i}`);
  console.log(`>> ini baris mundur terakhir`);
}

const products = ['apple', 'banana', 'orange', 'peach', 'tomato'];
console.log(products[0]); // array index nya dari 0
console.log(products[1]);
console.log(products[2]);

const totalProducts = products.length; 
for (let i = 0; i < totalProducts; i++) {
  const productName = products[i];
  console.log(`product ke-${i} -> ${productName}`);
  console.log('>> ini baris loop produk...');
}

// array of object looping bertingkat
const recipes = [
  { name: 'Martabak', ingredients: ['eggs', 'flour', 'meat'] },
  { name: 'Sate Ayam', ingredients: ['chicken', 'paste bean', 'onion', 'chili'] },
  { name: 'Nasgor', ingredients: ['rice', 'egg', 'onion', 'garlic'] },
];
console.log('==== RESEP LOOPING ====');
for (let i = 0; i < recipes.length; i++) {
  const recipe = recipes[i];
  console.log(`recipe ke-${i} -> ${recipe.name}`);
  console.log('> detail bahan baku:');
  for (let j = 0; j < recipe.ingredients.length; j++) {
    console.log(`-- ${recipe.ingredients[j]}`);
  }
}

// penulisan function
function hitungLuas(panjang, lebar) {
  console.log(`-- panjang: ${panjang}, lebar: ${lebar} --`);
  return panjang * lebar;
}
const luasKotakMakan = hitungLuas(5, 3);
const luasMeja = hitungLuas(10, 30);
console.log({ luasKotakMakan, luasMeja });

// manipulasi string, number, etc (Cukup ubah nilainya, tanpa kata 'let')
firstName = "Smith";
lastName = "Johnson";

const fullNameFormal = `${firstName} ${lastName}`;
console.log(fullNameFormal);
console.log(fullNameFormal.toUpperCase());
console.log(fullNameFormal.toLowerCase());