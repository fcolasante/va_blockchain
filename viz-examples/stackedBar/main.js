import { drawStacked } from "./stacked_v5_test.js";
//import { chart } from "stacked.js";

d3.csv("hashrate_simple.csv").then(function(data) {
    drawStacked(data)
});