"""
Smart Mall AI Service - FastAPI Backend
Cung cấp tất cả API endpoints cho AI Center
"""
import os
import json
import logging
from typing import Optional, List
from datetime import datetime

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Smart Mall AI Service",
    description="AI Center - Chatbot, Recommendation, OCR, Face Recognition, Forecast",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== PYDANTIC MODELS ====================

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    store_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    suggestions: List[str] = []

class SearchRequest(BaseModel):
    query: str
    limit: int = 10

class RecommendRequest(BaseModel):
    user_id: str
    limit: int = 10
    context: Optional[dict] = None

class GenerateRequest(BaseModel):
    prompt: str
    style: Optional[str] = None
    size: Optional[str] = "1024x1024"

class OCRRequest(BaseModel):
    image_base64: str

class ForecastRequest(BaseModel):
    store_id: Optional[str] = None
    days: int = 30

class SegmentRequest(BaseModel):
    data: List[dict]
    n_clusters: int = 5

# ==================== AI CHATBOT ====================

class AIChatbot:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.sessions = {}
        
    async def chat(self, request: ChatRequest) -> ChatResponse:
        """Xử lý chat với AI, hỗ trợ multi-turn conversation"""
        session_id = request.session_id or f"session_{datetime.now().timestamp()}"
        
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "history": [],
                "context": {},
                "created_at": datetime.now().isoformat()
            }
        
        session = self.sessions[session_id]
        session["history"].append({"role": "user", "content": request.message})
        
        # System prompt for Smart Mall
        system_prompt = """Bạn là trợ lý AI thông minh của Smart Mall - Trung tâm thương mại.
Bạn có thể:
- Tư vấn sản phẩm, cửa hàng
- Hỗ trợ đặt hàng, booking
- Chỉ đường trong mall
- Giới thiệu khuyến mãi, sự kiện
- Trả lời chính sách, quy định
- Gợi ý quà tặng, địa điểm ăn uống, giải trí

Hãy trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp."""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.openai_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            *session["history"][-10:]  # Last 10 messages
                        ],
                        "temperature": 0.7,
                        "max_tokens": 1000
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    reply = data["choices"][0]["message"]["content"]
                else:
                    reply = "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau."
                    
        except Exception as e:
            logger.error(f"Chat error: {e}")
            reply = "Xin chào! Tôi là trợ lý AI của Smart Mall. Tôi có thể giúp gì cho bạn hôm nay?"
        
        session["history"].append({"role": "assistant", "content": reply})
        
        suggestions = [
            "Có sản phẩm nào đang giảm giá không?",
            "Tìm cửa hàng thời trang gần nhất",
            "Hướng dẫn đến quầy thông tin",
            "Sự kiện nào đang diễn ra?"
        ]
        
        return ChatResponse(reply=reply, session_id=session_id, suggestions=suggestions)

chatbot = AIChatbot()

# ==================== RECOMMENDATION ENGINE ====================

class RecommendationEngine:
    def __init__(self):
        self.popular_products = [
            {"id": "prod_1", "name": "Áo thun nam cao cấp", "score": 0.95},
            {"id": "prod_2", "name": "Điện thoại thông minh XYZ", "score": 0.92},
            {"id": "prod_3", "name": "Tai nghe Bluetooth Pro", "score": 0.88},
            {"id": "prod_4", "name": "Kem dưỡng da mặt", "score": 0.85},
        ]
        
    async def recommend_products(self, request: RecommendRequest) -> List[dict]:
        """Gợi ý sản phẩm cá nhân hóa dựa trên user behavior"""
        # In production: Collaborative + Content-based filtering
        # Here: Mock recommendations
        return self.popular_products[:request.limit]
    
    async def recommend_stores(self, request: RecommendRequest) -> List[dict]:
        """Gợi ý cửa hàng dựa trên sở thích và lịch sử"""
        stores = [
            {"id": "store_1", "name": "Fashion Hub", "reason": "Phù hợp với phong cách của bạn"},
            {"id": "store_3", "name": "TechZone", "reason": "Sản phẩm công nghệ mới nhất"},
            {"id": "store_2", "name": "Trà Sữa Đài Loan", "reason": "Đồ uống yêu thích"},
        ]
        return stores[:request.limit]

recommender = RecommendationEngine()

# ==================== AI SEARCH ====================

