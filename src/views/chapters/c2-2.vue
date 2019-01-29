<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import "three/examples/js/geometries/ConvexGeometry.js";
import "three/examples/js/QuickHull.js";
import "three/examples/js/ParametricGeometries.js";

import { GUI } from "dat.gui";

function createMultiMaterialObject(geometry, materials) {
  let group = new THREE.Group();

  for (let i = 0, l = materials.length; i < l; i++) {
    group.add(new THREE.Mesh(geometry, materials[i]));
  }

  return group;
}

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
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);

      plane.receiveShadow = true;
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;
      this.plane = plane;

      this.scene.add(plane);

      this.addGeometries();
      this.camera.position.x = -50;
      this.camera.position.y = 30;
      this.camera.position.z = 20;
      this.camera.lookAt(this.scene.position);

      let ambientLight = new THREE.AmbientLight(0x0c0c0c);
      this.scene.add(ambientLight);

      let spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      this.scene.add(spotLight);

      document
        .getElementById("container")
        .appendChild(this.renderer.domElement);
      this.renderScene();
    },

    addGeometries() {
      let geoms = [];

      geoms.push(new THREE.CylinderGeometry(1, 4, 4));

      // basic cube
      geoms.push(new THREE.BoxGeometry(2, 2, 2));

      // basic spherer
      geoms.push(new THREE.SphereGeometry(2));

      geoms.push(new THREE.IcosahedronGeometry(4));

      // create a convex shape (a shape without dents)
      // using a couple of points
      // for instance a cube
      let points = [
        new THREE.Vector3(2, 2, 2),
        new THREE.Vector3(2, 2, -2),
        new THREE.Vector3(-2, 2, -2),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(2, -2, 2),
        new THREE.Vector3(2, -2, -2),
        new THREE.Vector3(-2, -2, -2),
        new THREE.Vector3(-2, -2, 2)
      ];

      geoms.push(new THREE.ConvexGeometry(points));

      // create a lathgeometry
      //http://en.wikipedia.org/wiki/Lathe_(graphics)
      let pts = []; //points array - the path profile points will be stored here
      let detail = 0.1; //half-circle detail - how many angle increments will be used to generate points
      let radius = 3; //radius for half_sphere
      for (
        let angle = 0.0;
        angle < Math.PI;
        angle += detail //loop from 0.0 radians to PI (0 - 180 degrees)
      )
        pts.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          )
        ); //angle/radius to x,z
      geoms.push(new THREE.LatheGeometry(pts, 12));

      // create a OctahedronGeometry
      geoms.push(new THREE.OctahedronGeometry(3));

      // create a geometry based on a function
      geoms.push(
        new THREE.ParametricGeometry(
          THREE.ParametricGeometries.mobius3d,
          20,
          10
        )
      );

      //
      geoms.push(new THREE.TetrahedronGeometry(3));

      geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

      geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

      let j = 0;
      for (let i = 0; i < geoms.length; i++) {
        let materials = [
          new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff,
            flatShading: THREE.FlatShading
          }),
          new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ];

        let mesh = createMultiMaterialObject(geoms[i], materials);
        mesh.traverse(function(e) {
          e.castShadow = true;
        });

        mesh.position.x = -24 + (i % 4) * 12;
        mesh.position.y = 4;
        mesh.position.z = -8 + j * 12;

        if ((i + 1) % 4 == 0) j++;
        this.scene.add(mesh);
      }
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
