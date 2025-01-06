import { Space } from "./space";

const space = new Space("input.txt");

space.ticks(100);

console.table(space.tiles.map((row) => row.map((robots) => robots.length)));

console.log(space.calculateSafetyFactor());
