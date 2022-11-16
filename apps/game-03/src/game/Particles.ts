import * as THREE from "three";
import { TweenMax, Power2 } from "gsap";

class Particle {
  mesh: any;

  constructor() {
    let geom = new THREE.TetrahedronGeometry(3, 0);
    let mat = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff,
      shading: THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(geom, mat);
  }

  explode({ pos, color, scale, particlesPool }: any) {
    let _this = this;
    let _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    let targetX = pos.x + (-1 + Math.random() * 2) * 50;
    let targetY = pos.y + (-1 + Math.random() * 2) * 50;
    let speed = 0.6 + Math.random() * 0.2;
    TweenMax.to(this.mesh.rotation, speed, {
      x: Math.random() * 12,
      y: Math.random() * 12,
    });
    TweenMax.to(this.mesh.scale, speed, { x: 0.1, y: 0.1, z: 0.1 });
    TweenMax.to(this.mesh.position, speed, {
      x: targetX,
      y: targetY,
      delay: Math.random() * 0.1,
      ease: Power2.easeOut,
      onComplete: function () {
        if (_p) _p.remove(_this.mesh);
        _this.mesh.scale.set(1, 1, 1);
        particlesPool.unshift(_this);
      },
    });
  }
}

class ParticlesHolder {
  mesh: any;

  constructor() {
    this.mesh = new THREE.Object3D();
  }

  spawnParticles({ pos, density, color, scale, particlesPool }: any) {
    for (let i = 0; i < density; i++) {
      let particle;
      if (particlesPool.length) {
        particle = particlesPool.pop();
      } else {
        particle = new Particle();
      }
      this.mesh.add(particle.mesh);
      particle.mesh.visible = true;
      particle.mesh.position.y = pos.y;
      particle.mesh.position.x = pos.x;
      particle.explode({ pos, color, scale, particlesPool });
    }
  }
}

export { ParticlesHolder, Particle };
