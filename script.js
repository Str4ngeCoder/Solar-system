// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Texture Loader
const loader = new THREE.TextureLoader();

// --- Starry Background ---
// Make sure 'starfield.jpg' is in your project's textures folder
loader.load('textures/starfield.jpg', function(starTexture) {
    // Set minification and magnification filters for better quality
    starTexture.minFilter = THREE.LinearFilter;
    starTexture.magFilter = THREE.LinearFilter;
    
    const starGeometry = new THREE.SphereGeometry(30, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: starTexture,
        side: THREE.BackSide,
    });
    const starSphere = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starSphere);
});

// const starsloader = new THREE.CubeTextureLoader();
// const starBackground = starsloader.load([
//   'textures/starfield.jpg', 'textures/starfield.jpg',
//   'textures/starfield.jpg', 'textures/starfield.jpg',
//   'textures/starfield.jpg', 'textures/starfield.jpg'
// ]);
// scene.background = starBackground;


// Sun with texture
loader.load('textures/sun.jpg', function(sunTexture) {
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    
    function animateSun() {
        requestAnimationFrame(animateSun);
        sun.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animateSun();
});

// Planet data
const planetsData = [
    { name: 'mercury', radius: 0.2, orbitRadius: 3, speed: 0.015, texture: 'textures/mercury.jpg' },
    { name: 'venus', radius: 0.3, orbitRadius: 4.5, speed: 0.01, texture: 'textures/venus.jpg' },
    { name: 'earth', radius: 0.35, orbitRadius: 6, speed: 0.008, texture: 'textures/earth.jpg' },
    { name: 'mars', radius: 0.25, orbitRadius: 7.5, speed: 0.006, texture: 'textures/mars.jpg' },
    { name: 'jupiter', radius: 0.8, orbitRadius: 10, speed: 0.004, texture: 'textures/jupiter.jpg', hasRings: true, ringInnerRadius: 0.9, ringOuterRadius: 1.1, ringColor: 0x665544 },
    { name: 'saturn', radius: 0.6, orbitRadius: 12, speed: 0.003, texture: 'textures/saturn.jpg', hasRings: true, ringInnerRadius: 0.9, ringOuterRadius: 1.8, ringColor: 0x555555 },
    { name: 'uranus', radius: 0.5, orbitRadius: 14, speed: 0.002, texture: 'textures/uranus.jpg', hasRings: true, ringInnerRadius: 0.7, ringOuterRadius: 1.1, ringColor: 0xAAAAAA },
    { name: 'neptune', radius: 0.5, orbitRadius: 16, speed: 0.001, texture: 'textures/neptune.jpg', hasRings: true, ringInnerRadius: 0.7, ringOuterRadius: 0.9, ringColor: 0x445566 }
];

const planetMeshes = [];

planetsData.forEach(p => {
    loader.load(p.texture, function(planetTexture) {
        const geometry = new THREE.SphereGeometry(p.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: planetTexture });
        const mesh = new THREE.Mesh(geometry, material);

        const orbit = new THREE.Object3D();
        orbit.add(mesh);
        scene.add(orbit);
        
        mesh.position.set(p.orbitRadius, 0, 0);
        orbit.rotation.y = Math.random() * Math.PI * 2;

        // if (p.hasRings) {
        //     const ringGeometry = new THREE.RingGeometry(p.radius * p.ringInnerRadius, p.radius * p.ringOuterRadius, 32);
        //     const ringMaterial = new THREE.MeshBasicMaterial({ color: p.ringColor, side: THREE.DoubleSide });
        //     const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            
        //     ringMesh.rotation.x = Math.PI / 2; // Default tilt
        //     if (p.name === 'uranus') {
        //         ringMesh.rotation.x = Math.PI / 2 + Math.PI / 5; // More significant tilt for Uranus
        //     }
            
        //     orbit.add(ringMesh);
        // }
        
        planetMeshes.push({ mesh, orbit, speed: p.speed });
    });
});

camera.position.set(0, 15, 22); // This will move the camera up along the Y-axis
camera.lookAt(scene.position); // This will make the camera look at the center of the scene

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    planetMeshes.forEach(p => {
        p.orbit.rotation.y += p.speed;
        p.mesh.rotation.y += p.speed * 2;
    });

    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// ... (previous code for scene, camera, renderer, etc.)

// --- Add OrbitControls ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Provides a smoother, more realistic feel
controls.dampingFactor = 0.05;

controls.minDistance = 5;

// Set the maximum distance the camera can get from the center
controls.maxDistance = 32;

camera.position.z = 20;

// Animation loop
function control_animate() {
    requestAnimationFrame(control_animate);

    // --- Update controls in the animation loop ---
    controls.update();

    planetMeshes.forEach(p => {
        p.orbit.rotation.y += p.speed;
        p.mesh.rotation.y += p.speed * 2;
    });

    renderer.render(scene, camera);
}

// ... (rest of your code for handling window resizing and starting animate())

control_animate();