const RINCON = 'https://carnitaselrincon.com/wp-content/uploads'
const R_FOOD = `${RINCON}/2021/10/Img01.png`
const R_HERO = `${RINCON}/2022/11/maina-1600.jpg`
const UNS = 'https://images.unsplash.com'

// 19 unique thumbnail images (one per location)
const VENDOR_IMGS = [
  R_FOOD,                                                                                    // 0  real El Rincón carnitas
  `${UNS}/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80`,                  // 1  meat platter
  `${UNS}/photo-1504544750208-dc0358e63f7f?w=400&auto=format&fit=crop&q=80`,               // 2  meat counter
  `${UNS}/photo-1529692236671-f1f6cf9683ba?w=400&auto=format&fit=crop&q=80`,               // 3  bbq grill
  `${UNS}/photo-1618449840665-9ed506d73a34?w=400&auto=format&fit=crop&q=80`,               // 4  tacos
  `${UNS}/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop&q=80`,               // 5  burrito spread
  `${UNS}/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80`,               // 6  quesadilla
  `${UNS}/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80`,               // 7  street food
  `${UNS}/photo-1527477396000-e27163b481c2?w=400&auto=format&fit=crop&q=80`,               // 8  roasted chicken
  `${UNS}/photo-1600891964092-4316c288032e?w=400&auto=format&fit=crop&q=80`,               // 9  grilled meat close-up
  `${UNS}/photo-1551504734-5da7e163b5a5?w=400&auto=format&fit=crop&q=80`,                  // 10 food market stall
  `${UNS}/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80`,               // 11 restaurant plating
  `${UNS}/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80`,                  // 12 professional kitchen
  `${UNS}/photo-1498654896293-37aacf113fd9?w=400&auto=format&fit=crop&q=80`,               // 13 street food night market
  `${UNS}/photo-1585325701956-60dd9c8553bc?w=400&auto=format&fit=crop&q=80`,               // 14 pork cuts
  `${UNS}/photo-1553163147-622ab57be1c7?w=400&auto=format&fit=crop&q=80`,                  // 15 taqueria counter
  `${UNS}/photo-1484980972926-edee96e0960d?w=400&auto=format&fit=crop&q=80`,               // 16 dining scene
  `${UNS}/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=80`,               // 17 open fire grill
  `${UNS}/photo-1604467715878-83e57e8bc129?w=400&auto=format&fit=crop&q=80`,               // 18 Mexican food spread
]

// 13 unique cover/hero images
const COVER_IMGS = [
  R_HERO,                                                                                    // 0  real El Rincón hero
  `${UNS}/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80`,                  // 1  kitchen wide
  `${UNS}/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80`,                  // 2  meat platter wide
  `${UNS}/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80`,               // 3  bbq grill wide
  `${UNS}/photo-1504544750208-dc0358e63f7f?w=800&auto=format&fit=crop&q=80`,               // 4  meat counter wide
  `${UNS}/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80`,               // 5  street food wide
  `${UNS}/photo-1600891964092-4316c288032e?w=800&auto=format&fit=crop&q=80`,               // 6  grilled meat wide
  `${UNS}/photo-1484980972926-edee96e0960d?w=800&auto=format&fit=crop&q=80`,               // 7  dining scene wide
  `${UNS}/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80`,               // 8  restaurant wide
  `${UNS}/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80`,               // 9  street night wide
  `${UNS}/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80`,               // 10 fire grill wide
  `${UNS}/photo-1585325701956-60dd9c8553bc?w=800&auto=format&fit=crop&q=80`,               // 11 pork cuts wide
  `${UNS}/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80`,               // 12 burrito spread wide
]

const vi = (i) => VENDOR_IMGS[i]
const ci = (i) => COVER_IMGS[i]

const SPECIALTIES = ['Party Trays', 'Carnitas', 'Tacos', 'Burritos', 'Quesadillas', 'Combos', 'Platillos']

