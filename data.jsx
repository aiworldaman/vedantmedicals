// data.jsx — Vedant Medicals sample catalogue (DEMO DATA ONLY)
// Prices in INR. Medicine names are realistic samples for prototype purposes.
// `stock` = units currently on hand (maintained from the Inventory admin page).

const CATEGORIES = [
  { id: "pain",    name: "Pain Relief",      icon: "pill",    tint: 22  },
  { id: "cold",    name: "Cold & Cough",     icon: "droplet", tint: 230 },
  { id: "vitamins",name: "Vitamins",         icon: "leaf",    tint: 150 },
  { id: "diabetes",name: "Diabetes Care",    icon: "drop",    tint: 285 },
  { id: "heart",   name: "Heart Care",       icon: "heart",   tint: 8   },
  { id: "digest",  name: "Stomach Care",     icon: "bottle",  tint: 50  },
  { id: "skin",    name: "Skin Care",        icon: "tube",    tint: 330 },
  { id: "baby",    name: "Baby & Mom",       icon: "baby",    tint: 195 },
  { id: "firstaid",name: "First Aid",        icon: "plus",    tint: 0   },
  { id: "wellness",name: "Personal Care",    icon: "spark",   tint: 175 },
  { id: "women",   name: "Women Care",       icon: "heart",   tint: 345 },
  { id: "ayurveda",name: "Ayurveda",         icon: "leaf",    tint: 128 },
];

// stock thresholds — also used by the Inventory page + product badges
const LOW_STOCK = 10; // qty below this (and above 0) shows "Low in stock"

// helper to keep product objects terse
function P(o){ return Object.assign({ rating: 4.4, reviews: 120, rx: false, qty: 0, stock: 50 }, o); }

