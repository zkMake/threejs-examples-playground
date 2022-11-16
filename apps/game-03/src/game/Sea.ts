import * as THREE from "three";

import COLORS from "./Colors";

class Sea {
  mesh: any;
  waves: any;

  constructor(game: any) {
    let geom = new THREE.CylinderGeometry(
      game.seaRadius,
      game.seaRadius,
      game.seaLength,
      40,
      10
    );
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geom.mergeVertices();
    let l = geom.vertices.length;

    this.waves = [];

    for (let i = 0; i < l; i++) {
      let v = geom.vertices[i];
      this.waves.push({
        y: v.y,
        x: v.x,
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp:
          game.wavesMinAmp +
          Math.random() * (game.wavesMaxAmp - game.wavesMinAmp),
        speed:
          game.wavesMinSpeed +
          Math.random() * (game.wavesMaxSpeed - game.wavesMinSpeed),
      });
    }
    let mat = new THREE.MeshPhongMaterial({
      color: COLORS.blue,
      transparent: true,
      opacity: 0.8,
      shading: THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.name = "waves";
    this.mesh.receiveShadow = true;
  }

  moveWaves(deltaTime: number) {
    let vertices = this.mesh.geometry.vertices;
    let l = vertices.length;

    for (let i = 0; i < l; i++) {
      let v = vertices[i];
      let vProps = this.waves[i];
      v.x = vProps.x + Math.cos(vProps.ang) * vProps.amp;
      v.y = vProps.y + Math.sin(vProps.ang) * vProps.amp;
      vProps.ang += vProps.speed * deltaTime;
      this.mesh.geometry.verticesNeedUpdate = true;
    }
  }
}

export default Sea;
