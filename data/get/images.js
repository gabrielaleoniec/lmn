const path = require('path');
const fs = require('fs');

console.log(__dirname);
let tmp = __dirname.split(path.sep);
console.log(tmp);
tmp.pop();
tmp.pop();
let new_dir = tmp.join(path.sep);
console.log(tmp);
const dir = new_dir+path.sep;

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

module.exports = {
  path: '/api/images/:filename',
  method: 'GET',
  delay: [200, 1000],
  render: function (req, res){
    let filename = req.params.filename;
    
    
    
    let type = mime[path.extname(filename).slice(1)] || 'text/plain';
    filename = path.normalize(dir+filename);
    
    var s = fs.createReadStream(filename);
    s.on('open', function () {
        res.status(200).set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
  }
};

