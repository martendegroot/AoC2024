import { Input, Move } from "./types";

const canCombineVectors = (
  a: [number, number],
  b: [number, number],
  c: [number, number]
): boolean => {
  const [ax, ay] = a;
  const [bx, by] = b;
  const [cx, cy] = c;

  // Determinant of the coefficient matrix
  const det = ax * by - ay * bx;

  // If determinant is 0, the vectors are collinear or parallel
  if (det === 0) {
    return false; // No unique solution
  }

  // Solve for x and y using Cramer's rule
  const x = (cx * by - cy * bx) / det;
  const y = (ax * cy - ay * cx) / det;

  // Check if x and y are non-negative integers
  return x >= 0 && y >= 0 && Number.isInteger(x) && Number.isInteger(y);
};

export const isSolvableGame = ({ a, b, prize }: Input): boolean =>
  canCombineVectors([a.x, a.y], [b.x, b.y], [prize.x, prize.y]);

export const shallowCompare = (obj1: Move, obj2: Move) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
