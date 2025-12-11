import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type RAPIERType from "@dimforge/rapier3d";

export class Table {
  dynamicBodies: [THREE.Object3D, RAPIERType.RigidBody][] = [];
  public tableGroup = new THREE.Group();

  constructor(
    private RAPIER: typeof RAPIERType,
    private world: RAPIERType.World
  ) {}

  async load(scene: THREE.Scene, position: [number, number, number]) {
    // Load GLB
    const gltf = await new GLTFLoader().loadAsync(
      "https://res.cloudinary.com/derfbfm9n/image/upload/v1761994782/game-objects-terrain-test_qfbwlx.glb"
    );

    const tableMesh = gltf.scene.getObjectByName("Table_Plane") as THREE.Mesh;
    const planeMesh = gltf.scene.getObjectByName("Plane") as THREE.Mesh;

    if (!tableMesh) {
      console.error("No mesh named 'table-plane' found in GLB");
      return;
    }

    tableMesh.traverse((o: any) => {
      if (o.isMesh) {
        console.log(o);
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    // Add table mesh to group
    this.tableGroup.add(tableMesh);
    // // Create a wall mesh relative to the table
    // const wallMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(2, 2, 8),
    //   new THREE.MeshStandardMaterial({ color: 0x808080 })
    // );
    // // Position the wall at the edge of the table
    // wallMesh.position.set(0, 1, 4); // relative to table center
    // this.tableGroup.add(wallMesh);

    // Position the whole group in the scene
    this.tableGroup.position.set(...position);
    scene.add(this.tableGroup);
    scene.add(planeMesh);
    // Prepare the table's trimesh collider
    tableMesh.updateWorldMatrix(true, true);
    const geom = tableMesh.geometry.clone();
    geom.applyMatrix4(tableMesh.matrixWorld);
    geom.computeVertexNormals();

    const vertices = new Float32Array(geom.attributes.position.array);
    const indexAttr = geom.index;
    if (!indexAttr) {
      console.error(
        "Geometry has no index buffer — cannot create trimesh collider"
      );
      return;
    }
    const indices = new Uint32Array(indexAttr.array);

    // Create one kinematic body for the whole group
    const tableBody = this.world.createRigidBody(
      this.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
        ...position
      )
    );

    // Trimesh collider for table
    const colliderDesc = this.RAPIER.ColliderDesc.trimesh(vertices, indices)
      .setFriction(1.0)
      .setRestitution(0.2);
    this.world.createCollider(colliderDesc, tableBody);

    // Wall collider relative to table
    // const wallColliderDesc = this.RAPIER.ColliderDesc.cuboid(1, 1, 4)
    //   .setFriction(1.0)
    //   .setRestitution(0.2)
    //   .setTranslation(0, 1, 4); // same offset as wall mesh
    // this.world.createCollider(wallColliderDesc, tableBody);

    // Add both meshes for updates
    this.dynamicBodies.push([tableMesh, tableBody]);
    //this.dynamicBodies.push([wallMesh, tableBody]);
  }

  update() {
    for (const [mesh, body] of this.dynamicBodies) {
      const t = body.translation();
      mesh.position.copy(t); // Will be overridden by group rotation
      const r = body.rotation();
      mesh.quaternion.copy(r);
    }
  }

  // Apply rotation to the whole group (optional helper)
  tilt(tiltX: number, tiltZ: number) {
    this.tableGroup.rotation.x = tiltX;
    this.tableGroup.rotation.z = tiltZ;

    const quat = new THREE.Quaternion().setFromEuler(this.tableGroup.rotation);
    if (this.dynamicBodies.length) {
      const body = this.dynamicBodies[0][1]; // all meshes share the same body
      body.setNextKinematicRotation(
        new this.RAPIER.Quaternion(quat.x, quat.y, quat.z, quat.w)
      );
    }
  }
}
