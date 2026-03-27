import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================================
// TRAVEL DATA — All geocoded locations
// ============================================================

const REGIONS = {
  antarctica: { name: 'Antarctica', color: '#00e5ff', cities: [] },
  southAmerica: { name: 'South America', color: '#ff6b35', cities: [] },
  europe: { name: 'Europe', color: '#ffd700', cities: [] },
  asia: { name: 'Asia', color: '#ff4081', cities: [] },
  oceania: { name: 'Oceania', color: '#76ff03', cities: [] },
  northAmerica: { name: 'North America', color: '#448aff', cities: [] },
};

// Helper to add a city
function c(region, name, lat, lng) {
  REGIONS[region].cities.push({ name, lat, lng });
}

// --- Antarctica Expedition ---
c('antarctica', 'Neko Harbor, Antarctica', -64.8389, -62.5339);
c('antarctica', 'Paradise Bay, Antarctica', -64.8133, -62.8744);
c('antarctica', 'Deception Island, Antarctica', -62.9533, -60.5883);
c('antarctica', 'Port Lockroy, Antarctica', -64.8239, -63.4942);
c('antarctica', 'Lemaire Channel, Antarctica', -65.0547, -63.9478);
c('antarctica', 'Cuverville Island, Antarctica', -64.6833, -62.6333);
c('antarctica', 'Danco Island, Antarctica', -64.7317, -62.6000);
c('antarctica', 'Half Moon Island, Antarctica', -62.5933, -59.9217);
c('antarctica', 'Ushuaia, Argentina', -54.8019, -68.3030);
c('antarctica', 'Drake Passage', -59.0, -64.0);

// --- South America ---
c('southAmerica', 'Machu Picchu, Peru', -13.1631, -72.5450);
c('southAmerica', 'Cusco, Peru', -13.5320, -71.9675);
c('southAmerica', 'Buenos Aires, Argentina', -34.6037, -58.3816);
c('southAmerica', 'Panama City, Panama', 8.9824, -79.5199);

// --- Europe ---
// United Kingdom
c('europe', 'London, UK', 51.5074, -0.1278);
c('europe', 'Edinburgh, UK', 55.9533, -3.1883);
c('europe', 'Oxford, UK', 51.7520, -1.2577);
c('europe', 'Cambridge, UK', 52.2053, 0.1218);

// Scandinavia
c('europe', 'Stockholm, Sweden', 59.3293, 18.0686);
c('europe', 'Copenhagen, Denmark', 55.6761, 12.5683);
c('europe', 'Oslo, Norway', 59.9139, 10.7522);
c('europe', 'Helsinki, Finland', 60.1699, 24.9384);

// Western Europe
c('europe', 'Paris, France', 48.8566, 2.3522);
c('europe', 'Amsterdam, Netherlands', 52.3676, 4.9041);
c('europe', 'Brussels, Belgium', 50.8503, 4.3517);
c('europe', 'Zurich, Switzerland', 47.3769, 8.5417);
c('europe', 'Geneva, Switzerland', 46.2044, 6.1432);
c('europe', 'Barcelona, Spain', 41.3874, 2.1686);
c('europe', 'Madrid, Spain', 40.4168, -3.7038);
c('europe', 'Rome, Italy', 41.9028, 12.4964);
c('europe', 'Florence, Italy', 43.7696, 11.2558);
c('europe', 'Venice, Italy', 45.4408, 12.3155);
c('europe', 'Milan, Italy', 45.4642, 9.1900);
c('europe', 'Munich, Germany', 48.1351, 11.5820);
c('europe', 'Berlin, Germany', 52.5200, 13.4050);
c('europe', 'Frankfurt, Germany', 50.1109, 8.6821);
c('europe', 'Vienna, Austria', 48.2082, 16.3738);

// Eastern Europe
c('europe', 'Prague, Czech Republic', 50.0755, 14.4378);
c('europe', 'Budapest, Hungary', 47.4979, 19.0402);
c('europe', 'Dubrovnik, Croatia', 42.6507, 18.0944);

