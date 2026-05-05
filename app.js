import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===========================
// DATA (loaded dynamically)
// ===========================

async function loadData() {
  const response = await fetch('./data.json');
  return response.json();
}

// ===========================
// SETTINGS APPLICATION
// ===========================

const DEFAULT_SETTINGS = {
  headerText: '',
  subtitle: '',
  fontDisplay: "'Space Grotesk', 'Inter', sans-serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  globeColor: '#0a0e1a',
  atmosColor: '#264d80',
  bgColor: '#06070d',
  textColor: '#ffffff',
};

function parseHexColor(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  return parseInt(m[1], 16);
}
function hexToVec3(hex) {
  const n = parseHexColor(hex);
  if (n === null) return null;
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

(async function init() {
  const DATA = await loadData();
  const AIRPORTS = DATA.airports;
  const FLIGHTS = DATA.flights;
  const TRIPS = DATA.trips || [];
  const SETTINGS = Object.assign({}, DEFAULT_SETTINGS, DATA.settings || {});

// Region classification
function getRegion(code) {
  const ap = AIRPORTS[code];
  if (!ap) return 'other';
  const { lat, lng, country } = ap;
  if (country === 'Argentina' && code === 'USH') return 'antarctica'; // Ushuaia → gateway
  if (['Argentina', 'Peru', 'Panama'].includes(country)) return 'south-america';
  if (['India', 'Thailand', 'Singapore'].includes(country)) return 'asia';
  if (['Australia', 'New Zealand'].includes(country)) return 'oceania';
  if (['UK', 'Germany', 'France', 'Netherlands', 'Sweden', 'Denmark', 'Norway',
       'Finland', 'Belgium', 'Spain', 'Austria', 'Slovakia', 'Switzerland', 'Italy'].includes(country))
    return 'europe';
  if (['USA', 'Canada', 'Mexico'].includes(country)) return 'north-america';
  return 'other';
}

const REGIONS = {
  'north-america': { label: 'North America', color: '#448aff' },
  'europe':        { label: 'Europe', color: '#ffd740' },
  'asia':          { label: 'Asia', color: '#ff4081' },
  'oceania':       { label: 'Oceania', color: '#69f0ae' },
  'south-america': { label: 'South America', color: '#ff6e40' },
  'antarctica':    { label: 'Antarctica', color: '#00e5ff' },
};

// Region classification for trips (by country name OR by latitude as fallback)
function getRegionByCountry(country, lat) {
  if (['USA', 'Canada', 'Mexico'].includes(country)) return 'north-america';
  if (['Argentina', 'Peru', 'Panama', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay', 'Venezuela'].includes(country)) return 'south-america';
  if (['India', 'Thailand', 'Singapore', 'Japan', 'China', 'South Korea', 'Vietnam', 'Malaysia', 'Indonesia', 'Philippines', 'Sri Lanka', 'Nepal', 'Bangladesh', 'Myanmar', 'Cambodia', 'Laos', 'Taiwan', 'Hong Kong', 'UAE', 'Israel', 'Turkey', 'Saudi Arabia', 'Qatar', 'Jordan', 'Lebanon', 'Oman', 'Bahrain', 'Kuwait'].includes(country)) return 'asia';
  if (['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'].includes(country)) return 'oceania';
  if (['UK', 'Germany', 'France', 'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Belgium', 'Spain', 'Austria', 'Slovakia', 'Switzerland', 'Italy', 'Portugal', 'Ireland', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Croatia', 'Iceland', 'Estonia', 'Latvia', 'Lithuania', 'Slovenia', 'Serbia', 'Bulgaria', 'Montenegro', 'Albania', 'North Macedonia', 'Bosnia and Herzegovina', 'Luxembourg', 'Malta', 'Cyprus', 'Scotland', 'Wales'].includes(country)) return 'europe';
  // Antarctica and sub-Antarctic territories
  if (['Antarctica', 'South Georgia', 'South Georgia and the South Sandwich Islands', 'Falkland Islands'].includes(country)) return 'antarctica';
  // Latitude-based fallback for unrecognised places (e.g. islands with no country)
  if (typeof lat === 'number') {
    if (lat <= -55) return 'antarctica';
    if (lat >= 60 && lat <= 75) return 'europe'; // Arctic Europe (Svalbard, etc.)
  }
  return 'other';
}


// Compute route data
const routeMap = new Map();
FLIGHTS.forEach(f => {
  if (!AIRPORTS[f.from] || !AIRPORTS[f.to]) return;
  const key = [f.from, f.to].sort().join('-');
  if (!routeMap.has(key)) {
    routeMap.set(key, { from: f.from, to: f.to, count: 0, flights: [] });
  }
  const r = routeMap.get(key);
  r.count++;
  r.flights.push(f);
});

// Compute airport flight counts
const airportCounts = {};
FLIGHTS.forEach(f => {
  [f.from, f.to].forEach(code => {
    if (AIRPORTS[code]) airportCounts[code] = (airportCounts[code] || 0) + 1;
  });
});

// ===========================
// THREE.JS SETUP
// ===========================

const canvas = document.getElementById('globe-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(parseHexColor(SETTINGS.bgColor) ?? 0x06070d);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 1.5;
controls.maxDistance = 6;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// ===========================
// GLOBE
// ===========================

const GLOBE_RADIUS = 1;

// Starfield
const starGeom = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 50 + Math.random() * 50;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  starPositions[i * 3 + 2] = r * Math.cos(phi);
}
starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0x555577, size: 0.15, sizeAttenuation: true })));

// Globe sphere — dark with grid
const globeGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
const globeMat = new THREE.MeshBasicMaterial({
  color: parseHexColor(SETTINGS.globeColor) ?? 0x0a0e1a,
  transparent: true,
  opacity: 0.95,
});
const globe = new THREE.Mesh(globeGeom, globeMat);
scene.add(globe);

// Lat/Lng grid lines
const gridGroup = new THREE.Group();
const gridMat = new THREE.LineBasicMaterial({ color: 0x1a2040, transparent: true, opacity: 0.4 });

// Latitude lines
for (let lat = -60; lat <= 60; lat += 30) {
  const points = [];
  const phi = (90 - lat) * (Math.PI / 180);
  for (let lng = 0; lng <= 360; lng += 3) {
    const theta = lng * (Math.PI / 180);
    points.push(new THREE.Vector3(
      -(GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.cos(theta),
      (GLOBE_RADIUS + 0.001) * Math.cos(phi),
      (GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.sin(theta)
    ));
  }
  gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMat));
}

// Longitude lines
for (let lng = 0; lng < 360; lng += 30) {
  const points = [];
  const theta = lng * (Math.PI / 180);
  for (let lat = -90; lat <= 90; lat += 3) {
    const phi = (90 - lat) * (Math.PI / 180);
    points.push(new THREE.Vector3(
      -(GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.cos(theta),
      (GLOBE_RADIUS + 0.001) * Math.cos(phi),
      (GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.sin(theta)
    ));
  }
  gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMat));
}
scene.add(gridGroup);

// Atmosphere glow
const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
const atmosVec = hexToVec3(SETTINGS.atmosColor) || [0.15, 0.3, 0.5];
const atmosMat = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Vector3(atmosVec[0], atmosVec[1], atmosVec[2]) },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(uColor, 1.0) * intensity * 0.6;
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
});
scene.add(new THREE.Mesh(atmosGeom, atmosMat));

