import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initRainScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const render = new THREE.WebGLRenderer({ antialias: false});
    render.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(render.domElement);

    camera.position.set(0,0,10);

    const rainGroup = new THREE.Group();
    scene.add(rainGroup);

    // 从 URL 参数中读取文案
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get('text') || 'i love you'; // 默认文案

    const texts = text.split(','); // 文案以逗号分隔
    const textMeshes = [];
    const fontLoader = new FontLoader();
    fontLoader.load('./font.json', (font) =>{
        // 生成文案
      texts.forEach((text, index) => {
        const fontSize = Math.random()
        const geometry = new TextGeometry(text, {
            font: font,
            size: fontSize,
            height: height,
            curveSegments: 12 // 降低分辨率
        });

        const hue = Math.random(); // 色相 [0, 1)
        const saturation = 0.7;    // 饱和度 [0, 1]
        const lightness = 0.5;     // 亮度 [0, 1]
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(-50, index * -10, 0); // 设置初始位置
        scene.add(mesh);

        textMeshes.push(mesh);
      });
    });
    // 渲染循环
    function animate() {
        requestAnimationFrame(animate);
  
        textMeshes.forEach((mesh) => {
          mesh.position.x += 0.1; // 从左向右移动
          if (mesh.position.x > 50) {
            mesh.position.x = -50; // 如果超出屏幕右侧，重置到左侧
          }
        });
  
        render.render(scene, camera);
      }
  
      animate();
  
      // 处理窗口大小变化
      window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
  
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
  
        renderer.setSize(width, height);
      });
}
