"use strict"; // Mengaktifkan mode ketat JavaScript untuk mencegah bug/error tersembunyi

// --- KONSTANTA & KONFIGURASI ---
// DummyJSON mengembalikan 30 resep per halaman; gunakan limit=0 agar ambil semua resep sekaligus
const API_URL = "https://dummyjson.com/recipes?limit=0";
const FAVORITES_KEY = "recipe-finder-favorites"; // Key untuk menyimpan data favorit di LocalStorage

// --- SELEKSI ELEMEN HTML (DOM) ---
// Menyimpan semua elemen HTML yang dibutuhkan ke dalam satu objek agar rapi dan mudah diakses
const elements = {
  brand: document.querySelector(".brand"),
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#search-input"),
  cuisineFilter: document.querySelector("#cuisine-filter"),
  difficultyFilter: document.querySelector("#difficulty-filter"),
  favoriteButton: document.querySelector("#favorite-button"),
  favoriteCount: document.querySelector("#favorite-count"),
  sectionTitle: document.querySelector("#section-title"),
  recipeCount: document.querySelector("#recipe-count"),
  resetButton: document.querySelector("#reset-filter-button"),
  retryButton: document.querySelector("#retry-button"),
  loadingState: document.querySelector("#loading-state"),
  errorState: document.querySelector("#error-state"),
  emptyState: document.querySelector("#empty-state"),
  recipeGrid: document.querySelector("#recipe-grid"),
  dialog: document.querySelector("#recipe-dialog"),
  dialogContent: document.querySelector("#dialog-content"),
  closeDialog: document.querySelector("#close-dialog")
};

// --- STATE APLIKASI (Penyimpan Data Sementara) ---
let recipes = []; // Menampung semua data resep dari API
let favorites = loadFavorites(); // Menampung ID resep favorit dari LocalStorage
let showingFavorites = false; // Flag untuk tandai apakah lagi tampilkan resep favorit aja atau enggak

// --- FUNGSI MANAJEMEN FAVORIT (LOCALSTORAGE) ---
// Membaca data favorit yang tersimpan di browser
function loadFavorites() {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(savedFavorites) ? savedFavorites : [];
  } catch (error) {
    console.warn("Favorite tidak dapat dibaca dari LocalStorage:", error);
    return [];
  }
}

// Menyimpan data favorit saat ini ke LocalStorage
function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Favorite tidak dapat disimpan:", error);
  }
  updateFavoriteCount();
}

// Memperbarui angka statistik jumlah favorit pada tombol/UI
function updateFavoriteCount() {
  elements.favoriteCount.textContent = String(favorites.length);
  elements.favoriteButton.setAttribute("aria-pressed", String(showingFavorites));
}

// --- FUNGSI UI & TAMPILAN KONDISIONAL ---
// Mengatur status tampilan (loading, error, atau grid resep)
function setLoading(isLoading) {
  elements.loadingState.hidden = !isLoading;
  elements.errorState.hidden = true;
  elements.recipeGrid.hidden = isLoading;
  if (isLoading) elements.emptyState.hidden = true;
}

// Mengisi opsi dropdown filter jenis masakan (Cuisine) secara dinamis dari data resep
function populateCuisineFilter() {
  // Ambil jenis cuisine yang unik (tanpa duplikat) dan urutkan sesuai abjad
  const cuisines = [...new Set(recipes.map((recipe) => recipe.cuisine).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  elements.cuisineFilter.replaceChildren(new Option("All Cuisines", ""));
  cuisines.forEach((cuisine) => {
    elements.cuisineFilter.add(new Option(cuisine, cuisine));
  });
}

// --- FUNGSI FETCH DATA (AMBIL DATA DARI API) ---
async function fetchRecipes() {
  setLoading(true);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data.recipes)) throw new Error("Recipe data is unavailable");

    recipes = data.recipes;
    populateCuisineFilter();
    elements.errorState.hidden = true;
    renderRecipes();
  } catch (error) {
    console.error("Gagal mengambil resep:", error);
    elements.loadingState.hidden = true;
    elements.recipeGrid.hidden = true;
    elements.emptyState.hidden = true;
    elements.errorState.hidden = false;
    elements.recipeCount.textContent = "Recipes unavailable";
  }
}