// --- Asia ---
// India
c('asia', 'New Delhi, India', 28.6139, 77.2090);
c('asia', 'Mumbai, India', 19.0760, 72.8777);
c('asia', 'Bangalore, India', 12.9716, 77.5946);
c('asia', 'Hyderabad, India', 17.3850, 78.4867);
c('asia', 'Chennai, India', 13.0827, 80.2707);
c('asia', 'Kolkata, India', 22.5726, 88.3639);
c('asia', 'Pune, India', 18.5204, 73.8567);
c('asia', 'Ahmedabad, India', 23.0225, 72.5714);
c('asia', 'Jaipur, India', 26.9124, 75.7873);
c('asia', 'Udaipur, India', 24.5854, 73.7125);
c('asia', 'Jodhpur, India', 26.2389, 73.0243);
c('asia', 'Agra, India', 27.1767, 78.0081);
c('asia', 'Varanasi, India', 25.3176, 83.0068);
c('asia', 'Lucknow, India', 26.8467, 80.9462);
c('asia', 'Chandigarh, India', 30.7333, 76.7794);
c('asia', 'Amritsar, India', 31.6340, 74.8723);
c('asia', 'Shimla, India', 31.1048, 77.1734);
c('asia', 'Manali, India', 32.2396, 77.1887);
c('asia', 'Dehradun, India', 30.3165, 78.0322);
c('asia', 'Rishikesh, India', 30.0869, 78.2676);
c('asia', 'Goa, India', 15.2993, 74.1240);
c('asia', 'Kochi, India', 9.9312, 76.2673);
c('asia', 'Mysore, India', 12.2958, 76.6394);
c('asia', 'Coorg, India', 12.3375, 75.8069);
c('asia', 'Ooty, India', 11.4102, 76.6950);
c('asia', 'Darjeeling, India', 27.0360, 88.2627);
c('asia', 'Gangtok, India', 27.3389, 88.6065);
c('asia', 'Srinagar, India', 34.0837, 74.7973);
c('asia', 'Leh, India', 34.1526, 77.5771);
c('asia', 'Bhopal, India', 23.2599, 77.4126);
c('asia', 'Indore, India', 22.7196, 75.8577);
c('asia', 'Nagpur, India', 21.1458, 79.0882);
c('asia', 'Ranchi, India', 23.3441, 85.3096);
c('asia', 'Patna, India', 25.6093, 85.1376);
c('asia', 'Guwahati, India', 26.1445, 91.7362);
c('asia', 'Thiruvananthapuram, India', 8.5241, 76.9366);
c('asia', 'Visakhapatnam, India', 17.6868, 83.2185);

// Japan
c('asia', 'Tokyo, Japan', 35.6762, 139.6503);
c('asia', 'Kyoto, Japan', 35.0116, 135.7681);
c('asia', 'Osaka, Japan', 34.6937, 135.5023);

// South Korea
c('asia', 'Seoul, South Korea', 37.5665, 126.9780);

// Southeast Asia
c('asia', 'Singapore', 1.3521, 103.8198);
c('asia', 'Bangkok, Thailand', 13.7563, 100.5018);
c('asia', 'Phuket, Thailand', 7.8804, 98.3923);
c('asia', 'Chiang Mai, Thailand', 18.7883, 98.9853);

// Nepal
c('asia', 'Kathmandu, Nepal', 27.7172, 85.3240);

// UAE
c('asia', 'Dubai, UAE', 25.2048, 55.2708);
c('asia', 'Abu Dhabi, UAE', 24.4539, 54.3773);

// --- Oceania ---
c('oceania', 'Queenstown, New Zealand', -45.0312, 168.6626);
c('oceania', 'Auckland, New Zealand', -36.8485, 174.7633);
c('oceania', 'Sydney, Australia', -33.8688, 151.2093);
c('oceania', 'Melbourne, Australia', -37.8136, 144.9631);

