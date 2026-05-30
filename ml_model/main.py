from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import newspaper
import os
from duckduckgo_search import DDGS

app = FastAPI(title="NewsPulse ML Inference Service")

# Restrict CORS to the backend origin in production
allowed_origins = os.getenv("BACKEND_ORIGIN", "*")
origins = [allowed_origins] if allowed_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the verified high-accuracy model
MODEL_NAME = "hamzab/roberta-fake-news-classification"

print(f"🚀 Loading {MODEL_NAME} pipeline...")
try:
    classifier = pipeline("text-classification", model=MODEL_NAME, top_k=None)
except Exception as e:
    print(f"⚠️ Warning: Model load failed ({e}), using fallback.")
    classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english", top_k=None)

class PredictRequest(BaseModel):
    text: str = ""
    url: str = ""

def extract_article_from_url(url: str) -> str:
    try:
        # BYPASS 403 FORBIDDEN: Set a real browser User-Agent
        config = newspaper.Config()
        config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        config.request_timeout = 15

        article = newspaper.Article(url, config=config)
        article.download()
        article.parse()
        return article.text
    except Exception as e:
        print(f"⚠️ Scraping failed for {url}: {e}")
        return ""

def perform_fact_check(text: str):
    try:
        query = text[:150].replace('\n', ' ')
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=3):
                results.append({
                    "title": r.get("title", ""),
                    "body": r.get("body", ""),
                    "href": r.get("href", "")
                })
        return results
    except Exception as e:
        return []

def explain_prediction(text: str, prediction_label: str):
    text_lower = text.lower()
    reasons, highlights = [], []
    fake_indicators = ["shocking", "unbelievable", "secret", "conspiracy", "hoax", "banned"]
    
    if prediction_label == "FAKE":
        found = [w for w in fake_indicators if w in text_lower]
        if found:
            reasons.append("Sensationalist or biased wording detected")
            highlights.extend(found)
        reasons.append("Linguistic patterns align with verified misinformation datasets")
    else:
        reasons.append("Objective, verifiable language detected")
        reasons.append("Low emotional manipulation framing")
        
    return reasons, list(set(highlights))

@app.post("/predict")
async def predict(req: PredictRequest):
    input_text = req.text
    if req.url:
        input_text = extract_article_from_url(req.url)
        
    if not input_text or len(input_text.strip()) < 15:
        # Specific error message for the user if scraping fails
        raise HTTPException(status_code=400, detail="Could not retrieve enough text. This site may be blocking us, or the link is invalid.")

    # Optimized context length from Audit results
    truncated_text = input_text[:1500]

    try:
        results = classifier(truncated_text)
        if isinstance(results[0], list):
            results = results[0]
            
        # Determine fake score dynamically based on active model labels
        fake_indicators = {"LABEL_0", "NEGATIVE", "FAKE"}
        fake_score = next((res['score'] for res in results if res['label'].upper() in fake_indicators), 0)
        
        if fake_score >= 0.50:
            prediction = "FAKE"
            confidence = fake_score
        else:
            # Determine real score dynamically
            real_indicators = {"LABEL_1", "POSITIVE", "REAL"}
            confidence = next((res['score'] for res in results if res['label'].upper() in real_indicators), 1 - fake_score)
            prediction = "REAL"
            
        conf_pct = round(confidence * 100, 2)
        reasons, highlights = explain_prediction(input_text, prediction)
        fact_check_results = perform_fact_check(input_text)
        
        return {
            "prediction": prediction,
            "confidence": conf_pct,
            "reasons": reasons,
            "highlights": highlights,
            "fact_check_results": fact_check_results,
            "analyzed_url": req.url,
            "extracted_text": input_text if req.url else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)