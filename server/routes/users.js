var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const result = await User.find();
  res.send(result);
});

router.delete('/', async function(req, res, next) {
  await User.collection.drop();
  res.status(204).send();
});

/* GET  specific user */
router.get('/:id', async function(req, res, next) {
  const user = await User.findOne({userId: req.params.id});

  if(!user){
    res.status(404).send('That user does not exist');
  } else {
    res.send(user);
  }
});


module.exports = router;
