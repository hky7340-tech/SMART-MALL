import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3008;

app.use(cors());
app.use(express.json());

// ==================== TYPES ====================
interface LoyaltyPoints {
    userId: number;
    balance: number;
    lifetimePoints: number;
    tier: 'silver' | 'gold' | 'platinum' | 'diamond' | 'vip';
    createdAt: string;
}

interface PointTransaction {
    id: string;
    userId: number;
    type: 'earn' | 'spend' | 'expire' | 'bonus';
    amount: number;
    balance: number;
    description: string;
    referenceId?: string;
    createdAt: string;
}

interface Tier {
    id: string;
    name: string;
    minPoints: number;
    benefits: string[];
    discountPercent: number;
}

interface Reward {
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    image: string;
    stock: number;
    isActive: boolean;
}

interface Checkin {
    id: string;
    userId: number;
    date: string;
    streak: number;
    pointsEarned: number;
}

interface Quest {
    id: string;
    title: string;
    description: string;
    type: 'daily' | 'weekly' | 'event';
    pointsReward: number;
    condition: string;
    isActive: boolean;
}

interface UserQuest {
    id: string;
    userId: number;
    questId: string;
    progress: number;
    target: number;
    completed: boolean;
    claimed: boolean;
}

interface LuckyWheel {
    id: string;
    name: string;
    spinsPerDay: number;
    rewards: WheelReward[];
    isActive: boolean;
}

interface WheelReward {
    label: string;
    type: 'points' | 'voucher' | 'gift';
    value: number;
    probability: number;
}

// ==================== DATA STORE ====================
const pointsMap = new Map<number, LoyaltyPoints>();
const transactions: PointTransaction[] = [];
let nextTxnId = 1;
const checkins: Checkin[] = [];
let nextCheckinId = 1;
const userQuests: UserQuest[] = [];
let nextUqId = 1;

const tiers: Tier[] = [
    { id: 'tier_1', name: 'Silver', minPoints: 0, discountPercent: 0, benefits: ['Tích điểm 1%', 'Quà sinh nhật'] },
    { id: 'tier_2', name: 'Gold', minPoints: 1000, discountPercent: 3, benefits: ['Tích điểm 2%', 'Quà sinh nhật', 'Giảm 3%'] },
    { id: 'tier_3', name: 'Platinum', minPoints: 5000, discountPercent: 5, benefits: ['Tích điểm 3%', 'Quà sinh nhật', 'Giảm 5%', 'Ưu tiên đặt chỗ'] },
    { id: 'tier_4', name: 'Diamond', minPoints: 20000, discountPercent: 10, benefits: ['Tích điểm 5%', 'Quà sinh nhật', 'Giảm 10%', 'Ưu tiên đặt chỗ', 'Sự kiện exclusive'] },
    { id: 'tier_5', name: 'VIP', minPoints: 50000, discountPercent: 15, benefits: ['Tích điểm 7%', 'Quà sinh nhật', 'Giảm 15%', 'Hỗ trợ riêng', 'Sự kiện exclusive', 'Quà tặng VIP'] },
];

const rewards: Reward[] = [
    { id: 'rew_1', name: 'Voucher 50,000đ', description: 'Giảm 50,000đ cho đơn hàng từ 200,000đ', pointsRequired: 500, image: '', stock: 100, isActive: true },
    { id: 'rew_2', name: 'Voucher 100,000đ', description: 'Giảm 100,000đ cho đơn hàng từ 500,000đ', pointsRequired: 1000, image: '', stock: 50, isActive: true },
    { id: 'rew_3', name: 'Túi tote Smart Mall', description: 'Túi tote phiên bản giới hạn', pointsRequired: 2000, image: '', stock: 30, isActive: true },
    { id: 'rew_4', name: 'Voucher 500,000đ', description: 'Giảm 500,000đ cho đơn hàng từ 2,000,000đ', pointsRequired: 5000, image: '', stock: 10, isActive: true },
];