// --- FUNGSI LOGIKA FILTER & PENCARIAN ---
// Menyaring daftar resep berdasarkan pencarian kata kunci, jenis masakan, tingkat kesulitan, atau status favorit
function getVisibleRecipes() {
  const searchTerm = elements.searchInput.value.trim().toLocaleLowerCase();
  const selectedCuisine = elements.cuisineFilter.value;
  const selectedDifficulty = elements.difficultyFilter.value;
  
  // Tentukan apakah mengambil seluruh resep atau hanya resep favorit
  const availableRecipes = showingFavorites
    ? recipes.filter((recipe) => favorites.includes(recipe.id))
    : recipes;

  return availableRecipes.filter((recipe) => {
    const matchesSearch = !searchTerm
      || recipe.name.toLocaleLowerCase().includes(searchTerm)
      || recipe.cuisine.toLocaleLowerCase().includes(searchTerm);
    const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesCuisine && matchesDifficulty;
  });
}

// --- FUNGSI PEMBUATAN ELEMEN CARD RESEP ---
// Membuat struktur elemen HTML untuk tiap kartu resep
function createRecipeCard(recipe) {
  const isFavorite = favorites.includes(recipe.id);
  const card = document.createElement("article");
  card.className = "recipe-card";

  // Gambar resep
  const image = document.createElement("img");
  image.className = "recipe-image";
  image.src = recipe.image;
  image.alt = recipe.name;
  image.loading = "lazy"; // Lazy loading agar web lebih cepat di-load

  const body = document.createElement("div");
  body.className = "recipe-body";

  // Badge jenis masakan
  const cuisine = document.createElement("span");
  cuisine.className = "recipe-cuisine";
  cuisine.textContent = recipe.cuisine || "Various";

  // Judul resep
  const title = document.createElement("h3");
  title.className = "recipe-title";
  title.textContent = recipe.name;

  // Metadata (Rating, Durasi, Tingkat Kesulitan)
  const meta = document.createElement("div");
  meta.className = "recipe-meta";
  [
    `⭐ ${recipe.rating ?? "N/A"}`,
    `⏱️ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`,
    `📊 ${recipe.difficulty || "N/A"}`
  ].forEach((text) => {
    const item = document.createElement("span");
    item.textContent = text;
    meta.append(item);
  });

  // Tombol Aksi (Detail & Favorit)
  const actions = document.createElement("div");
  actions.className = "recipe-actions";

  // Tombol Lihat Detail
  const detailButton = document.createElement("button");
  detailButton.className = "detail-button";
  detailButton.type = "button";
  detailButton.textContent = "View recipe";
  detailButton.addEventListener("click", () => showRecipeDetails(recipe));

  // Tombol Love / Favorit
  const favoriteButton = document.createElement("button");
  favoriteButton.className = "like-button";
  favoriteButton.type = "button";
  favoriteButton.textContent = isFavorite ? "❤️" : "🤍";
  favoriteButton.setAttribute("aria-label", isFavorite ? "Remove from favorites" : "Add to favorites");
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.addEventListener("click", () => toggleFavorite(recipe.id));

  actions.append(detailButton, favoriteButton);
  body.append(cuisine, title, meta, actions);
  card.append(image, body);
  return card;
}

// --- FUNGSI RENDER KE LAYAR ---
// Menampilkan kartu resep yang lolos filter ke layar
function renderRecipes() {
  const visibleRecipes = getVisibleRecipes();
  
  // Render kartu resep atau tampilkan state kosong jika tidak ada hasil
  elements.recipeGrid.replaceChildren(...visibleRecipes.map(createRecipeCard));
  elements.recipeGrid.hidden = visibleRecipes.length === 0;
  elements.emptyState.hidden = visibleRecipes.length !== 0;
  elements.loadingState.hidden = true;
  elements.errorState.hidden = true;
  
  // Update info teks di UI
  elements.recipeCount.textContent = `${visibleRecipes.length} ${visibleRecipes.length === 1 ? "recipe" : "recipes"}`;
  elements.sectionTitle.textContent = showingFavorites ? "Your Favorite Recipes" : "Explore Recipes";
  
  // Sembunyikan/tampilkan tombol reset berdasarkan ada tidaknya filter aktif
  elements.resetButton.hidden = !elements.searchInput.value
    && !elements.cuisineFilter.value
    && !elements.difficultyFilter.value;
}

// --- FUNGSI TOGGLE FAVORIT ---
// Menambah atau menghapus ID resep dari daftar favorit
function toggleFavorite(recipeId) {
  if (favorites.includes(recipeId)) {
    favorites = favorites.filter((id) => id !== recipeId);
  } else {
    favorites.push(recipeId);
  }
  saveFavorites();
  renderRecipes();

  // Jika modal dialog resep sedang terbuka, perbarui tampilannya juga
  const openRecipe = recipes.find((recipe) => recipe.id === recipeId);
  if (openRecipe && elements.dialog.open) showRecipeDetails(openRecipe);
}

