
const products = [
  {
    id: 1,
    name: "مونسترا",
    latin: "Monstera deliciosa",
    price: 890000,
    category: "tropical",
    tag: "پرفروش",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=85",
    description: "برگ‌های بزرگ و شکاف‌دار؛ انتخابی چشمگیر برای گوشه‌های روشن خانه.",
    light: "نور غیرمستقیم و روشن",
    water: "پس از خشک شدن سطح خاک",
    care: "متوسط"
  },
  {
    id: 2,
    name: "سانسوریا",
    latin: "Dracaena trifasciata",
    price: 490000,
    category: "easy",
    tag: "مناسب مبتدی‌ها",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae2b5e?auto=format&fit=crop&w=800&q=85",
    description: "گیاهی مقاوم با برگ‌های ایستاده؛ مناسب خانه و فضای کار.",
    light: "نور متوسط تا روشن",
    water: "پس از خشک شدن کامل خاک",
    care: "آسان"
  },
  {
    id: 3,
    name: "زامیفولیا",
    latin: "Zamioculcas zamiifolia",
    price: 650000,
    category: "easy",
    tag: "کم‌دردسر",
    image: "https://images.unsplash.com/photo-1632207691143-643e2b4a9f45?auto=format&fit=crop&w=800&q=85",
    description: "برگ‌های براق و ظاهر مرتب؛ گزینه‌ای مناسب برای افراد پرمشغله.",
    light: "نور غیرمستقیم",
    water: "پس از خشک شدن خاک",
    care: "آسان"
  },
  {
    id: 4,
    name: "فیکوس الاستیکا",
    latin: "Ficus elastica",
    price: 790000,
    category: "decor",
    tag: "انتخاب طراحان",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=85",
    description: "برگ‌های چرمی و براق؛ برای دکوراسیون‌های مدرن و مینیمال.",
    light: "نور زیاد و غیرمستقیم",
    water: "وقتی چند سانتی‌متر بالای خاک خشک شد",
    care: "متوسط"
  },
  {
    id: 5,
    name: "پتوس",
    latin: "Epipremnum aureum",
    price: 390000,
    category: "decor",
    tag: "شروع سبز",
    image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=85",
    description: "گیاهی رونده با برگ‌های زیبا؛ مناسب قفسه، میز و گلدان آویز.",
    light: "نور غیرمستقیم",
    water: "با خشک شدن سطح خاک",
    care: "آسان"
  }
];

const toman = new Intl.NumberFormat("fa-IR");

function formatPrice(price) {
  return `${toman.format(price)} تومان`;
}

function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}، ${product.latin}"
          loading="lazy"
        >
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <div class="product-topline">
          <div>
            <h3>${product.name}</h3>
            <p class="product-latin">${product.latin}</p>
          </div>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>

        <p class="product-description">${product.description}</p>

        <div class="care-details">
          <div>☀ <span>نور:</span> ${product.light}</div>
          <div>💧 <span>آبیاری:</span> ${product.water}</div>
          <div>♧ <span>نگهداری:</span> ${product.care}</div>
        </div>

        <button
          class="btn btn-primary add-to-cart"
          data-add="${product.id}"
          type="button"
        >
          افزودن به سبد خرید +
        </button>
      </div>
    </article>
  `;
}

// سبد خرید نمایشی با ذخیره‌سازی در مرورگر
let cart = [];

try {
  const savedCart = JSON.parse(localStorage.getItem("verde-cart") || "[]");

  if (Array.isArray(savedCart)) {
    cart = savedCart.filter(item =>
      item &&
      Number.isInteger(item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      products.some(product => product.id === item.id)
    );
  }
} catch {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem("verde-cart", JSON.stringify(cart));
  } catch {
    // در صورت غیرفعال بودن ذخیره‌سازی، سبد در همین صفحه باقی می‌ماند.
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll("#cart-count").forEach(element => {
    element.textContent = toman.format(count);
  });
}

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  showToast(`${product.name} به سبد خرید اضافه شد.`);
}

function renderProducts(targetId, items) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = items.map(productCard).join("");
}

// محصولات منتخب صفحه اصلی
renderProducts("featured-products", products.slice(0, 3));

// نمایش تمام محصولات در صفحه فروشگاه
renderProducts("all-products", products);
updateCartCount();

// فیلتر دسته‌بندی و جست‌وجو
const filterContainer = document.getElementById("product-filters");
const searchInput = document.getElementById("product-search");
const emptyState = document.getElementById("empty-state");

let activeCategory = "all";

function filterProducts() {
  const query = (searchInput?.value || "").trim().toLocaleLowerCase("fa");

  const filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;

    const searchableText =
      `${product.name} ${product.latin} ${product.description}`.toLocaleLowerCase("fa");

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  renderProducts("all-products", filtered);

  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
  }
}

if (filterContainer) {
  filterContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    activeCategory = button.dataset.filter;

    filterContainer.querySelectorAll(".filter-btn").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    filterProducts();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", filterProducts);
}

// باز کردن صفحه فروشگاه با دسته‌بندی انتخاب‌شده
const params = new URLSearchParams(window.location.search);
const requestedCategory = params.get("category");

if (
  filterContainer &&
  ["easy", "tropical", "decor"].includes(requestedCategory)
) {
  const button = filterContainer.querySelector(
    `[data-filter="${requestedCategory}"]`
  );

  if (button) button.click();
}

// مدیریت کلیک دکمه‌های خرید؛ حتی بعد از فیلتر محصولات
document.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

// منوی موبایل
document.querySelectorAll(".menu-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const nav = button.closest(".site-header")?.querySelector(".nav-links");
    if (!nav) return;

    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "بستن منو" : "باز کردن منو"
    );
  });
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    link.closest(".nav-links")?.classList.remove("open");
  });
});

// فرم نمایشی عضویت در خبرنامه
const newsletterForm = document.getElementById("newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();
    showToast("فرم آزمایشی است؛ برای ثبت واقعی، بک‌اند لازم است.");
    newsletterForm.reset();
  });
}
