import Parser from "../src/logic/parser";
import data from "./data.json";

test("Parser.parse() should return an object", () => {
    var parser = new Parser();

    var obj = []
    for (var i = 0; i < data.length; i++) {
        var parsed = parser.parse(data[i]);
        expect (typeof parsed).toBe("object");
        obj.push(parsed);
    }

    // write to file
    var fs = require("fs");
    fs.writeFileSync("./tests/parsed.json", JSON.stringify(obj));

})