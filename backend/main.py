from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_disease  # Apna predict_disease function import karna hai
import uvicorn
from predict import predict_disease

app = FastAPI()

# CORS allow kar rahe hain taki mobile ya client connect kar sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Sab allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Predict endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # File check kar rahe hain
        if not file.content_type.startswith("image/"):
            return {"error": "Uploaded file is not an image."}
        
        # File read
        image_data = await file.read()
        print(f"Received file: {file.filename}, size: {len(image_data)} bytes")

        # Predict function ko call kar rahe hain
        result = predict_disease(image_data)
        
        return result
    
    except Exception as e:
        print("Prediction Error:", str(e))
        return {"error": "Prediction failed. Please check server logs."}

# (Optional) Agar chahte ho file run karte hi start ho jaye, to neeche ka bhi add kar sakte ho
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
