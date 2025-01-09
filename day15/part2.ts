import { WareHouse } from "./warehouse";

const warehouse = new WareHouse("input.test3.default");

warehouse.widenGrid();

console.table(warehouse.grid);

// warehouse.solve();

// console.log(warehouse.calculateScore());