const quests: Quest[] = [
    { id: 'q_1', title: 'Điểm danh hàng ngày', description: 'Check-in mỗi ngày để nhận điểm', type: 'daily', pointsReward: 10, condition: 'checkin', isActive: true },
    { id: 'q_2', title: 'Xem 5 sản phẩm', description: 'Xem ít nhất 5 sản phẩm trong ngày', type: 'daily', pointsReward: 5, condition: 'view_products', isActive: true },
    { id: 'q_3', title: 'Mua 1 đơn hàng', description: 'Hoàn thành 1 đơn hàng trong tuần', type: 'weekly', pointsReward: 50, condition: 'purchase', isActive: true },
    { id: 'q_4', title: 'Đánh giá 3 sản phẩm', description: 'Viết đánh giá cho 3 sản phẩm', type: 'weekly', pointsReward: 30, condition: 'review', isActive: true },
    { id: 'q_5', title: 'Mời bạn bè', description: 'Giới thiệu bạn đăng ký tài khoản', type: 'weekly', pointsReward: 100, condition: 'referral', isActive: true },
];

const luckyWheels: LuckyWheel[] = [
    {
        id: 'wheel_1', name: 'Vòng quay may mắn', spinsPerDay: 1, isActive: true,
        rewards: [
            { label: '10 điểm', type: 'points', value: 10, probability: 0.3 },
            { label: '20 điểm', type: 'points', value: 20, probability: 0.25 },
            { label: '50 điểm', type: 'points', value: 50, probability: 0.2 },
            { label: 'Voucher 50k', type: 'voucher', value: 50000, probability: 0.1 },
            { label: '100 điểm', type: 'points', value: 100, probability: 0.1 },
            { label: 'Voucher 200k', type: 'voucher', value: 200000, probability: 0.05 },
        ],
    },
];

// ==================== HELPER FUNCTIONS ====================
function getOrCreatePoints(userId: number): LoyaltyPoints {
    if (!pointsMap.has(userId)) {
        pointsMap.set(userId, {
            userId, balance: 0, lifetimePoints: 0, tier: 'silver', createdAt: new Date().toISOString(),
        });
    }
    return pointsMap.get(userId)!;
}

function calculateTier(lifetimePoints: number): LoyaltyPoints['tier'] {
    const sorted = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
    for (const t of sorted) {
        if (lifetimePoints >= t.minPoints) return t.name.toLowerCase() as LoyaltyPoints['tier'];
    }
    return 'silver';
}

// ==================== POINTS API ====================
app.get('/points', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const points = getOrCreatePoints(Number(userId));
    res.json({ success: true, data: points });
});

app.get('/transactions', (req, res) => {
    const { userId, page = '1', limit = '20' } = req.query;
    let result = [...transactions];
    if (userId) result = result.filter(t => t.userId === Number(userId));
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    res.json({
        success: true, data: result.slice(startIndex, startIndex + limitNum),
        pagination: { page: pageNum, limit: limitNum, total: result.length },
    });
});

app.post('/points/add', (req, res) => {
    const { userId, amount, description, referenceId } = req.body;
    if (!userId || !amount) return res.status(400).json({ success: false, message: 'userId and amount are required' });
    const points = getOrCreatePoints(Number(userId));
    points.balance += Number(amount);
    points.lifetimePoints += Number(amount);
    points.tier = calculateTier(points.lifetimePoints);
    const txn: PointTransaction = {
        id: `PTXN_${String(nextTxnId++).padStart(6, '0')}`,
        userId: Number(userId), type: 'earn', amount: Number(amount),
        balance: points.balance, description: description || 'Tích điểm',
        referenceId, createdAt: new Date().toISOString(),
    };
    transactions.push(txn);
    res.json({ success: true, message: 'Points added', data: { points, transaction: txn } });
});

app.post('/points/spend', (req, res) => {
    const { userId, amount, description } = req.body;
    if (!userId || !amount) return res.status(400).json({ success: false, message: 'userId and amount are required' });
    const points = getOrCreatePoints(Number(userId));
    if (points.balance < Number(amount)) return res.status(400).json({ success: false, message: 'Insufficient points' });
    points.balance -= Number(amount);
    const txn: PointTransaction = {
        id: `PTXN_${String(nextTxnId++).padStart(6, '0')}`,
        userId: Number(userId), type: 'spend', amount: Number(amount),
        balance: points.balance, description: description || 'Tiêu điểm',
        createdAt: new Date().toISOString(),
    };
    transactions.push(txn);
    res.json({ success: true, message: 'Points spent', data: { points, transaction: txn } });
});