// Apply visual settings to DOM (header text, fonts, colors)
function applyDomSettings() {
  const root = document.documentElement.style;
  root.setProperty('--color-globe-text', SETTINGS.textColor);
  root.setProperty('--color-globe-bg', SETTINGS.bgColor);
  root.setProperty('--font-body', SETTINGS.fontBody);
  root.setProperty('--font-display', SETTINGS.fontDisplay);

  const titleBlock = document.getElementById('globe-title-block');
  const titleEl = document.getElementById('globe-title');
  const subtitleEl = document.getElementById('globe-subtitle');
  const hasTitle = (SETTINGS.headerText && SETTINGS.headerText.trim()) ||
                   (SETTINGS.subtitle && SETTINGS.subtitle.trim());
  if (titleEl) titleEl.textContent = SETTINGS.headerText || '';
  if (subtitleEl) {
    subtitleEl.textContent = SETTINGS.subtitle || '';
    subtitleEl.style.display = SETTINGS.subtitle ? '' : 'none';
  }
  if (titleBlock) {
    if (hasTitle) {
      titleBlock.removeAttribute('hidden');
      document.body.classList.add('has-globe-title');
    } else {
      titleBlock.setAttribute('hidden', '');
      document.body.classList.remove('has-globe-title');
    }
  }
}
applyDomSettings();

// ===========================
// COUNTRY LABELS
// ===========================

