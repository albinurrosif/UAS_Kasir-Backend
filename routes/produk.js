const express = require('express');
const router = express.Router();

const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

const authenticateToken = require('../routes/auth/midleware/authenticateToken');

router.get('/', authenticateToken, function (req, res) {
  connection.query(' SELECT * FROM produk ', function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server failed',
        error: err,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data produk',
        data: rows,
      });
    }
  });
});

router.post('/store', authenticateToken, [(body('namaproduk').notEmpty(), body('deskripsi').notEmpty(), body('harga').notEmpty(), body('stok').notEmpty())], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array(),
    });
  }
  let Data = {
    namaproduk: req.body.namaproduk,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    stok: req.body.stok,
  };
  connection.query('insert into produk set ? ', Data, function (err, rows) {
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

router.get('/(:id)', authenticateToken, function (req, res) {
  let id = req.params.id;
  connection.query(`select * from produk where idproduk = ${id}`, function (err, rows) {
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
        message: 'data produk',
        data: rows[0],
      });
    }
  });
});

router.patch('/update/:id', authenticateToken, [body('namaproduk').notEmpty(), body('deskripsi').notEmpty(), body('harga').notEmpty()], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array(),
    });
  }
  let id = req.params.id;
  let data = {
    namaproduk: req.body.namaproduk,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    // Jangan sertakan stok di sini agar tidak dapat diedit
  };
  connection.query(`update produk set ? where idproduk = ${id}`, data, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'update',
      });
    }
  });
});

router.delete('/delete/(:id)', authenticateToken, function (req, res) {
  let id = req.params.id;
  connection.query(`delete from produk where idproduk = ${id}`, function (err, rows) {
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
