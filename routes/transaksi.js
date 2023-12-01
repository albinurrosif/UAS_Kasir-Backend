const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

const connection = require('../config/db');

const { body, validationResult } = require('express-validator');

const authenticateToken = require('./auth/midleware/authenticateToken');

// Menetapkan zona waktu Jakarta
moment.tz.setDefault('Asia/Jakarta');

router.get('/', authenticateToken, function (req, res) {
  connection.query(' SELECT * FROM transaksi ', function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server failed',
        error: err,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data transaksi',
        data: rows,
      });
    }
  });
});

router.post('/store', authenticateToken, (req, res) => {
  // Menggunakan objek Date untuk mendapatkan tanggal dan waktu saat ini dalam zona waktu Jakarta
  const tanggalSekarang = moment().format('YYYY-MM-DD HH:mm:ss');

  let data = {
    tanggal: tanggalSekarang,
    // No need to include idpelanggan in the data
  };

  connection.query('insert into transaksi set ? ', data, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server failed',
      });
    } else {
      return res.status(201).json({
        status: true,
        message: 'Success',
        data: rows[0],
      });
    }
  });
});

router.get('/:id', authenticateToken, function (req, res) {
  let id = req.params.id;
  connection.query(
    `SELECT transaksi.*, pelanggan.namapelanggan FROM transaksi 
     JOIN pelanggan ON transaksi.idpelanggan = pelanggan.idpelanggan
     WHERE transaksi.idtransaksi = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'server error',
          error: err,
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'data transaksi',
          data: rows[0],
        });
      }
    }
  );
});

router.delete('/delete/(:id)', authenticateToken, function (req, res) {
  let id = req.params.id;
  connection.query(`delete from transaksi where idtransaksi = ${id}`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data dihapus',
      });
    }
  });
});

module.exports = router;