const PRODUCTS = [
  P({ id: "p01", name: "Paracetamol 500mg", brand: "Vedant Pharma", cat: "pain", stock: 124,
      pack: "Strip of 15 tablets", salt: "Paracetamol (Acetaminophen) 500mg",
      mrp: 28, price: 22, rating: 4.6, reviews: 2140,
      use: "Relieves fever, headache and mild-to-moderate body pain." }),
  P({ id: "p02", name: "Ibuprofen 400mg", brand: "Reliva", cat: "pain", stock: 8,
      pack: "Strip of 10 tablets", salt: "Ibuprofen 400mg",
      mrp: 45, price: 38, rating: 4.5, reviews: 980,
      use: "Anti-inflammatory pain relief for muscle ache and cramps." }),
  P({ id: "p03", name: "Pain Relief Balm", brand: "Vedant Care", cat: "pain", stock: 46,
      pack: "Jar of 50g", salt: "Methyl salicylate, Menthol, Camphor",
      mrp: 95, price: 82, rating: 4.4, reviews: 540,
      use: "Fast topical relief for joint and back pain." }),

  P({ id: "p04", name: "Cetirizine 10mg", brand: "Allerfree", cat: "cold", stock: 0,
      pack: "Strip of 10 tablets", salt: "Cetirizine Hydrochloride 10mg",
      mrp: 32, price: 25, rating: 4.5, reviews: 1320,
      use: "Anti-allergic for runny nose, sneezing and itching." }),
  P({ id: "p05", name: "Cough Syrup (Sugar-free)", brand: "Vedant Care", cat: "cold", stock: 33,
      pack: "Bottle of 100ml", salt: "Dextromethorphan, Guaifenesin",
      mrp: 110, price: 96, rating: 4.3, reviews: 410,
      use: "Soothes dry cough and clears chest congestion." }),
  P({ id: "p06", name: "Steam Inhalation Capsules", brand: "BreatheEasy", cat: "cold", stock: 6,
      pack: "Pack of 12", salt: "Eucalyptus, Menthol",
      mrp: 60, price: 54, rating: 4.2, reviews: 220,
      use: "Eases blocked nose with herbal steam vapours." }),

  P({ id: "p07", name: "Vitamin C 1000mg", brand: "NutriVed", cat: "vitamins", stock: 210,
      pack: "Bottle of 60 tablets", salt: "Ascorbic Acid 1000mg",
      mrp: 320, price: 249, rating: 4.7, reviews: 3100,
      use: "Daily immunity support and antioxidant protection." }),
  P({ id: "p08", name: "Multivitamin Daily", brand: "NutriVed", cat: "vitamins", stock: 78,
      pack: "Bottle of 30 tablets", salt: "Multivitamins & Minerals",
      mrp: 480, price: 399, rating: 4.6, reviews: 1750,
      use: "Fills everyday nutritional gaps; energy & wellness." }),
  P({ id: "p09", name: "Vitamin D3 60K", brand: "BoneWell", cat: "vitamins", stock: 4,
      pack: "Pack of 4 sachets", salt: "Cholecalciferol 60000 IU",
      mrp: 210, price: 178, rating: 4.5, reviews: 860,
      use: "Weekly dose to support bone health and immunity." }),

  P({ id: "p10", name: "Metformin 500mg", brand: "GlucoVed", cat: "diabetes", rx: true, stock: 62,
      pack: "Strip of 20 tablets", salt: "Metformin Hydrochloride 500mg",
      mrp: 64, price: 52, rating: 4.6, reviews: 1290,
      use: "Controls blood sugar in type-2 diabetes." }),
  P({ id: "p11", name: "Blood Glucose Test Strips", brand: "AccuVed", cat: "diabetes", stock: 0,
      pack: "Box of 50 strips", salt: "Glucose oxidase strips",
      mrp: 850, price: 699, rating: 4.4, reviews: 470,
      use: "For use with AccuVed glucometers; 50 readings." }),

  P({ id: "p12", name: "Atorvastatin 10mg", brand: "Cardiova", cat: "heart", rx: true, stock: 24,
      pack: "Strip of 15 tablets", salt: "Atorvastatin 10mg",
      mrp: 120, price: 98, rating: 4.5, reviews: 720,
      use: "Lowers cholesterol; supports heart health." }),
  P({ id: "p13", name: "Aspirin 75mg", brand: "Cardiova", cat: "heart", stock: 140,
      pack: "Strip of 14 tablets", salt: "Aspirin 75mg",
      mrp: 22, price: 18, rating: 4.4, reviews: 610,
      use: "Low-dose blood thinner for cardiac care." }),

  P({ id: "p14", name: "Antacid Gel (Mint)", brand: "DigestVed", cat: "digest", stock: 9,
      pack: "Bottle of 170ml", salt: "Magnesium & Aluminium hydroxide",
      mrp: 140, price: 119, rating: 4.5, reviews: 980,
      use: "Quick relief from acidity, heartburn and gas." }),
  P({ id: "p15", name: "ORS Lemon Sachets", brand: "Vedant Care", cat: "digest", stock: 305,
      pack: "Pack of 10 sachets", salt: "Oral Rehydration Salts",
      mrp: 90, price: 75, rating: 4.7, reviews: 1500,
      use: "Restores hydration and electrolytes after dehydration." }),

  P({ id: "p16", name: "Moisturising Lotion SPF30", brand: "DermaVed", cat: "skin", stock: 52,
      pack: "Tube of 100ml", salt: "Niacinamide, SPF30",
      mrp: 380, price: 329, rating: 4.6, reviews: 2400,
      use: "Daily sun protection and deep hydration." }),
  P({ id: "p17", name: "Antiseptic Cream", brand: "DermaVed", cat: "skin", stock: 3,
      pack: "Tube of 30g", salt: "Povidone-Iodine",
      mrp: 75, price: 64, rating: 4.4, reviews: 350,
      use: "Prevents infection on minor cuts and wounds." }),

  P({ id: "p18", name: "Baby Diapers (M, 56)", brand: "TinyVed", cat: "baby", stock: 82,
      pack: "Pack of 56", salt: "Ultra-absorbent core",
      mrp: 899, price: 749, rating: 4.7, reviews: 5200,
      use: "12-hour dryness for 7–12kg babies." }),
  P({ id: "p19", name: "Baby Gentle Wash", brand: "TinyVed", cat: "baby", stock: 0,
      pack: "Bottle of 200ml", salt: "Tear-free mild cleanser",
      mrp: 260, price: 219, rating: 4.6, reviews: 1100,
      use: "No-tears body & hair wash for newborns." }),

  P({ id: "p20", name: "Adhesive Bandages (Box 100)", brand: "MediVed", cat: "firstaid", stock: 67,
      pack: "Box of 100", salt: "Sterile fabric strips",
      mrp: 150, price: 125, rating: 4.5, reviews: 640,
      use: "Everyday protection for small cuts and blisters." }),
  P({ id: "p21", name: "Digital Thermometer", brand: "MediVed", cat: "firstaid", stock: 7,
      pack: "1 unit", salt: "Flexible-tip, 10s read",
      mrp: 320, price: 249, rating: 4.4, reviews: 880,
      use: "Fast, accurate fever readings for all ages." }),

  P({ id: "p22", name: "Hand Sanitizer 500ml", brand: "Vedant Care", cat: "wellness", stock: 190,
      pack: "Pump bottle 500ml", salt: "70% Ethyl Alcohol",
      mrp: 199, price: 149, rating: 4.6, reviews: 1900,
      use: "Kills 99.9% germs; moisturising formula." }),
  P({ id: "p23", name: "N95 Face Mask (Pack 5)", brand: "MediVed", cat: "wellness", stock: 5,
      pack: "Pack of 5", salt: "5-layer filtration",
      mrp: 250, price: 199, rating: 4.5, reviews: 760,
      use: "Reusable protection against dust and droplets." }),
  P({ id: "p24", name: "Azithromycin 500mg", brand: "Reliva", cat: "cold", rx: true, stock: 0,
      pack: "Strip of 5 tablets", salt: "Azithromycin 500mg",
      mrp: 130, price: 112, rating: 4.5, reviews: 540,
      use: "Antibiotic for bacterial respiratory infections." }),

  P({ id: "p25", name: "Iron + Folic Acid Tablets", brand: "NutriVed", cat: "women", stock: 64,
      pack: "Strip of 30 tablets", salt: "Ferrous Ascorbate + Folic Acid",
      mrp: 120, price: 99, rating: 4.5, reviews: 430,
      use: "Supports haemoglobin and helps prevent iron-deficiency anaemia in women." }),
  P({ id: "p26", name: "Ultra Sanitary Pads (XL, 30)", brand: "FemVed", cat: "women", stock: 128,
      pack: "Pack of 30 pads", salt: "Soft cotton cover, gel core",
      mrp: 399, price: 329, rating: 4.6, reviews: 1820,
      use: "Overnight protection with a dry-cover top sheet for sensitive skin." }),
  P({ id: "p27", name: "Calcium + Vitamin D3 (Women)", brand: "BoneWell", cat: "women", stock: 7,
      pack: "Bottle of 60 tablets", salt: "Calcium Carbonate + Cholecalciferol",
      mrp: 340, price: 289, rating: 4.5, reviews: 610,
      use: "Daily bone-strength support for women, especially after 30." }),

  P({ id: "p28", name: "Ashwagandha 500mg", brand: "VedHerbals", cat: "ayurveda", stock: 88,
      pack: "Bottle of 60 capsules", salt: "Withania somnifera root extract",
      mrp: 399, price: 329, rating: 4.6, reviews: 2100,
      use: "Traditional adaptogen for stress, energy and restful sleep." }),
  P({ id: "p29", name: "Chyawanprash 500g", brand: "VedHerbals", cat: "ayurveda", stock: 5,
      pack: "Jar of 500g", salt: "Amla, 40+ herbs & honey",
      mrp: 285, price: 235, rating: 4.5, reviews: 1450,
      use: "Daily ayurvedic immunity tonic rich in vitamin C." }),
  P({ id: "p30", name: "Tulsi Drops", brand: "VedHerbals", cat: "ayurveda", stock: 42,
      pack: "Bottle of 30ml", salt: "Concentrated holy basil (Tulsi) extract",
      mrp: 180, price: 149, rating: 4.4, reviews: 520,
      use: "A few drops daily for respiratory wellness and immunity." }),
];

