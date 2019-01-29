<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { GUI } from "dat.gui";

export default {
  data() {
    return {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      gui: new GUI(),
      renderer: new THREE.WebGLRenderer(),
      cube: {},
      sphere: {},
      plane: {},
      controls: {},
      planeGeometry: {},
      numberOfObjects: 0
    };
  },
  methods: {
    createView() {
      this.renderer.setClearColor(new THREE.Color(0xee, 0xee, 0xee));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      // this.scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

      let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
      this.planeGeometry = planeGeometry;
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x3333ff });
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);

      plane.receiveShadow = true;
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;
      this.plane = plane;

      this.scene.add(plane);

      this.camera.position.x = -30;
      this.camera.position.y = 40;
      this.camera.position.z = 30;
      this.camera.lookAt(this.scene.position);

      let ambientLight = new THREE.AmbientLight(0x0c0c0c);
      this.scene.add(ambientLight);

      let spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      this.scene.add(spotLight);

      let dom = document
        .getElementById("container")
        .appendChild(this.renderer.domElement);
      this.renderScene();
    },
    renderScene() {
      this.scene.traverse(e => {
        if (e instanceof THREE.Mesh && e != this.plane) {
          e.rotation.x += this.controls.rotationSpeed;
          e.rotation.y += this.controls.rotationSpeed;
          e.rotation.z += this.controls.rotationSpeed;
        }
      });
      window.requestAnimationFrame(this.renderScene);
      this.renderer.render(this.scene, this.camera);
    },
    addControls() {
      let controls = {
        rotationSpeed: 0.02,
        bouncingSpeed: 0.03,
        numberOfObjects: this.scene.children.length,
        removeCube: () => {
          let allChildren = this.scene.children;
          let lastChild = allChildren[allChildren.length - 1];
          if (lastChild instanceof THREE.Mesh) {
            this.scene.remove(lastChild);
            this.numberOfObjects = this.scene.children.length;
          }
        },
        addCube: () => {
          let cubeSize = Math.ceil(Math.random() * 3);
          let cubeGeometry = new THREE.BoxGeometry(
            cubeSize,
            cubeSize,
            cubeSize
          );
          let cubeMaterial = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
          });
          let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.castShadow = true;
          cube.name = "cube-" + this.scene.children.length;

          cube.position.x =
            -30 +
            Math.round(Math.random() * this.planeGeometry.parameters.width);
          cube.position.y = Math.round(Math.random() * 5);
          cube.position.z =
            -20 +
            Math.round(Math.random() * this.planeGeometry.parameters.height);

          // add the cube to the scene
          this.scene.add(cube);
          this.numberOfObjects = this.scene.children.length;
        },
        outputObjects: () => {
          console.log(this.scene.children);
        }
      };
      this.controls = controls;
      this.gui.add(this.controls, "rotationSpeed", 0, 0.5);
      this.gui.add(this.controls, "bouncingSpeed", 0, 0.5);
      this.gui.add(this.controls, "addCube");
      this.gui.add(this.controls, "removeCube");
      this.gui.add(this.controls, "outputObjects");
      this.gui.add(this.controls, "numberOfObjects").listen();
    },
    rotationCube() {
      this.cube.rotation.x += this.controls.rotationSpeed;
      this.cube.rotation.y += this.controls.rotationSpeed;
      this.cube.rotation.z += this.controls.rotationSpeed;
    },
    bounusSphere() {
      this.step += this.controls.bouncingSpeed;
      this.sphere.position.x = 20 + 10 * Math.cos(this.step);
      this.sphere.position.y = 2 + 10 * Math.abs(Math.sin(this.step));
    },
    onResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  },
  mounted() {
    this.addControls();
    this.createView();
    window.addEventListener("resize", this.onResize, false);
  },
  beforeDestroy() {
    this.gui.destroy();
  }
};
</script>
