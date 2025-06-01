import numpy as np
from tensorflow.keras.models import load_model
from utils.preprocess import preprocess_image
import io
from PIL import Image

# Load the model
model = load_model("model/model.h5")

# List of possible disease classes
CLASS_NAMES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___Healthy"
]

def predict_disease(image_bytes):
    try:
        # Open the image and convert it to RGB
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return {"error": "Invalid image format."}

    # Preprocess the image for prediction
    preprocessed = preprocess_image(image)

    # Ensure the preprocessed shape is correct before prediction
    print("Preprocessed shape:", preprocessed.shape)  # Should print (1, 256, 256, 3)

    # Make predictions using the model
    predictions = model.predict(preprocessed)

    # Get the prediction confidence and the predicted class
    confidence = float(np.max(predictions))
    predicted_class = CLASS_NAMES[np.argmax(predictions)]

    print(f"Predicted Class: {predicted_class}, Confidence: {confidence}")
    
    return {
        "class": predicted_class,
        "confidence": round(confidence * 100, 2)
    }