export const MOCK_VENDORS = [
  // San Jose — 4 locations
  {
    id: 'loc-1', name: 'El Rincón — Alum Rock', slug: 'alum-rock',
    description: 'Our flagship San Jose location on Alum Rock Ave. Auténticas carnitas cooked fresh daily since 2004. Party trays for any size gathering, delivered to your door.',
    rating: 4.9, reviewCount: 287, image: vi(0), coverImage: ci(0),  // Alum Rock — real El Rincón photos
    city: 'San Jose', address: '3141 Alum Rock Ave, San Jose, CA 95127',
    phone: '(408) 791-6422', hours: 'Everyday 10AM–6PM',
    deliveryZones: ['San Jose', 'Milpitas', 'Santa Clara'],
    minOrder: 15, estimatedDelivery: '25–40 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-1',
  },
  {
    id: 'loc-2', name: 'El Rincón — King Rd', slug: 'king-rd',
    description: 'East San Jose\'s home for authentic carnitas since 2007. Serving the neighborhood with party trays, combos, and everything from tacos to super burritos — all made fresh.',
    rating: 4.8, reviewCount: 214, image: vi(3), coverImage: ci(3),
    city: 'San Jose', address: '1199 S King Rd Ste 20, San Jose, CA 95122',
    phone: '(408) 708-4184', hours: 'Wkdy 9AM–6PM, Wknd 8AM–6PM',
    deliveryZones: ['San Jose', 'Evergreen', 'Milpitas'],
    minOrder: 15, estimatedDelivery: '25–40 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-2',
  },
  {
    id: 'loc-3', name: 'El Rincón — Keyes St', slug: 'keyes-st',
    description: 'Downtown San Jose\'s go-to carnitas spot. Our Keyes Street location is famous for weekday lunch crowds and has been feeding Silicon Valley workers for over a decade.',
    rating: 4.7, reviewCount: 198, image: vi(2), coverImage: ci(4),
    city: 'San Jose', address: '84 Keyes St, San Jose, CA 95112',
    phone: '(408) 947-9165', hours: 'Everyday 10AM–6PM',
    deliveryZones: ['San Jose', 'Santa Clara', 'Sunnyvale'],
    minOrder: 15, estimatedDelivery: '20–35 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-3',
  },
  {
    id: 'loc-4', name: 'El Rincón — Alma Ave', slug: 'alma-ave',
    description: 'South San Jose\'s carnitas destination. The Alma Ave team is known for the friendliest service in the Bay and the best mixtas in town. Try a combo — you won\'t regret it.',
    rating: 4.8, reviewCount: 176, image: vi(1), coverImage: ci(2),
    city: 'San Jose', address: '148 W Alma Ave, San Jose, CA 95110',
    phone: '(408) 297-1756', hours: 'Wkdy 10AM–6:30PM, Wknd 9AM–6:30PM',
    deliveryZones: ['San Jose', 'Campbell', 'Los Gatos'],
    minOrder: 15, estimatedDelivery: '25–40 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-4',
  },
  // Hayward — 2 locations
  {
    id: 'loc-5', name: 'El Rincón — Gading Rd', slug: 'gading-rd',
    description: 'Serving Hayward with the same auténticas carnitas that made El Rincón famous. Our Gading Rd location handles party trays up to 100 people — call ahead for large orders.',
    rating: 4.7, reviewCount: 156, image: vi(9), coverImage: ci(6),
    city: 'Hayward', address: '26712 Gading Rd, Hayward, CA 94544',
    phone: '(510) 397-6904', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Hayward', 'Union City', 'Fremont'],
    minOrder: 15, estimatedDelivery: '30–45 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-5',
  },
  {
    id: 'loc-6', name: 'El Rincón — Tennyson Rd', slug: 'tennyson-rd',
    description: 'West Hayward\'s favorite carnitas spot since 2011. The Tennyson Road team serves everything from individual tacos to full 100-person party trays with the same love every time.',
    rating: 4.6, reviewCount: 134, image: vi(10), coverImage: ci(1),
    city: 'Hayward', address: '1108 W Tennyson Rd, Hayward, CA 94544',
    phone: '(510) 363-9291', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Hayward', 'San Leandro', 'Oakland'],
    minOrder: 15, estimatedDelivery: '30–45 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-6',
  },
  // Redwood City — 2 locations
  {
    id: 'loc-7', name: 'El Rincón — Middlefield Rd', slug: 'middlefield-rd',
    description: 'Peninsula carnitas lovers, this one\'s for you. Our Middlefield Rd location in Redwood City draws customers from across the Peninsula for weekend party trays and daily combos.',
    rating: 4.9, reviewCount: 243, image: vi(7), coverImage: ci(5),
    city: 'Redwood City', address: '2950 Middlefield Rd Spc #B, Redwood City, CA 94063',
    phone: '(650) 362-3223', hours: 'Everyday 10AM–6PM',
    deliveryZones: ['Redwood City', 'Menlo Park', 'East Palo Alto'],
    minOrder: 15, estimatedDelivery: '25–40 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-7',
  },
  {
    id: 'loc-8', name: 'El Rincón — El Camino Real', slug: 'el-camino-real',
    description: 'Right on El Camino Real for easy access from anywhere on the Peninsula. This location is a favorite for tech workers and families alike — party trays ready to go in 30 minutes.',
    rating: 4.8, reviewCount: 189, image: vi(14), coverImage: ci(11),
    city: 'Redwood City', address: '999 El Camino Real, Redwood City, CA 94063',
    phone: '(650) 362-3334', hours: 'Everyday 10AM–6PM',
    deliveryZones: ['Redwood City', 'San Carlos', 'Belmont'],
    minOrder: 15, estimatedDelivery: '25–40 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-8',
  },
  // San Francisco — 1 location
  {
    id: 'loc-9', name: 'El Rincón — San Francisco', slug: 'san-francisco',
    description: 'Authentic carnitas in the heart of the Mission at 22nd St. SF locals have been driving here and calling in party tray orders for family gatherings across the Bay since 2015.',
    rating: 4.9, reviewCount: 312, image: vi(4), coverImage: ci(9),
    city: 'San Francisco', address: '3242 22nd St, San Francisco, CA 94110',
    phone: '(415) 757-9327', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['San Francisco', 'Daly City', 'South San Francisco'],
    minOrder: 15, estimatedDelivery: '30–50 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-9',
  },
  // Sacramento — 3 locations
  {
    id: 'loc-10', name: 'El Rincón — Northgate Blvd', slug: 'northgate-sac',
    description: 'North Sacramento\'s carnitas headquarters. Our Northgate Blvd location serves the Sacramento community with the same El Rincón recipes perfected since 2004.',
    rating: 4.7, reviewCount: 145, image: vi(13), coverImage: ci(7),
    city: 'Sacramento', address: '2201 Northgate Blvd, Sacramento, CA 95833',
    phone: '(916) 274-4080', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Sacramento', 'Natomas', 'Rio Linda'],
    minOrder: 15, estimatedDelivery: '30–45 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-10',
  },
  {
    id: 'loc-11', name: 'El Rincón — Folsom Blvd', slug: 'folsom-blvd',
    description: 'East Sacramento\'s favorite carnitas. The Folsom Blvd team takes pride in every tray and every taco. Weekend specials include whole chicken and fresh barbacoa.',
    rating: 4.6, reviewCount: 128, image: vi(15), coverImage: ci(8),
    city: 'Sacramento', address: '9007 Folsom Blvd, Sacramento, CA 95826',
    phone: '(916) 469-9183', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Sacramento', 'Rancho Cordova', 'Elk Grove'],
    minOrder: 15, estimatedDelivery: '30–45 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-11',
  },
  {
    id: 'loc-12', name: 'El Rincón — Florin Rd', slug: 'florin-rd',
    description: 'South Sacramento knows carnitas, and El Rincón on Florin Rd is the gold standard. Family-sized party trays, combos that fill you up, and service that keeps you coming back.',
    rating: 4.7, reviewCount: 162, image: vi(16), coverImage: ci(0),
    city: 'Sacramento', address: '6530 Florin Rd, Sacramento, CA 95828',
    phone: '(916) 476-5410', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Sacramento', 'Elk Grove', 'Florin'],
    minOrder: 15, estimatedDelivery: '30–45 min', isOpen: false,
    specialties: SPECIALTIES, ownerId: 'vendor-user-12',
  },
  // Other cities
  {
    id: 'loc-13', name: 'El Rincón — Woodland', slug: 'woodland',
    description: 'Yolo County\'s destination for authentic Michoacán-style carnitas. Our Woodland location on E Main St brings the full El Rincón experience to the Sacramento Valley.',
    rating: 4.8, reviewCount: 118, image: vi(17), coverImage: ci(10),
    city: 'Woodland', address: '1780 E Main St, Woodland, CA 95776',
    phone: '(530) 665-6262', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Woodland', 'Davis', 'West Sacramento'],
    minOrder: 15, estimatedDelivery: '35–50 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-13',
  },
  {
    id: 'loc-14', name: 'El Rincón — Vallejo', slug: 'vallejo',
    description: 'Solano County\'s carnitas connection. The Vallejo crew on Tennessee St stays open until 7PM on weekends so you can place that last-minute party tray order for Sunday family dinners.',
    rating: 4.6, reviewCount: 107, image: vi(5), coverImage: ci(3),
    city: 'Vallejo', address: '818 Tennessee St, Vallejo, CA 94590',
    phone: '(707) 654-8280', hours: 'Wkdy 10AM–6PM, Wknd 9AM–7PM',
    deliveryZones: ['Vallejo', 'Benicia', 'American Canyon'],
    minOrder: 15, estimatedDelivery: '35–50 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-14',
  },
  {
    id: 'loc-15', name: 'El Rincón — Lodi', slug: 'lodi',
    description: 'San Joaquin Valley carnitas done right. Our Lodi location on Church St has become a staple for the whole region — from quinceañeras to backyard carne asadas, we\'ve got you covered.',
    rating: 4.7, reviewCount: 93, image: vi(6), coverImage: ci(2),
    city: 'Lodi', address: '1413 Church St, Lodi, CA 95240',
    phone: '(209) 263-7311', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Lodi', 'Stockton', 'Galt'],
    minOrder: 15, estimatedDelivery: '35–50 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-15',
  },
  {
    id: 'loc-16', name: 'El Rincón — Fairfield', slug: 'fairfield',
    description: 'Fairfield and the greater Solano County community can count on El Rincón on N Texas St for fresh daily carnitas. Open every day of the week — no day is a bad day for carnitas.',
    rating: 4.6, reviewCount: 88, image: vi(8), coverImage: ci(1),
    city: 'Fairfield', address: '1785 N Texas St, Fairfield, CA 94533',
    phone: '(707) 673-2633', hours: 'Everyday 10AM–6PM',
    deliveryZones: ['Fairfield', 'Vacaville', 'Suisun City'],
    minOrder: 15, estimatedDelivery: '30–45 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-16',
  },
  {
    id: 'loc-17', name: 'El Rincón — Yuba City', slug: 'yuba-city',
    description: 'Northern California\'s carnitas haven. Yuba City opens early on weekends at 8AM so you can get your party trays prepped and ready before the fiesta begins.',
    rating: 4.7, reviewCount: 76, image: vi(18), coverImage: ci(12),
    city: 'Yuba City', address: '511 2nd St, Yuba City, CA 95991',
    phone: '(530) 763-5753', hours: 'Wkdy 10AM–6PM, Wknd 8AM–6PM',
    deliveryZones: ['Yuba City', 'Marysville', 'Wheatland'],
    minOrder: 15, estimatedDelivery: '35–50 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-17',
  },
  {
    id: 'loc-18', name: 'El Rincón — Modesto', slug: 'modesto',
    description: 'The Central Valley\'s best carnitas are right here on Yosemite Blvd. Our Modesto location has been a community staple for years — party trays, combos, and weekend specials every week.',
    rating: 4.8, reviewCount: 112, image: vi(11), coverImage: ci(8),
    city: 'Modesto', address: '1524 Yosemite Blvd, Modesto, CA 95354',
    phone: '(209) 408-8628', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Modesto', 'Ceres', 'Turlock'],
    minOrder: 15, estimatedDelivery: '35–50 min', isOpen: true,
    specialties: SPECIALTIES, ownerId: 'vendor-user-18',
  },
  {
    id: 'loc-19', name: 'El Rincón — Chico', slug: 'chico',
    description: 'Our newest location brings auténticas carnitas to Northern California\'s college town. El Rincón on Main St in Chico is already a favorite for students, families, and everyone in between.',
    rating: 4.5, reviewCount: 61, image: vi(12), coverImage: ci(7),
    city: 'Chico', address: '1020 Main St, Chico, CA 95928',
    phone: '(530) 570-3499', hours: 'Wkdy 10AM–6PM, Wknd 9AM–6PM',
    deliveryZones: ['Chico', 'Paradise', 'Oroville'],
    minOrder: 15, estimatedDelivery: '35–50 min', isOpen: false,
    specialties: SPECIALTIES, ownerId: 'vendor-user-19',
  },
]

