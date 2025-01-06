import fs from "node:fs";

const input = fs.readFileSync("input.txt", "utf8");
const rows = input.split("\n");
const matrix = rows.map((row) => Array.from(row));

const mw = matrix[0].length;
const mh = matrix.length;

interface Coordinate {
  x: number;
  y: number;
}

const freqs: Record<string, Coordinate[]> = {};

// Read frequencies
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    const char = matrix[r][c];
    if (char !== "." && char !== "#") {
      if (!freqs[char]) {
        freqs[char] = [];
      }

      freqs[char].push({ y: r, x: c });
    }
  }
}

// calculate anti-nodes
const nodes: Coordinate[] = [];

for (const f in freqs) {
  if (freqs[f].length > 1) {
    const combinations = freqs[f].flatMap((a1, index) =>
      freqs[f].slice(index + 1).map((a2) => [a1, a2])
    );

    for (const c of combinations) {
      const dx = c[1].x - c[0].x;
      const dy = c[1].y - c[0].y;

      let n = 0;
      const npx0 = c[0].x;
      const npy0 = c[0].y;

      while (
        npx0 - n * dx >= 0 &&
        npx0 - n * dx < mw &&
        npy0 - n * dy >= 0 &&
        npy0 - n * dy < mh
      ) {
        const x = npx0 - n * dx;
        const y = npy0 - n * dy;
        nodes.push({ x, y });
        n++;
      }

      n = 0;
      const npx1 = c[1].x;
      const npy1 = c[1].y;

      while (
        npx1 + n * dx >= 0 &&
        npx1 + n * dx < mw &&
        npy1 + n * dy >= 0 &&
        npy1 + n * dy < mh
      ) {
        const x = npx1 + n * dx;
        const y = npy1 + n * dy;

        nodes.push({ x, y });
        n++;
      }
    }
  }
}

const validNodes: Coordinate[] = [];

nodes.map((n) => {
  if (!validNodes.some((vn) => n.x === vn.x && n.y === vn.y)) {
    validNodes.push(n);
  }
});

console.log(validNodes.sort((a, b) => (a.y - b.y) * 100 + a.x - b.x));
console.log(validNodes.length);
