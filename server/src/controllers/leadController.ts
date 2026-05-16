import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { leadCreateSchema, leadUpdateSchema } from '../validations/leadSchema';
import { Parser } from 'json2csv';

export const getLeads = async (req: Request, res: Response) => {
  try {
    const { status, source, search, sort, page = 1, limit = 10 } = req.query;
    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    const total = await Lead.countDocuments(query);
    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: leads
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const validatedData = leadCreateSchema.parse(req.body);
    const lead = await Lead.create(validatedData);
    res.status(201).json({ success: true, data: lead });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors || err.message });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const validatedData = leadUpdateSchema.parse(req.body);
    const lead = await Lead.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true
    });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors || err.message });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const exportLeadsCSV = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    const fields = ['name', 'email', 'status', 'source', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