// Fixed centroids for major reference countries (so the globe looks anchored
// even before the user adds data). Visited countries from data still get
// added on top with a centroid computed from their actual airports/trips.
const COUNTRY_CENTROIDS = {
  'USA': { lat: 39.5, lng: -98.35 },
  'United States': { lat: 39.5, lng: -98.35 },
  'Canada': { lat: 56.1, lng: -106.3 },
  'Mexico': { lat: 23.6, lng: -102.5 },
  'Brazil': { lat: -10.0, lng: -52.0 },
  'Argentina': { lat: -38.4, lng: -63.6 },
  'Peru': { lat: -9.2, lng: -75.0 },
  'Chile': { lat: -35.7, lng: -71.5 },
  'Colombia': { lat: 4.6, lng: -74.3 },
  'Panama': { lat: 8.5, lng: -80.8 },
  'UK': { lat: 54.0, lng: -2.5 },
  'United Kingdom': { lat: 54.0, lng: -2.5 },
  'Ireland': { lat: 53.4, lng: -8.2 },
  'France': { lat: 46.6, lng: 2.2 },
  'Spain': { lat: 40.4, lng: -3.7 },
  'Portugal': { lat: 39.4, lng: -8.2 },
  'Italy': { lat: 41.9, lng: 12.5 },
  'Germany': { lat: 51.2, lng: 10.5 },
  'Belgium': { lat: 50.5, lng: 4.5 },
  'Netherlands': { lat: 52.1, lng: 5.3 },
  'Switzerland': { lat: 46.8, lng: 8.2 },
  'Austria': { lat: 47.5, lng: 14.5 },
  'Slovakia': { lat: 48.7, lng: 19.7 },
  'Czech Republic': { lat: 49.8, lng: 15.5 },
  'Poland': { lat: 51.9, lng: 19.1 },
  'Denmark': { lat: 56.3, lng: 9.5 },
  'Sweden': { lat: 60.1, lng: 18.6 },
  'Norway': { lat: 64.5, lng: 11.5 },
  'Finland': { lat: 64.0, lng: 26.0 },
  'Iceland': { lat: 64.9, lng: -19.0 },
  'Russia': { lat: 61.5, lng: 90.0 },
  'Greece': { lat: 39.1, lng: 21.8 },
  'Turkey': { lat: 39.0, lng: 35.2 },
  'Egypt': { lat: 26.8, lng: 30.8 },
  'Morocco': { lat: 31.8, lng: -7.1 },
  'South Africa': { lat: -30.6, lng: 22.9 },
  'Kenya': { lat: -0.0, lng: 37.9 },
  'Nigeria': { lat: 9.1, lng: 8.7 },
  'India': { lat: 22.6, lng: 79.0 },
  'China': { lat: 35.9, lng: 104.2 },
  'Japan': { lat: 36.2, lng: 138.3 },
  'South Korea': { lat: 36.0, lng: 127.8 },
  'Thailand': { lat: 15.9, lng: 100.99 },
  'Vietnam': { lat: 14.1, lng: 108.3 },
  'Indonesia': { lat: -2.5, lng: 118.0 },
  'Philippines': { lat: 12.9, lng: 121.8 },
  'Singapore': { lat: 1.4, lng: 103.8 },
  'Malaysia': { lat: 4.2, lng: 101.98 },
  'Australia': { lat: -25.3, lng: 133.8 },
  'New Zealand': { lat: -41.0, lng: 173.0 },
  'UAE': { lat: 23.4, lng: 53.85 },
  'Saudi Arabia': { lat: 24.0, lng: 45.0 },
  'Israel': { lat: 31.0, lng: 34.85 },
  'Antarctica': { lat: -82.0, lng: 35.0 },
};

// Normalise common country aliases so we don't end up with duplicate labels
// when the data uses different spellings (e.g. "USA" and "United States").
const COUNTRY_ALIASES = {
  'united states': 'USA',
  'united states of america': 'USA',
  'usa': 'USA',
  'u.s.a.': 'USA',
  'u.s.': 'USA',
  'america': 'USA',
  'united kingdom': 'UK',
  'uk': 'UK',
  'great britain': 'UK',
  'england': 'UK',
};
function normaliseCountry(name) {
  if (!name) return name;
  const k = name.trim().toLowerCase();
  return COUNTRY_ALIASES[k] || name.trim();
}

// Build the working list of country labels. Visited countries override
// the static centroid with the average of their actual data points so
// labels sit on the user's actual region of activity.
function buildCountryLabels() {
  const acc = {}; // name -> { lat, lng, count }
  Object.values(AIRPORTS).forEach(a => {
    if (!a.country) return;
    const k = normaliseCountry(a.country);
    if (!acc[k]) acc[k] = { lat: 0, lng: 0, count: 0 };
    acc[k].lat += a.lat;
    acc[k].lng += a.lng;
    acc[k].count += 1;
  });
  TRIPS.forEach(t => {
    if (!t.country || t.lat == null || t.lng == null) return;
    const k = normaliseCountry(t.country);
    if (!acc[k]) acc[k] = { lat: 0, lng: 0, count: 0 };
    acc[k].lat += t.lat;
    acc[k].lng += t.lng;
    acc[k].count += 1;
  });

  const labels = [];
  const seen = new Set();

  // Visited countries first — use averaged centroid
  Object.entries(acc).forEach(([name, v]) => {
    labels.push({
      name,
      lat: v.lat / v.count,
      lng: v.lng / v.count,
      visited: true,
    });
    seen.add(name.toLowerCase());
  });

  // Reference countries (not yet visited) for context when zoomed in
  Object.entries(COUNTRY_CENTROIDS).forEach(([name, p]) => {
    const canonical = normaliseCountry(name);
    if (seen.has(canonical.toLowerCase())) return;
    labels.push({ name: canonical, lat: p.lat, lng: p.lng, visited: false });
    seen.add(canonical.toLowerCase());
  });

  return labels;
}

const countryLabels = buildCountryLabels().map(c => {
  const el = document.createElement('div');
  el.className = 'country-label';
  el.textContent = c.name;
  el.style.opacity = '0';
  return { ...c, el, position: null };
});

