import mustache from 'mustache';

const template = `
Request(
    {{#removeTrailingComma}}
    {{#url}}url='{{url}}'{{/url}}{{^last}},{{/last}}
    {{#header.length}}
    headers = \{
        {{#header}}
        {{#index}} '{{name}}': '{{value}}', {{/index}}{{^index}}'{{name}}': '{{value}}'{{/index}}
        {{/header}}    
    \}{{/header.length}}{{^last}},{{/last}}
    {{#cookie.present}}
    cookies = [
        {{#cookie.value}}
        \{'name': '{{name}}', 'value': '{{value}}', 'path': '{{path}}', 'domain': '{{domain}}', 'expires': '{{expires}}', 'httpOnly': '{{httpOnly}}', 'secure': '{{secure}}'\}{{/cookie.value}}{{^last}},{{/last}}
    ]{{/cookie.present}}
    {{/removeTrailingComma}}
)
`

export default class Scrapy {
    process(requestObject) {
        mustache.escape = (value) => { return value }

        requestObject.removeTrailingComma = () => {
            return function (text, render) {
                // remove ending empty lines
                text = text.replace(/\s+$/, '');
                return render(text).replace(/,\s*$/, "");
            }
        }
        return mustache.render(template, requestObject);
    }
}