import fs from "node:fs";

const input = fs.readFileSync("input.test.txt", "utf8");
const rows = input.split("\n");
const matrix = rows.map((row) => Array.from(row));

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

      nodes.push({ x: c[0].x - dx, y: c[0].y - dy });
      nodes.push({ x: c[1].x + dx, y: c[1].y + dy });
    }
  }
}

const validNodes: Coordinate[] = [];

nodes.map((n) => {
  if (n.x >= 0 && n.x < matrix[0].length && n.y >= 0 && n.y < matrix.length)
    if (!validNodes.some((vn) => n.x === vn.x && n.y === vn.y)) {
      validNodes.push(n);
    }
});

console.log(validNodes.sort((a, b) => (a.y - b.y) * 100 + a.x - b.x));
console.log(validNodes.length);
