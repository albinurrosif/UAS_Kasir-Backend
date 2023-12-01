// const express = require('express');
// const router = express.Router();

// const connection = require('../config/db');
// const { body, validationResult } = require('express-validator');

// const authenticateToken = require('../routes/auth/midleware/authenticateToken');

// router.get('/', authenticateToken, function (req, res) {
//   connection.query(' SELECT * FROM pelanggan ', function (err, rows) {
//     if (err) {
//       return res.status(500).json({
//         status: false,
//         message: 'server failed',
//         error: err,
//       });
//     } else {
//       return res.status(200).json({
//         status: true,
//         message: 'Data pelanggan',
//         data: rows,
//       });
//     }
//   });
// });

// router.post('/store', authenticateToken, [(body('namapelanggan').notEmpty(), body('notelepon').notEmpty(), body('alamat').notEmpty())], (req, res) => {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(422).json({
//       error: error.array(),
//     });
//   }
//   let Data = {
//     namapelanggan: req.body.namapelanggan,
//     notelepon: req.body.notelepon,
//     alamat: req.body.alamat,
//   };
//   connection.query('insert into pelanggan set ? ', Data, function (err, rows) {
//     if (err) {
//       return res.status(500).json({
//         status: false,
//         message: 'server failed',
//       });
//     } else {
//       return res.status(201).json({
//         status: true,
//         message: 'Success',
//         data: rows[0],
//       });
//     }
//   });
// });

// router.get('/(:id)', authenticateToken, function (req, res) {
//   let id = req.params.id;
//   connection.query(`select * from pelanggan where idpelanggan = ${id}`, function (err, rows) {
//     if (err) {
//       return res.status(500).json({
//         status: false,
//         message: 'server error',
//         error: err,
//       });
//     }
//     if (rows.length <= 0) {
//       return res.status(404).json({
//         status: false,
//         message: 'Not Found',
//       });
//     } else {
//       return res.status(200).json({
//         status: true,
//         message: 'data pelanggan',
//         data: rows[0],
//       });
//     }
//   });
// });

// router.put('/update/:id', authenticateToken, [(body('namapelanggan').notEmpty(), body('notelepon').notEmpty(), body('alamat').notEmpty())], async (req, res) => {
//   try {
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//       return res.status(422).json({
//         error: error.array(),
//       });
//     }

//     const id = req.params.id;
//     const data = {
//       namapelanggan: req.body.namapelanggan,
//       notelepon: req.body.notelepon,
//       alamat: req.body.alamat,
//     };

//     const updateQuery = 'UPDATE pelanggan SET ? WHERE idpelanggan = ?';
//     await connection.query(updateQuery, [data, id]);

//     return res.status(200).json({
//       status: true,
//       message: 'update',
//     });
//   } catch (error) {
//     console.error('Kesalahan saat memperbarui data pelanggan:', error);
//     return res.status(500).json({
//       status: false,
//       message: 'Terjadi kesalahan saat memperbarui data pelanggan.',
//       error: error.message,
//     });
//   }
// });

// router.delete('/delete/(:id)', authenticateToken, function (req, res) {
//   let id = req.params.id;
//   connection.query(`delete from pelanggan where idpelanggan = ${id}`, function (err, rows) {
//     if (err) {
//       return res.status(500).json({
//         status: false,
//         message: 'server error',
//       });
//     } else {
//       return res.status(200).json({
//         status: true,
//         message: 'Data dihapus',
//       });
//     }
//   });
// });

// module.exports = router;
