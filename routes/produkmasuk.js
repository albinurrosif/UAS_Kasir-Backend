const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

const authenticateToken = require('../routes/auth/midleware/authenticateToken');

// Menetapkan zona waktu Jakarta
moment.tz.setDefault('Asia/Jakarta');

router.get('/', authenticateToken, function (req, res) {
  connection.query('SELECT * FROM produkmasuk', function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan server.',
        error: err,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data produk masuk',
        data: rows,
      });
    }
  });
});

router.post('/store', authenticateToken, [(body('idproduk').notEmpty(), body('jumlahprodukmasuk').notEmpty())], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array(),
    });
  }

  // Mengambil tanggal dan waktu saat ini di zona waktu Jakarta
  const tanggalMasuk = moment().format();

  let data = {
    idproduk: req.body.idproduk,
    jumlahprodukmasuk: req.body.jumlahprodukmasuk,
    tanggalmasuk: tanggalMasuk,
  };

  connection.query('INSERT INTO produkmasuk SET ?', data, function (err, result) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan server.',
        error: err,
      });
    } else {
      // Perbarui stok produk di tabel produk
      connection.query('UPDATE produk SET stok = stok + ? WHERE idproduk = ?', [req.body.jumlahprodukmasuk, req.body.idproduk], function (err) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan server.',
            error: err,
          });
        } else {
          return res.status(201).json({
            status: true,
            message: 'Produk masuk berhasil ditambahkan.',
            data: result,
          });
        }
      });
    }
  });
});

router.patch('/update/:id', authenticateToken, [(body('idproduk').notEmpty(), body('jumlahprodukmasuk').notEmpty(), body('tanggalmasuk').notEmpty())], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  let id = req.params.id;
  let data = {
    idproduk: req.body.idproduk,
    jumlahprodukmasuk: req.body.jumlahprodukmasuk,
    tanggalmasuk: req.body.tanggalmasuk,
  };

  try {
    const updateResult = await connection.query('UPDATE produkmasuk SET ? WHERE idprodukmasuk = ?', [data, id]);

    return res.status(200).json({
      status: true,
      message: 'Data produk masuk berhasil diperbarui.',
      data: updateResult,
    });
  } catch (error) {
    console.error('Kesalahan:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server.',
      error: error.message,
    });
  }
});

router.delete('/delete/(:id)', authenticateToken, async function (req, res) {
  let id = req.params.id;

  try {
    const deleteResult = await connection.query('DELETE FROM produkmasuk WHERE idprodukmasuk = ?', [id]);

    return res.status(200).json({
      status: true,
      message: 'Data produk masuk berhasil dihapus.',
      data: deleteResult,
    });
  } catch (error) {
    console.error('Kesalahan:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server.',
      error: error.message,
    });
  }
});

module.exports = router;