// --- FUNGSI MODAL DIALOG DETAIL RESEP ---
// Menampilkan pop-up modal berisi rincian bahan dan instruksi memasak
function showRecipeDetails(recipe) {
  const body = document.createElement("div");
  body.className = "dialog-body";

  const image = document.createElement("img");
  image.className = "dialog-image";
  image.src = recipe.image;
  image.alt = recipe.name;

  const cuisine = document.createElement("span");
  cuisine.className = "recipe-cuisine";
  cuisine.textContent = recipe.cuisine || "Various";

  const title = document.createElement("h2");
  title.textContent = recipe.name;

  // Rincian meta tambahan
  const meta = document.createElement("div");
  meta.className = "dialog-meta";
  [
    `⭐ ${recipe.rating ?? "N/A"} (${recipe.reviewCount ?? 0} reviews)`,
    `⏱️ Prep ${recipe.prepTimeMinutes} min · Cook ${recipe.cookTimeMinutes} min`,
    `🍽️ ${recipe.servings ?? "?"} servings`,
    `📊 ${recipe.difficulty || "N/A"}`,
    `🏷️ ${(recipe.tags || []).join(", ") || "No tags"}`
  ].forEach((text) => {
    const item = document.createElement("span");
    item.textContent = text;
    meta.append(item);
  });

  // Tampilkan daftar Bahan-bahan (Ingredients)
  const ingredientsHeading = document.createElement("h3");
  ingredientsHeading.textContent = "Ingredients";
  const ingredients = document.createElement("ul");
  ingredients.className = "ingredients";
  (recipe.ingredients || []).forEach((ingredient) => {
    const item = document.createElement("li");
    item.textContent = ingredient;
    ingredients.append(item);
  });

  // Tampilkan Langkah-langkah Memasak (Instructions)
  const instructionsHeading = document.createElement("h3");
  instructionsHeading.textContent = "Instructions";
  const instructions = document.createElement("div");
  instructions.className = "instructions";
  (recipe.instructions || []).forEach((step, index) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = `${index + 1}. ${step}`;
    instructions.append(paragraph);
  });

  body.append(cuisine, title, meta, ingredientsHeading, ingredients, instructionsHeading, instructions);
  elements.dialogContent.replaceChildren(image, body);
  
  // Buka modal jika belum terbuka
  if (!elements.dialog.open) elements.dialog.showModal();
}

// --- EVENT LISTENERS (EVENT HANDLING) ---

// Prevent form submission/reload dan render resep
elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderRecipes();
});

// Event pencarian & filter (render ulang tiap input/opsi berubah)
elements.searchInput.addEventListener("input", renderRecipes);
elements.cuisineFilter.addEventListener("change", renderRecipes);
elements.difficultyFilter.addEventListener("change", renderRecipes);

// Klik logo/brand untuk reset seluruh filter dan kembali ke tampilan awal
elements.brand.addEventListener("click", (event) => {
  event.preventDefault();
  showingFavorites = false;
  elements.searchInput.value = "";
  elements.cuisineFilter.value = "";
  elements.difficultyFilter.value = "";
  updateFavoriteCount();
  renderRecipes();
});

// Klik tombol navigasi favorit untuk switch antara semua resep vs favorit
elements.favoriteButton.addEventListener("click", () => {
  showingFavorites = !showingFavorites;
  updateFavoriteCount();
  renderRecipes();
});

// Klik tombol reset filter
elements.resetButton.addEventListener("click", () => {
  elements.searchInput.value = "";
  elements.cuisineFilter.value = "";
  elements.difficultyFilter.value = "";
  renderRecipes();
});

// Coba ambil data lagi jika gagal/error
elements.retryButton.addEventListener("click", fetchRecipes);

// Tutup dialog modal saat tombol close diklik
elements.closeDialog.addEventListener("click", () => elements.dialog.close());

// Tutup dialog modal saat mengklik area di luar kotak modal (backdrop)
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});

// Tutup dialog modal saat menekan tombol Escape di keyboard
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.dialog.open) elements.dialog.close();
});

// --- INISIALISASI PERTAMA KALI ---
updateFavoriteCount(); // Set angka counter favorit di awal
fetchRecipes(); // Ambil data resep dari server saat halaman pertama kali dimuat