// --- North America ---
// United States
c('northAmerica', 'San Francisco, CA', 37.7749, -122.4194);
c('northAmerica', 'San Jose, CA', 37.3382, -121.8863);
c('northAmerica', 'Los Angeles, CA', 34.0522, -118.2437);
c('northAmerica', 'San Diego, CA', 32.7157, -117.1611);
c('northAmerica', 'Seattle, WA', 47.6062, -122.3321);
c('northAmerica', 'Portland, OR', 45.5155, -122.6789);
c('northAmerica', 'Las Vegas, NV', 36.1699, -115.1398);
c('northAmerica', 'Phoenix, AZ', 33.4484, -112.0740);
c('northAmerica', 'Denver, CO', 39.7392, -104.9903);
c('northAmerica', 'Salt Lake City, UT', 40.7608, -111.8910);
c('northAmerica', 'Chicago, IL', 41.8781, -87.6298);
c('northAmerica', 'New York, NY', 40.7128, -74.0060);
c('northAmerica', 'Boston, MA', 42.3601, -71.0589);
c('northAmerica', 'Washington DC', 38.9072, -77.0369);
c('northAmerica', 'Philadelphia, PA', 39.9526, -75.1652);
c('northAmerica', 'Miami, FL', 25.7617, -80.1918);
c('northAmerica', 'Orlando, FL', 28.5383, -81.3792);
c('northAmerica', 'Atlanta, GA', 33.7490, -84.3880);
c('northAmerica', 'Dallas, TX', 32.7767, -96.7970);
c('northAmerica', 'Houston, TX', 29.7604, -95.3698);
c('northAmerica', 'Austin, TX', 30.2672, -97.7431);
c('northAmerica', 'Nashville, TN', 36.1627, -86.7816);
c('northAmerica', 'New Orleans, LA', 29.9511, -90.0715);
c('northAmerica', 'Minneapolis, MN', 44.9778, -93.2650);
c('northAmerica', 'Detroit, MI', 42.3314, -83.0458);
c('northAmerica', 'Cleveland, OH', 41.4993, -81.6944);
c('northAmerica', 'Pittsburgh, PA', 40.4406, -79.9959);
c('northAmerica', 'Charlotte, NC', 35.2271, -80.8431);
c('northAmerica', 'Raleigh, NC', 35.7796, -78.6382);
c('northAmerica', 'Honolulu, HI', 21.3069, -157.8583);

// Canada
c('northAmerica', 'Whistler, BC', 50.1163, -122.9574);
c('northAmerica', 'Vancouver, BC', 49.2827, -123.1207);
c('northAmerica', 'Toronto, ON', 43.6532, -79.3832);

// Mexico
c('northAmerica', 'Cancun, Mexico', 21.1619, -86.8515);
c('northAmerica', 'Mexico City, Mexico', 19.4326, -99.1332);


// ============================================================
// THREE.JS SCENE SETUP
// ============================================================

const GLOBE_RADIUS = 5;
const PIN_HEIGHT = 0.04;
const ARC_SEGMENTS = 64;

let scene, camera, renderer, controls;
let globeMesh, atmosphereMesh;
let pinInstancedMesh;
let arcGroup;
let raycaster, mouse;
let pinData = [];   // { position: Vector3, regionKey, cityName, color }
let regionVisibility = {};
let isInteracting = false;
let hoverIndex = -1;

// Collect all cities flat
function getAllCities() {
  const all = [];
  for (const [key, region] of Object.entries(REGIONS)) {
    for (const city of region.cities) {
      all.push({ ...city, regionKey: key, color: region.color, regionName: region.name });
    }
  }
  return all;
}

// Lat/lng to 3D position on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Initialize the scene
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a);

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 14);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.getElementById('globe-container').appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 7;
  controls.maxDistance = 25;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;

  controls.addEventListener('start', () => { isInteracting = true; });
  controls.addEventListener('end', () => { isInteracting = false; });

  // Raycaster
  raycaster = new THREE.Raycaster();
  raycaster.params.Points = { threshold: 0.3 };
  mouse = new THREE.Vector2(-999, -999);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x334466, 1.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xaabbff, 1.2);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  const backLight = new THREE.DirectionalLight(0x6644aa, 0.4);
  backLight.position.set(-5, -2, -5);
  scene.add(backLight);

  // Build the globe
  createGlobe();
  createAtmosphere();
  createStarField();
  createPins();
  createArcs();
  setupLegend();

  // Events
  window.addEventListener('resize', onResize);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('click', onMouseClick);
  renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });

  // Hide loader
  document.getElementById('loader').classList.add('hidden');

  // Start animation
  animate();
}

