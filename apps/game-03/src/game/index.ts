// @ts-nocheck
import { TweenMax } from "gsap";
import * as THREE from "three";

import { Colors } from "./Colors.ts";
import AirPlane from "./Airplane.ts";
import Sea from "./Sea.ts";

// Game variables
let game;
let deltaTime = 0;
let newTime = new Date().getTime();
let oldTime = new Date().getTime();
let enemiesPool = [];
let particlesPool = [];

let coinsHolder = null;
let enemiesHolder = null;
let particlesHolder = null;
let sky = null;

function resetGame() {
  game = {
    speed: 0,
    initSpeed: 0.00035,
    baseSpeed: 0.00035,
    targetBaseSpeed: 0.00035,
    incrementSpeedByTime: 0.0000025,
    incrementSpeedByLevel: 0.000005,
    distanceForSpeedUpdate: 100,
    speedLastUpdate: 0,

    distance: 0,
    ratioSpeedDistance: 50,
    energy: 100,
    ratioSpeedEnergy: 3,

    level: 1,
    levelLastUpdate: 0,
    distanceForLevelUpdate: 1000,

    planeDefaultHeight: 100,
    planeAmpHeight: 80,
    planeAmpWidth: 75,
    planeMoveSensitivity: 0.005,
    planeRotXSensitivity: 0.0008,
    planeRotZSensitivity: 0.0004,
    planeFallSpeed: 0.001,
    planeMinSpeed: 1.2,
    planeMaxSpeed: 1.6,
    planeSpeed: 0,
    planeCollisionDisplacementX: 0,
    planeCollisionSpeedX: 0,

    planeCollisionDisplacementY: 0,
    planeCollisionSpeedY: 0,

    seaRadius: 600,
    seaLength: 800,
    wavesMinAmp: 5,
    wavesMaxAmp: 20,
    wavesMinSpeed: 0.001,
    wavesMaxSpeed: 0.003,

    cameraFarPos: 500,
    cameraNearPos: 150,
    cameraSensitivity: 0.002,

    coinDistanceTolerance: 15,
    coinValue: 3,
    coinsSpeed: 0.5,
    coinLastSpawn: 0,
    distanceForCoinsSpawn: 100,

    enemyDistanceTolerance: 10,
    enemyValue: 10,
    enemiesSpeed: 0.6,
    enemyLastSpawn: 0,
    distanceForEnemiesSpawn: 50,

    status: "playing",
  };

  fieldLevel.innerHTML = Math.floor(game.level);
}

// Three.js related variables
let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container;

//SCREEN & MOUSE VARIABLES
let HEIGHT,
  WIDTH,
  mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS
function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 0.1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = game.planeDefaultHeight;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", handleWindowResize, false);
}

// MOUSE AND SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  let tx = -1 + (event.clientX / WIDTH) * 2;
  let ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

function handleTouchMove(event) {
  event.preventDefault();
  let tx = -1 + (event.touches[0].pageX / WIDTH) * 2;
  let ty = 1 - (event.touches[0].pageY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

function handleMouseUp() {
  if (game.status == "waitingReplay") {
    resetGame();
    hideReplay();
  }
}

function handleTouchEnd() {
  if (game.status == "waitingReplay") {
    resetGame();
    hideReplay();
  }
}

// LIGHTS
let ambientLight, hemisphereLight, shadowLight;

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;

  // let ch = new THREE.CameraHelper(shadowLight.shadow.camera);
  //scene.add(ch);

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}

const Sky = function () {
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
};

Sky.prototype.moveClouds = function () {
  for (let i = 0; i < this.nClouds; i++) {
    let c = this.clouds[i];
    c.rotate();
  }
  this.mesh.rotation.z += game.speed * deltaTime;
};

const Cloud = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  let geom = new THREE.CubeGeometry(20, 20, 20);
  let mat = new THREE.MeshPhongMaterial({
    color: Colors.white,
  });

  //*
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
  //*/
};

Cloud.prototype.rotate = function () {
  let l = this.mesh.children.length;
  for (let i = 0; i < l; i++) {
    let m = this.mesh.children[i];
    m.rotation.z += Math.random() * 0.005 * (i + 1);
    m.rotation.y += Math.random() * 0.002 * (i + 1);
  }
};

const Enemy = function () {
  let geom = new THREE.TetrahedronGeometry(8, 2);
  let mat = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shininess: 0,
    specular: 0xffffff,
    shading: THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
};

const EnemiesHolder = function () {
  this.mesh = new THREE.Object3D();
  this.enemiesInUse = [];
};

EnemiesHolder.prototype.spawnEnemies = function () {
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
};

EnemiesHolder.prototype.rotateEnemies = function () {
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
      particlesHolder.spawnParticles(
        enemy.mesh.position.clone(),
        15,
        Colors.red,
        3
      );

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
};

