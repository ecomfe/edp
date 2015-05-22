var fs = require('fs');
var path = require('path');


var fileMetadatas = [];
var files = fs.readdirSync(__dirname);
files.forEach(function (file) {
    if (!/\.md$/.test(file)) {
        return;
    }

    var content = fs.readFileSync(path.resolve(__dirname, file), 'UTF-8');
    var lines = content.split(/\r?\n/);
    var metadata = {
        primaries: [],
        filename: file.replace(/\.md$/i, '')
    };
    
    for (var i = 0, len = lines.length; i < len; i++) {
        var line = lines[i];
        if (/^categories:/.test(line)) {
            metadata.category = lines[i + 1].replace(/^\s*-\s*/, '').replace(/\s*$/, '');
        }
        else if (/^#\s/.test(line)) {
            metadata.primaries.push(line.replace(/^#\s*/, '').replace(/\s*$/, ''))
        }
        else if (/^title:/.test(line)) {
            metadata.title = line.replace(/^\s*title\s*:\s*/, '').replace(/\s*$/, '');
        }
    }

    fileMetadatas.push(metadata);
});

var types = [
    {name: 'Initialization', title: '安装与升级'},
    {name: 'Package_management', title: '包管理'},
    {name: 'Project_management', title: '项目管理'},
    {name: 'Build', title: '项目构建'},
    {name: 'Lint', title: '前端代码静态检测'},
    {name: 'WebServer', title: '使用WebServer进行调试'},
    {name: 'Command_extension', title: '扩展自己的EDP命令'},
    {name: 'Doctor', title: '诊断工具'}
];

var typesIdx = {};
types.forEach(function (type) {
    typesIdx[type.name] = type;
});

fileMetadatas.forEach(function (metadata) {

    var type = typesIdx[metadata.category];

    if (!type.docs) {
        type.docs = [];
    }

    type.docs.push(metadata);
});

var text = '';
types.forEach(function (type) {
    var categroyPath = type.name.replace(/_/g, '-');
    text += '\n<li><a class="cat-title">' + type.title + '</a>\n    <ul>';
    type.docs.forEach(function (doc) {
        //text += '\n        <li><a href="<%= root_path %>/' + path + '/' + doc.filename + '/">' + doc.title + '</a></li>';

        if (doc.primaries.length > 0) {
            text += '\n        <li><a class="cat-title" href="<%= root_path %>/' + categroyPath + '/' + doc.filename + '/">' + doc.title + '</a>';
            text += '\n        <ul>';

            doc.primaries.forEach(function (primary) {
                text += '\n            <li><a href="<%= root_path %>/' + categroyPath + '/' + doc.filename + '/#' + primary + '">' + primary + '</a></li>';
            });
            text += '\n        </ul>\n</li>';
        }
        else {
            text += '\n        <li><a href="<%= root_path %>/' + categroyPath + '/' + doc.filename + '/">' + doc.title + '</a></li>';
        }
    });
    text += '\n    </ul>\n</li>';
});

console.log(text);
