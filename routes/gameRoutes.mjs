import express from 'express';
import { getDB } from '../db/connection.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET all games
router.get('/', async (req, res) => {
  const games = await getDB().collection('games').find().toArray();
  res.json(games);
});

// POST new game
router.post('/', async (req, res) => {
  const result = await getDB().collection('games').insertOne(req.body);
  res.status(201).json(result);
});

// PUT update game
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await getDB().collection('games').updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );
  res.json(result);
});

// DELETE game
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await getDB().collection('games').deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

export default router;
