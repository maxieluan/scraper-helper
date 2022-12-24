import Scrapy from "../src/logic/langs/scrapy";
import data from "./parsed.json";

test("Scrapy.process() should return a Request, containing url", () => {
    var scrapy = new Scrapy();

    for (var i = 0; i < data.length; i++) {
        var processed = scrapy.process(data[i]);
        expect (typeof processed).toBe("string");
        expect (processed).toContain("Request(");
        expect (processed).toContain("url=");        
    }
})

test("Before closing ) there is no trailing comma and space", () => {
    var scrapy = new Scrapy();

    for (var i = 0; i < data.length; i++) {
        var processed = scrapy.process(data[i]);
        expect (processed).not.toMatch(/\s,\s\)$/);
    }
})