const PROD_IMGS = {
  tray: R_FOOD,
  carnitas: R_FOOD,
  combo: R_FOOD,
  taco: `${UNS}/photo-1618449840665-9ed506d73a34?w=600&auto=format&fit=crop`,
  burrito: `${UNS}/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop`,
  quesadilla: `${UNS}/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop`,
  chicken: `${UNS}/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop`,
  drinks: `${UNS}/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop`,
}

const BASE_PRODUCTS = [
  // ── Party Trays ──────────────────────────────────────────────────────────────
  {
    id: 'tray-100', name: 'Party Tray — 100 People', category: 'trays', unit: 'tray',
    description: 'Our signature 100-person party tray. Generous portions of auténticas carnitas cooked fresh and packed hot. The ultimate tray for quinceañeras, weddings, and large family celebrations.',
    pricePerLb: 790, image: PROD_IMGS.tray, inStock: true, popular: true,
    options: { meatType: true },
  },
  {
    id: 'tray-50', name: 'Party Tray — 50 People', category: 'trays', unit: 'tray',
    description: 'Feeds 50 guests with fresh carnitas. Perfect for birthday parties, graduations, and family reunions. Call 24 hours ahead for this size.',
    pricePerLb: 395, image: PROD_IMGS.tray, inStock: true, popular: true,
    options: { meatType: true },
  },
  {
    id: 'tray-30', name: 'Party Tray — 30 People', category: 'trays', unit: 'tray',
    description: 'The most popular party tray size. Feeds 30 guests generously. Great for family gatherings, office parties, and backyard celebrations.',
    pricePerLb: 230, image: PROD_IMGS.tray, inStock: true, popular: true,
    options: { meatType: true },
  },
  {
    id: 'tray-15', name: 'Party Tray — 15 People', category: 'trays', unit: 'tray',
    description: 'Perfect for smaller gatherings. Feeds 15 people comfortably. Same auténticas carnitas we\'ve been making since 2004 — just right for intimate family dinners.',
    pricePerLb: 122, image: PROD_IMGS.tray, inStock: true, popular: false,
    options: { meatType: true },
  },
  // ── Combos ───────────────────────────────────────────────────────────────────
  {
    id: 'combo-1', name: 'Combo #1', category: 'combos', unit: 'meal',
    description: 'Our biggest combo — a hearty plate with carnitas, rice, beans, tortillas, and a full range of salsas and condiments. Feeds one hungry person very well.',
    pricePerLb: 32.75, image: PROD_IMGS.combo, inStock: true, popular: true,
    options: { meatType: true },
  },
  {
    id: 'combo-2', name: 'Combo #2', category: 'combos', unit: 'meal',
    description: 'A satisfying combo with carnitas, rice, beans, and tortillas. The everyday favorite — the right amount for a filling lunch or dinner.',
    pricePerLb: 26.75, image: PROD_IMGS.combo, inStock: true, popular: true,
    options: { meatType: true },
  },
  {
    id: 'combo-3', name: 'Combo #3', category: 'combos', unit: 'meal',
    description: 'A lighter combo for a quick, delicious meal. Includes carnitas, tortillas, and fresh salsas. Great for a solo lunch on the go.',
    pricePerLb: 15.75, image: PROD_IMGS.combo, inStock: true, popular: false,
    options: { meatType: true },
  },
  // ── Por Libra ────────────────────────────────────────────────────────────────
  {
    id: 'lb-mixtas', name: 'Mixtas', category: 'per-pound', unit: 'lb',
    description: 'A mix of all carnitas cuts — the most popular choice at every El Rincón location. Tender pork cooked the traditional way with citrus and spices.',
    pricePerLb: 14, image: PROD_IMGS.carnitas, inStock: true, popular: true,
    options: {},
  },
  {
    id: 'lb-pura-carne', name: 'Pura Carne', category: 'per-pound', unit: 'lb',
    description: 'Pure lean pork, no offal or skin. The cleanest, most tender cut for those who prefer straightforward carnitas without the extras.',
    pricePerLb: 14, image: PROD_IMGS.carnitas, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'lb-buche', name: 'Buche', category: 'per-pound', unit: 'lb',
    description: 'Pork stomach cooked carnitas-style. Rich, deeply flavorful, and uniquely tender. A beloved cut for those in the know.',
    pricePerLb: 14, image: PROD_IMGS.carnitas, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'lb-cueritos', name: 'Cueritos', category: 'per-pound', unit: 'lb',
    description: 'Pickled pork skin with a tangy, chewy bite. A traditional Mexican treat that adds amazing texture and flavor to tacos and tostadas.',
    pricePerLb: 14, image: PROD_IMGS.carnitas, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'lb-chicharron', name: 'Chicharron', category: 'per-pound', unit: 'lb',
    description: 'Crispy, golden fried pork rinds made fresh. Irresistibly crunchy and full of flavor — eat them as a snack or crumble them into tacos.',
    pricePerLb: 15, image: PROD_IMGS.carnitas, inStock: true, popular: false,
    options: {},
  },
  // ── Per Piece ────────────────────────────────────────────────────────────────
  {
    id: 'piece-patas-carnitas', name: 'Patas en Carnitas', category: 'per-pound', unit: 'each',
    description: 'Pork feet cooked carnitas-style. Tender, gelatinous, and deeply savory — a traditional delicacy enjoyed by carnitas lovers everywhere.',
    pricePerLb: 7, image: PROD_IMGS.carnitas, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'piece-patas-vinagre', name: 'Patas en Vinagre', category: 'per-pound', unit: 'each',
    description: 'Pickled pork feet. Tangy, bold, and unforgettable. A specialty item that pairs perfectly with fresh tortillas and a cold drink.',
    pricePerLb: 8, image: PROD_IMGS.carnitas, inStock: true, popular: false,
    options: {},
  },
  // ── Tacos ────────────────────────────────────────────────────────────────────
  {
    id: 'taco', name: 'Taco de Carnitas', category: 'tacos', unit: 'each',
    description: 'A classic street-style carnitas taco on a fresh corn tortilla with onion and cilantro. Simple, perfect, and made with our slow-cooked carnitas.',
    pricePerLb: 4, image: PROD_IMGS.taco, inStock: true, popular: true,
    options: { meatType: true },
  },
  // ── Burritos ─────────────────────────────────────────────────────────────────
  {
    id: 'burrito-regular', name: 'Burrito Regular', category: 'burritos', unit: 'meal',
    description: 'A stuffed flour tortilla with carnitas, rice, beans, and fresh salsa. Filling, flavorful, and exactly what you need for a hearty meal.',
    pricePerLb: 10, image: PROD_IMGS.burrito, inStock: true, popular: true,
    options: { meatType: true },
  },
  {
    id: 'burrito-super', name: 'Super Burrito', category: 'burritos', unit: 'meal',
    description: 'Everything in the regular burrito plus guacamole, sour cream, and extra carnitas. This is the one you order when you\'re seriously hungry.',
    pricePerLb: 13, image: PROD_IMGS.burrito, inStock: true, popular: true,
    options: { meatType: true },
  },
  // ── Quesadillas ──────────────────────────────────────────────────────────────
  {
    id: 'quesadilla-regular', name: 'Quesadilla Regular', category: 'quesadillas', unit: 'meal',
    description: 'A golden, crispy flour tortilla with melted cheese. A simple classic — great as a side or on its own for a lighter bite.',
    pricePerLb: 9, image: PROD_IMGS.quesadilla, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'quesadilla-carne', name: 'Quesadilla con Carne', category: 'quesadillas', unit: 'meal',
    description: 'Our quesadilla loaded with our signature carnitas and melted cheese. Crispy outside, gooey and flavorful inside. A customer favorite.',
    pricePerLb: 11, image: PROD_IMGS.quesadilla, inStock: true, popular: true,
    options: { meatType: true },
  },
  // ── Platillos ────────────────────────────────────────────────────────────────
  {
    id: 'platillo', name: 'Platillo de Carnitas', category: 'plates', unit: 'meal',
    description: 'A full plate with carnitas, rice, beans, tortillas, and fresh salsas. The complete El Rincón experience in a single serving — perfect for a sit-down meal.',
    pricePerLb: 14, image: PROD_IMGS.combo, inStock: true, popular: false,
    options: { meatType: true },
  },
  // ── Weekend Specials ─────────────────────────────────────────────────────────
  {
    id: 'wknd-chicken-whole', name: 'Whole Chicken', category: 'weekend', unit: 'each',
    description: 'Weekend special: a whole slow-roasted chicken seasoned with our signature blend. Available Saturdays and Sundays only while supplies last.',
    pricePerLb: 17, image: PROD_IMGS.chicken, inStock: true, popular: true,
    options: {},
  },
  {
    id: 'wknd-chicken-half', name: 'Half Chicken', category: 'weekend', unit: 'each',
    description: 'Weekend special: half of our slow-roasted chicken, perfectly seasoned. A great option if you want the weekend chicken but not the whole bird.',
    pricePerLb: 8.50, image: PROD_IMGS.chicken, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'wknd-barbacoa', name: 'Barbacoa', category: 'weekend', unit: 'lb',
    description: 'Weekend special: slow-cooked barbacoa beef, rich and tender. Available Saturday and Sunday only. Incredible in tacos, burritos, or on its own.',
    pricePerLb: 16, image: PROD_IMGS.carnitas, inStock: true, popular: true,
    options: {},
  },
  {
    id: 'wknd-taco-barbacoa', name: 'Taco Barbacoa', category: 'weekend', unit: 'each',
    description: 'Weekend special: a taco filled with our slow-cooked barbacoa on a fresh corn tortilla. Available Saturday and Sunday only — come early, they sell out fast.',
    pricePerLb: 3.75, image: PROD_IMGS.taco, inStock: true, popular: true,
    options: {},
  },
  // ── Bebidas ──────────────────────────────────────────────────────────────────
  {
    id: 'bev-soda-can', name: 'Soda Can', category: 'beverages', unit: 'each',
    description: 'Assorted sodas — Coke, Sprite, Orange, and more. The perfect complement to your carnitas order.',
    pricePerLb: 1.80, image: PROD_IMGS.drinks, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'bev-soda-2l', name: '2-Liter Soda', category: 'beverages', unit: 'each',
    description: 'A 2-liter bottle of your choice — great for parties. Assorted flavors available.',
    pricePerLb: 3.75, image: PROD_IMGS.drinks, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'bev-aguas', name: 'Aguas Frescas', category: 'beverages', unit: 'each',
    description: 'Freshly made agua fresca — horchata, jamaica, or tamarindo. Homemade daily and the perfect refreshment with your meal.',
    pricePerLb: 3.50, image: PROD_IMGS.drinks, inStock: true, popular: true,
    options: {},
  },
  {
    id: 'bev-water', name: 'Agua / Water', category: 'beverages', unit: 'each',
    description: 'Bottled water to keep you hydrated.',
    pricePerLb: 1.50, image: PROD_IMGS.drinks, inStock: true, popular: false,
    options: {},
  },
  // ── Extras ───────────────────────────────────────────────────────────────────
  {
    id: 'extra-8oz', name: 'Salsa & Extras (8oz)', category: 'beverages', unit: 'each',
    description: 'Extra salsa, guacamole, crema, or condiments — 8oz container. Add to your order to make sure you have enough for everyone.',
    pricePerLb: 3, image: PROD_IMGS.drinks, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'extra-16oz', name: 'Salsa & Extras (16oz)', category: 'beverages', unit: 'each',
    description: 'Extra salsa, guacamole, crema, or condiments — 16oz container. Great for party trays.',
    pricePerLb: 4, image: PROD_IMGS.drinks, inStock: true, popular: false,
    options: {},
  },
  {
    id: 'extra-32oz', name: 'Salsa & Extras (32oz)', category: 'beverages', unit: 'each',
    description: 'Extra salsa, guacamole, crema, or condiments — 32oz container. For the big party orders.',
    pricePerLb: 8, image: PROD_IMGS.drinks, inStock: true, popular: false,
    options: {},
  },
]

