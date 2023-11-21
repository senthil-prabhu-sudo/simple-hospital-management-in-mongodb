const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();

mongoose.connect('mongodb://localhost/hospital_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
});

const Patient = mongoose.model('Patient', patientSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
      const patients = await Patient.find({});
      res.render('index.ejs', { patients });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error: ' + err.message);
    }
  });
  
app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { name, age, gender } = req.body;
  const newPatient = new Patient({ name, age, gender });

  newPatient.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/delete/:id', (req, res) => {
  const patientId = req.params.id;
  Patient.findByIdAndDelete(patientId, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