const OFFERS = [
  { id: "o1", title: "Flat 25% off", sub: "on your first medicine order", code: "VEDANT25", tint: 162 },
  { id: "o2", title: "Free delivery", sub: "on orders above ₹499", code: "FREESHIP", tint: 22 },
  { id: "o3", title: "Upload & save", sub: "extra 15% on prescriptions", code: "RXCARE", tint: 285 },
];

// stock status helper — single source of truth for badges + inventory page
function stockInfo(n){
  n = Math.max(0, Number(n) || 0);
  if (n <= 0)        return { level: "out", label: "Out of stock", short: "Out" };
  if (n < LOW_STOCK) return { level: "low", label: "Low in stock", short: "Low" };
  return { level: "in", label: "In stock", short: "In stock" };
}

// human-friendly departments for the Shop-by-category dropdown.
// each link points to a category id (`cat`) or a search term (`q`).
const DEPARTMENTS = [
  { id: "medicines", name: "Medicines", icon: "pill", cols: [
    { title: "By condition", links: [
      { label: "Pain Relief", cat: "pain" },
      { label: "Cold & Cough", cat: "cold" },
      { label: "Stomach Care", cat: "digest" },
      { label: "Diabetes Care", cat: "diabetes" },
      { label: "Heart Care", cat: "heart" },
    ]},
    { title: "Quick relief", links: [
      { label: "Fever & headache", q: "paracetamol" },
      { label: "Allergy & sneezing", q: "cetirizine" },
      { label: "Acidity & gas", q: "antacid" },
      { label: "Antibiotics · Rx", q: "azithromycin" },
    ]},
  ]},
  { id: "womencare", name: "Women Care", icon: "heart", cols: [
    { title: "Everyday wellness", links: [
      { label: "All women care", cat: "women" },
      { label: "Iron & blood health", q: "iron" },
      { label: "Calcium & bones", q: "calcium" },
    ]},
    { title: "Personal hygiene", links: [
      { label: "Sanitary pads", q: "sanitary" },
      { label: "Mom & pregnancy", q: "folic" },
    ]},
  ]},
  { id: "babycare", name: "Baby Care", icon: "baby", cols: [
    { title: "Daily essentials", links: [
      { label: "All baby & mom", cat: "baby" },
      { label: "Diapers", q: "diaper" },
      { label: "Baby bath & wash", q: "wash" },
    ]},
  ]},
  { id: "personalcare", name: "Personal Care", icon: "spark", cols: [
    { title: "Skin & body", links: [
      { label: "Skin Care", cat: "skin" },
      { label: "Sun protection", q: "spf" },
      { label: "Antiseptic care", q: "antiseptic" },
    ]},
    { title: "Hygiene & protection", links: [
      { label: "Hand sanitizer", q: "sanitizer" },
      { label: "Face masks", q: "mask" },
    ]},
  ]},
  { id: "ayurveda", name: "Ayurveda", icon: "leaf", cols: [
    { title: "Herbal & immunity", links: [
      { label: "All ayurvedic range", cat: "ayurveda" },
      { label: "Ashwagandha", q: "ashwagandha" },
      { label: "Chyawanprash", q: "chyawanprash" },
      { label: "Tulsi & herbal drops", q: "tulsi" },
    ]},
  ]},
  { id: "vitamins", name: "Vitamins & Wellness", icon: "drop", cols: [
    { title: "Supplements", links: [
      { label: "Vitamins", cat: "vitamins" },
      { label: "Multivitamins", q: "multivitamin" },
      { label: "Vitamin C & immunity", q: "vitamin c" },
    ]},
    { title: "Devices & first aid", links: [
      { label: "First Aid", cat: "firstaid" },
      { label: "Thermometers", q: "thermometer" },
      { label: "Daily personal care", cat: "wellness" },
    ]},
  ]},
];

