const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    res.send(db);
});

app.post('/api/notes', (req, res) => {
    let note = req.body;
    note.id = db.length + 1;
    db.push(note);
    fs.writeFileSync('./db/db.json', JSON.stringify(db));
    res.send(db);
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params);
    db.splice(req.params.id - 1, 1);
    for(let i = 1; i < (db.length + 1); i++) {
        db[i - 1].id = i;
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(db));
    res.send('Deleted');
});


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(port, () => {
    console.log(`Listening on PORT: ${port}`);
})