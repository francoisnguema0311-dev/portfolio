import * as THREE from 'three';

export class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.planets = [];
    this.simulationSpeed = 1;
    this.textureLoader = new THREE.TextureLoader();

    this.init();
  }

  init() {
    this.createSun();
    this.createPlanets();
    this.createStarfield();
  }

  createSun() {
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sunMaterial = new THREE.MeshStandardMaterial({
      emissive: 0xffcc00,
      emissiveIntensity: 2,
      color: 0xffcc00,
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.scene.add(this.sun);

    const sunLight = new THREE.PointLight(0xffffff, 3, 1000);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
  }

  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.8 });

    const starPositions = [];
    for (let i = 0; i < 15000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starPositions.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  }

  createPlanets() {
    const planetData = [
      { name: 'Mercury', color: 0x8c8c8c, size: 0.4, distance: 12, speed: 0.04, section: 'about', tex: 'https://threejs.org/examples/textures/planets/mercury.jpg' },
      { name: 'Venus', color: 0xe3bb76, size: 0.9, distance: 18, speed: 0.015, section: 'skills', tex: 'https://threejs.org/examples/textures/planets/venus.jpg' },
      { name: 'Earth', color: 0x2233ff, size: 1, distance: 25, speed: 0.01, section: 'projects', tex: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg' },
      { name: 'Mars', color: 0xff4422, size: 0.5, distance: 32, speed: 0.008, section: 'experience', tex: 'https://threejs.org/examples/textures/planets/mars.jpg' },
      { name: 'Jupiter', color: 0xd39c7e, size: 2.5, distance: 45, speed: 0.004, section: 'contact', tex: 'https://threejs.org/examples/textures/planets/jupiter.jpg' },
      { name: 'Saturn', color: 0xc5ab6e, size: 2.1, distance: 58, speed: 0.002, section: 'testimonials', tex: 'https://threejs.org/examples/textures/planets/saturn.jpg', hasRings: true },
      { name: 'Uranus', color: 0xbbdef0, size: 1.5, distance: 72, speed: 0.001, section: 'interests', tex: 'https://threejs.org/examples/textures/planets/uranus.jpg' },
      { name: 'Neptune', color: 0x6081ff, size: 1.4, distance: 85, speed: 0.0008, section: 'socials', tex: 'https://threejs.org/examples/textures/planets/neptune.jpg' },
    ];

    planetData.forEach(data => {
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        map: this.textureLoader.load(data.tex)
      });
      const mesh = new THREE.Mesh(geometry, material);

      const orbitGroup = new THREE.Group();
      this.scene.add(orbitGroup);

      mesh.position.set(data.distance, 0, 0);
      orbitGroup.add(mesh);

      if (data.hasRings) {
        const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xc5ab6e,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
      }

      const pathGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 128);
      const pathMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
      const path = new THREE.Mesh(pathGeometry, pathMaterial);
      path.rotation.x = Math.PI / 2;
      this.scene.add(path);

      this.planets.push({
        mesh,
        orbitGroup,
        data,
        angle: Math.random() * Math.PI * 2
      });
    });
  }

  update(deltaTime) {
    this.planets.forEach(p => {
      p.angle += p.data.speed * this.simulationSpeed;
      p.mesh.position.x = Math.cos(p.angle) * p.data.distance;
      p.mesh.position.z = Math.sin(p.angle) * p.data.distance;
      p.mesh.rotation.y += 0.01;
    });
  }

  setSimulationSpeed(speed) {
    this.simulationSpeed = speed;
  }
}
