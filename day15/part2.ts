import { WareHouse } from "./warehouse2";

const warehouse = new WareHouse("input");

warehouse.widenGrid();

warehouse.solve();

console.log(warehouse.calculateScore());