// ============================================================
// GLOBE CREATION — Programmatic dark globe with grid
// ============================================================

function createGlobe() {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 64);

  // Custom shader for a dark globe with latitude/longitude lines
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x0d1025) },
      uGridColor: { value: new THREE.Color(0x1a2040) },
      uCoastColor: { value: new THREE.Color(0x2a3570) },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uGridColor;
      uniform vec3 uCoastColor;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        // Base color
        vec3 color = uColor;

        // Compute lat/lng from position
        float radius = length(vPosition);
        float lat = asin(vPosition.y / radius);
        float lng = atan(vPosition.z, vPosition.x);

        // Latitude lines every 15 degrees
        float latDeg = lat * 57.2958;
        float latLine = abs(fract(latDeg / 15.0 + 0.5) - 0.5) * 2.0;
        float latGrid = 1.0 - smoothstep(0.0, 0.06, latLine);

        // Longitude lines every 15 degrees
        float lngDeg = lng * 57.2958;
        float lngLine = abs(fract(lngDeg / 15.0 + 0.5) - 0.5) * 2.0;
        float lngGrid = 1.0 - smoothstep(0.0, 0.06, lngLine);

        // Equator and prime meridian (slightly brighter)
        float eqLine = 1.0 - smoothstep(0.0, 0.02, abs(latDeg));
        float pmLine = 1.0 - smoothstep(0.0, 0.02, abs(lngDeg));

        float grid = max(latGrid, lngGrid) * 0.4 + max(eqLine, pmLine) * 0.2;

        color = mix(color, uGridColor, grid);

        // Fresnel edge glow
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
        color += uCoastColor * fresnel * 0.3;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  globeMesh = new THREE.Mesh(geometry, material);
  scene.add(globeMesh);

  // Add wireframe overlay for extra detail
  const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.005, 48, 24);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x1a2050,
    wireframe: true,
    transparent: true,
    opacity: 0.05,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireMesh);
}

function createAtmosphere() {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.02, 64, 32);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x4488ff) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float intensity = pow(1.0 - dot(vNormal, vViewDir), 3.0);
        gl_FragColor = vec4(uColor, intensity * 0.15);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
  });

  atmosphereMesh = new THREE.Mesh(geometry, material);
  scene.add(atmosphereMesh);
}

function createStarField() {
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const r = 50 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = Math.random() * 1.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      varying float vSize;
      uniform float uTime;
      void main() {
        vSize = size;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying float vSize;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, dist) * 0.8;
        gl_FragColor = vec4(0.85, 0.88, 1.0, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

// ============================================================
// PINS — InstancedMesh for performance
// ============================================================

function createPins() {
  const allCities = getAllCities();
  const count = allCities.length;

  // Pin geometry — small sphere
  const pinGeo = new THREE.SphereGeometry(PIN_HEIGHT, 8, 6);
  const pinMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    depthTest: true,
  });

  pinInstancedMesh = new THREE.InstancedMesh(pinGeo, pinMat, count);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  pinData = [];

  allCities.forEach((city, i) => {
    const pos = latLngToVector3(city.lat, city.lng, GLOBE_RADIUS + 0.03);
    dummy.position.copy(pos);
    dummy.lookAt(0, 0, 0);
    dummy.updateMatrix();
    pinInstancedMesh.setMatrixAt(i, dummy.matrix);

    color.set(city.color);
    pinInstancedMesh.setColorAt(i, color);

    pinData.push({
      position: pos,
      regionKey: city.regionKey,
      cityName: city.name,
      color: city.color,
      regionName: city.regionName,
    });
  });

  pinInstancedMesh.instanceMatrix.needsUpdate = true;
  pinInstancedMesh.instanceColor.needsUpdate = true;
  scene.add(pinInstancedMesh);

  // Glow sprites for each pin
  createPinGlows(allCities);
}