const labelsContainer = document.getElementById('country-labels');
if (labelsContainer) {
  countryLabels.forEach(l => labelsContainer.appendChild(l.el));
}

// Per-frame: project each label, fade in when zoomed close, hide on far side.
// Camera distance ranges roughly 1.5 (very close) to 6 (far). Labels appear
// when the camera is closer than about 2.6, fully visible at 1.8 and below.
function updateCountryLabels() {
  if (!labelsContainer || countryLabels.length === 0) return;
  // Lazy-init 3D positions on first call (latLngToVector3 is defined below)
  if (!countryLabels[0].position) {
    countryLabels.forEach(l => {
      l.position = latLngToVector3(l.lat, l.lng, GLOBE_RADIUS + 0.01);
    });
  }
  const camDist = camera.position.length();
  // Master zoom factor (0 = hidden, 1 = fully visible)
  const ZOOM_NEAR = 1.8, ZOOM_FAR = 2.6;
  let zoomFactor = (ZOOM_FAR - camDist) / (ZOOM_FAR - ZOOM_NEAR);
  zoomFactor = Math.max(0, Math.min(1, zoomFactor));

  if (zoomFactor === 0) {
    // Hide everything in one cheap pass
    countryLabels.forEach(l => {
      if (l.el.style.opacity !== '0') l.el.style.opacity = '0';
    });
    return;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const camDir = camera.position.clone().normalize();
  const tmp = new THREE.Vector3();

  countryLabels.forEach(l => {
    // Hide if on the far side of the globe
    const labelDir = l.position.clone().normalize();
    const facing = labelDir.dot(camDir); // 1 = directly facing camera
    if (facing < 0.05) {
      if (l.el.style.opacity !== '0') l.el.style.opacity = '0';
      return;
    }

    // Project to screen
    tmp.copy(l.position).project(camera);
    if (tmp.z > 1) {
      if (l.el.style.opacity !== '0') l.el.style.opacity = '0';
      return;
    }
    const sx = (tmp.x * 0.5 + 0.5) * w;
    const sy = (-tmp.y * 0.5 + 0.5) * h;

    // Fade based on zoom and edge proximity (facing 0.05..0.4 is the rim)
    const edgeFade = Math.max(0, Math.min(1, (facing - 0.05) / 0.35));
    const baseOpacity = l.visited ? 0.92 : 0.55;
    const opacity = zoomFactor * edgeFade * baseOpacity;

    if (opacity < 0.04) {
      if (l.el.style.opacity !== '0') l.el.style.opacity = '0';
      return;
    }

    // Offset upward by 14px so the label sits just above the dot at this point
    l.el.style.transform = `translate(-50%, -100%) translate(${sx.toFixed(1)}px, ${(sy - 6).toFixed(1)}px)`;
    l.el.style.opacity = opacity.toFixed(2);
  });
}

// ===========================
// HELPER: lat/lng to 3D
// ===========================

function latLngToVector3(lat, lng, radius = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ===========================
// AIRPORT DOTS (InstancedMesh)
// ===========================

const airportCodes = Object.keys(AIRPORTS).filter(c => c !== 'Priv');
const dotGeom = new THREE.SphereGeometry(0.008, 8, 8);
const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const dotMesh = new THREE.InstancedMesh(dotGeom, dotMat, airportCodes.length);

// Glow dots
const glowGeom = new THREE.SphereGeometry(0.016, 8, 8);
const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
const glowMesh = new THREE.InstancedMesh(glowGeom, glowMat, airportCodes.length);

const dotPositions = []; // for raycasting
const dummy = new THREE.Object3D();

airportCodes.forEach((code, i) => {
  const ap = AIRPORTS[code];
  const region = getRegion(code);
  const color = new THREE.Color(REGIONS[region]?.color || '#ffffff');
  const pos = latLngToVector3(ap.lat, ap.lng, GLOBE_RADIUS + 0.003);

  dummy.position.copy(pos);
  // Scale based on flight count
  const count = airportCounts[code] || 1;
  const scale = Math.min(1 + count * 0.03, 2.5);
  dummy.scale.setScalar(scale);
  dummy.updateMatrix();

  dotMesh.setMatrixAt(i, dummy.matrix);
  dotMesh.setColorAt(i, color);
  glowMesh.setMatrixAt(i, dummy.matrix);
  glowMesh.setColorAt(i, color);

  dotPositions.push({ code, position: pos.clone(), index: i, region });
});

dotMesh.instanceMatrix.needsUpdate = true;
dotMesh.instanceColor.needsUpdate = true;
glowMesh.instanceMatrix.needsUpdate = true;
glowMesh.instanceColor.needsUpdate = true;
scene.add(dotMesh);
scene.add(glowMesh);

// ===========================
// TRIP DOTS (non-flight travel locations)
// ===========================

// Deduplicate trips by lat/lng to avoid overlapping dots
const tripLocations = [];
const tripLocSet = new Set();
TRIPS.forEach(t => {
  const key = `${t.lat.toFixed(2)},${t.lng.toFixed(2)}`;
  if (!tripLocSet.has(key)) {
    tripLocSet.add(key);
    tripLocations.push(t);
  }
});

let tripDotMesh = null;
let tripGlowMesh = null;
const tripDotPositions = [];

if (tripLocations.length > 0) {
  const tripDotGeom = new THREE.SphereGeometry(0.007, 8, 8);
  const tripDotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  tripDotMesh = new THREE.InstancedMesh(tripDotGeom, tripDotMat, tripLocations.length);

  const tripGlowGeom = new THREE.SphereGeometry(0.014, 8, 8);
  const tripGlowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
  tripGlowMesh = new THREE.InstancedMesh(tripGlowGeom, tripGlowMat, tripLocations.length);

  tripLocations.forEach((t, i) => {
    const region = getRegionByCountry(t.country, t.lat);
    const color = new THREE.Color(REGIONS[region]?.color || '#7be3ff');
    const pos = latLngToVector3(t.lat, t.lng, GLOBE_RADIUS + 0.003);

    dummy.position.copy(pos);
    dummy.scale.setScalar(1.0);
    dummy.updateMatrix();

    tripDotMesh.setMatrixAt(i, dummy.matrix);
    tripDotMesh.setColorAt(i, color);
    tripGlowMesh.setMatrixAt(i, dummy.matrix);
    tripGlowMesh.setColorAt(i, color);

    tripDotPositions.push({ city: t.city, country: t.country, date: t.date, position: pos.clone(), index: i, region, isTrip: true });
  });

  tripDotMesh.instanceMatrix.needsUpdate = true;
  tripDotMesh.instanceColor.needsUpdate = true;
  tripGlowMesh.instanceMatrix.needsUpdate = true;
  tripGlowMesh.instanceColor.needsUpdate = true;
  scene.add(tripDotMesh);
  scene.add(tripGlowMesh);
}

// ===========================
// FLIGHT ARCS
// ===========================

const arcGroup = new THREE.Group();
scene.add(arcGroup);

function createArc(fromCode, toCode, color, opacity = 0.35, lineWidth = 1) {
  const from = AIRPORTS[fromCode];
  const to = AIRPORTS[toCode];
  if (!from || !to) return null;

  const start = latLngToVector3(from.lat, from.lng, GLOBE_RADIUS + 0.004);
  const end = latLngToVector3(to.lat, to.lng, GLOBE_RADIUS + 0.004);
  const dist = start.distanceTo(end);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + 0.004 + dist * 0.25);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(48);
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Line(geom, mat);
}

// Build all arcs
const arcObjects = [];
routeMap.forEach((route, key) => {
  const fromRegion = getRegion(route.from);
  const toRegion = getRegion(route.to);
  // Use the color of the more "interesting" (non-NA) endpoint, or the from
  const region = fromRegion !== 'north-america' ? fromRegion : toRegion;
  const color = REGIONS[region]?.color || '#448aff';
  const opacity = Math.min(0.15 + route.count * 0.04, 0.6);
  const arc = createArc(route.from, route.to, color, opacity);
  if (arc) {
    arc.userData = { key, from: route.from, to: route.to, count: route.count, flights: route.flights, region };
    arcGroup.add(arc);
    arcObjects.push(arc);
  }
});

// ===========================
// COUNTRY OUTLINES (from TopoJSON)
// ===========================

async function loadCountryOutlines() {
  try {
    const topoResp = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const topo = await topoResp.json();

    // Manual TopoJSON decode
    const transform = topo.transform;
    const arcs = topo.arcs.map(arc => {
      let x = 0, y = 0;
      return arc.map(([dx, dy]) => {
        x += dx; y += dy;
        return [
          x * transform.scale[0] + transform.translate[0],
          y * transform.scale[1] + transform.translate[1]
        ];
      });
    });

    const countries = topo.objects.countries;
    const geometries = countries.geometries;

    const outlineMat = new THREE.LineBasicMaterial({
      color: 0x4a7ab8,
      transparent: true,
      opacity: 0.75,
    });

    const outlineGroup = new THREE.Group();

    function decodeRing(indices) {
      let coords = [];
      indices.forEach(idx => {
        const arcCoords = idx >= 0 ? arcs[idx] : arcs[~idx].slice().reverse();
        coords = coords.concat(arcCoords);
      });
      return coords;
    }

    geometries.forEach(geom => {
      let rings = [];
      if (geom.type === 'Polygon') {
        rings = geom.arcs.map(ring => decodeRing(ring));
      } else if (geom.type === 'MultiPolygon') {
        geom.arcs.forEach(poly => {
          poly.forEach(ring => rings.push(decodeRing(ring)));
        });
      }

      rings.forEach(coords => {
        if (coords.length < 3) return;
        const points = coords.map(([lng, lat]) =>
          latLngToVector3(lat, lng, GLOBE_RADIUS + 0.002)
        );
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        outlineGroup.add(new THREE.Line(geom, outlineMat));
      });
    });

    scene.add(outlineGroup);
  } catch (e) {
    console.warn('Could not load country outlines:', e);
  }
}

loadCountryOutlines();

// ===========================
// TOOLTIP / RAYCASTING
// ===========================

const tooltip = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
raycaster.params.Points = { threshold: 0.05 };

let hoveredAirport = null;

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Find nearest airport dot
  let closest = null;
  let closestDist = 30; // pixels

  // Check airport dots
  dotPositions.forEach(dp => {
    const screenPos = dp.position.clone().project(camera);
    const sx = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
    const dist = Math.hypot(event.clientX - sx, event.clientY - sy);

    const dotDir = dp.position.clone().normalize();
    const camDir = camera.position.clone().normalize();
    if (dotDir.dot(camDir) < -0.1) return;

    if (dist < closestDist) {
      closestDist = dist;
      closest = dp;
    }
  });

  // Check trip dots (skip ones hidden by the year filter)
  tripDotPositions.forEach(dp => {
    if (dp.visible === false) return;
    const screenPos = dp.position.clone().project(camera);
    const sx = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
    const dist = Math.hypot(event.clientX - sx, event.clientY - sy);

    const dotDir = dp.position.clone().normalize();
    const camDir = camera.position.clone().normalize();
    if (dotDir.dot(camDir) < -0.1) return;

    if (dist < closestDist) {
      closestDist = dist;
      closest = dp;
    }
  });

  if (closest) {
    const region = closest.region;
    const color = REGIONS[region]?.color || '#fff';

    let tooltipContent;
    if (closest.isTrip) {
      tooltipContent = `
        <span class="tooltip-dot" style="background:${color}"></span>
        <span class="tooltip-info">
          <span class="tooltip-city">${closest.city}</span>
          <span class="tooltip-detail">${closest.country} · trip</span>
        </span>
      `;
    } else {
      const ap = AIRPORTS[closest.code];
      const flightCount = airportCounts[closest.code] || 0;
      tooltipContent = `
        <span class="tooltip-dot" style="background:${color}"></span>
        <span class="tooltip-info">
          <span class="tooltip-city">${ap.city} (${closest.code})</span>
          <span class="tooltip-detail">${ap.country} · ${flightCount} flights</span>
        </span>
      `;
    }

    tooltip.innerHTML = tooltipContent;
    tooltip.classList.add('visible');
    tooltip.style.left = (event.clientX + 16) + 'px';
    tooltip.style.top = (event.clientY - 16) + 'px';
    canvas.style.cursor = 'pointer';
    hoveredAirport = closest;
  } else {
    tooltip.classList.remove('visible');
    canvas.style.cursor = 'grab';
    hoveredAirport = null;
  }
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseleave', () => {
  tooltip.classList.remove('visible');
  hoveredAirport = null;
});

