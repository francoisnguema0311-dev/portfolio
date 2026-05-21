import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SolarSystem } from './SolarSystem';
import { CameraManager } from './CameraManager';
import { UI } from './UI';

class App {
  constructor() {
    this.initScene();
    this.initSolarSystem();
    this.initUI();
    this.initInteraction();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 50, 100);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const container = document.getElementById('canvas-container');
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 1000;
    this.controls.minDistance = 5;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initSolarSystem() {
    this.solarSystem = new SolarSystem(this.scene);
    this.cameraManager = new CameraManager(this.camera, this.controls);
  }

  initUI() {
    this.ui = new UI(
      (planetData) => this.handlePlanetSelect(planetData),
      (speed) => this.solarSystem.setSimulationSpeed(speed)
    );
  }

  initInteraction() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(this.solarSystem.planets.map(p => p.mesh));

      if (intersects.length > 0) {
        const object = intersects[0].object;
        const planet = this.solarSystem.planets.find(p => p.mesh === object);

        if (planet) {
          this.handlePlanetSelect(planet.data);
          this.cameraManager.focusOn(object);
        }
      }
    });
  }

  handlePlanetSelect(planetData) {
    this.ui.showInfo(planetData);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = 0.016; // Approx 60fps
    this.solarSystem.update(deltaTime);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

new App();