// ==================== TIERS API ====================
app.get('/tiers', (req, res) => {
    res.json({ success: true, data: tiers });
});

app.get('/tiers/:id', (req, res) => {
    const tier = tiers.find(t => t.id === req.params.id);
    if (!tier) return res.status(404).json({ success: false, message: 'Tier not found' });
    res.json({ success: true, data: tier });
});

// ==================== REWARDS API ====================
app.get('/rewards', (req, res) => {
    res.json({ success: true, data: rewards.filter(r => r.isActive) });
});

app.post('/rewards/:id/redeem', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const reward = rewards.find(r => r.id === req.params.id);
    if (!reward) return res.status(404).json({ success: false, message: 'Reward not found' });
    if (!reward.isActive) return res.status(400).json({ success: false, message: 'Reward is not active' });
    if (reward.stock <= 0) return res.status(400).json({ success: false, message: 'Reward out of stock' });
    const points = getOrCreatePoints(Number(userId));
    if (points.balance < reward.pointsRequired) return res.status(400).json({ success: false, message: 'Insufficient points' });
    points.balance -= reward.pointsRequired;
    reward.stock--;
    const txn: PointTransaction = {
        id: `PTXN_${String(nextTxnId++).padStart(6, '0')}`,
        userId: Number(userId), type: 'spend', amount: reward.pointsRequired,
        balance: points.balance, description: `Đổi quà: ${reward.name}`,
        createdAt: new Date().toISOString(),
    };
    transactions.push(txn);
    res.json({ success: true, message: 'Reward redeemed', data: { reward, transaction: txn, points } });
});

// ==================== CHECKIN API ====================
app.post('/checkin', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const today = new Date().toISOString().split('T')[0];
    const existing = checkins.find(c => c.userId === Number(userId) && c.date === today);
    if (existing) return res.status(400).json({ success: false, message: 'Already checked in today' });
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastCheckin = checkins.filter(c => c.userId === Number(userId)).sort((a, b) => b.date.localeCompare(a.date))[0];
    const streak = lastCheckin && lastCheckin.date === yesterday ? lastCheckin.streak + 1 : 1;
    const pointsEarned = Math.min(10 + (streak - 1) * 2, 50);
    const checkin: Checkin = {
        id: `CK_${String(nextCheckinId++).padStart(6, '0')}`,
        userId: Number(userId), date: today, streak, pointsEarned,
    };
    checkins.push(checkin);
    const points = getOrCreatePoints(Number(userId));
    points.balance += pointsEarned;
    points.lifetimePoints += pointsEarned;
    points.tier = calculateTier(points.lifetimePoints);
    const txn: PointTransaction = {
        id: `PTXN_${String(nextTxnId++).padStart(6, '0')}`,
        userId: Number(userId), type: 'earn', amount: pointsEarned,
        balance: points.balance, description: `Điểm danh ngày ${today} (streak: ${streak})`,
        createdAt: new Date().toISOString(),
    };
    transactions.push(txn);
    res.json({ success: true, message: 'Check-in successful', data: { checkin, points, transaction: txn } });
});

app.get('/checkin/history', (req, res) => {
    const { userId, page = '1', limit = '30' } = req.query;
    let result = [...checkins];
    if (userId) result = result.filter(c => c.userId === Number(userId));
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    res.json({
        success: true, data: result.slice(startIndex, startIndex + limitNum),
        pagination: { page: pageNum, limit: limitNum, total: result.length },
    });
});

// ==================== GAMIFICATION API ====================
app.get('/quests', (req, res) => {
    const { type } = req.query;
    let result = quests.filter(q => q.isActive);
    if (type) result = result.filter(q => q.type === type);
    res.json({ success: true, data: result });
});

