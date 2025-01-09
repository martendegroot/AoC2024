import { WareHouse } from "./warehouse";

const warehouse = new WareHouse("input.test.default");

warehouse.widenGrid();

console.table(warehouse.grid);

// warehouse.solve();

// console.log(warehouse.calculateScore());
