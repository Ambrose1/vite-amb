import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const texts = ['I love you', 'Forever with you.', 'You have my heart', 'I cant live without you.'];

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false }); // 禁用抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 20);

// Create a group to hold all text meshes
const heartGroup = new THREE.Group();
scene.add(heartGroup);

// Load font
const fontLoader = new FontLoader();
fontLoader.load('./src/assets/font.json', (font) => {
    // Heart parameters
    const t_steps = 30; // 减少点数
    const v_steps = 7;  // 减少点数
    const dt = (2 * Math.PI) / t_steps;
    const dv = (2 * Math.PI) / v_steps;

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff6f61 });

    // Generate heart points and text meshes
    for (let ti = 0; ti < t_steps; ti++) {
        const t = ti * dt;
        for (let vj = 0; vj < v_steps; vj++) {
            const v = vj * dv;

            // Position
            const x = 16 * Math.sin(t) ** 3 * Math.cos(v);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            const z = 16 * Math.sin(t) ** 3 * Math.sin(v);
            const position = new THREE.Vector3(x, y, z).multiplyScalar(0.5);

            // Normal vector
            const dx_dt = 48 * Math.sin(t) ** 2 * Math.cos(t) * Math.cos(v);
            const dy_dt = -13 * Math.sin(t) + 10 * Math.sin(2 * t) + 6 * Math.sin(3 * t) + 4 * Math.sin(4 * t);
            const dz_dt = 48 * Math.sin(t) ** 2 * Math.cos(t) * Math.sin(v);
            const tangentT = new THREE.Vector3(dx_dt, dy_dt, dz_dt).normalize();

            const dx_dv = -16 * Math.sin(t) ** 3 * Math.sin(v);
            const dy_dv = 0;
            const dz_dv = 16 * Math.sin(t) ** 3 * Math.cos(v);
            const tangentV = new THREE.Vector3(dx_dv, dy_dv, dz_dv).normalize();

            const N = tangentT.clone().cross(tangentV).normalize();

            // Create text geometry
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            const fontSize = Math.max(0.05, Math.min(0.2, 0.05 * 16 * Math.sin(t) ** 3));
            const height = fontSize / 4;
            const textGeometry = new TextGeometry(randomText, {
                font: font,
                size: fontSize,
                height: height,
                curveSegments: 6 // 降低分辨率
            });
            textGeometry.center();
            textGeometry.scale(-1, 1, 1);

            // Create text mesh
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.copy(position);
            textMesh.lookAt(N);
            textMesh.up.copy(tangentT.clone().normalize());

            // Add to group
            heartGroup.add(textMesh);
        }
    }

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);

        // 跳动动画
        time += 0.08;
        const scale = 1 + Math.sin(time) * 0.03;
        heartGroup.scale.set(scale, scale, scale);

        // 旋转动画
        heartGroup.rotation.y += 0.001;

        // 渲染场景
        renderer.render(scene, camera);
    }
    animate();
});

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;

// Adjust camera and renderer when window size changes
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});