// ===========================
// LEGEND
// ===========================

const legendToggle = document.getElementById('legend-toggle');
const legendEl = document.getElementById('legend');
const legendItems = document.getElementById('legend-items');

// Count airports per region
const regionCounts = {};
airportCodes.forEach(code => {
  const r = getRegion(code);
  regionCounts[r] = (regionCounts[r] || 0) + 1;
});

const activeRegions = new Set(Object.keys(REGIONS));

Object.entries(REGIONS).forEach(([key, { label, color }]) => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.dataset.region = key;
  item.innerHTML = `
    <span class="legend-dot" style="background:${color}"></span>
    <span>${label}</span>
    <span class="legend-count">${regionCounts[key] || 0}</span>
  `;
  item.addEventListener('click', () => {
    if (activeRegions.has(key)) {
      activeRegions.delete(key);
      item.classList.add('dimmed');
    } else {
      activeRegions.add(key);
      item.classList.remove('dimmed');
    }
    updateVisibility();
  });
  legendItems.appendChild(item);
});

legendToggle.addEventListener('click', () => {
  legendEl.classList.toggle('open');
});

// ===========================
// YEAR FILTER
// ===========================

let activeYear = 'all';

// Build year buttons dynamically from flight + trip dates so newly-added years
// (e.g. 2025, 2026) automatically appear without a code change.
function buildYearFilter() {
  const years = new Set();
  FLIGHTS.forEach(f => {
    if (f.date && f.date.length >= 4) years.add(f.date.slice(0, 4));
  });
  TRIPS.forEach(t => {
    if (t.date && t.date.length >= 4) years.add(t.date.slice(0, 4));
  });
  // Sort newest first; only keep 4-digit numeric strings
  const sortedYears = Array.from(years)
    .filter(y => /^\d{4}$/.test(y))
    .sort((a, b) => b.localeCompare(a));

  const container = document.getElementById('year-filter');
  if (!container) return;
  container.innerHTML = '';

  // Buttons (default UI on wide containers)
  const allBtn = document.createElement('button');
  allBtn.className = 'year-btn active';
  allBtn.dataset.year = 'all';
  allBtn.textContent = 'All Years';
  container.appendChild(allBtn);

  sortedYears.forEach(y => {
    const b = document.createElement('button');
    b.className = 'year-btn';
    b.dataset.year = y;
    b.textContent = y;
    container.appendChild(b);
  });

  // Dropdown (shown via CSS when .year-filter has .compact)
  const select = document.createElement('select');
  select.className = 'year-select';
  select.setAttribute('aria-label', 'Filter by year');
  const optAll = document.createElement('option');
  optAll.value = 'all';
  optAll.textContent = 'All Years';
  select.appendChild(optAll);
  sortedYears.forEach(y => {
    const o = document.createElement('option');
    o.value = y;
    o.textContent = y;
    select.appendChild(o);
  });
  select.value = activeYear;
  container.appendChild(select);

  const yearBtns = container.querySelectorAll('.year-btn');
  function setActiveYear(year) {
    activeYear = year;
    yearBtns.forEach(b => b.classList.toggle('active', b.dataset.year === year));
    if (select.value !== year) select.value = year;
    updateVisibility();
  }
  yearBtns.forEach(btn => {
    btn.addEventListener('click', () => setActiveYear(btn.dataset.year));
  });
  select.addEventListener('change', () => setActiveYear(select.value));
}
buildYearFilter();

