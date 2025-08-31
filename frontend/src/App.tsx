import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Zap,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface ClassificationResult {
  animal: string;
  confidence: number;
  timestamp: Date;
}

const mockClassify = (file: File): Promise<ClassificationResult> => {
  return new Promise((resolve) => {
    // Mock classification results
    const animals = [
      { animal: "Cat", confidence: 95.2 },
      { animal: "Dog", confidence: 92.8 },
      { animal: "Bird", confidence: 88.3 },
      { animal: "Rabbit", confidence: 91.7 },
      { animal: "Horse", confidence: 89.4 },
      { animal: "Fish", confidence: 86.9 },
      { animal: "Lion", confidence: 93.5 },
      { animal: "Tiger", confidence: 94.1 },
      { animal: "Elephant", confidence: 96.3 },
      { animal: "Bear", confidence: 90.6 },
    ];

    setTimeout(() => {
      const randomResult = animals[Math.floor(Math.random() * animals.length)];
      resolve({
        ...randomResult,
        timestamp: new Date(),
      });
    }, 2000);
  });
};

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    console.log(file);
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResult(null);
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to classify image");
        }

        const data = await response.json();
        console.log("data" + JSON.stringify(data));

        // ✅ Expecting backend response like: { "class": "dog", "confidence": 0.95 }
        setResult({
          animal: data.class_en,
          confidence: data.confidence ? data.confidence * 100 : 90, // default if missing
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Classification failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-50";
    if (confidence >= 75) return "text-yellow-600 bg-yellow-50";
    return "text-orange-600 bg-orange-50";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90)
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <AlertCircle className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-2xl">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Animal Classifier
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image of any animal and our advanced AI will identify it
            instantly with confidence scores
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 backdrop-blur-sm bg-white/60 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/80 scale-105"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/80"
                } ${selectedImage ? "border-green-400 bg-green-50/60" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div
                    className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedImage ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    {selectedImage ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <Upload className="h-8 w-8 text-blue-600" />
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedImage
                        ? "Image Selected!"
                        : "Drop your image here"}
                    </p>
                    <p className="text-gray-600 mb-4">
                      or click to browse files
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Choose Image
                    </button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, GIF, WebP (Max 10MB)
                  </p>
                </div>
              </div>

              {selectedImage && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  Upload New Image
                </button>
              )}
            </div>

            {/* Preview and Results Section */}
            <div className="space-y-6">
              {selectedImage && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Image Preview
                  </h3>
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={selectedImage}
                      alt="Selected animal"
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analyzing Image...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Our AI is identifying the animal in your image
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full animate-pulse"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Results */}
              {result && !isLoading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Classification Result
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {result.animal}
                        </span>
                        {getConfidenceIcon(result.confidence)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(
                            result.confidence
                          )}`}
                        >
                          {result.confidence.toFixed(1)}% confidence
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 text-center">
                      Analyzed on {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Powered by trained model • Built with React & Tailwind CSS
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