function createPinGlows(allCities) {
  // Use a second InstancedMesh with additive blending for the glow
  const glowGeo = new THREE.SphereGeometry(PIN_HEIGHT * 2.5, 8, 6);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const glowMesh = new THREE.InstancedMesh(glowGeo, glowMat, allCities.length);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  allCities.forEach((city, i) => {
    const pos = latLngToVector3(city.lat, city.lng, GLOBE_RADIUS + 0.03);
    dummy.position.copy(pos);
    dummy.updateMatrix();
    glowMesh.setMatrixAt(i, dummy.matrix);
    color.set(city.color);
    glowMesh.setColorAt(i, color);
  });

  glowMesh.instanceMatrix.needsUpdate = true;
  glowMesh.instanceColor.needsUpdate = true;
  glowMesh.name = 'pinGlows';
  scene.add(glowMesh);
}

// ============================================================
// ARCS — Great-circle flight routes
// ============================================================

function createArcs() {
  arcGroup = new THREE.Group();
  arcGroup.name = 'arcs';
  scene.add(arcGroup);

  // Define route connections per region
  const regionRoutes = {
    antarctica: [
      ['Ushuaia, Argentina', 'Drake Passage'],
      ['Drake Passage', 'Half Moon Island, Antarctica'],
      ['Half Moon Island, Antarctica', 'Deception Island, Antarctica'],
      ['Deception Island, Antarctica', 'Cuverville Island, Antarctica'],
      ['Cuverville Island, Antarctica', 'Danco Island, Antarctica'],
      ['Danco Island, Antarctica', 'Neko Harbor, Antarctica'],
      ['Neko Harbor, Antarctica', 'Paradise Bay, Antarctica'],
      ['Paradise Bay, Antarctica', 'Lemaire Channel, Antarctica'],
      ['Lemaire Channel, Antarctica', 'Port Lockroy, Antarctica'],
    ],
    southAmerica: [
      ['Cusco, Peru', 'Machu Picchu, Peru'],
      ['Buenos Aires, Argentina', 'Cusco, Peru'],
    ],
    europe: [
      ['London, UK', 'Paris, France'],
      ['Paris, France', 'Amsterdam, Netherlands'],
      ['Amsterdam, Netherlands', 'Brussels, Belgium'],
      ['Brussels, Belgium', 'Frankfurt, Germany'],
      ['Frankfurt, Germany', 'Munich, Germany'],
      ['Munich, Germany', 'Zurich, Switzerland'],
      ['Zurich, Switzerland', 'Geneva, Switzerland'],
      ['Geneva, Switzerland', 'Milan, Italy'],
      ['Milan, Italy', 'Venice, Italy'],
      ['Venice, Italy', 'Florence, Italy'],
      ['Florence, Italy', 'Rome, Italy'],
      ['London, UK', 'Edinburgh, UK'],
      ['London, UK', 'Oxford, UK'],
      ['London, UK', 'Cambridge, UK'],
      ['Stockholm, Sweden', 'Copenhagen, Denmark'],
      ['Copenhagen, Denmark', 'Oslo, Norway'],
      ['Oslo, Norway', 'Helsinki, Finland'],
      ['Berlin, Germany', 'Prague, Czech Republic'],
      ['Prague, Czech Republic', 'Vienna, Austria'],
      ['Vienna, Austria', 'Budapest, Hungary'],
      ['Budapest, Hungary', 'Dubrovnik, Croatia'],
      ['Madrid, Spain', 'Barcelona, Spain'],
    ],
    asia: [
      ['New Delhi, India', 'Agra, India'],
      ['New Delhi, India', 'Jaipur, India'],
      ['Jaipur, India', 'Udaipur, India'],
      ['Udaipur, India', 'Jodhpur, India'],
      ['New Delhi, India', 'Chandigarh, India'],
      ['Chandigarh, India', 'Shimla, India'],
      ['Shimla, India', 'Manali, India'],
      ['New Delhi, India', 'Mumbai, India'],
      ['Mumbai, India', 'Pune, India'],
      ['Mumbai, India', 'Goa, India'],
      ['Goa, India', 'Kochi, India'],
      ['Kochi, India', 'Thiruvananthapuram, India'],
      ['Bangalore, India', 'Mysore, India'],
      ['Mysore, India', 'Coorg, India'],
      ['Bangalore, India', 'Chennai, India'],
      ['Chennai, India', 'Hyderabad, India'],
      ['Kolkata, India', 'Darjeeling, India'],
      ['Darjeeling, India', 'Gangtok, India'],
      ['New Delhi, India', 'Srinagar, India'],
      ['Srinagar, India', 'Leh, India'],
      ['Tokyo, Japan', 'Kyoto, Japan'],
      ['Kyoto, Japan', 'Osaka, Japan'],
      ['Seoul, South Korea', 'Tokyo, Japan'],
      ['Singapore', 'Bangkok, Thailand'],
      ['Bangkok, Thailand', 'Chiang Mai, Thailand'],
      ['Bangkok, Thailand', 'Phuket, Thailand'],
      ['New Delhi, India', 'Kathmandu, Nepal'],
      ['Dubai, UAE', 'Abu Dhabi, UAE'],
      ['New Delhi, India', 'Dubai, UAE'],
    ],
    oceania: [
      ['Auckland, New Zealand', 'Queenstown, New Zealand'],
      ['Sydney, Australia', 'Melbourne, Australia'],
    ],
    northAmerica: [
      ['San Francisco, CA', 'San Jose, CA'],
      ['San Jose, CA', 'Los Angeles, CA'],
      ['Los Angeles, CA', 'San Diego, CA'],
      ['San Francisco, CA', 'Seattle, WA'],
      ['Seattle, WA', 'Portland, OR'],
      ['San Francisco, CA', 'Las Vegas, NV'],
      ['Las Vegas, NV', 'Phoenix, AZ'],
      ['Denver, CO', 'Salt Lake City, UT'],
      ['Chicago, IL', 'Minneapolis, MN'],
      ['Chicago, IL', 'Detroit, MI'],
      ['New York, NY', 'Boston, MA'],
      ['New York, NY', 'Philadelphia, PA'],
      ['Philadelphia, PA', 'Washington DC'],
      ['Washington DC', 'Charlotte, NC'],
      ['Charlotte, NC', 'Raleigh, NC'],
      ['Atlanta, GA', 'Nashville, TN'],
      ['Miami, FL', 'Orlando, FL'],
      ['Dallas, TX', 'Houston, TX'],
      ['Houston, TX', 'Austin, TX'],
      ['Austin, TX', 'New Orleans, LA'],
      ['Vancouver, BC', 'Whistler, BC'],
      ['Vancouver, BC', 'Seattle, WA'],
      ['Toronto, ON', 'New York, NY'],
      ['Cancun, Mexico', 'Mexico City, Mexico'],
      ['Cleveland, OH', 'Pittsburgh, PA'],
    ],
  };

  // Build a city lookup map
  const cityLookup = {};
  for (const [key, region] of Object.entries(REGIONS)) {
    for (const city of region.cities) {
      cityLookup[city.name] = { lat: city.lat, lng: city.lng };
    }
  }

  // Create arc lines
  for (const [regionKey, routes] of Object.entries(regionRoutes)) {
    const regionColor = REGIONS[regionKey].color;

    for (const [fromName, toName] of routes) {
      const from = cityLookup[fromName];
      const to = cityLookup[toName];
      if (!from || !to) continue;

      const arc = createArcLine(from, to, regionColor, regionKey);
      if (arc) arcGroup.add(arc);
    }
  }
}

