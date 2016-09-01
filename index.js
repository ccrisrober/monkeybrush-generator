#!/usr/bin/env node

var readdirp = require('readdirp');
var path = require("path");
var fs = require("fs");
var dotty = require("dotty");

// https://github.com/SBoudrias/Inquirer.js/#examples

var target = process.cwd() + "/test";

var config = {
	name: "MonkeyBrush example",
	user: {
		name: "foouser",
		github: "myproject"
	}
};

readdirp({
	root: path.join(__dirname, "_templates")
}).on("data", function(file) {
	var dest = path.resolve(target, file.path);
	if (!fs.existsSync(target)){
    	fs.mkdirSync(target);
	}

	fs.readFile(file.fullPath, "utf-8", function(err, content) {
		if (err) throw err;

		content = render(content, config);

		//console.log(content);

		var n = dest.lastIndexOf("_");

		// slice the string in 2, one from the start to the lastIndexOf
		// and then replace the word in the rest
		var str = dest.slice(0, n) + dest.slice(n).replace("_", "");

		fs.writeFile(str, content)
	});
});

function render(template, params) {
	return template.replace(/\{\{([^}]+)}}/g, function(_, name) {
		return dotty.get(params, name)
	});
}