const Particle = function () {
  let geom = new THREE.TetrahedronGeometry(3, 0);
  let mat = new THREE.MeshPhongMaterial({
    color: 0x009999,
    shininess: 0,
    specular: 0xffffff,
    shading: THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
};

Particle.prototype.explode = function (pos, color, scale) {
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
    ease: TweenMax.Power2.easeOut,
    onComplete: function () {
      if (_p) _p.remove(_this.mesh);
      _this.mesh.scale.set(1, 1, 1);
      particlesPool.unshift(_this);
    },
  });
};

const ParticlesHolder = function () {
  this.mesh = new THREE.Object3D();
};

ParticlesHolder.prototype.spawnParticles = function (
  pos,
  density,
  color,
  scale
) {
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
    particle.explode(pos, color, scale);
  }
};

const Coin = function () {
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
};

const CoinsHolder = function (nCoins) {
  this.mesh = new THREE.Object3D();
  this.coinsInUse = [];
  this.coinsPool = [];
  for (let i = 0; i < nCoins; i++) {
    let coin = new Coin();
    this.coinsPool.push(coin);
  }
};

CoinsHolder.prototype.spawnCoins = function () {
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
};

CoinsHolder.prototype.rotateCoins = function () {
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
      particlesHolder.spawnParticles(
        coin.mesh.position.clone(),
        5,
        0x009999,
        0.8
      );
      addEnergy();
      i--;
    } else if (coin.angle > Math.PI) {
      this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
      this.mesh.remove(coin.mesh);
      i--;
    }
  }
};

// 3D Models
let sea;
let airplane;

function createPlane() {
  airplane = new AirPlane();
  airplane.mesh.scale.set(0.25, 0.25, 0.25);
  airplane.mesh.position.y = game.planeDefaultHeight;
  scene.add(airplane.mesh);
}

function createSea() {
  sea = new Sea(game);
  sea.mesh.position.y = -game.seaRadius;
  scene.add(sea.mesh);
}

function createSky() {
  sky = new Sky();
  sky.mesh.position.y = -game.seaRadius;
  scene.add(sky.mesh);
}

function createCoins() {
  coinsHolder = new CoinsHolder(20);
  scene.add(coinsHolder.mesh);
}

function createEnemies() {
  for (let i = 0; i < 10; i++) {
    enemiesPool.push(new Enemy());
  }
  enemiesHolder = new EnemiesHolder();
  //enemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(enemiesHolder.mesh);
}

function createParticles() {
  for (let i = 0; i < 10; i++) {
    particlesPool.push(new Particle());
  }
  particlesHolder = new ParticlesHolder();
  //enemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(particlesHolder.mesh);
}

