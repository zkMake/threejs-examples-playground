import * as THREE from "three";

import COLORS from "./Colors";

class Enemy {
  mesh: any;
  angle: number;
  dist: number;

  constructor() {
    let geom = new THREE.TetrahedronGeometry(8, 2);
    let mat = new THREE.MeshPhongMaterial({
      color: COLORS.red,
      shininess: 0,
      specular: 0xffffff,
      shading: THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
  }
}

class EnemiesHolder {
  mesh: any;
  enemiesInUse: any[];

  constructor() {
    this.mesh = new THREE.Object3D();
    this.enemiesInUse = [];
  }

  spawnEnemies({ game, enemiesPool }: any) {
    let nEnemies = game.level;

    for (let i = 0; i < nEnemies; i++) {
      let enemy;
      if (enemiesPool.length) {
        enemy = enemiesPool.pop();
      } else {
        enemy = new Enemy();
      }

      enemy.angle = -(i * 0.1);
      enemy.distance =
        game.seaRadius +
        game.planeDefaultHeight +
        (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
      enemy.mesh.position.y =
        -game.seaRadius + Math.sin(enemy.angle) * enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;

      this.mesh.add(enemy.mesh);
      this.enemiesInUse.push(enemy);
    }
  }

  rotateEnemies({
    game,
    deltaTime,
    airplane,
    enemiesPool,
    particlesHolder,
    ambientLight,
    removeEnergy,
    particlesPool,
  }: any) {
    for (let i = 0; i < this.enemiesInUse.length; i++) {
      let enemy = this.enemiesInUse[i];
      enemy.angle += game.speed * deltaTime * game.enemiesSpeed;

      if (enemy.angle > Math.PI * 2) enemy.angle -= Math.PI * 2;

      enemy.mesh.position.y =
        -game.seaRadius + Math.sin(enemy.angle) * enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;
      enemy.mesh.rotation.z += Math.random() * 0.1;
      enemy.mesh.rotation.y += Math.random() * 0.1;

      //let globalEnemyPosition =  enemy.mesh.localToWorld(new THREE.Vector3());
      let diffPos = airplane.mesh.position
        .clone()
        .sub(enemy.mesh.position.clone());
      let d = diffPos.length();
      if (d < game.enemyDistanceTolerance) {
        particlesHolder.spawnParticles({
          pos: enemy.mesh.position.clone(),
          density: 15,
          color: COLORS.red,
          scale: 3,
          particlesPool,
        });

        enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
        this.mesh.remove(enemy.mesh);
        game.planeCollisionSpeedX = (100 * diffPos.x) / d;
        game.planeCollisionSpeedY = (100 * diffPos.y) / d;
        ambientLight.intensity = 2;

        removeEnergy();
        i--;
      } else if (enemy.angle > Math.PI) {
        enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
        this.mesh.remove(enemy.mesh);
        i--;
      }
    }
  }
}

export { EnemiesHolder, Enemy };
