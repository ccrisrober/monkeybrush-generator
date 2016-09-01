#!/usr/bin/env node

var readdirp = require('readdirp');
var path = require("path");
var fs = require("fs");
var dotty = require("dotty");
var inquirer = require('inquirer');

var target = process.cwd() + "/test";

var config = {
	name: "MonkeyBrush example",
	description: "",
	user: {
		name: "foouser",
		github: "myproject"
	}
};

function render(template, params) {
	return template.replace(/\{\{([^}]+)}}/g, function(_, name) {
		return dotty.get(params, name)
	});
};

console.log(require("figlet").textSync('MonkeyBrush', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

inquirer.prompt([{
	type: "input",
	name: "name",
	message: "Project name",
	default: path.basename(target)
}, {
	type: "input",
	name: "description",
	message: "Project description (minLenght: 3)",
	validate: function (str) {
		return str.length >= 3;
	}
}
]).then(function(responses) {
	console.log(responses);
	config.name = responses.name;
	config.description = responses.description;
	console.log(config);

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

    var exec = require('child_process').exec;

	var child = exec("npm install", function (err, stdout, stderr) {
		if (stderr !== null) {
	      console.log('' + stderr);
	    }
	    if (stdout !== null) {
	      console.log('' + stdout);
	    }
	    if (err !== null) {
	      console.log('' + err);
	    }
	});
});
