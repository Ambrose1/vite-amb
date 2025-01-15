import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';
export class MeteorManager {
    constructor(font, material) {
        this.font = font;
        this.material = material;
        this.meteors = [];
    }

    addMeteor(text) {
        const meteor = new Meteor(text, this.font, this.material);
        this.meteors.push(meteor);
        heartGroup.add(meteor.meteorGroup);
    }

    update() {
        this.meteors.forEach((meteor, index) => {
            meteor.update();
            // �移除飞出场景的流星
            if (meteor.position.length() > 20) {
                heartGroup.remove(meteor.meteorGroup);
                this.meteors.splice(index, 1);
            }
        });
    }
}

export class Meteor {
    constructor(text, font, material) {
        this.text = text;
        this.font = font;
        this.material = material;

        this.init();
    }

    init() {
        // 创建文字几何体
        const textGeometry = new TextGeometry(this.text, {
            font: this.font,
            size: 0.5,
            height: 0.1,
            curveSegments: 12
        });
        textGeometry.center();

        // 创建文字网格
        this.textMesh = new THREE.Mesh(textGeometry, this.material);

        // 创建尾巴
        this.tailGeometry = new THREE.BufferGeometry();
        this.tailPoints = [];
        for (let i = 0; i < 10; i++) {
            this.tailPoints.push(new THREE.Vector3(0, 0, 0));
        }
        this.tailGeometry.setFromPoints(this.tailPoints);
        const tailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        this.tail = new THREE.Line(this.tailGeometry, tailMaterial);

        // 组合流星
        this.meteorGroup = new THREE.Group();
        this.meteorGroup.add(this.textMesh);
        this.meteorGroup.add(this.tail);

        // 初始化位置和方向
        this.position = new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
        this.velocity = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(0.1);
        this.meteorGroup.position.copy(this.position);
    }

    update() {
        // 更新位置
        this.position.add(this.velocity);
        this.meteorGroup.position.copy(this.position);

        // 更新尾巴
        this.tailPoints.shift();
        this.tailPoints.push(this.position.clone());
        this.tailGeometry.setFromPoints(this.tailPoints);
    }
}