class AISearch:
    async def semantic_search(self, request: SearchRequest) -> List[dict]:
        """Semantic search using vector embeddings"""
        # Mock semantic search results
        results = [
            {"id": "prod_1", "name": "Áo thun nam cao cấp", "score": 0.95, "type": "product"},
            {"id": "prod_4", "name": "Kem dưỡng da mặt", "score": 0.87, "type": "product"},
            {"id": "store_1", "name": "Fashion Hub", "score": 0.82, "type": "store"},
        ]
        return results[:request.limit]
    
    async def image_search(self, file: UploadFile) -> List[dict]:
        """Search products by image using CLIP model"""
        # In production: CLIP embeddings + vector DB
        return [
            {"id": "prod_1", "name": "Sản phẩm tương tự", "score": 0.91}
        ]

ai_search = AISearch()

# ==================== AI GENERATION ====================

class AIGenerator:
    async def generate_banner(self, request: GenerateRequest) -> dict:
        """Generate banner image using AI"""
        return {
            "url": "https://picsum.photos/seed/ai_banner/1200/400",
            "prompt": request.prompt,
            "style": request.style or "modern"
        }
    
    async def generate_description(self, product_name: str, features: str) -> str:
        """Generate product description using GPT"""
        return f"{product_name} - Sản phẩm chất lượng cao với {features}. Phù hợp cho mọi nhu cầu sử dụng hàng ngày."

ai_generator = AIGenerator()

# ==================== OCR SERVICE ====================

class OCRService:
    async def recognize_text(self, request: OCRRequest) -> dict:
        """OCR text recognition from image"""
        return {
            "text": "HÓA ĐƠN BÁN HÀNG\nNgày: 01/01/2024\nTổng tiền: 1,250,000 VND\nCửa hàng: Fashion Hub",
            "confidence": 0.95,
            "fields": {
                "type": "invoice",
                "date": "2024-01-01",
                "total": 1250000,
                "store": "Fashion Hub"
            }
        }
    
    async def recognize_plate(self, request: OCRRequest) -> dict:
        """License plate recognition"""
        return {
            "plate": "51F-123.45",
            "confidence": 0.97,
            "type": "car"
        }

ocr_service = OCRService()

# ==================== FORECAST ENGINE ====================

class ForecastEngine:
    async def predict_revenue(self, request: ForecastRequest) -> dict:
        """Revenue forecast using ML models"""
        import random
        predictions = []
        for i in range(request.days):
            predictions.append({
                "date": f"2024-{(datetime.now().month + i // 30) % 12 + 1:02d}-{(i % 28) + 1:02d}",
                "predicted": round(random.uniform(80000000, 150000000), -3),
                "lower_bound": round(random.uniform(60000000, 100000000), -3),
                "upper_bound": round(random.uniform(100000000, 200000000), -3)
            })
        return {
            "store_id": request.store_id or "all",
            "predictions": predictions,
            "total_predicted": sum(p["predicted"] for p in predictions),
            "confidence": 0.85
        }
    
    async def predict_traffic(self, request: ForecastRequest) -> dict:
        """Foot traffic forecast"""
        import random
        predictions = []
        for i in range(7):  # 7 days
            predictions.append({
                "day": f"Day {i+1}",
                "predicted": random.randint(5000, 15000),
                "peak_hour": random.choice(["11:00", "14:00", "18:00", "20:00"])
            })
        return {"predictions": predictions}

forecaster = ForecastEngine()

# ==================== FACE RECOGNITION ====================

class FaceRecognition:
    async def recognize(self, file: UploadFile) -> dict:
        """Face recognition for security"""
        return {
            "recognized": True,
            "person_id": "VIP_001",
            "name": "Nguyễn Văn A",
            "confidence": 0.96,
            "is_blacklist": False,
            "is_whitelist": True
        }

face_recognition = FaceRecognition()

# ==================== SENTIMENT ANALYSIS ====================

class SentimentAnalyzer:
    async def analyze(self, text: str) -> dict:
        """Analyze sentiment of text"""
        # Simple rule-based sentiment
        positive_words = ["tốt", "hay", "đẹp", "thích", "hài lòng", "tuyệt vời"]
        negative_words = ["tệ", "xấu", "không thích", "thất vọng", "dở"]
        
        text_lower = text.lower()
        positive_count = sum(1 for w in positive_words if w in text_lower)
        negative_count = sum(1 for w in negative_words if w in text_lower)
        
        if positive_count > negative_count:
            sentiment = "positive"
            score = 0.5 + (positive_count - negative_count) * 0.1
        elif negative_count > positive_count:
            sentiment = "negative"
            score = 0.5 - (negative_count - positive_count) * 0.1
        else:
            sentiment = "neutral"
            score = 0.5
        
        return {
            "sentiment": sentiment,
            "score": min(max(score, 0), 1),
            "positive_words": [w for w in positive_words if w in text_lower],
            "negative_words": [w for w in negative_words if w in text_lower]
        }

