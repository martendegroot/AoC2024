import { WareHouse } from "./warehouse";

const warehouse = new WareHouse("input");

warehouse.solve();

console.log(warehouse.calculateScore());
