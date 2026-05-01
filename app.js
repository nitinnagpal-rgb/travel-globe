import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===========================
// DATA (loaded dynamically)
// ===========================

async function loadData() {
  const response = await fetch('./data.json');
  return response.json();
}

(async function init() {
  const DATA = await loadData();
  const AIRPORTS = DATA.airports;
  const FLIGHTS = DATA.flights;
  const TRIPS = DATA.trips || [];

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
renderer.setClearColor(0x06070d);

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
  color: 0x0a0e1a,
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
const atmosMat = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(0.15, 0.3, 0.5, 1.0) * intensity * 0.6;
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
});
scene.add(new THREE.Mesh(atmosGeom, atmosMat));

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

    tripDotPositions.push({ city: t.city, country: t.country, position: pos.clone(), index: i, region, isTrip: true });
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
      color: 0x1a3050,
      transparent: true,
      opacity: 0.5,
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

  // Check trip dots
  tripDotPositions.forEach(dp => {
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
const yearBtns = document.querySelectorAll('.year-btn');

yearBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    yearBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeYear = btn.dataset.year;
    updateVisibility();
  });
});

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

  // Update stats
  updateStats(filteredFlights);
}

function updateStats(flights) {
  const airports = new Set();
  const airlines = new Set();
  let totalDist = 0;
  const continents = new Set();

  flights.forEach(f => {
    airports.add(f.from);
    airports.add(f.to);
    airlines.add(f.airline);
    totalDist += f.dist || 0;
    [f.from, f.to].forEach(code => {
      if (AIRPORTS[code]) {
        const r = getRegion(code);
        if (r !== 'other') continents.add(r);
      }
    });
  });

  // Count trips matching current year filter
  const filteredTrips = TRIPS.filter(t => {
    if (activeYear !== 'all' && t.date && !t.date.startsWith(activeYear)) return false;
    return true;
  });

  // Add trip regions to continents
  filteredTrips.forEach(t => {
    const r = getRegionByCountry(t.country, t.lat);
    if (r !== 'other') continents.add(r);
  });

  document.querySelectorAll('#globe-view .stat-number').forEach(el => {
    const format = el.dataset.format;
    const label = el.closest('.stat')?.querySelector('.stat-label')?.textContent;
    let target;
    if (format === 'miles') target = totalDist;
    else if (label === 'Flights') target = flights.length;
    else if (label === 'Airports') target = airports.size;
    else if (label === 'Airlines') target = airlines.size;
    else if (label === 'Continents') target = continents.size;
    else if (label === 'Trips') target = filteredTrips.length;
    else return;

    animateNumber(el, target, format === 'miles');
  });
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
