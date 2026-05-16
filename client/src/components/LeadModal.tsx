import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader } from './ui/Card';
import { X } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import type { Lead } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead | null;
  isViewOnly?: boolean;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSuccess, lead, isViewOnly }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'New',
    source: 'Website',
    createdAt: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        createdAt: new Date(lead.createdAt).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewOnly) return;
    setLoading(true);
    try {
      if (lead) {
        await api.put(`/leads/${lead._id}`, formData);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', formData);
        toast.success('Lead created successfully');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <h2 className="text-xl font-bold">
              {isViewOnly ? 'Lead Details' : lead ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter lead name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isViewOnly}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isViewOnly}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-800 dark:bg-slate-950 disabled:opacity-50"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={isViewOnly}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Source</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-800 dark:bg-slate-950 disabled:opacity-50"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    disabled={isViewOnly}
                  >
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>
              <Input
                label="Created At"
                type="date"
                value={formData.createdAt}
                onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                required
                disabled={isViewOnly}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={onClose}>
                  {isViewOnly ? 'Close' : 'Cancel'}
                </Button>
                {!isViewOnly && (
                  <Button type="submit" isLoading={loading}>
                    {lead ? 'Update Lead' : 'Create Lead'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
