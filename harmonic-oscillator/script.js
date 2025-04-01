import * as THREE from 'three';

// --- Basic Three.js Setup ---
const container = document.getElementById('visualization-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // White background

const camera = new THREE.PerspectiveCamera(
    75, // Field of View
    container.clientWidth / container.clientHeight, // Aspect Ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.z = 8; // Move camera back
camera.position.y = 2; // Move camera up slightly
camera.lookAt(0, 0, 0); // Look at the center

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// --- Oscillator Object ---
const geometry = new THREE.SphereGeometry(0.5, 32, 32); // Radius 0.5
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff }); // Blue color
const oscillatorMesh = new THREE.Mesh(geometry, material);
scene.add(oscillatorMesh);

// --- Equilibrium Line (Optional Visual Aid) ---
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
const points = [];
points.push( new THREE.Vector3( -10, 0, 0 ) ); // Extend beyond typical amplitude
points.push( new THREE.Vector3(  10, 0, 0 ) );
const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
const equilibriumLine = new THREE.Line( lineGeometry, lineMaterial );
scene.add(equilibriumLine);

// --- Grid Helper (Optional Visual Aid) ---
const gridHelper = new THREE.GridHelper( 10, 10 ); // Size 10, 10 divisions
gridHelper.rotation.x = Math.PI / 2; // Rotate to be on the XZ plane (like a floor)
// scene.add( gridHelper ); // Uncomment to add floor grid


// --- Oscillator Parameters ---
let amplitude = 2.0;
let angularFrequency = 1.5;
const phase = 0; // Keeping phase constant at 0 for simplicity

// --- UI Controls ---
const amplitudeSlider = document.getElementById('amplitudeSlider');
const amplitudeValueSpan = document.getElementById('amplitudeValue');
const frequencySlider = document.getElementById('frequencySlider');
const frequencyValueSpan = document.getElementById('frequencyValue');

// Initialize display
amplitudeValueSpan.textContent = parseFloat(amplitudeSlider.value).toFixed(1);
frequencyValueSpan.textContent = parseFloat(frequencySlider.value).toFixed(1);

// Event Listeners
amplitudeSlider.addEventListener('input', (event) => {
    amplitude = parseFloat(event.target.value);
    amplitudeValueSpan.textContent = amplitude.toFixed(1);
});

frequencySlider.addEventListener('input', (event) => {
    angularFrequency = parseFloat(event.target.value);
    frequencyValueSpan.textContent = angularFrequency.toFixed(1);
});

// --- Animation ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate); // Loop animation

    const elapsedTime = clock.getElapsedTime();

    // Calculate position using the SHO equation: x(t) = A * cos(ωt + φ)
    const xPosition = amplitude * Math.cos(angularFrequency * elapsedTime + phase);

    // Update the mesh position (oscillating along the x-axis)
    oscillatorMesh.position.x = xPosition;

    // Render the scene
    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener('resize', onWindowResize);

// --- Start Animation ---
animate();
