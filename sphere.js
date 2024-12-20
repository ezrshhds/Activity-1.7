import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/build/three.module.js';

class SphereGeometry extends BufferGeometry {
    constructor(radius = 1, detail = 2) {
        super();
        this.type = 'SphereGeometry';

        const vertices = [];
        const indices = [];

        const t = (1 + Math.sqrt(5)) / 2; // Golden ratio
        const baseVertices = [
            new Vector3(-1, t, 0).normalize(),
            new Vector3(1, t, 0).normalize(),
            new Vector3(-1, -t, 0).normalize(),
            new Vector3(1, -t, 0).normalize(),
            new Vector3(0, -1, t).normalize(),
            new Vector3(0, 1, t).normalize(),
            new Vector3(0, -1, -t).normalize(),
            new Vector3(0, 1, -t).normalize(),
            new Vector3(t, 0, -1).normalize(),
            new Vector3(t, 0, 1).normalize(),
            new Vector3(-t, 0, -1).normalize(),
            new Vector3(-t, 0, 1).normalize(),
        ];

        const baseIndices = [
            [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
            [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
            [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
            [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
        ];

        baseIndices.forEach(face => {
            this.subdivide(
                baseVertices[face[0]].clone().multiplyScalar(radius),
                baseVertices[face[1]].clone().multiplyScalar(radius),
                baseVertices[face[2]].clone().multiplyScalar(radius),
                detail,
                vertices,
                indices
            );
        });

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices.flat(), 3));
    }

    subdivide(v0, v1, v2, depth, vertices, indices) {
        if (depth === 0) {
            const idxStart = vertices.length / 3;
            vertices.push(...v0.toArray(), ...v1.toArray(), ...v2.toArray());
            indices.push(idxStart, idxStart + 1, idxStart + 2);
            return;
        }

        const v01 = v0.clone().add(v1).normalize();
        const v12 = v1.clone().add(v2).normalize();
        const v20 = v2.clone().add(v0).normalize();

        this.subdivide(v0, v01, v20, depth - 1, vertices, indices);
        this.subdivide(v1, v12, v01, depth - 1, vertices, indices);
        this.subdivide(v2, v20, v12, depth - 1, vertices, indices);
        this.subdivide(v01, v12, v20, depth - 1, vertices, indices);
    }
}

export { SphereGeometry };
