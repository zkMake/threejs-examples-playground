import * as THREE from "three";

class Coin {
  mesh: any;
  angle: number;
  dist: number;

  constructor() {
    let geom = new THREE.TetrahedronGeometry(5, 0);
    let mat = new THREE.MeshPhongMaterial({
      color: 0x009999,
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

class CoinsHolder {
  mesh: any;
  coinsInUse: any[];
  coinsPool: any[];

  constructor(nCoins: number) {
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
    for (let i = 0; i < nCoins; i++) {
      let coin = new Coin();
      this.coinsPool.push(coin);
    }
  }

  spawnCoins({ game }: any) {
    let nCoins = 1 + Math.floor(Math.random() * 10);
    let d =
      game.seaRadius +
      game.planeDefaultHeight +
      (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
    let amplitude = 10 + Math.round(Math.random() * 10);
    for (let i = 0; i < nCoins; i++) {
      let coin;
      if (this.coinsPool.length) {
        coin = this.coinsPool.pop();
      } else {
        coin = new Coin();
      }
      this.mesh.add(coin.mesh);
      this.coinsInUse.push(coin);
      coin.angle = -(i * 0.02);
      coin.distance = d + Math.cos(i * 0.5) * amplitude;
      coin.mesh.position.y =
        -game.seaRadius + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
    }
  }

  rotateCoins({
    game,
    deltaTime,
    airplane,
    particlesHolder,
    addEnergy,
    particlesPool,
  }: any) {
    for (let i = 0; i < this.coinsInUse.length; i++) {
      let coin = this.coinsInUse[i];
      if (coin.exploding) continue;
      coin.angle += game.speed * deltaTime * game.coinsSpeed;
      if (coin.angle > Math.PI * 2) coin.angle -= Math.PI * 2;
      coin.mesh.position.y =
        -game.seaRadius + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
      coin.mesh.rotation.z += Math.random() * 0.1;
      coin.mesh.rotation.y += Math.random() * 0.1;

      //let globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
      let diffPos = airplane.mesh.position
        .clone()
        .sub(coin.mesh.position.clone());
      let d = diffPos.length();
      if (d < game.coinDistanceTolerance) {
        this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
        this.mesh.remove(coin.mesh);
        particlesHolder.spawnParticles({
          pos: coin.mesh.position.clone(),
          density: 5,
          color: 0x009999,
          scale: 0.8,
          particlesPool,
        });
        addEnergy();
        i--;
      } else if (coin.angle > Math.PI) {
        this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
        this.mesh.remove(coin.mesh);
        i--;
      }
    }
  }
}

export { CoinsHolder, Coin };
