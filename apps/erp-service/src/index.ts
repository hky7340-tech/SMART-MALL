import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3013;

app.use(cors());
app.use(express.json());

interface Invoice {
    id: string; type: 'revenue' | 'expense'; amount: number; category: string;
    description: string; status: 'draft' | 'approved' | 'paid'; createdAt: string; paidAt?: string;
}
interface Employee {
    id: string; name: string; email: string; department: string; position: string;
    salary: number; status: 'active' | 'resigned'; joinedAt: string;
}
interface Supplier {
    id: string; name: string; contact: string; email: string; phone: string;
    address: string; rating: number; status: 'active' | 'inactive';
}
interface Contract {
    id: string; title: string; type: string; party: string; value: number;
    startDate: string; endDate: string; status: 'active' | 'expired' | 'terminated';
    fileUrl: string; createdAt: string;
}

let invoices: Invoice[] = []; let employees: Employee[] = []; let suppliers: Supplier[] = []; let contracts: Contract[] = [];
let nextInv = 1, nextEmp = 1, nextSup = 1, nextCont = 1;

// Finance
app.get('/finance/revenue', (req, res) => {
    const { from, to } = req.query;
    let r = invoices.filter(i => i.type === 'revenue');
    if (from) r = r.filter(i => i.createdAt >= from);
    if (to) r = r.filter(i => i.createdAt <= to);
    res.json({ success: true, data: { total: r.reduce((s, i) => s + i.amount, 0), count: r.length, invoices: r } });
});
app.get('/finance/expenses', (req, res) => {
    const { from, to } = req.query;
    let r = invoices.filter(i => i.type === 'expense');
    if (from) r = r.filter(i => i.createdAt >= from);
    if (to) r = r.filter(i => i.createdAt <= to);
    res.json({ success: true, data: { total: r.reduce((s, i) => s + i.amount, 0), count: r.length, invoices: r } });
});
app.post('/finance/invoices', (req, res) => {
    const { type, amount, category, description } = req.body;
    if (!type || !amount) return res.status(400).json({ success: false, message: 'Type and amount required' });
    const inv: Invoice = { id: `inv_${nextInv++}`, type, amount: Number(amount), category: category || 'other', description: description || '', status: 'draft', createdAt: new Date().toISOString() };
    invoices.push(inv); res.status(201).json({ success: true, data: inv });
});

// HR
app.get('/hr/employees', (req, res) => {
    let r = [...employees]; const { department, status } = req.query;
    if (department) r = r.filter(e => e.department === department);
    if (status) r = r.filter(e => e.status === status);
    res.json({ success: true, data: r });
});
app.post('/hr/employees', (req, res) => {
    const { name, email, department, position, salary } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });
    const emp: Employee = { id: `emp_${nextEmp++}`, name, email, department: department || '', position: position || '', salary: salary || 0, status: 'active', joinedAt: new Date().toISOString() };
    employees.push(emp); res.status(201).json({ success: true, data: emp });
});
app.get('/hr/payroll', (req, res) => {
    const total = employees.reduce((s, e) => s + e.salary, 0);
    res.json({ success: true, data: { total, count: employees.length, employees } });
});

// Procurement
app.get('/procurement/suppliers', (req, res) => {
    let r = [...suppliers]; const { status } = req.query;
    if (status) r = r.filter(s => s.status === status);
    res.json({ success: true, data: r });
});
app.post('/procurement/suppliers', (req, res) => {
    const { name, contact, email, phone } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    const sup: Supplier = { id: `sup_${nextSup++}`, name, contact: contact || '', email: email || '', phone: phone || '', address: '', rating: 0, status: 'active' };
    suppliers.push(sup); res.status(201).json({ success: true, data: sup });
});

// Contracts
app.get('/contracts', (req, res) => {
    let r = [...contracts]; const { status, type } = req.query;
    if (status) r = r.filter(c => c.status === status);
    if (type) r = r.filter(c => c.type === type);
    res.json({ success: true, data: r });
});
app.post('/contracts', (req, res) => {
    const { title, type, party, value, startDate, endDate } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    const cont: Contract = { id: `cont_${nextCont++}`, title, type: type || 'service', party: party || '', value: value || 0, startDate: startDate || '', endDate: endDate || '', status: 'active', fileUrl: '', createdAt: new Date().toISOString() };
    contracts.push(cont); res.status(201).json({ success: true, data: cont });
});

app.get('/dashboard', (req, res) => {
    const revenue = invoices.filter(i => i.type === 'revenue').reduce((s, i) => s + i.amount, 0);
    const expenses = invoices.filter(i => i.type === 'expense').reduce((s, i) => s + i.amount, 0);
    res.json({ success: true, data: { finance: { revenue, expenses, profit: revenue - expenses }, employees: { total: employees.length, active: employees.filter(e => e.status === 'active').length }, suppliers: { total: suppliers.length }, contracts: { total: contracts.length, active: contracts.filter(c => c.status === 'active').length } } });
});

app.listen(PORT, () => console.log(`🏭 ERP Service running on port ${PORT}`));
export default app;