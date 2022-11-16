import * as THREE from "three";
import Cloud from "./Cloud";

class Sky {
  mesh: any;
  nClouds: number;
  clouds: Cloud[];

  constructor(game: any) {
    this.mesh = new THREE.Object3D();
    this.nClouds = 20;
    this.clouds = [];
    const stepAngle = (Math.PI * 2) / this.nClouds;

    for (let i = 0; i < this.nClouds; i++) {
      const c = new Cloud();
      this.clouds.push(c);
      const a = stepAngle * i;
      const h = game.seaRadius + 150 + Math.random() * 200;
      c.mesh.position.y = Math.sin(a) * h;
      c.mesh.position.x = Math.cos(a) * h;
      c.mesh.position.z = -300 - Math.random() * 500;
      c.mesh.rotation.z = a + Math.PI / 2;
      const s = 1 + Math.random() * 2;
      c.mesh.scale.set(s, s, s);
      this.mesh.add(c.mesh);
    }
  }

  moveClouds(speed: number, deltaTime: number) {
    for (let i = 0; i < this.nClouds; i++) {
      let c = this.clouds[i];
      c.rotate();
    }

    this.mesh.rotation.z += speed * deltaTime;
  }
}

export default Sky;
