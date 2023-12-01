const express = require('express');
const router = express.Router();

const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

const authenticateToken = require('./auth/midleware/authenticateToken');

router.get('/', authenticateToken, function (req, res) {
  connection.query('SELECT * FROM detailtransaksi', function (err, rows) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: err,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Data detail transaksi',
        data: rows,
      });
    }
  });
});

router.post('/store', authenticateToken, [(body('idtransaksi').notEmpty(), body('idproduk').notEmpty(), body('jumlah').notEmpty())], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const data = {
      idtransaksi: req.body.idtransaksi,
      idproduk: req.body.idproduk,
      jumlah: req.body.jumlah,
    };

    console.log('Data yang akan disimpan:', data);

    connection.query('INSERT INTO detailtransaksi SET ?', data, function (err, rows) {
      if (err) {
        console.error('Kesalahan saat menyimpan ke database:', err);
        return res.status(500).json({
          success: false,
          message: 'Terjadi kesalahan server',
        });
      } else {
        console.log('Sukses menyimpan ke database:', rows);
        return res.status(201).json({
          success: true,
          message: 'Sukses',
          data: rows[0],
        });
      }
    });
  } catch (error) {
    console.error('Kesalahan umum:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

router.get('/:id', authenticateToken, async function (req, res) {
  const idtransaksi = req.params.id;

  const query = `
    SELECT p.idproduk, p.namaproduk, p.deskripsi, p.harga, dp.jumlah
    FROM produk p
    JOIN detailtransaksi dp ON p.idproduk = dp.idproduk
    WHERE dp.idtransaksi = ?;
  `;

  connection.query(query, [idtransaksi], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: err,
      });
    } else {
      const detailTransaksiList = rows.map((row) => ({
        idproduk: row.idproduk,
        namaproduk: row.namaproduk,
        deskripsi: row.deskripsi,
        harga: row.harga,
        jumlah: row.jumlah,
      }));

      return res.status(200).json({
        success: true,
        detailTransaksiList: detailTransaksiList,
      });
    }
  });
});

router.patch('/update/:id', authenticateToken, [body('idtransaksi').notEmpty(), body('idproduk').notEmpty(), body('jumlah').notEmpty()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const id = req.params.id;
  const data = {
    idtransaksi: req.body.idtransaksi,
    idproduk: req.body.idproduk,
    jumlah: req.body.jumlah,
  };

  connection.query('UPDATE detailtransaksi SET ? WHERE iddetailtransaksi = ?', [data, id], function (err, rows) {
    if (err) {
      console.error('Kesalahan saat mengupdate ke database:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
      });
    } else {
      console.log('Sukses mengupdate ke database:', rows);
      return res.status(200).json({
        success: true,
        message: 'Update sukses',
      });
    }
  });
});

router.delete('/delete/:id', authenticateToken, function (req, res) {
  const id = req.params.id;
  connection.query('DELETE FROM detailtransaksi WHERE iddetailtransaksi = ?', [id], function (err, rows) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Data dihapus',
      });
    }
  });
});

router.delete('/produk/delete', authenticateToken, function (req, res) {
  const { transaksi, produk } = req.query;
  connection.query('DELETE FROM detailtransaksi WHERE idtransaksi = ? AND idproduk = ?', [transaksi, produk], function (err, rows) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        err: err,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Data dihapus',
      });
    }
  });
});

module.exports = router;
