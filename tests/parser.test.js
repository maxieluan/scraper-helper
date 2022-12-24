import Parser from "../src/logic/parser";
import data from "./data.json";

test("Parser.parse() should return an object", () => {
    var parser = new Parser();

    for (var i = 0; i < data.length; i++) {
        expect (typeof parser.parse(data[i])).toBe("object");
        console.log(parser.parse(data[i]));
    }
})