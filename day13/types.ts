export type Coordinates = { x: number; y: number };
export type Input = { a: Coordinates; b: Coordinates; prize: Coordinates };

export type Move = {
  cost: number;
  x: number;
  y: number;
};
