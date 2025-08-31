import torch
import torchvision.transforms as transforms
from PIL import Image
import io

# Load trained model
model = torch.load("animal_classifier.pt", map_location="cpu")
model.eval()

# Define transforms (same as training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# ✅ Use same class order as training dataset
class_names = ["cane", "cavallo", "elefante", "farfalla", "gallina",
               "gatto", "mucca", "pecora", "ragno", "scoiattolo"]

def predict_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_tensor = transform(image).unsqueeze(0)  # add batch dimension
    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = outputs.max(1)
    return class_names[predicted.item()]