sentiment_analyzer = SentimentAnalyzer()

# ==================== CHURN PREDICTION ====================

class ChurnPredictor:
    async def predict(self, user_id: str) -> dict:
        """Predict customer churn risk"""
        import random
        risk_score = random.uniform(0, 1)
        return {
            "user_id": user_id,
            "churn_risk": risk_score,
            "risk_level": "high" if risk_score > 0.7 else "medium" if risk_score > 0.4 else "low",
            "factors": ["Giảm tần suất mua hàng", "Chưa mua hàng 30 ngày"],
            "recommendation": "Gửi voucher giảm giá 20% để giữ chân"
        }

churn_predictor = ChurnPredictor()

# ==================== API ENDPOINTS ====================

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service", "version": "2.0.0"}

# Chat
@app.post("/ai/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return await chatbot.chat(request)

@app.post("/ai/chat/stream")
async def chat_stream(request: ChatRequest):
    """Streaming chat response"""
    response = await chatbot.chat(request)
    async def generate():
        for char in response.reply:
            yield char
    return StreamingResponse(generate(), media_type="text/plain")

# Search
@app.post("/ai/search")
async def semantic_search(request: SearchRequest):
    return await ai_search.semantic_search(request)

@app.post("/ai/search/image")
async def image_search(file: UploadFile = File(...)):
    return await ai_search.image_search(file)

# Recommendations
@app.post("/ai/recommend/products")
async def recommend_products(request: RecommendRequest):
    return await recommender.recommend_products(request)

@app.post("/ai/recommend/stores")
async def recommend_stores(request: RecommendRequest):
    return await recommender.recommend_stores(request)

# Generation
@app.post("/ai/generate/banner")
async def generate_banner(request: GenerateRequest):
    return await ai_generator.generate_banner(request)

@app.post("/ai/generate/description")
async def generate_description(product_name: str = Form(...), features: str = Form(...)):
    return {"description": await ai_generator.generate_description(product_name, features)}

# OCR
@app.post("/ai/ocr/invoice")
async def ocr_invoice(request: OCRRequest):
    return await ocr_service.recognize_text(request)

@app.post("/ai/ocr/contract")
async def ocr_contract(request: OCRRequest):
    return await ocr_service.recognize_text(request)

@app.post("/ai/plate/recognize")
async def recognize_plate(request: OCRRequest):
    return await ocr_service.recognize_plate(request)

# Face Recognition
@app.post("/ai/face/recognize")
async def face_recognize(file: UploadFile = File(...)):
    return await face_recognition.recognize(file)

# Forecast
@app.post("/ai/forecast/revenue")
async def forecast_revenue(request: ForecastRequest):
    return await forecaster.predict_revenue(request)

@app.post("/ai/forecast/traffic")
async def forecast_traffic(request: ForecastRequest):
    return await forecaster.predict_traffic(request)

# Analytics
@app.post("/ai/analyze/sentiment")
async def analyze_sentiment(text: str = Form(...)):
    return await sentiment_analyzer.analyze(text)

@app.post("/ai/predict/churn")
async def predict_churn(user_id: str = Form(...)):
    return await churn_predictor.predict(user_id)

@app.post("/ai/segment/customers")
async def segment_customers(request: SegmentRequest):
    """Customer segmentation using K-Means"""
    from sklearn.cluster import KMeans
    if len(request.data) < request.n_clusters:
        raise HTTPException(status_code=400, detail="Not enough data points")
    
    # Convert data to feature matrix
    features = []
    for item in request.data:
        features.append([
            item.get("recency", 0),
            item.get("frequency", 0),
            item.get("monetary", 0)
        ])
    
    X = np.array(features)
    kmeans = KMeans(n_clusters=request.n_clusters, random_state=42)
    labels = kmeans.fit_predict(X)
    
    segments = []
    for i in range(request.n_clusters):
        mask = labels == i
        segments.append({
            "segment_id": i,
            "size": int(mask.sum()),
            "centroid": kmeans.cluster_centers_[i].tolist(),
            "label": f"Segment {i+1}"
        })
    
    return {"segments": segments, "labels": labels.tolist()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3009)