// ===================== ACCOUNTS / DAYBOOK =====================
// Deterministic seeded ledger for the last ~9 weeks so period filters
// always have data and the numbers don't shuffle on every reload.
const GST_RATE = 0.05; // medicines mostly taxed at 5% in India

function mulberry32(a){
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function _isoNDaysAgo(n){
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - n);
  return d;
}
function _iso(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function buildLedger(){
  const txns = [];
  let idn = 4000;
  const round10 = (n) => Math.round(n/10)*10;
  const pick = (r, arr) => arr[Math.floor(r()*arr.length)];
  const mk = (d, kind, cat, party, amount, method, status) =>
    txns.push({ id: 'TXN' + (idn++), date: _iso(d), kind, cat, party, amount, method, status });

  for (let dAgo = 62; dAgo >= 0; dAgo--){
    const d = _isoNDaysAgo(dAgo);
    const r = mulberry32(7919 + dAgo*31 + d.getMonth()*7);
    const weekend = (d.getDay() === 0 || d.getDay() === 6) ? 1.22 : 1;

    // daily counter sales
    mk(d, 'in', 'Counter sales', 'Walk-in customers',
       round10((6000 + r()*7200) * weekend), pick(r, ['Cash','UPI','Card']), 'settled');

    // online orders most days
    if (r() > 0.22)
      mk(d, 'in', 'Online orders', 'App & web orders',
         round10(2200 + r()*5200), 'UPI', r() > 0.16 ? 'settled' : 'pending');

    // supplier restock every ~4 days
    if (dAgo % 4 === 1)
      mk(d, 'out', 'Stock purchase', pick(r, ['Sun Pharma Depot','Cipla Wholesale','MedPlus Distributors']),
         round10(9000 + r()*14000), 'Bank', r() > 0.3 ? 'settled' : 'pending');

    // occasional logistics
    if (r() > 0.62)
      mk(d, 'out', 'Delivery & logistics', 'Apollo Logistics',
         round10(300 + r()*900), 'UPI', 'settled');

    // monthly fixed costs
    if (d.getDate() === 1){
      mk(d, 'out', 'Shop rent', 'Premises landlord', 35000, 'Bank', 'settled');
      mk(d, 'out', 'Staff salaries', '3 pharmacists + helper', 78000, 'Bank', 'settled');
    }
    if (d.getDate() === 5)
      mk(d, 'out', 'Electricity & utilities', 'State electricity board',
         round10(4000 + r()*2600), 'UPI', 'settled');
  }
  return txns.reverse(); // most recent first
}

const LEDGER = buildLedger();

Object.assign(window, { CATEGORIES, PRODUCTS, OFFERS, DEPARTMENTS, LOW_STOCK, stockInfo, LEDGER, GST_RATE });
