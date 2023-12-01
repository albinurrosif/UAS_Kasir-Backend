const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const connection = require('../config/db');

const secretKey = 'kunciRahasiaYangSama';

// Registrasi pengguna
router.post('/register', [body('username').notEmpty().withMessage('Isi semua bidang'), body('password').notEmpty().withMessage('Isi semua bidang')], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array()); // Tambahkan ini
    return res.status(400).json({ error: errors.array() });
  }

  const { username, password } = req.body;

  const checkUserQuery = 'SELECT * FROM user WHERE username = ?';

  connection.query(checkUserQuery, [username], (err, result) => {
    if (err) {
      console.error('Error checking user:', err); // Tambahkan ini
      return res.status(500).json({ error: 'Server error' });
    }

    if (result.length > 0) {
      console.log('User already exists'); // Tambahkan ini
      return res.status(409).json({ error: 'Pengguna sudah terdaftar' });
    }

    const insertUserQuery = 'INSERT INTO user (username, password) VALUES (?, ?)';

    connection.query(insertUserQuery, [username, password], (err, result) => {
      if (err) {
        console.error('Error during user registration:', err); // Tambahkan ini
        return res.status(500).json({ error: 'Server error' });
      }

      const payload = { userId: result.insertId, username };
      const token = jwt.sign(payload, secretKey);

      const updateTokenQuery = 'UPDATE user SET token = ? WHERE iduser = ?';

      connection.query(updateTokenQuery, [token, result.insertId], (err, updateResult) => {
        if (err) {
          console.error('Error updating token:', err); // Tambahkan ini
          return res.status(500).json({ error: 'Server error' });
        }

        res.json({ token });
      });
    });
  });
});

// Login pengguna
router.post('/', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM user WHERE username = ?', [username], (error, result) => {
    if (error) {
      console.error('Error during user login:', error);
      return res.status(500).json({ error: 'Server error' });
    }

    if (result.length === 0) {
      console.log('User not found');
      return res.status(401).json({ error: 'Gagal masuk' });
    }

    const user = result[0];

    if (user.password !== password) {
      console.log('Incorrect password');
      return res.status(401).json({ error: 'Kata sandi salah' });
    }

    if (user.token) {
      // Verify the existing token to ensure its validity
      jwt.verify(user.token, secretKey, (err, decoded) => {
        if (err) {
          // Token verification failed, generate a new one
          const payload = { userId: user.iduser, username };
          const newToken = jwt.sign(payload, secretKey);

          const updateTokenQuery = 'UPDATE user SET token = ? WHERE iduser = ?';

          connection.query(updateTokenQuery, [newToken, user.iduser], (updateErr, updateResult) => {
            if (updateErr) {
              console.error('Error updating token:', updateErr);
              return res.status(500).json({ error: 'Server error' });
            }

            res.json({ token: newToken });
          });
        } else {
          // Token is valid, return the existing one
          res.json({ token: user.token });
        }
      });
    } else {
      // User doesn't have a token, generate a new one
      const payload = { userId: user.iduser, username };
      const token = jwt.sign(payload, secretKey);

      const updateTokenQuery = 'UPDATE user SET token = ? WHERE iduser = ?';

      connection.query(updateTokenQuery, [token, user.iduser], (err, updateResult) => {
        if (err) {
          console.error('Error updating token:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        res.json({ token });
      });
    }
  });
});

module.exports = router;
