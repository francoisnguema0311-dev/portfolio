import * as THREE from 'three';
import gsap from 'gsap';

export class CameraManager {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
  }

  focusOn(target) {
    const targetPosition = new THREE.Vector3();
    target.getWorldPosition(targetPosition);

    const cameraOffset = new THREE.Vector3(
      targetPosition.x * 1.5,
      targetPosition.y + 2,
      targetPosition.z * 1.5
    );

    gsap.to(this.camera.position, {
      x: cameraOffset.x,
      y: cameraOffset.y,
      z: cameraOffset.z,
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.controls.update();
      }
    });

    gsap.to(this.controls.target, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.controls.update();
      }
    });
  }

  reset() {
    gsap.to(this.camera.position, {
      x: 0,
      y: 50,
      z: 100,
      duration: 2,
      ease: 'power3.inOut'
    });

    gsap.to(this.controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.controls.update();
      }
    });
  }
}
