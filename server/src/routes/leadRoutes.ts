import express from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV
} from '../controllers/leadController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/v1/leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 */
router.get('/', getLeads);
router.get('/export', exportLeadsCSV);
router.get('/:id', getLead);

/**
 * @swagger
 * /api/v1/leads:
 *   post:
 *     summary: Create lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Lead created successfully
 */
router.post('/', createLead);
router.put('/:id', updateLead);

/**
 * @swagger
 * /api/v1/leads/{id}:
 *   delete:
 *     summary: Delete lead (Admin only)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 */
router.delete('/:id', authorize('Admin'), deleteLead); // Only Admin can delete

export default router;