app.get('/quests/my', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const uid = Number(userId);
    const myQuests = quests.filter(q => q.isActive).map(q => {
        const existing = userQuests.find(uq => uq.userId === uid && uq.questId === q.id);
        return existing || {
            id: `uq_${uid}_${q.id}`, userId: uid, questId: q.id,
            progress: 0, target: 1, completed: false, claimed: false,
        };
    });
    res.json({ success: true, data: myQuests });
});

app.post('/quests/:id/progress', (req, res) => {
    const { userId, progress } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const quest = quests.find(q => q.id === req.params.id);
    if (!quest) return res.status(404).json({ success: false, message: 'Quest not found' });
    const uid = Number(userId);
    let uq = userQuests.find(q => q.userId === uid && q.questId === quest.id);
    if (!uq) {
        uq = { id: `uq_${String(nextUqId++).padStart(6, '0')}`, userId: uid, questId: quest.id, progress: 0, target: 1, completed: false, claimed: false };
        userQuests.push(uq);
    }
    uq.progress += Number(progress) || 1;
    if (uq.progress >= uq.target) uq.completed = true;
    res.json({ success: true, data: uq });
});

app.post('/quests/:id/claim', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const quest = quests.find(q => q.id === req.params.id);
    if (!quest) return res.status(404).json({ success: false, message: 'Quest not found' });
    const uid = Number(userId);
    const uq = userQuests.find(q => q.userId === uid && q.questId === quest.id);
    if (!uq || !uq.completed) return res.status(400).json({ success: false, message: 'Quest not completed' });
    if (uq.claimed) return res.status(400).json({ success: false, message: 'Quest already claimed' });
    uq.claimed = true;
    const points = getOrCreatePoints(uid);
    points.balance += quest.pointsReward;
    points.lifetimePoints += quest.pointsReward;
    points.tier = calculateTier(points.lifetimePoints);
    const txn: PointTransaction = {
        id: `PTXN_${String(nextTxnId++).padStart(6, '0')}`,
        userId: uid, type: 'earn', amount: quest.pointsReward,
        balance: points.balance, description: `Hoàn thành nhiệm vụ: ${quest.title}`,
        createdAt: new Date().toISOString(),
    };
    transactions.push(txn);
    res.json({ success: true, message: 'Reward claimed', data: { points, transaction: txn } });
});

// ==================== LUCKY WHEEL API ====================
app.get('/wheel', (req, res) => {
    res.json({ success: true, data: luckyWheels.filter(w => w.isActive) });
});

app.post('/wheel/spin', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const wheel = luckyWheels.find(w => w.isActive);
    if (!wheel) return res.status(400).json({ success: false, message: 'No active wheel' });
    const today = new Date().toISOString().split('T')[0];
    const spinsToday = checkins.filter(c => c.userId === Number(userId) && c.date === today).length;
    if (spinsToday >= wheel.spinsPerDay) return res.status(400).json({ success: false, message: 'No spins left today' });
    const rand = Math.random();
    let cumulative = 0;
    let selected = wheel.rewards[0];
    for (const r of wheel.rewards) {
        cumulative += r.probability;
        if (rand <= cumulative) { selected = r; break; }
    }
    const points = getOrCreatePoints(Number(userId));
    if (selected.type === 'points') {
        points.balance += selected.value;
        points.lifetimePoints += selected.value;
        points.tier = calculateTier(points.lifetimePoints);
    }
    res.json({ success: true, data: { reward: selected, points } });
});

// ==================== LEADERBOARD API ====================
app.get('/leaderboard', (req, res) => {
    const { period = 'all', limit = '10' } = req.query;
    const sorted = Array.from(pointsMap.values()).sort((a, b) => b.lifetimePoints - a.lifetimePoints);
    const top = sorted.slice(0, Number(limit)).map((p, i) => ({
        rank: i + 1, userId: p.userId, points: p.lifetimePoints, tier: p.tier,
    }));
    res.json({ success: true, data: top });
});

app.listen(PORT, () => console.log(`🎯 Loyalty Service running on port ${PORT}`));
export default app;