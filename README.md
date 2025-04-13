# Purchase Decision Attribution System

This project is a **machine learning/statistical modeling platform** designed to **dissect and attribute** the contribution of each variable to a final purchase decision. It is built using a **trained model on the Cetrio dataset** and also supports **real-time or near-real-time attribution** through integration with external advertising platforms like **Google Ads**, **Facebook Ads**, and **Shopify** via their APIs.

## 🚀 Features

- 🧠 **Model-Based Attribution**:
  - Trained using the **Cetrio dataset**
  - Supports multiple models including **Random Forest** and other ML/statistical approaches
  - Feature importance visualization to understand variable impact on purchase decision

- 📊 **Data Analysis & Graphical Representation**:
  - Visual insights generated from model output
  - Graphical analytics for both internal and external data

- 🔌 **External Platform Integration via API**:
  - Users can connect their external accounts like:
    - Google Ads
    - Facebook Ads
    - Shopify
  - Pulls campaign/ad data using APIs and shows feature attributions visually

- ⚙️ **Simulation Module**:
  - Run simulations with small data using user-defined parameters
  - Provides real-time feature attribution feedback for experimental scenarios


![Alt Text](./public/Screenshot(2).png)
![Alt Text](./public/Screenshot(3).png)
![Alt Text](./public/Screenshot(4).png)
![Alt Text](./public/Screenshot(5).png)
![Alt Text](./public/Screenshot(6).png)
![Alt Text](./public/Screenshot(7).png)
![Alt Text](./public/Screenshot(8).png)

## 🛠️ Tech Stack

- **Backend**: Python, Flask/FastAPI
- **Machine Learning**: scikit-learn, pandas, numpy
- **Frontend**: React.js
- **Visualization**: Matplotlib, Seaborn, D3.js / Chart.js
- **External APIs**: Google Ads API, Facebook Marketing API, Shopify API

## 🧪 Future Scope

- Extend support to more ad platforms
- Use deep learning models for better attribution in non-linear data
- Add more real-time analytics and alerting system

## 📂 Dataset

- **Cetrio Dataset** used for training
- External data fetched dynamically from APIs
