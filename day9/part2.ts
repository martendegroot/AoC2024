import fs from "node:fs";

const input = Array.from(fs.readFileSync("input.txt", "utf8")).map((s) =>
  Number(s)
);

interface Space {
  size: number;
  id?: number;
}

const diskMap = input.map((size, index) => {
  const result: Space = { size };
  if (index % 2 === 0) {
    result.id = index / 2;
  }
  return result;
});

const mergeFreeSpace = (diskMap: Space[]) => {
  for (let s = 0; s < diskMap.length - 1; s++) {
    if (diskMap[s].id === undefined) {
      while (s + 1 < diskMap.length && diskMap[s + 1].id === undefined) {
        const totalSize = diskMap[s].size + diskMap[s + 1].size;
        diskMap.splice(s, 2, { size: totalSize });
      }
    }
  }
};

const files = [...diskMap].reverse().filter((file) => file.id !== undefined);

for (const file of files) {
  const diskIndex = diskMap.findIndex((space) => space.id === file.id);

  for (let s = 0; s < diskMap.length; s++) {
    if (
      diskMap[s].id === undefined &&
      diskMap[s].size >= file.size &&
      s < diskIndex
    ) {
      // Free up old file space
      diskMap[diskIndex] = { size: diskMap[diskIndex].size };
      mergeFreeSpace(diskMap);

      // Place file on new location
      diskMap[s].size -= file.size;
      diskMap.splice(s, 0, file);
      break;
    }
  }
}

/**
 * build disk
 */

const disk: string[] = [];

for (const file of diskMap) {
  for (let f = 0; f < file.size; f++) {
    disk.push(file.id !== undefined ? `${file.id}` : ".");
  }
}

/**
 * Calculate checksum
 */
let checksum = 0;

for (let i = 0; i < disk.length; i++) {
  if (disk[i] !== ".") {
    checksum += Number(disk[i]) * i;
  }
}

console.log(checksum);
