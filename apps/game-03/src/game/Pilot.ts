// @ts-nocheck
import * as THREE from "three";

import { Colors } from "./Colors.ts";

const Pilot = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "pilot";
  this.angleHairs = 0;

  let bodyGeom = new THREE.BoxGeometry(15, 15, 15);
  let bodyMat = new THREE.MeshPhongMaterial({
    color: Colors.brown,
    shading: THREE.FlatShading,
  });
  let body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(2, -12, 0);

  this.mesh.add(body);

  let faceGeom = new THREE.BoxGeometry(10, 10, 10);
  let faceMat = new THREE.MeshLambertMaterial({ color: Colors.pink });
  let face = new THREE.Mesh(faceGeom, faceMat);
  this.mesh.add(face);

  let hairGeom = new THREE.BoxGeometry(4, 4, 4);
  let hairMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
  let hair = new THREE.Mesh(hairGeom, hairMat);
  hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
  let hairs = new THREE.Object3D();

  this.hairsTop = new THREE.Object3D();

  for (let i = 0; i < 12; i++) {
    let h = hair.clone();
    let col = i % 3;
    let row = Math.floor(i / 3);
    let startPosZ = -4;
    let startPosX = -4;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    h.geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1));
    this.hairsTop.add(h);
  }
  hairs.add(this.hairsTop);

  let hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
  hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
  let hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
  let hairSideL = hairSideR.clone();
  hairSideR.position.set(8, -2, 6);
  hairSideL.position.set(8, -2, -6);
  hairs.add(hairSideR);
  hairs.add(hairSideL);

  let hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
  let hairBack = new THREE.Mesh(hairBackGeom, hairMat);
  hairBack.position.set(-1, -4, 0);
  hairs.add(hairBack);
  hairs.position.set(-5, 5, 0);

  this.mesh.add(hairs);

  let glassGeom = new THREE.BoxGeometry(5, 5, 5);
  let glassMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
  let glassR = new THREE.Mesh(glassGeom, glassMat);
  glassR.position.set(6, 0, 3);
  let glassL = glassR.clone();
  glassL.position.z = -glassR.position.z;

  let glassAGeom = new THREE.BoxGeometry(11, 1, 11);
  let glassA = new THREE.Mesh(glassAGeom, glassMat);
  this.mesh.add(glassR);
  this.mesh.add(glassL);
  this.mesh.add(glassA);

  let earGeom = new THREE.BoxGeometry(2, 3, 2);
  let earL = new THREE.Mesh(earGeom, faceMat);
  earL.position.set(0, 0, -6);
  let earR = earL.clone();
  earR.position.set(0, 0, 6);
  this.mesh.add(earL);
  this.mesh.add(earR);
};

Pilot.prototype.updateHairs = function (speed, deltaTime) {
  let hairs = this.hairsTop.children;

  let l = hairs.length;
  for (let i = 0; i < l; i++) {
    let h = hairs[i];
    h.scale.y = 0.75 + Math.cos(this.angleHairs + i / 3) * 0.25;
  }

  this.angleHairs += speed * deltaTime * 40;
};

export default Pilot;
