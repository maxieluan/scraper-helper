import jsonpath from 'jsonpath';

export default class Parser {
    parse(requestObject) {
        var obj = {
            url: "",
            header: [],
            cookie: {
                present: false,
                value: [
                    
                ]
            },
            token: {
                present: false,
                value: "",
                refresh: 30
            }
        }

        // raise error if requestObject is not an object
        if (typeof requestObject !== "object") {
            throw new Error("requestObject is not an object");
        }

        const urlpath = "$.request.url"
        const headers = "$.request.headers"
        const cookies = "$.request.cookies"

        // get url
        obj.url =  jsonpath.query(requestObject, urlpath)[0];

        // get headers
        var headersJson = jsonpath.query(requestObject, headers)[0];
        for (var i = 0; i < headersJson.length; i++) {
            obj.header.push({
                name: headersJson[i].name,
                value: headersJson[i].value
            })
        }

        // get cookies
        var cookiesJson = jsonpath.query(requestObject, cookies)[0];
        if (cookiesJson.length > 0) {
            obj.cookie.present = true;
            for (var i = 0; i < cookiesJson.length; i++) {
                obj.cookie.value.push({
                    name: cookiesJson[i].name,
                    value: cookiesJson[i].value,
                    path: cookiesJson[i].path,
                    domain: cookiesJson[i].domain,
                    expires: cookiesJson[i].expires,
                    httpOnly: cookiesJson[i].httpOnly,
                    secure: cookiesJson[i].secure
                })
            }
        }

        return obj;
    }
}