function loop() {
  newTime = new Date().getTime();
  deltaTime = newTime - oldTime;
  oldTime = newTime;

  if (game.status == "playing") {
    // Add energy coins every 100m;
    if (
      Math.floor(game.distance) % game.distanceForCoinsSpawn == 0 &&
      Math.floor(game.distance) > game.coinLastSpawn
    ) {
      game.coinLastSpawn = Math.floor(game.distance);
      coinsHolder.spawnCoins();
    }

    if (
      Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 &&
      Math.floor(game.distance) > game.speedLastUpdate
    ) {
      game.speedLastUpdate = Math.floor(game.distance);
      game.targetBaseSpeed += game.incrementSpeedByTime * deltaTime;
    }

    if (
      Math.floor(game.distance) % game.distanceForEnemiesSpawn == 0 &&
      Math.floor(game.distance) > game.enemyLastSpawn
    ) {
      game.enemyLastSpawn = Math.floor(game.distance);
      enemiesHolder.spawnEnemies();
    }

    if (
      Math.floor(game.distance) % game.distanceForLevelUpdate == 0 &&
      Math.floor(game.distance) > game.levelLastUpdate
    ) {
      game.levelLastUpdate = Math.floor(game.distance);
      game.level++;
      fieldLevel.innerHTML = Math.floor(game.level);

      game.targetBaseSpeed =
        game.initSpeed + game.incrementSpeedByLevel * game.level;
    }

    updatePlane();
    updateDistance();
    updateEnergy();
    game.baseSpeed +=
      (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
    game.speed = game.baseSpeed * game.planeSpeed;
  } else if (game.status == "gameover") {
    game.speed *= 0.99;
    airplane.mesh.rotation.z +=
      (-Math.PI / 2 - airplane.mesh.rotation.z) * 0.0002 * deltaTime;
    airplane.mesh.rotation.x += 0.0003 * deltaTime;
    game.planeFallSpeed *= 1.05;
    airplane.mesh.position.y -= game.planeFallSpeed * deltaTime;

    if (airplane.mesh.position.y < -200) {
      showReplay();
      game.status = "waitingReplay";
    }
  } else if (game.status == "waitingReplay") {
  }

  airplane.propeller.rotation.x += 0.2 + game.planeSpeed * deltaTime * 0.005;
  sea.mesh.rotation.z += game.speed * deltaTime;

  if (sea.mesh.rotation.z > 2 * Math.PI) sea.mesh.rotation.z -= 2 * Math.PI;

  ambientLight.intensity += (0.5 - ambientLight.intensity) * deltaTime * 0.005;

  coinsHolder.rotateCoins();
  enemiesHolder.rotateEnemies();

  sky.moveClouds();
  sea.moveWaves(deltaTime);

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updateDistance() {
  game.distance += game.speed * deltaTime * game.ratioSpeedDistance;
  fieldDistance.innerHTML = Math.floor(game.distance);
  let d =
    502 *
    (1 -
      (game.distance % game.distanceForLevelUpdate) /
        game.distanceForLevelUpdate);

  levelCircle.setAttribute("stroke-dashoffset", String(d));
}

function updateEnergy() {
  game.energy -= game.speed * deltaTime * game.ratioSpeedEnergy;
  game.energy = Math.max(0, game.energy);
  energyBar.style.right = 100 - game.energy + "%";
  energyBar.style.backgroundColor = game.energy < 50 ? "#f25346" : "#68c3c0";

  if (game.energy < 30) {
    energyBar.style.animationName = "blinking";
  } else {
    energyBar.style.animationName = "none";
  }

  if (game.energy < 1) {
    game.status = "gameover";
  }
}

function addEnergy() {
  game.energy += game.coinValue;
  game.energy = Math.min(game.energy, 100);
}

function removeEnergy() {
  game.energy -= game.enemyValue;
  game.energy = Math.max(0, game.energy);
}

function updatePlane() {
  game.planeSpeed = normalize(
    mousePos.x,
    -0.5,
    0.5,
    game.planeMinSpeed,
    game.planeMaxSpeed
  );

  let targetY = normalize(
    mousePos.y,
    -0.75,
    0.75,
    game.planeDefaultHeight - game.planeAmpHeight,
    game.planeDefaultHeight + game.planeAmpHeight
  );

  let targetX = normalize(
    mousePos.x,
    -1,
    1,
    -game.planeAmpWidth * 0.7,
    -game.planeAmpWidth
  );

  game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
  targetX += game.planeCollisionDisplacementX;

  game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
  targetY += game.planeCollisionDisplacementY;

  airplane.mesh.position.y +=
    (targetY - airplane.mesh.position.y) *
    deltaTime *
    game.planeMoveSensitivity;
  airplane.mesh.position.x +=
    (targetX - airplane.mesh.position.x) *
    deltaTime *
    game.planeMoveSensitivity;

  airplane.mesh.rotation.z =
    (targetY - airplane.mesh.position.y) *
    deltaTime *
    game.planeRotXSensitivity;
  airplane.mesh.rotation.x =
    (airplane.mesh.position.y - targetY) *
    deltaTime *
    game.planeRotZSensitivity;

  camera.fov = normalize(mousePos.x, -1, 1, 40, 80);
  camera.updateProjectionMatrix();
  camera.position.y +=
    (airplane.mesh.position.y - camera.position.y) *
    deltaTime *
    game.cameraSensitivity;

  game.planeCollisionSpeedX +=
    (0 - game.planeCollisionSpeedX) * deltaTime * 0.03;
  game.planeCollisionDisplacementX +=
    (0 - game.planeCollisionDisplacementX) * deltaTime * 0.01;
  game.planeCollisionSpeedY +=
    (0 - game.planeCollisionSpeedY) * deltaTime * 0.03;
  game.planeCollisionDisplacementY +=
    (0 - game.planeCollisionDisplacementY) * deltaTime * 0.01;

  airplane.pilot.updateHairs(game.speed, deltaTime);
}

function showReplay() {
  replayMessage.style.display = "block";
}

function hideReplay() {
  replayMessage.style.display = "none";
}

function normalize(v, vMin, vMax, tMin, tMax) {
  const nv = Math.max(Math.min(v, vMax), vMin);
  const dv = vMax - vMin;
  const pc = (nv - vMin) / dv;
  const dt = tMax - tMin;

  return tMin + pc * dt; // tv
}

let fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;

function init() {
  // UI

  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  replayMessage = document.getElementById("replayMessage");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");

  resetGame();
  createScene();

  createLights();
  createPlane();
  createSea();
  createSky();
  createCoins();
  createEnemies();
  createParticles();

  document.addEventListener("mousemove", handleMouseMove, false);
  document.addEventListener("touchmove", handleTouchMove, false);
  document.addEventListener("mouseup", handleMouseUp, false);
  document.addEventListener("touchend", handleTouchEnd, false);

  loop();
}

window.addEventListener("load", init, false);