function createArcLine(from, to, colorHex, regionKey) {
  const start = latLngToVector3(from.lat, from.lng, GLOBE_RADIUS);
  const end = latLngToVector3(to.lat, to.lng, GLOBE_RADIUS);

  // Calculate distance for arc height
  const dist = start.distanceTo(end);
  const midHeight = GLOBE_RADIUS + dist * 0.15 + 0.1;

  // Mid point
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(midHeight);

  // Create quadratic bezier curve
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(ARC_SEGMENTS);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.25,
    depthTest: true,
    linewidth: 1,
  });

  const line = new THREE.Line(geometry, material);
  line.userData.regionKey = regionKey;
  return line;
}

// ============================================================
// LEGEND
// ============================================================

function setupLegend() {
  const legendItems = document.getElementById('legend-items');

  for (const [key, region] of Object.entries(REGIONS)) {
    regionVisibility[key] = true;

    const item = document.createElement('div');
    item.className = 'legend-item';
    item.dataset.region = key;
    item.innerHTML = `
      <div class="legend-dot" style="background: ${region.color}; color: ${region.color};"></div>
      <span class="legend-label">${region.name}</span>
      <span class="legend-count">${region.cities.length}</span>
    `;
    item.addEventListener('click', () => toggleRegion(key, item));
    legendItems.appendChild(item);
  }

  // Toggle legend collapse
  document.getElementById('legend-toggle').addEventListener('click', () => {
    document.getElementById('legend').classList.toggle('collapsed');
  });
}

