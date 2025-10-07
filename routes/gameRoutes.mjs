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

// UPDATE a game by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const result = await getDB().collection('games').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ message: 'Game updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating game' });
  }
});

// DELETE game
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await getDB().collection('games').deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

export default router;
