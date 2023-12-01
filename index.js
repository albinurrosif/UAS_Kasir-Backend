const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public/images')));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const detailtransaksi = require('./routes/detailtransaksi');
app.use('/api/detailtransaksi', detailtransaksi);

// const pelanggan = require('./routes/pelanggan');
// app.use('/api/pelanggan', pelanggan);
const transaksi = require('./routes/transaksi');
app.use('/api/transaksi', transaksi);
const produk = require('./routes/produk');
app.use('/api/produk', produk);
const produkmasuk = require('./routes/produkmasuk');
app.use('/api/produkmasuk', produkmasuk);
const auth = require('./routes/auth');
app.use('/api/auth', auth);

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