// === Responsive layout for embedded / narrow iframes ===
// Toggles body classes and switches the year filter to a dropdown when the
// container gets too narrow for the row of year buttons.
function applyResponsiveLayout() {
  const w = window.innerWidth;
  document.body.classList.toggle('narrow', w < 720);
  document.body.classList.toggle('ultra-narrow', w < 480);

  const yearFilter = document.getElementById('year-filter');
  if (yearFilter) {
    // Switch to a dropdown when there are simply too many years to lay out
    // as buttons, or when the viewport is narrow. We avoid measuring the
    // current bounding boxes (that creates a feedback loop with the
    // ResizeObserver, since collapsing buttons shrinks the container).
    const btnCount = yearFilter.querySelectorAll('.year-btn').length;
    const compact =
      w < 480 ||                       // narrow viewport — always collapse
      (btnCount >= 6 && w < 760) ||    // many years on a small/medium screen
      btnCount >= 10;                  // a lot of years no matter the width
    yearFilter.classList.toggle('compact', compact);
  }
}
applyResponsiveLayout();
// Re-run after layout settles (year buttons just got appended) so row
// detection uses real bounding boxes, not the pre-paint state.
requestAnimationFrame(() => {
  applyResponsiveLayout();
  requestAnimationFrame(applyResponsiveLayout);
});
window.addEventListener('resize', applyResponsiveLayout);
if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(applyResponsiveLayout).observe(document.body);
  // Also observe the year filter itself — wrapping changes its height
  // without changing the body, and we want the dropdown to kick in then.
  const yfEl = document.getElementById('year-filter');
  if (yfEl) new ResizeObserver(applyResponsiveLayout).observe(yfEl);
}