export const MOCK_PRODUCTS = Object.fromEntries(
  MOCK_VENDORS.map(v => [
    v.id,
    BASE_PRODUCTS.map(p => ({ ...p, id: `${v.id}-${p.id}`, vendorId: v.id })),
  ])
)

export const MOCK_ORDERS = [
  {
    id: 'ord-001',
    customerId: 'customer-user-1',
    vendorId: 'loc-1',
    vendorName: 'El Rincón — Alum Rock',
    driverId: 'driver-user-1',
    driverName: 'Carlos M.',
    items: [
      { productId: 'loc-1-tray-30', name: 'Party Tray — 30 People', pricePerLb: 230, quantity: 1, unit: 'tray', meatType: 'mixtas' },
      { productId: 'loc-1-bev-aguas', name: 'Aguas Frescas', pricePerLb: 3.50, quantity: 2, unit: 'each' },
    ],
    subtotal: 237,
    serviceFee: 11.85,
    deliveryFee: 4.99,
    total: 253.84,
    status: 'picked_up',
    address: '500 El Camino Real, San Jose, CA',
    createdAt: new Date(Date.now() - 25 * 60000),
    estimatedDelivery: '5–15 min',
    paymentMethod: 'card',
    paymentLast4: '4242',
  },
  {
    id: 'ord-002',
    customerId: 'customer-user-1',
    vendorId: 'loc-7',
    vendorName: 'El Rincón — Middlefield Rd',
    driverId: 'driver-user-2',
    driverName: 'Miguel R.',
    items: [
      { productId: 'loc-7-tray-15', name: 'Party Tray — 15 People', pricePerLb: 122, quantity: 1, unit: 'tray', meatType: 'pura-carne' },
    ],
    subtotal: 122,
    serviceFee: 6.10,
    deliveryFee: 4.99,
    total: 133.09,
    status: 'delivered',
    address: '500 El Camino Real, San Jose, CA',
    createdAt: new Date(Date.now() - 2 * 24 * 3600000),
    estimatedDelivery: 'Delivered',
    paymentMethod: 'card',
    paymentLast4: '4242',
  },
]

