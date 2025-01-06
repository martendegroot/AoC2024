const input = "773 79858 0 71 213357 2937 1 3998391"
  .split(" ")
  .map((string) => Number(string));

const numbers = {};

// load all numbers
for (const num of input) {
  const cleanNum = Number(num).toString();
  if (!numbers[cleanNum]) {
    numbers[cleanNum] = 1;
  } else {
    numbers[cleanNum]++;
  }
}

let calcCount = 0;

const applyRules = (nums: Record<string, number>): Record<string, number> => {
  const newNuwms = {};

  for (const num in nums) {
    calcCount++;
    const cleanNum = Number(num).toString();

    if (Number(cleanNum) === 0) {
      if (!newNuwms["1"]) {
        newNuwms["1"] = nums[cleanNum];
      } else {
        newNuwms["1"] = newNuwms["1"] + nums[cleanNum];
      }
    } else if (cleanNum.length % 2 === 0) {
      const firstHalf = Number(
        cleanNum.slice(0, cleanNum.length / 2)
      ).toString();
      const secondHalf = Number(
        cleanNum.slice(cleanNum.length / 2, cleanNum.length)
      ).toString();

      if (!newNuwms[firstHalf]) {
        newNuwms[firstHalf] = nums[cleanNum];
      } else {
        newNuwms[firstHalf] = newNuwms[firstHalf] + nums[cleanNum];
      }

      if (!newNuwms[secondHalf]) {
        newNuwms[secondHalf] = nums[cleanNum];
      } else {
        newNuwms[secondHalf] = newNuwms[secondHalf] + nums[cleanNum];
      }
    } else {
      const multiple = (Number(cleanNum) * 2024).toString();
      if (!newNuwms[multiple]) {
        newNuwms[multiple] = nums[cleanNum];
      } else {
        newNuwms[multiple] = newNuwms[multiple] + nums[cleanNum];
      }
    }
  }

  return newNuwms;
};

const applyNTimes = (numbers: Record<string, number>, times: number) => {
  let count = 0;
  let result = numbers;

  while (count < times) {
    result = applyRules(result);
    console.log(Object.keys(result).length);
    count++;
  }
  return result;
};

const result = applyNTimes(numbers, 75);
let sum = 0;

for (const mark in result) {
  sum += result[mark];
}

console.log("stones", sum);