function toggleRegion(key, item) {
  regionVisibility[key] = !regionVisibility[key];
  item.classList.toggle('inactive');
  updateVisibility();
}

function updateVisibility() {
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  // Update pin visibility
  pinData.forEach((pin, i) => {
    const visible = regionVisibility[pin.regionKey];
    const pos = visible ? pin.position : new THREE.Vector3(0, 0, 0);
    const scale = visible ? 1 : 0;

    dummy.position.copy(pos);
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    pinInstancedMesh.setMatrixAt(i, dummy.matrix);

    color.set(pin.color);
    pinInstancedMesh.setColorAt(i, color);
  });
  pinInstancedMesh.instanceMatrix.needsUpdate = true;
  pinInstancedMesh.instanceColor.needsUpdate = true;

  // Update glow visibility
  const glowMesh = scene.getObjectByName('pinGlows');
  if (glowMesh) {
    pinData.forEach((pin, i) => {
      const visible = regionVisibility[pin.regionKey];
      const pos = visible ? pin.position : new THREE.Vector3(0, 0, 0);
      const scale = visible ? 1 : 0;

      dummy.position.copy(pos);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      glowMesh.setMatrixAt(i, dummy.matrix);
    });
    glowMesh.instanceMatrix.needsUpdate = true;
  }

  // Update arc visibility
  arcGroup.children.forEach(arc => {
    arc.visible = regionVisibility[arc.userData.regionKey];
  });
}

// ============================================================
// INTERACTION — Hover & Tooltip
// ============================================================

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  checkHover(event.clientX, event.clientY);
}

function onMouseClick(event) {
  // Click also shows tooltip for touch-like interaction
  checkHover(event.clientX, event.clientY);
}

function onTouchStart(event) {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    checkHover(touch.clientX, touch.clientY);
  }
}

const _projected = new THREE.Vector3();

function checkHover(clientX, clientY) {
  raycaster.setFromCamera(mouse, camera);

  // Screen-space hit detection for better accuracy
  let closest = -1;
  let closestDist = Infinity;
  const screenThreshold = 15; // pixels

  for (let i = 0; i < pinData.length; i++) {
    if (!regionVisibility[pinData[i].regionKey]) continue;

    // Check that the pin is facing the camera (not behind globe)
    const dotProduct = pinData[i].position.clone().normalize().dot(
      camera.position.clone().normalize()
    );
    if (dotProduct < 0.05) continue;

    // Project pin to screen space
    _projected.copy(pinData[i].position);
    _projected.project(camera);

    const sx = (_projected.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-_projected.y * 0.5 + 0.5) * window.innerHeight;

    const dx = clientX - sx;
    const dy = clientY - sy;
    const screenDist = Math.sqrt(dx * dx + dy * dy);

    if (screenDist < screenThreshold && screenDist < closestDist) {
      closestDist = screenDist;
      closest = i;
    }
  }

  const tooltip = document.getElementById('tooltip');

  if (closest !== -1) {
    const pin = pinData[closest];
    tooltip.innerHTML = `<span class="tooltip-dot" style="background: ${pin.color};"></span>${pin.cityName}`;
    tooltip.style.left = clientX + 'px';
    tooltip.style.top = clientY + 'px';
    tooltip.classList.add('visible');
    renderer.domElement.style.cursor = 'pointer';
    hoverIndex = closest;
  } else {
    tooltip.classList.remove('visible');
    renderer.domElement.style.cursor = 'grab';
    hoverIndex = -1;
  }
}