export const MOCK_REVIEWS = {
  'loc-1': [
    { id: 'rv-1-1', vendorId: 'loc-1', rating: 5, text: 'Delicious carnitas! We drive from San Francisco to get party trays from El Rincón. The mixtas are absolutely incredible — crispy ends, tender inside. Never disappoints.', reviewerName: 'Alyssa A.', createdAt: new Date(Date.now() - 3 * 24 * 3600000) },
    { id: 'rv-1-2', vendorId: 'loc-1', rating: 5, text: 'Great Mexican place for carnitas! For family functions this is THE spot. Got the 50-person tray for a quinceañera and everyone was raving about it all night.', reviewerName: 'Mario M.', createdAt: new Date(Date.now() - 6 * 24 * 3600000) },
    { id: 'rv-1-3', vendorId: 'loc-1', rating: 5, text: 'The party trays available for 15, 30, 50 or 100 people are the best deal in the Bay. Always fresh, always on time. My family has been ordering from here for years.', reviewerName: 'Emily L.', createdAt: new Date(Date.now() - 10 * 24 * 3600000) },
    { id: 'rv-1-4', vendorId: 'loc-1', rating: 5, text: 'The ladies that work there are so helpful, kind, hardworking and fast! Got our 30-person tray ready in no time. Best carnitas in the South Bay, hands down.', reviewerName: 'Maryann C.', createdAt: new Date(Date.now() - 14 * 24 * 3600000) },
  ],
  'loc-2': [
    { id: 'rv-2-1', vendorId: 'loc-2', rating: 5, text: 'Had burritos and quesadillas here many times. Great cuts of pork, best I\'ve had in San Jose. The super burrito is massive and incredibly flavorful.', reviewerName: 'Stephen C.', createdAt: new Date(Date.now() - 2 * 24 * 3600000) },
    { id: 'rv-2-2', vendorId: 'loc-2', rating: 5, text: 'Never had an issue here. The mix carnitas SHMACKS! Always fresh, always hot. I order from here at least twice a month.', reviewerName: 'Alejandra R.', createdAt: new Date(Date.now() - 7 * 24 * 3600000) },
    { id: 'rv-2-3', vendorId: 'loc-2', rating: 4, text: 'Party tray for my son\'s graduation — 45 guests all satisfied! The weekend chicken was also incredible. Fast delivery and everything arrived hot.', reviewerName: 'Jose M.', createdAt: new Date(Date.now() - 12 * 24 * 3600000) },
  ],
  'loc-3': [
    { id: 'rv-3-1', vendorId: 'loc-3', rating: 5, text: 'Best lunch spot in downtown SJ. The Combo #1 is huge and so filling — carnitas, rice, beans, all fresh. I come here every week.', reviewerName: 'Carlos R.', createdAt: new Date(Date.now() - 4 * 24 * 3600000) },
    { id: 'rv-3-2', vendorId: 'loc-3', rating: 4, text: 'Ordered the 30-person tray for a birthday party. Arrived on time and still hot. The mixtas are perfect — crispy and tender at the same time. Will order again.', reviewerName: 'Rosa P.', createdAt: new Date(Date.now() - 9 * 24 * 3600000) },
  ],
  'loc-7': [
    { id: 'rv-7-1', vendorId: 'loc-7', rating: 5, text: 'Delicious carnitas! We drove from San Francisco to Redwood City just for El Rincón. Worth every mile. The 50-person party tray was the highlight of our family reunion.', reviewerName: 'Alyssa A.', createdAt: new Date(Date.now() - 5 * 24 * 3600000) },
    { id: 'rv-7-2', vendorId: 'loc-7', rating: 5, text: 'Best carnitas on the Peninsula, no contest. I\'ve tried every Mexican spot in Redwood City and El Rincón is in a different league. The quesadillas con carne are addictive.', reviewerName: 'David K.', createdAt: new Date(Date.now() - 8 * 24 * 3600000) },
    { id: 'rv-7-3', vendorId: 'loc-7', rating: 5, text: 'Got the 100-person party tray for our company party. Ordered 24 hours ahead as requested and it was absolutely worth it. Every single person asked where we got the food.', reviewerName: 'Lisa T.', createdAt: new Date(Date.now() - 15 * 24 * 3600000) },
  ],
  'loc-9': [
    { id: 'rv-9-1', vendorId: 'loc-9', rating: 5, text: 'Best carnitas in the Mission, hands down. Always fresh, always perfectly cooked. The weekend barbacoa tacos are worth showing up early for.', reviewerName: 'Marco V.', createdAt: new Date(Date.now() - 3 * 24 * 3600000) },
    { id: 'rv-9-2', vendorId: 'loc-9', rating: 5, text: 'Party tray for a birthday in the Mission — every guest wanted the recipe. El Rincón never misses. The aguas frescas are also excellent.', reviewerName: 'Sofia G.', createdAt: new Date(Date.now() - 11 * 24 * 3600000) },
  ],
  'loc-18': [
    { id: 'rv-18-1', vendorId: 'loc-18', rating: 5, text: 'Modesto finally has a carnitas place worth talking about. El Rincón on Yosemite Blvd is the real deal — everything tastes exactly like it does at the Bay Area locations.', reviewerName: 'Elena S.', createdAt: new Date(Date.now() - 7 * 24 * 3600000) },
    { id: 'rv-18-2', vendorId: 'loc-18', rating: 4, text: 'Weekend specials here are fire. The whole chicken and barbacoa are unreal. El Rincón has been consistent for years and this location carries that tradition perfectly.', reviewerName: 'Hector B.', createdAt: new Date(Date.now() - 20 * 24 * 3600000) },
  ],
}

