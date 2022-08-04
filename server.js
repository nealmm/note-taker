const express = require('express')
const uuid    = require('uuid')
const path    = require('path')
const fs      = require('fs')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'))
})

app.get('/assets/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/css/styles.css'))
})

app.get('/assets/js/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/js/index.js'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.post('/api/notes', (req, res) => {
    let note = req.body
    note.id = uuid.v1()

    fs.readFile('./db/db.json', (err, data) => {
        let notes = JSON.parse(data)
        notes.unshift(note)
        fs.writeFile('./db/db.json', JSON.stringify(notes), () => {})
    })

    res.end()
})

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        let notes = JSON.parse(data)

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === req.params.id) {
                notes.splice(i, 1)
                break
            }
        }

        fs.writeFile('./db/db.json', JSON.stringify(notes), () => {})
    })

    res.end()
})

app.listen(PORT)