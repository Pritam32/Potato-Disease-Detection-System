import numpy as np
from tensorflow.keras.preprocessing import image

def preprocess_image(img):
    # Resize the image to the input size expected by the model (256x256 in this case)
    img = img.resize((256, 256))  # Adjust this to match your model's expected size

    # Convert the image to RGB (in case it's in another mode, like RGBA or grayscale)
    img = img.convert("RGB")

    # Convert the image to a numpy array and normalize it
    img_array = np.array(img) / 255.0

    # Expand dimensions to match model input (batch size, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)  # Add the batch dimension correctly

    return img_array