// ============================================================
// RESIZE
// ============================================================

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================================
// ANIMATION LOOP
// ============================================================

let startTime = performance.now() / 1000;

function animate() {
  requestAnimationFrame(animate);

  const elapsed = performance.now() / 1000 - startTime;

  // Update controls
  controls.update();

  // Gentle pulse for pin glow
  const glowMesh = scene.getObjectByName('pinGlows');
  if (glowMesh) {
    glowMesh.material.opacity = 0.12 + Math.sin(elapsed * 2) * 0.04;
  }

  renderer.render(scene, camera);
}

// ============================================================
// COUNTRY OUTLINES via GeoJSON
// ============================================================

async function loadCountryOutlines() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const data = await response.json();

    // TopoJSON to GeoJSON conversion (simple)
    const countries = topojsonFeature(data, data.objects.countries);

    const material = new THREE.LineBasicMaterial({
      color: 0x1e2d60,
      transparent: true,
      opacity: 0.5,
    });

    const outlineGroup = new THREE.Group();
    outlineGroup.name = 'countryOutlines';

    for (const feature of countries.features) {
      const geometries = feature.geometry.type === 'Polygon'
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

      for (const polygon of geometries) {
        for (const ring of polygon) {
          const points = [];
          for (let i = 0; i < ring.length; i++) {
            const [lng, lat] = ring[i];
            points.push(latLngToVector3(lat, lng, GLOBE_RADIUS + 0.01));
          }
          if (points.length > 1) {
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            outlineGroup.add(line);
          }
        }
      }
    }

    scene.add(outlineGroup);
  } catch (err) {
    console.warn('Could not load country outlines:', err);
  }
}

// Minimal TopoJSON to GeoJSON converter
function topojsonFeature(topology, object) {
  const features = [];
  const arcs = topology.arcs;
  const transform = topology.transform;

  function decodeArc(arcIndex) {
    const reverse = arcIndex < 0;
    const arc = arcs[reverse ? ~arcIndex : arcIndex];
    const decoded = [];
    let x = 0, y = 0;

    for (const point of arc) {
      x += point[0];
      y += point[1];
      decoded.push([
        x * transform.scale[0] + transform.translate[0],
        y * transform.scale[1] + transform.translate[1]
      ]);
    }

    if (reverse) decoded.reverse();
    return decoded;
  }

  function decodeRing(arcIndices) {
    const ring = [];
    for (const arcIndex of arcIndices) {
      const decoded = decodeArc(arcIndex);
      // Skip first point of subsequent arcs to avoid duplication
      for (let i = ring.length > 0 ? 1 : 0; i < decoded.length; i++) {
        ring.push(decoded[i]);
      }
    }
    return ring;
  }

  function decodePolygon(arcsArray) {
    return arcsArray.map(ring => decodeRing(ring));
  }

  for (const geom of object.geometries) {
    let coordinates;

    if (geom.type === 'Polygon') {
      coordinates = decodePolygon(geom.arcs);
      features.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates },
        properties: geom.properties || {}
      });
    } else if (geom.type === 'MultiPolygon') {
      coordinates = geom.arcs.map(polygon => decodePolygon(polygon));
      features.push({
        type: 'Feature',
        geometry: { type: 'MultiPolygon', coordinates },
        properties: geom.properties || {}
      });
    }
  }

  return { type: 'FeatureCollection', features };
}

// ============================================================
// BOOT
// ============================================================

init();
loadCountryOutlines();

