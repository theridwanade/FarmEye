# FarmEye - AI-Powered Farm Monitoring System

## 🚀 Overview
Farmers face challenges in **feed monitoring, security, and livestock management**, leading to **economic losses, inefficiency, and food waste**. Manual tracking is unreliable, and many farms lack **affordable automation solutions**. This project provides an **AI-driven system** to detect feed levels, monitor farm security, and enable **smart farm management**.

## 🎯 Problem Statement
- **Feed Wastage & Monitoring Issues**: Inefficient feed tracking leads to waste and increased costs.
- **Farm Security Risks**: Intrusions from unauthorized entities cause losses.
- **Lack of Automation**: Small- and medium-scale farmers lack access to AI-driven smart monitoring systems.

## 🌍 Impact & SDG Alignment
This project contributes to the **United Nations Sustainable Development Goals (SDGs):**
- **SDG 2 (Zero Hunger):** Reduces food waste and optimizes animal nutrition.
- **SDG 9 (Industry, Innovation & Infrastructure):** Introduces AI-driven automation in agriculture.
- **SDG 12 (Responsible Consumption & Production):** Enhances resource efficiency and sustainability.

## 🛠️ Tech Stack
### **Core Technologies**
- **TensorFlow.js (COCO-SSD)**: Object detection for feed levels, animals, and intruders.
- **OpenCV.js**: Image processing for feed volume estimation.
- **YOLOv8 (Optional)**: Fast and accurate object detection for real-time monitoring.
- **React.js**: Web-based dashboard for real-time data visualization.
- **Node.js (Nodemailer)**: Sends email alerts for low feed levels or security breaches.

### **Future Enhancements**
- **IoT Sensors**: Data collection for temperature, humidity, and automated refilling.
- **Automated Feeding Systems**: AI-powered feed distribution.
- **Cloud Integration**: Data storage and analytics for improved decision-making.

## ⚙️ How It Works
1. **Live Video Processing**: Camera feed is analyzed using **COCO-SSD (TensorFlow.js)** to detect bowls, feed levels, and animals.
2. **Image Processing**: **OpenCV.js** measures the percentage of feed in the bowl using edge detection and contour analysis.
3. **Intruder Detection (Optional YOLOv8 Integration)**: Identifies unauthorized entities for security alerts.
4. **Real-Time Dashboard**: A React.js web app displays feed levels, detected animals, and security alerts.
5. **Automated Alerts**: **Node.js with Nodemailer** sends email notifications when feed is low or intrusions are detected.


## 🔥 Key Features
- **Feed Level Detection**: Monitors the amount of food in animal feeding bowls.
- **Intruder Detection**: Identifies unauthorized entities in the farm environment.
- **Automated Alerts**: Sends **email notifications** when feed is low or intrusions occur.
- **Web-Based Dashboard**: Real-time data visualization for farmers.
- **Scalable & Future-Ready**: Can be expanded to full **IoT-based farm automation**.

## 🎯 Project Goals
- **Develop a functional POC** demonstrating AI-driven farm monitoring.
- **Optimize object detection models** for efficiency and accuracy.
- **Ensure seamless real-time monitoring** via a web-based interface.
- **Enable scalability** for full farm automation in future iterations.

## 🏆 Expected Impact
- **Reduce farm losses & optimize feed usage.**
- **Enhance farm security and monitoring.**
- **Introduce cost-effective automation to small and medium-sized farms.**
- **Create a foundation for smart agriculture and IoT-based automation.**

## 🚀 Get Started
### Prerequisites
- **Node.js & npm** (for backend and frontend setup)
- **Python (Optional)** (if using YOLOv8 for inference)
- **Camera / Webcam** (for real-time detection)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/farm-monitoring.git
   cd farm-monitoring
   ```
2. Install dependencies:
   ```sh
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Run the application:
   ```sh
   cd backend && node server.js
   cd frontend && npm start
   ```

## 📜 License
This project is **open-source** under the MIT License.

---

🌱 **Smarter Farming. Safer Livestock. Less Waste.**
