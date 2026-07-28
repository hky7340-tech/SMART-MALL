import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface UserAccount {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'customer' | 'store_owner' | 'staff';
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
}

const users = new Map<string, UserAccount>();
let nextId = 1;
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// ==================== REGISTER ====================
app.post('/register', (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Email, password and name are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }
  if (users.has(email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user: UserAccount = {
    id: nextId++,
    email,
    password,
    name,
    role: 'customer',
    phone: phone || '',
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };
  users.set(email, user);

  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

  // Auto-verify for demo purposes
  user.emailVerified = true;

  res.json({
    success: true,
    message: 'Registration successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
});

// ==================== LOGIN ====================
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const account = Array.from(users.values()).find(u => u.email === email);
  if (!account) {
    return res.status(401).json({ success: false, message: 'Account not found. Please register first.' });
  }
  if (account.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: { id: account.id, name: account.name, email: account.email, role: account.role, phone: account.phone },
  });
});

// ==================== VERIFY TOKEN ====================
app.get('/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString();
    const email = decoded.split(':')[0];
    const account = users.get(email);
    if (!account) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.json({
      success: true,
      user: { id: account.id, name: account.name, email: account.email, role: account.role, phone: account.phone },
    });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ==================== SEND OTP ====================
app.post('/otp/send', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, { code, expiresAt: Date.now() + 300000 }); // 5 min expiry

  console.log(`[OTP] Sent to ${email}: ${code}`); // In production, send via email/SMS
  res.json({ success: true, message: 'OTP sent successfully', debug: code });
});

// ==================== VERIFY OTP ====================
app.post('/otp/verify', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: 'Email and code required' });

  const stored = otpStore.get(email);
  if (!stored) return res.status(400).json({ success: false, message: 'No OTP sent to this email' });
  if (Date.now() > stored.expiresAt) return res.status(400).json({ success: false, message: 'OTP expired' });
  if (stored.code !== code) return res.status(400).json({ success: false, message: 'Invalid OTP' });

  otpStore.delete(email);

  // Mark email as verified
  const account = users.get(email);
  if (account) {
    account.emailVerified = true;
    users.set(email, account);
  }

  res.json({ success: true, message: 'OTP verified successfully' });
});

// ==================== FORGOT PASSWORD ====================
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });

  const account = Array.from(users.values()).find(u => u.email === email);
  if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, { code, expiresAt: Date.now() + 300000 });
  console.log(`[OTP] Forgot password for ${email}: ${code}`);

  res.json({ success: true, message: 'OTP sent for password reset', debug: code });
});

// ==================== RESET PASSWORD ====================
app.post('/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, code and newPassword required' });
  }

  const stored = otpStore.get(email);
  if (!stored) return res.status(400).json({ success: false, message: 'No OTP sent' });
  if (Date.now() > stored.expiresAt) return res.status(400).json({ success: false, message: 'OTP expired' });
  if (stored.code !== code) return res.status(400).json({ success: false, message: 'Invalid OTP' });

  otpStore.delete(email);

  const account = Array.from(users.values()).find(u => u.email === email);
  if (account) {
    account.password = newPassword;
    users.set(account.email, account);
  }

  res.json({ success: true, message: 'Password reset successful' });
});

app.listen(PORT, () => console.log(`🔐 Auth Service running on port ${PORT}`));
export default app;