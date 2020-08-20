const express = require('express'); //import module express
const app = express();
const bodyParser = require('body-parser'); //import body parser: middleware express untuk input http

const mongoClient = require('mongodb').MongoClient; //mongodb driver, untuk menghubungkan node dengan mongodb
const objectID = require('mongodb').ObjectID;
const dbURL = "mongodb://127.0.0.1:27017/";
const dbName = "arkademy";

let dbo = null;
mongoClient.connect(dbURL, (error, db) => {
    if(error) throw error; //jika terjadi error, tampilkan
    dbo = db.db(dbName);
})

app.use(bodyParser.urlencoded({extended: false})); //harus diletakkan paling atas

app.get('/siswa',(request, response) => { //request dan res adalah callback requestuest dan respond
    dbo.collection("siswa").find().toArray((error, res) => {
        if (error) throw error;
        response.json(res);
    })
});

app.get('/siswa/:id', (request, response) => {
    //mencari siswa dengan id x
    let idSiswa = request.params.id;
    let id_object = new objectID(idSiswa);

    dbo.collection('siswa').findOne({'_id' : id_object}, (error, result) => {
        if (error) throw error;
        response.json(result);
    })
});

//menambahkan data pada database
app.post('/siswa', (request, response) =>{
    let namaSiswa = request.body.nama;
    let alamatSiswa = request.body.alamat;

    dbo.collection('siswa').insertOne({
        nama: namaSiswa,
        alamat: alamatSiswa
    }, (error, res) => {
        if (error) throw error;
        response.json(res);
    })
});

app.delete('/siswa/:id', (request, response) => {
    let idSiswa = request.params.id;
    let id_object = new objectID(idSiswa);

    dbo.collection('siswa').deleteOne({
        _id: id_object
    }, (error, res)=>{
        if (error) throw error
        response.json(res);
    })
});

//mengedit entry yang sudah ada
app.put('/siswa/:id',(request, response) =>{ //cari berdasarkan id
    let idSiswa = request.params.id
    let id_object = new objectID(idSiswa);
    let namaSiswa = request.body.nama;
    let alamatSiswa = request.body.alamat;

    dbo.collection('siswa').updateOne({
        _id: id_object
    }, {$set: {
        nama: namaSiswa,
        alamat: alamatSiswa
    }}, (error, res) =>{
        if (error) throw error;
        response.json(res);
    })
});

app.listen('8080', (e)=>{ //port server yang digunakan http://127.0.0.1:8080
    console.log(e)
})