// ===========================
// VISIBILITY UPDATES
// ===========================

function updateVisibility() {
  // Filter flights
  const filteredFlights = FLIGHTS.filter(f => {
    if (activeYear !== 'all' && !f.date.startsWith(activeYear)) return false;
    return true;
  });

  // Compute visible airports and routes
  const visibleAirports = new Set();
  const visibleRouteKeys = new Set();

  filteredFlights.forEach(f => {
    if (!AIRPORTS[f.from] || !AIRPORTS[f.to]) return;
    const fromRegion = getRegion(f.from);
    const toRegion = getRegion(f.to);
    if (activeRegions.has(fromRegion)) visibleAirports.add(f.from);
    if (activeRegions.has(toRegion)) visibleAirports.add(f.to);

    // Show arc if either end is in an active region
    if (activeRegions.has(fromRegion) || activeRegions.has(toRegion)) {
      visibleRouteKeys.add([f.from, f.to].sort().join('-'));
      visibleAirports.add(f.from);
      visibleAirports.add(f.to);
    }
  });

  // Update dots
  airportCodes.forEach((code, i) => {
    const region = getRegion(code);
    const visible = visibleAirports.has(code) && activeRegions.has(region);
    const color = visible ? new THREE.Color(REGIONS[region]?.color || '#fff') : new THREE.Color(0x000000);
    const scale = visible ? Math.min(1 + (airportCounts[code] || 1) * 0.03, 2.5) : 0.001;

    const pos = latLngToVector3(AIRPORTS[code].lat, AIRPORTS[code].lng, GLOBE_RADIUS + 0.003);
    dummy.position.copy(pos);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();

    dotMesh.setMatrixAt(i, dummy.matrix);
    dotMesh.setColorAt(i, color);
    glowMesh.setMatrixAt(i, dummy.matrix);
    glowMesh.setColorAt(i, color);
  });

  dotMesh.instanceMatrix.needsUpdate = true;
  dotMesh.instanceColor.needsUpdate = true;
  glowMesh.instanceMatrix.needsUpdate = true;
  glowMesh.instanceColor.needsUpdate = true;

  // Update arcs
  arcObjects.forEach(arc => {
    arc.visible = visibleRouteKeys.has(arc.userData.key);
  });

  // Update trip dots — hide ones that don't match the active year
  if (tripDotMesh) {
    tripLocations.forEach((t, i) => {
      const matches = activeYear === 'all' || (t.date && t.date.startsWith(activeYear));
      const region = getRegionByCountry(t.country, t.lat);
      const color = matches ? new THREE.Color(REGIONS[region]?.color || '#7be3ff') : new THREE.Color(0x000000);
      const scale = matches ? 1.0 : 0.001;
      const pos = latLngToVector3(t.lat, t.lng, GLOBE_RADIUS + 0.003);
      dummy.position.copy(pos);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      tripDotMesh.setMatrixAt(i, dummy.matrix);
      tripDotMesh.setColorAt(i, color);
      if (tripGlowMesh) {
        dummy.scale.setScalar(scale * 1.5);
        dummy.updateMatrix();
        tripGlowMesh.setMatrixAt(i, dummy.matrix);
      }
      // Mark hover/click hit-test data so hidden trips can't be selected
      if (tripDotPositions[i]) tripDotPositions[i].visible = matches;
    });
    tripDotMesh.instanceMatrix.needsUpdate = true;
    if (tripDotMesh.instanceColor) tripDotMesh.instanceColor.needsUpdate = true;
    if (tripGlowMesh) tripGlowMesh.instanceMatrix.needsUpdate = true;
  }

  // Update stats
  updateStats(filteredFlights);
}