export const MOCK_DRIVER_DELIVERIES = [
  {
    id: 'del-001',
    orderId: 'ord-001',
    driverId: 'driver-user-1',
    status: 'picked_up',
    vendorName: 'El Rincón — Alum Rock',
    vendorAddress: '3141 Alum Rock Ave, San Jose, CA 95127',
    customerName: 'Maria G.',
    customerAddress: '500 El Camino Real, San Jose, CA 95008',
    customerPhone: '(408) 555-0199',
    items: '1 Party Tray (30 People) + 2 Aguas Frescas',
    earning: 9.50,
    pickupTime: new Date(Date.now() - 15 * 60000),
    estimatedDropoff: '5–10 min',
  },
]

export const MOCK_USERS = {
  customer: {
    id: 'customer-user-1',
    email: 'customer@demo.com',
    password: 'demo123',
    name: 'Maria García',
    role: 'customer',
    phone: '(408) 555-0199',
    address: '500 El Camino Real, San Jose, CA 95008',
    avatar: null,
  },
  vendor: {
    id: 'vendor-user-1',
    email: 'vendor@demo.com',
    password: 'demo123',
    name: 'Ana Rincón',
    role: 'vendor',
    vendorId: 'loc-1',
    phone: '(408) 791-6422',
    avatar: null,
  },
  driver: {
    id: 'driver-user-1',
    email: 'driver@demo.com',
    password: 'demo123',
    name: 'Carlos Mendoza',
    role: 'driver',
    phone: '(408) 555-0288',
    vehicle: 'Toyota Corolla — Silver',
    licensePlate: '7ABC123',
    avatar: null,
    isOnline: true,
  },
  admin: {
    id: 'admin-user-1',
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Admin User',
    role: 'admin',
    phone: '(415) 555-0001',
    avatar: null,
  },
}
