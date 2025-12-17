import * as THREE from "three";
import { GltfAssetCache } from "../../engine/assets/gltf-assets-cache";
import RAPIER from "@dimforge/rapier3d";

export class Table {
  public readonly group = new THREE.Group();
  private mesh!: THREE.Mesh;
  private body!: RAPIER.RigidBody;

  async load(position: THREE.Vector3) {
    const gltf = await GltfAssetCache.load(
      `https://res.cloudinary.com/derfbfm9n/image/upload/v1761994782/game-objects-terrain-test_qfbwlx.glb`
    );
    const source = gltf.scene.getObjectByName("Table_Plane");

    if (!(source instanceof THREE.Mesh)) {
      throw new Error("Table_Plane mesh not found or not a Mesh");
    }

    const mesh = source.clone();
    this.mesh = mesh;
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;
    this.group.add(mesh);
    this.group.position.copy(position);
  }
  attachRigidBody(body: RAPIER.RigidBody) {
    this.body = body;
  }

  tilt(x: number, z: number) {
    if (!this.body) return;
    this.group.rotation.x = x;
    this.group.rotation.z = z;
  }

  getColliderTrimeshLocal() {
    const mesh = this.mesh;
    const geom = mesh.geometry;

    if (!geom.index) {
      throw new Error("Geometry has no index buffer");
    }

    return {
      vertices: new Float32Array(geom.attributes.position.array),
      indices: new Uint32Array(geom.index.array),
    };
  }

  getColliderTrimeshWorld() {
    const geom = this.mesh.geometry.clone();
    this.mesh.updateWorldMatrix(true, true);
    geom.applyMatrix4(this.mesh.matrixWorld);
    geom.computeVertexNormals();
    if (!geom.index) {
      throw new Error("Geometry has no index buffer");
    }

    return {
      vertices: new Float32Array(geom.attributes.position.array),
      indices: new Uint32Array(geom.index.array),
    };
  }
}

//     this.tableGroup.add(tableMesh);

//     this.tableGroup.position.set(...position);
//     scene.add(this.tableGroup);
//     scene.add(planeMesh);
//     // Prepare the table's trimesh collider
//     tableMesh.updateWorldMatrix(true, true);
//     const geom = tableMesh.geometry.clone();
//     geom.applyMatrix4(tableMesh.matrixWorld);
//     geom.computeVertexNormals();

//     const vertices = new Float32Array(geom.attributes.position.array);
//     const indexAttr = geom.index;
//     if (!indexAttr) {
//       console.error(
//         "Geometry has no index buffer — cannot create trimesh collider"
//       );
//       return;
//     }
//     const indices = new Uint32Array(indexAttr.array);

//     // Create one kinematic body for the whole group
//     const tableBody = this.world.createRigidBody(
//       this.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
//         ...position
//       )
//     );

//     const colliderDesc = this.RAPIER.ColliderDesc.trimesh(vertices, indices)
//       .setFriction(1.0)
//       .setRestitution(0.2);
//     this.world.createCollider(colliderDesc, tableBody);

//     this.dynamicBodies.push([tableMesh, tableBody]);
//   }

//   update() {
//     for (const [mesh, body] of this.dynamicBodies) {
//       const t = body.translation();
//       mesh.position.copy(t); // Will be overridden by group rotation
//       const r = body.rotation();
//       mesh.quaternion.copy(r);
//     }
//   }

//   tilt(tiltX: number, tiltZ: number) {
//     this.tableGroup.rotation.x = tiltX;
//     this.tableGroup.rotation.z = tiltZ;

//     const quat = new THREE.Quaternion().setFromEuler(this.tableGroup.rotation);
//     if (this.dynamicBodies.length) {
//       const body = this.dynamicBodies[0][1]; // all meshes share the same body
//       body.setNextKinematicRotation(
//         new this.RAPIER.Quaternion(quat.x, quat.y, quat.z, quat.w)
//       );
//     }
//   }
// }
