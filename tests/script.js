const {Parser} = require("../src/logic/parser");
const input = require("./data.json");

// loopthrough input

    for (var i = 0; i < input.length; i++) {
        // parse input
        var parser = new Parser();
        var output = parser.parse(input[i]);
    
        // print output
        console.log(output);
    }
