import { Space } from "./space";

const space = new Space("input.txt");

space.ticks(7132);

space.printTiles();

// const maxTries = 1_000_000;
// let n = 0;

// let symScore = 0;

// let highestScore = 0;
// let highestScoreN = 0;

// while (symScore < 0.95 && ++n < maxTries) {
//   const symScore = space.calculateSymmetryScore();

//   if (symScore > highestScore) {
//     highestScore = symScore;
//     highestScoreN = n;
//   }

//   space.tick();

//   if (n % 1000 === 0) {
//     console.log(n, " : ", { highestScore, highestScoreN });
//   }
// }

// if (n === maxTries) {
//   console.log("quitted on max tries");
// }

// console.log(space.printTiles());
// console.log(symScore);

// console.log({ highestScore, highestScoreN });

// // let count = 0;

// // setInterval(() => {
// //   console.clear();
// //   space.tick();
// //   space.printTiles();

// //   console.log("\n\n", ++count);
// // }, 300);
