var express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const result = await User.find();
  res.send(result);
});

router.delete("/", async function (req, res, next) {
  await User.collection.drop();
  res.status(204).send();
});

router.get("/check-auth", async function (req, res, next) {

  res.status(200).json({ message: req.session })

});

/* GET  specific user */
router.get("/self", async function (req, res, next) {
  const userIdFromSession = req.session.user.userId
  const user = await User.findOne({ userId: userIdFromSession });

  if (!user) {
    res.status(404).send("That user does not exist");
  } else {
    res.send(user);
  }
});

/**
 * PATCH Idempotent endpoint on updated the userlist for a specific festival
 * Body expected:
 * {
 *    festivalId: string,
 *    listCategory: 'archived' | 'removed',
 *    action: 'add' | 'remove'
 * }
 **/
 router.patch("/userlist", async function (req, res, next) {
  try {
    const userId = req.session.user.userId
    const festivalId = req.body.festivalId;
    const listCategory = req.body.listCategory;
    const action = req.body.action;
    let user;
    switch (action) {
      case 'remove':
        user = await User.findOneAndUpdate({ userId: userId }, { 
            $pull: { [listCategory]: festivalId }
        }, {
          new: true
        });
        break;
      case 'add':
      default:
        user = await User.findOneAndUpdate({ userId: userId }, { 
            $addToSet: { [listCategory]: festivalId }
        }, {
          new: true
        });
        break;
    }
    res.send(user);
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: `unable to perform update: ${error}`})
  }
});

router.delete("/", async function (req, res, next) {
  await User.collection.drop();
  res.status(204).send();
});

module.exports = router;
