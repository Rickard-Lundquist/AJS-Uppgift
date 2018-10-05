let fs = require('fs');
let path = require('path');

let express = require('express');
let app = express();

let server = app.listen(3000, listening);

function listening() {
    console.log("listening...");
}

app.use(express.static('www'));

app.use(express.json({extended: false}));

app.post('/add/recipe', addWord);

function addWord(request) {

    let allData = require('./www/JSON/recipes.json');
    allData.push(request.body);
    let allJson = JSON.stringify(allData, null, 2);
    fs.writeFile('./www/JSON/recipes.json', allJson, () => request.body);
}

const ldata = JSON.parse(
    fs.readFileSync('./livsmedelsdata.json')
);

app.get('/first-five', (req, res) => {
    res.json(ldata.slice(0, 5));
});

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, './www/index.html'));
});