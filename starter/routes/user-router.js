
const express = require('express');

const router = express.Router();


const getAllUsers = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

const pathUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getAllUsers).delete(deleteUser).patch(pathUser);


module.exports = router