function updateStats(flights) {
  const airports = new Set();
  const airlines = new Set();
  let totalDist = 0;
  const continents = new Set();
  // Cities and countries are deduped by lowercased name (so "Paris" and "paris" only count once)
  const cities = new Set();
  const countries = new Set();

  flights.forEach(f => {
    airports.add(f.from);
    airports.add(f.to);
    airlines.add(f.airline);
    totalDist += f.dist || 0;
    [f.from, f.to].forEach(code => {
      if (AIRPORTS[code]) {
        const r = getRegion(code);
        if (r !== 'other') continents.add(r);
        const cityName = AIRPORTS[code].city;
        if (cityName) cities.add(cityName.trim().toLowerCase());
        const countryName = AIRPORTS[code].country;
        if (countryName) countries.add(countryName.trim().toLowerCase());
      }
    });
  });

  // Count trips matching current year filter
  const filteredTrips = TRIPS.filter(t => {
    if (activeYear !== 'all' && t.date && !t.date.startsWith(activeYear)) return false;
    return true;
  });

  // Add trip cities, countries & regions; sum trip miles when 'from' coords are present
  let tripMiles = 0;
  filteredTrips.forEach(t => {
    const r = getRegionByCountry(t.country, t.lat);
    if (r !== 'other') continents.add(r);
    if (t.city) cities.add(t.city.trim().toLowerCase());
    if (t.country) countries.add(t.country.trim().toLowerCase());
    if (t.tripMiles && Number.isFinite(t.tripMiles)) {
      tripMiles += t.tripMiles;
    } else if (t.fromLat != null && t.fromLng != null && t.lat != null && t.lng != null) {
      tripMiles += haversineMiles(t.fromLat, t.fromLng, t.lat, t.lng);
    }
  });

  document.querySelectorAll('#globe-view .stat-number').forEach(el => {
    const format = el.dataset.format;
    const label = el.closest('.stat')?.querySelector('.stat-label')?.textContent;
    let target;
    if (format === 'miles') target = totalDist;
    else if (format === 'trip-miles') target = Math.round(tripMiles);
    else if (label === 'Flights') target = flights.length;
    else if (label === 'Airports') target = airports.size;
    else if (label === 'Airlines') target = airlines.size;
    else if (label === 'Continents') target = continents.size;
    else if (label === 'Countries') target = countries.size;
    else if (label === 'Cities Visited') target = cities.size;
    else return;

    animateNumber(el, target, format === 'miles' || format === 'trip-miles');
  });
}

// Great-circle distance in miles between two lat/lng points
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.7613; // Earth radius in miles
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ===========================
// ANIMATE NUMBERS
// ===========================

function animateNumber(el, target, isMiles = false) {
  const current = parseInt(el.textContent.replace(/,/g, '')) || 0;
  if (current === target) return;

  const duration = 800;
  const start = performance.now();
  const startVal = current;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.round(startVal + (target - startVal) * ease);
    el.textContent = isMiles ? val.toLocaleString() : val.toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Initial stats from loaded data
setTimeout(() => {
  updateStats(FLIGHTS);
}, 300);

// ===========================
// ANIMATE
// ===========================

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Pulse glow
  const pulse = 0.3 + Math.sin(performance.now() * 0.002) * 0.1;
  glowMat.opacity = pulse;

  updateCountryLabels();
  renderer.render(scene, camera);
}

animate();

// ===========================
// RESIZE
// ===========================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

})();
