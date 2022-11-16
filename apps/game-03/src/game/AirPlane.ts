import * as THREE from "three";

import COLORS from "./Colors";
import Pilot from "./Pilot";

class AirPlane {
  mesh: any;
  pilot: any;
  propeller: any;

  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "airPlane";

    let geomCabin = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
    let matCabin = new THREE.MeshPhongMaterial({
      color: COLORS.red,
      shading: THREE.FlatShading,
    });

    geomCabin.vertices[4].y -= 10;
    geomCabin.vertices[4].z += 20;
    geomCabin.vertices[5].y -= 10;
    geomCabin.vertices[5].z -= 20;
    geomCabin.vertices[6].y += 30;
    geomCabin.vertices[6].z += 20;
    geomCabin.vertices[7].y += 30;
    geomCabin.vertices[7].z -= 20;

    let cabin = new THREE.Mesh(geomCabin, matCabin);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    this.mesh.add(cabin);

    // Engine

    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    let matEngine = new THREE.MeshPhongMaterial({
      color: COLORS.white,
      shading: THREE.FlatShading,
    });
    let engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 50;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Tail Plane

    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    let matTailPlane = new THREE.MeshPhongMaterial({
      color: COLORS.red,
      shading: THREE.FlatShading,
    });
    let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-40, 20, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Wings

    let geomSideWing = new THREE.BoxGeometry(30, 5, 120, 1, 1, 1);
    let matSideWing = new THREE.MeshPhongMaterial({
      color: COLORS.red,
      shading: THREE.FlatShading,
    });
    let sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.position.set(0, 15, 0);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    let geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
    let matWindshield = new THREE.MeshPhongMaterial({
      color: COLORS.white,
      transparent: true,
      opacity: 0.3,
      shading: THREE.FlatShading,
    });
    let windshield = new THREE.Mesh(geomWindshield, matWindshield);
    windshield.position.set(5, 27, 0);

    windshield.castShadow = true;
    windshield.receiveShadow = true;

    this.mesh.add(windshield);

    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    geomPropeller.vertices[4].y -= 5;
    geomPropeller.vertices[4].z += 5;
    geomPropeller.vertices[5].y -= 5;
    geomPropeller.vertices[5].z -= 5;
    geomPropeller.vertices[6].y += 5;
    geomPropeller.vertices[6].z += 5;
    geomPropeller.vertices[7].y += 5;
    geomPropeller.vertices[7].z -= 5;
    let matPropeller = new THREE.MeshPhongMaterial({
      color: COLORS.brown,
      shading: THREE.FlatShading,
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    let geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1);
    let matBlade = new THREE.MeshPhongMaterial({
      color: COLORS.brownDark,
      shading: THREE.FlatShading,
    });
    let blade1 = new THREE.Mesh(geomBlade, matBlade);
    blade1.position.set(8, 0, 0);

    blade1.castShadow = true;
    blade1.receiveShadow = true;

    let blade2 = blade1.clone();
    blade2.rotation.x = Math.PI / 2;

    blade2.castShadow = true;
    blade2.receiveShadow = true;

    this.propeller.add(blade1);
    this.propeller.add(blade2);
    this.propeller.position.set(60, 0, 0);
    this.mesh.add(this.propeller);

    let wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
    let wheelProtecMat = new THREE.MeshPhongMaterial({
      color: COLORS.red,
      shading: THREE.FlatShading,
    });
    let wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
    wheelProtecR.position.set(25, -20, 25);
    this.mesh.add(wheelProtecR);

    let wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
    let wheelTireMat = new THREE.MeshPhongMaterial({
      color: COLORS.brownDark,
      shading: THREE.FlatShading,
    });
    let wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
    wheelTireR.position.set(25, -28, 25);

    let wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
    let wheelAxisMat = new THREE.MeshPhongMaterial({
      color: COLORS.brown,
      shading: THREE.FlatShading,
    });
    let wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
    wheelTireR.add(wheelAxis);

    this.mesh.add(wheelTireR);

    let wheelProtecL = wheelProtecR.clone();
    wheelProtecL.position.z = -wheelProtecR.position.z;
    this.mesh.add(wheelProtecL);

    let wheelTireL = wheelTireR.clone();
    wheelTireL.position.z = -wheelTireR.position.z;
    this.mesh.add(wheelTireL);

    let wheelTireB = wheelTireR.clone();
    wheelTireB.scale.set(0.5, 0.5, 0.5);
    wheelTireB.position.set(-35, -5, 0);
    this.mesh.add(wheelTireB);

    let suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
    suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0));
    let suspensionMat = new THREE.MeshPhongMaterial({
      color: COLORS.red,
      shading: THREE.FlatShading,
    });
    let suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
    suspension.position.set(-35, -5, 0);
    suspension.rotation.z = -0.3;
    this.mesh.add(suspension);

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10, 27, 0);
    this.mesh.add(this.pilot.mesh);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }
}

export default AirPlane;
