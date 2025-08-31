# 🐾 Animal Image Classifier

## Screenshot

<p align="center">
  <img src="https://github.com/anish-sharan/Animal-Recognition/blob/main/frontend/workings/Screenshot%202025-08-30%20at%204.45.05%E2%80%AFPM.png" alt="App Screenshot" width="600">
</p>

This project trains a **Deep Learning model** to classify animal images into 10 categories:
`cane (dog), cavallo (horse), elefante (elephant), farfalla (butterfly), gallina (hen), gatto (cat), mucca (cow), pecora (sheep), ragno (spider), scoiattolo (squirrel)`.

---

## 🚀 Tech Stack
- **Framework**: PyTorch  
- **Model**: ResNet-18 (CNN)  
- **Dataset**: Animals10 (Kaggle)  
- **Environment**: Kaggle Notebooks / Local with GPU  
- **Frontend**: React with Tailwind CSS  
- **Backend**: FastAPI  

---

## 📂 Project Structure
- `backend/` → FastAPI server, model training & inference code  
- `frontend/` → React + Tailwind frontend for uploading images & displaying predictions  
- `animal_classifier.pt` → Saved PyTorch model  
- `README.md` → Project documentation  

---

## 🔑 Features
✅ Train a ResNet-18 CNN on the **Animals10 dataset**  
✅ Classify images into **10 animal categories**  
✅ Expose model via **FastAPI endpoints**  
✅ Simple **React UI** to upload images and see predictions  
✅ GPU-accelerated training on Kaggle  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/anish-sharan/animal-classifier.git
cd animal-classifier
