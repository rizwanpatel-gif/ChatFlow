import { Router, Request, Response } from 'express'
import { pool } from '../db'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM flows ORDER BY updated_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch flows' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM flows WHERE id = $1', [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Flow not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch flow' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name = 'My Flow', nodes = [], edges = [] } = req.body
    const result = await pool.query(
      `INSERT INTO flows (name, nodes, edges) VALUES ($1, $2, $3) RETURNING *`,
      [name, JSON.stringify(nodes), JSON.stringify(edges)]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create flow' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name = 'My Flow', nodes = [], edges = [] } = req.body
    const result = await pool.query(
      `UPDATE flows SET name = $1, nodes = $2, edges = $3, updated_at = NOW() WHERE id = $4 RETURNING *`,
      [name, JSON.stringify(nodes), JSON.stringify(edges), id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Flow not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update flow' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM flows WHERE id = $1', [id])
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete flow' })
  }
})

export default router
