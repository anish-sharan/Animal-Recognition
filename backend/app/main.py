import io
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# ✅ Allowlist ResNet class for safe unpickling
torch.serialization.add_safe_globals([models.resnet.ResNet])

# ✅ Load full model (from Kaggle-saved file)
model = torch.load("animal_classifier.pt", map_location="cpu", weights_only=False)
model.eval()

# ✅ Define transforms (must match training preprocessing)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# ✅ Class labels (Italian → original dataset order)
class_names_it = ["cane", "cavallo", "elefante", "farfalla", "gallina",
                  "gatto", "mucca", "pecora", "ragno", "scoiattolo"]

# ✅ English mapping
class_names_en = ["dog", "horse", "elephant", "butterfly", "chicken",
                  "cat", "cow", "sheep", "spider", "squirrel"]

# ✅ FastAPI app
app = FastAPI(title="Animal Classifier API")

# Allow CORS (so frontend can call backend)
origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probs, 1)

    idx = predicted.item()

    return {
        "class_it": class_names_it[idx],   # Italian (original dataset)
        "class_en": class_names_en[idx],   # English (for frontend)
        "confidence": confidence.item()
    }
