const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./src/auth_config.json");
const db = require('./src/db'); 
// const Joi = require('joi');

const app = express();
app.use(express.json()); // For parsing application/json

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

app.get('/get-user-info', (req, res) => {

  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email query parameter is required');
  }

  const query = `SELECT * FROM user_info where user_info.email = ?`;

  db.query(query, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error getting data');
      }
      if (results.length === 0) {
        return res.status(404).send('No data found');
      } else {
        console.log(results)
        res.status(200).json(results[0]);
      }
    }
  );
});

app.post('/save-user-info', (req, res) => {

  console.log("yoooo3");
  console.log(req.body)

  const { firstname, lastname, age, poids, taille, rhesus, allergies, email } = req.body;

  const query = `INSERT INTO user_info (firstname, lastname, age, poids, taille, rhesus, allergies, email) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [firstname, lastname, age, poids, taille, rhesus, allergies, email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving data');
      }
      res.send('Data saved successfully');
    }
  );
});

app.put('/update-user-info', (req, res) => {
  const { firstname, lastname, age, poids, taille, rhesus, allergies, email } = req.body;

  const query = `UPDATE user_info 
                 SET firstname = ?, lastname = ?, age = ?, 
                     poids = ?, taille = ?, rhesus = ?, allergies = ?
                 WHERE email = ?`;

  db.query(
    query,
    [firstname, lastname, age, poids, taille, rhesus, allergies, email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating data');
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('No user found with this email');
      }
      res.send('Data updated successfully');
    }
  );
});

// Get prescriptions for a specific user
app.get('/get-prescriptions', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email query parameter is required');
  }

  const query = `SELECT * FROM prescriptions WHERE user_email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error getting prescriptions');
    }
    res.status(200).json(results);
  });
});

// Save a new prescription
app.post('/save-prescription', (req, res) => {
  const { 
    user_email, 
    medication_name, 
    dosage_quantity, 
    dosage_frequency, 
    dosage_duration, 
    start_date,
    end_date, 
    notes 
  } = req.body;

  const query = `
    INSERT INTO prescriptions 
    (user_email, medication_name, dosage_quantity, dosage_frequency, dosage_duration, start_date, end_date, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      user_email, 
      medication_name, 
      dosage_quantity, 
      dosage_frequency, 
      dosage_duration, 
      start_date,
      end_date,
      notes
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving prescription');
      }
      res.status(201).json({ 
        message: 'Prescription saved successfully',
        id: result.insertId 
      });
    }
  );
});


app.get('/get-prescription/:id', (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM prescriptions WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération :", err);
      return res.status(500).send('Erreur serveur');
    }

    if (results.length === 0) {
      return res.status(404).send('Prescription non trouvée');
    }

    res.status(200).json(results[0]);
  });
});


// Update an existing prescription
app.put('/update-prescription/:id', (req, res) => {
  const { id } = req.params;
  const { 
    medication_name, 
    dosage_quantity, 
    dosage_frequency, 
    dosage_duration, 
    start_date,
    end_date,
    notes 
  } = req.body;

  const query = `
    UPDATE prescriptions 
    SET 
      medication_name = ?, 
      dosage_quantity = ?, 
      dosage_frequency = ?, 
      dosage_duration = ?, 
      start_date = ?, 
      end_date = ?, 
      notes = ? 
    WHERE id = ?
  `;

  db.query(
    query,
    [
      medication_name, 
      dosage_quantity, 
      dosage_frequency, 
      dosage_duration, 
      start_date,
      end_date, 
      notes,
      id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating prescription');
      }

      if (result.affectedRows === 0) {
        return res.status(404).send('Prescription not found');
      }

      res.json({ message: 'Prescription updated successfully' });
    }
  );
});


// Delete a prescription
app.delete('/delete-prescription/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM prescriptions WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting prescription');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Prescription not found');
    }

    res.json({ message: 'Prescription deleted successfully' });
  });
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
