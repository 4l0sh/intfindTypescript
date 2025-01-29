const express = require('express');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');

module.exports = (db) => {
  //Middleware to verify token
  const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unautorized: no token' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        iss: 'http://localhost:4000',
      });
      req.user = decoded;
      next();
    } catch (err) {
      console.log('error verifying token', err);
      return res.status(401).json({ error: 'Unautorized: invalid token ' });
    }
  };

  //Signup Route
  router.post('/signup', (req, res) => {
    const collection = db.collection('users');
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    collection.findOne({ email: req.body.email }).then((existingUser) => {
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }
      collection
        .insertOne({
          avatar: req.body.selectedAvatar,
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          role: req.body.role,
        })
        .then((response) => {
          const token = jwt.sign(
            { name: req.body.name, role: 'student', email: req.body.email },
            JWT_SECRET,
            {
              expiresIn: 60 * 60,
            }
          );
          const result = {
            _id: response.insertedId,
            message: `User ${req.body.name} created successfully`,
            token: token,
          };
          res.status(201).json(result);
        })
        .catch((err) => {
          res.status(500).json({ message: 'Internal Server Error' });
          console.log(err);
        });
    });
  });
  //Skills Route
  router.post('/skills', verifyToken, (req, res) => {
    const collection = db.collection('skills');
    collection
      .insertOne({ _id: req.header('_id'), skills: req.body.skills })
      .then((result) => {
        res.status(200).json({ message: 'Skills added successfully' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(err);
      });
  });

  //login Mail Route
  router.post('/loginmail', (req, res) => {
    const collection = db.collection('users');
    const email = req.body.email;
    collection
      .findOne({ email: email })
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: 'User not found' });
        }
        const response = {
          status: 200,
          userId: result._id,
          message: `User ${result.name} Has been found`,
          role: result.role,
          token: jwt.sign(
            {
              userId: result._id,
              name: result.name,
              role: result.role,
              iss: 'http://localhost:4000',
            },
            JWT_SECRET,
            { expiresIn: 60 * 60 }
          ),
        };
        res.json(response);
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ message: 'Internal Server Error while finding user' });
      });
  });
  //login Route
  router.post('/login', (req, res) => {
    const collection = db.collection('users');
    const email = req.body.email;
    const password = req.body.password;

    collection
      .findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: 'Error while verifying password' });
          }

          if (!isMatch) {
            return res
              .status(401)
              .json({ message: 'Invalid email or password' });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              name: user.name,
              role: user.role,
              iss: 'http://localhost:4000',
            },
            JWT_SECRET,
            { expiresIn: 60 * 60 }
          );

          const response = {
            status: 200,
            userId: user._id,
            message: `User ${user.name} has logged in successfully`,
            role: user.role,
            token: token,
          };

          res.json(response);
        });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ message: 'Internal Server Error while logging in user' });
      });
  });
  //study Route
  router.post('/study', verifyToken, (req, res) => {
    const collection = db.collection('opleiding');
    const study = req.body.study;
    const _id = req.header('userId');
    collection
      .insertOne({ _id: _id, study: study })
      .then((result) => {
        res.status(200).json({ message: 'Study added' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(err);
      });
  });
  //experience route
  router.post('/experience', verifyToken, (req, res) => {
    const collection = db.collection('experience');

    collection
      .insertOne({
        _id: req.header('userId'),
        experience: req.body.inputs,
      })
      .then((result) => {
        res.status(200).json({ message: 'Experience added' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(err);
      });
  });
  //reference route
  router.post('/references', verifyToken, (req, res) => {
    const collection = db.collection('references');
    collection
      .insertOne({ _id: req.header('userId'), reference: req.body })
      .then((response) => {
        res.status(200).json({ message: 'Reference added' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(err);
      });
  });

  //get user route
  const { ObjectId } = require('mongodb');
  router.get('/studentInfo/:id', (req, res) => {
    const collection = db.collection('users');
    const collectionSkills = db.collection('skills');
    const collectionCourse = db.collection('opleiding');
    const collectionExperience = db.collection('experience');
    const collectionReference = db.collection('references');
    try {
      userId = new ObjectId(req.params.id);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    Promise.all([
      collection.findOne({ _id: userId }),
      collectionSkills.findOne({ _id: req.params.id }),
      collectionCourse.findOne({ _id: req.params.id }),
      collectionExperience.findOne({ _id: req.params.id }),
      collectionReference.findOne({ _id: req.params.id }),
    ])
      .then(([user, skills, Course, experience, reference]) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        if (!skills || !Course || !experience || !reference) {
          return res.status;
        }
        res.json({
          user,
          skills,
          Course,
          experience,
          reference,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  });

  //get all users route
  router.get('/users', checkAdmin, (req, res) => {
    const collection = db.collection('users');
    collection
      .find({})
      .toArray()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: 'Internal Server Error Finding Users' }, err);
      });
  });

  //test route
  router.get('/test/:id', (req, res) => {
    res.status(200).json({ message: 'Test route', id: req.params.id });
  });

  function checkAdmin(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: req.cookies.jwt });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      if (decoded.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized: not an admin' });
      }

      next();
    });
  }
  //delete user
  router.delete('/users/:id', checkAdmin, (req, res) => {
    const collection = db.collection('users');
    collection
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json({ message: 'User deleted successfully' });
      })
      .catch((err) => {
        console.log('error deleting user', err);
        console.log('res object:', res);
        if (res) {
          res.status(500).json({ message: 'Error deleting user' });
        } else {
          console.log('res is undefined');
        }
      });
  });

  //update user
  router.put('/users/:id', checkAdmin, (req, res) => {
    const collection = db.collection('users');
    collection
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { role: req.body.role } }
      )
      .then((result) => {
        res.status(200).json({ message: 'User updated successfully' });
      })
      .catch((err) => {
        console.log('Error updating user', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  });
  return router;
};
