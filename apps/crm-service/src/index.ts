import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3012;

app.use(cors());
app.use(express.json());

interface Lead {
    id: string; name: string; email: string; phone: string; source: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    score: number; notes: string; createdAt: string;
}
interface Campaign {
    id: string; name: string; type: 'email' | 'sms' | 'push' | 'social';
    status: 'draft' | 'running' | 'completed' | 'paused';
    segment: string; sent: number; opened: number; clicked: number; converted: number;
    budget: number; startDate: string; endDate: string; createdAt: string;
}
interface Ticket {
    id: string; customerId: number; subject: string; description: string;
    category: string; priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    assignedTo: string; createdAt: string; resolvedAt?: string;
}

const leads: Lead[] = []; const campaigns: Campaign[] = []; const tickets: Ticket[] = [];
let nextLead = 1, nextCamp = 1, nextTicket = 1;

app.get('/leads', (req, res) => {
    let r = [...leads]; const { status, source } = req.query;
    if (status) r = r.filter(l => l.status === status);
    if (source) r = r.filter(l => l.source === source);
    res.json({ success: true, data: r });
});
app.post('/leads', (req, res) => {
    const { name, email, phone, source } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    const lead: Lead = { id: `lead_${nextLead++}`, name, email: email || '', phone: phone || '', source: source || 'manual', status: 'new', score: 0, notes: '', createdAt: new Date().toISOString() };
    leads.push(lead); res.status(201).json({ success: true, data: lead });
});
app.put('/leads/:id/status', (req, res) => {
    const lead = leads.find(l => l.id === req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    lead.status = req.body.status || lead.status; lead.score = req.body.score || lead.score;
    res.json({ success: true, data: lead });
});

app.get('/campaigns', (req, res) => {
    let r = [...campaigns]; const { status, type } = req.query;
    if (status) r = r.filter(c => c.status === status);
    if (type) r = r.filter(c => c.type === type);
    res.json({ success: true, data: r });
});
app.post('/campaigns', (req, res) => {
    const { name, type, segment, budget } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    const camp: Campaign = { id: `camp_${nextCamp++}`, name, type: type || 'email', status: 'draft', segment: segment || 'all', sent: 0, opened: 0, clicked: 0, converted: 0, budget: budget || 0, startDate: '', endDate: '', createdAt: new Date().toISOString() };
    campaigns.push(camp); res.status(201).json({ success: true, data: camp });
});
app.put('/campaigns/:id/launch', (req, res) => {
    const camp = campaigns.find(c => c.id === req.params.id);
    if (!camp) return res.status(404).json({ success: false, message: 'Campaign not found' });
    camp.status = 'running'; camp.startDate = new Date().toISOString();
    res.json({ success: true, data: camp });
});

app.get('/tickets', (req, res) => {
    let r = [...tickets]; const { status, priority, category } = req.query;
    if (status) r = r.filter(t => t.status === status);
    if (priority) r = r.filter(t => t.priority === priority);
    if (category) r = r.filter(t => t.category === category);
    res.json({ success: true, data: r });
});
app.post('/tickets', (req, res) => {
    const { customerId, subject, description, category, priority } = req.body;
    if (!subject) return res.status(400).json({ success: false, message: 'Subject required' });
    const ticket: Ticket = { id: `tkt_${nextTicket++}`, customerId: customerId || 0, subject, description: description || '', category: category || 'general', priority: priority || 'medium', status: 'open', assignedTo: '', createdAt: new Date().toISOString() };
    tickets.push(ticket); res.status(201).json({ success: true, data: ticket });
});
app.put('/tickets/:id/status', (req, res) => {
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    ticket.status = req.body.status || ticket.status;
    if (ticket.status === 'resolved') ticket.resolvedAt = new Date().toISOString();
    if (req.body.assignedTo) ticket.assignedTo = req.body.assignedTo;
    res.json({ success: true, data: ticket });
});

app.get('/dashboard', (req, res) => {
    res.json({
        success: true, data: {
            leads: { total: leads.length, byStatus: { new: leads.filter(l => l.status === 'new').length, contacted: leads.filter(l => l.status === 'contacted').length, qualified: leads.filter(l => l.status === 'qualified').length, converted: leads.filter(l => l.status === 'converted').length } },
            campaigns: { total: campaigns.length, running: campaigns.filter(c => c.status === 'running').length },
            tickets: { total: tickets.length, open: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length, resolved: tickets.filter(t => t.status === 'resolved').length },
        }
    });
});

app.listen(PORT, () => console.log(`🤝 CRM Service running on port ${PORT}`));
export default app;