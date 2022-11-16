import * as THREE from "three";

import COLORS from "./Colors";

class Cloud {
  mesh: any;

  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";
    let geom = new THREE.CubeGeometry(20, 20, 20);
    let mat = new THREE.MeshPhongMaterial({
      color: COLORS.white,
    });

    let nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {
      let m = new THREE.Mesh(geom.clone(), mat);
      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;
      let s = 0.1 + Math.random() * 0.9;
      m.scale.set(s, s, s);
      this.mesh.add(m);
      m.castShadow = true;
      m.receiveShadow = true;
    }
  }

  rotate() {
    let l = this.mesh.children.length;
    for (let i = 0; i < l; i++) {
      let m = this.mesh.children[i];
      m.rotation.z += Math.random() * 0.005 * (i + 1);
      m.rotation.y += Math.random() * 0.002 * (i + 1);
    }
  }
}

export default Cloud;
