import fs from "node:fs";
import { Input, Coordinates } from "./types";

export const readInput = (name: string): Input[] => {
  const input = fs.readFileSync(name, "utf8");

  const parseLine = (
    line: string
  ): {
    label: string;
    coordinates: Coordinates;
  } => {
    const [label, values] = line.split(": ");
    const [xPart, yPart] = values.split(", ");
    const x = parseInt(xPart.split(/[+=]/)[1], 10);
    const y = parseInt(yPart.split(/[+=]/)[1], 10);
    return { label, coordinates: { x, y } };
  };

  const parseBlock = (block: string): Input => {
    const result: Input = {
      a: { x: 0, y: 0 },
      b: { x: 0, y: 0 },
      prize: { x: 0, y: 0 },
    };
    const labelMapping: Record<string, keyof Input> = {
      "Button A": "a",
      "Button B": "b",
      Prize: "prize",
    };

    block.split("\n").forEach((line) => {
      const { label, coordinates } = parseLine(line);
      const key = labelMapping[label];
      if (key) result[key] = coordinates;
    });

    return result;
  };

  const extractXYValues = (input: string): Input[] =>
    input.split("\n\n").map(parseBlock);

  return extractXYValues(input);
};
