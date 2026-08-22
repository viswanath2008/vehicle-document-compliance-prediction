# VeriDrive — Vehicle Insurance & Document Compliance Predictor

> 🚗 A smart vehicle document compliance prediction application that analyzes essential vehicle and driver information to estimate compliance probability, detect document-related issues, and provide an overall compliance status.

## 📌 Overview

**VeriDrive** is a web-based Vehicle Insurance and Document Compliance Predictor designed to evaluate whether a vehicle and its associated driver documentation meet basic compliance requirements.

The application accepts multiple inputs related to the vehicle, owner, insurance, registration, pollution certificate, driving license, and past traffic violations. These inputs are processed through a **weighted heuristic prediction model** that calculates a compliance probability and determines whether the vehicle profile is considered compliant or non-compliant.

Instead of simply returning a binary result, VeriDrive also identifies the factors affecting the prediction and highlights potential document-related issues.

> **Note:** The current version uses a weighted heuristic classifier implemented in TypeScript. It is not a trained machine-learning model based on a real-world dataset.

---

## ✨ Features

- 🛡️ **Vehicle Compliance Prediction**
  - Predicts whether a vehicle profile is compliant or non-compliant.

- 📊 **Compliance Probability Score**
  - Calculates a normalized probability score based on multiple document and driver-related factors.

- 📄 **Insurance Validation**
  - Supports:
    - Valid insurance
    - Expired insurance
    - No active insurance

- 🚘 **Registration Certificate (RC) Verification**
  - Checks whether the RC is:
    - Present
    - Missing
    - Potentially fraudulent

- 🌱 **PUCC / Pollution Certificate Validation**
  - Evaluates:
    - Valid PUCC
    - Expired PUCC
    - Missing PUCC

- 🪪 **Driving License Status**
  - Supports:
    - Valid license
    - Expired license
    - Suspended license

- ⚠️ **Traffic Violation Analysis**
  - Considers the number of past traffic violations while calculating compliance.

- 🚗 **Vehicle Information**
  - Vehicle age
  - Vehicle type
  - Registration state

- 👤 **Owner Information**
  - Owner age
  - Past traffic violation count

- 🔍 **Issue Detection**
  - Provides clear explanations for missing, expired, suspended, or potentially fraudulent documents.

- 📈 **Weighted Factor Analysis**
  - Shows which compliance factors passed or failed.

- 🔄 **Reset Functionality**
  - Quickly reset the application back to its default values.

- 🎨 **Modern Responsive Interface**
  - Clean and user-friendly interface built with modern React components.

---

# 🧠 How the Prediction System Works

VeriDrive uses a **weighted heuristic classifier** to evaluate the overall document compliance of a vehicle.

Each important factor contributes to the final compliance score.

| Factor | Weight |
|---|---:|
| Valid Insurance | 25% |
| RC Document Present | 25% |
| Valid PUCC Certificate | 20% |
| Valid Driving License | 20% |
| Clean Violation History | 10% |

The total possible score is:

```text
100%
```

The application calculates the score using the following concept:

```text
Compliance Probability =
Sum of Passed Factor Weights
────────────────────────────
Total Weight
```

### Example

If a vehicle has:

- Valid Insurance ✅
- RC Present ✅
- Valid PUCC ✅
- Valid Driving License ✅
- No Past Violations ✅

The compliance probability will be:

```text
100%
```

---

## 🚨 Critical Disqualifiers

Some conditions are treated as critical failures and can automatically result in a **Non-Compliant** prediction.

These include:

- Missing RC
- Potentially fraudulent RC
- Suspended driving license
- No active insurance policy

The prediction logic also applies additional penalties to the compliance probability for severe issues.

### Penalty Logic

```text
Potentially Fraudulent RC  → Probability × 0.2

Suspended License          → Probability × 0.3

No Active Insurance        → Probability × 0.5
```

A profile is considered compliant only when:

```text
Compliance Probability ≥ 60%
```

and no critical disqualifier is present.

---

# 🛠️ Tech Stack

This project is built using modern frontend technologies.

### Frontend

- React
- TypeScript
- Tailwind CSS

### UI Components

- shadcn/ui
- Radix-based UI components

### Icons

- Lucide React

### Prediction Logic

- Custom TypeScript Weighted Heuristic Model

---

# 📂 Project Structure

```text
vehicle-document-compliance-predictor/
│
├── src/
│   ├── App.tsx
│   │
│   └── lib/
│       └── model.ts
│
├── public/
│
├── package.json
│
└── README.md
```

### Important Files

#### `src/App.tsx`

This file contains the main application interface and manages:

- User input
- Form state
- Compliance meter
- Prediction triggering
- Result display
- Reset functionality

#### `src/lib/model.ts`

This file contains the core prediction logic.

It defines:

```typescript
DriverInput
```

The input structure for vehicle and driver information.

```typescript
PredictionResult
```

The structure used to return the prediction result.

```typescript
predictCompliance()
```

The main function responsible for:

- Evaluating document status
- Calculating weighted scores
- Applying penalties
- Detecting critical failures
- Generating issues
- Returning the final compliance prediction

---

# 📥 Input Parameters

The application evaluates the following parameters:

| Parameter | Description |
|---|---|
| Vehicle Age | Age of the vehicle in years |
| Owner Age | Age of the vehicle owner |
| Vehicle Type | Car, Motorcycle, Truck, or Auto Rickshaw |
| Registration State | State where the vehicle is registered |
| Insurance Status | Valid, Expired, or None |
| RC Status | Present, Missing, or Potentially Fraudulent |
| Pollution Status | Valid, Expired, or None |
| License Status | Valid, Expired, or Suspended |
| Past Violations | Number of previous traffic violations |

---

# 🔮 Prediction Output

After clicking **Predict Compliance**, the application provides:

### 1. Compliance Status

```text
COMPLIANT
```

or

```text
NON-COMPLIANT
```

### 2. Compliance Probability

For example:

```text
87%
```

### 3. Factor Analysis

The application evaluates individual factors such as:

```text
✓ Insurance Valid

✓ RC Document Present

✓ Pollution Certificate Valid

✓ Driving License Valid

✗ Clean Violation History
```

### 4. Detected Issues

The application also provides explanations such as:

```text
Insurance has expired — renewal required.
```

```text
Registration Certificate is missing from vehicle records.
```

```text
Driving license is currently suspended.
```

```text
Multiple past traffic violations detected.
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm or another JavaScript package manager

Check your installation:

```bash
node --version
npm --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 2. Navigate to the Project Directory

```bash
cd YOUR-REPOSITORY
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

Depending on your project configuration:

```bash
npm run dev
```

Open the local development URL displayed in your terminal.

---

# 🧪 Example Prediction Scenarios

## Scenario 1: Fully Compliant Vehicle

### Input

```text
Vehicle Age: 3 years
Insurance: Valid
RC: Present
PUCC: Valid
License: Valid
Past Violations: 0
```

### Expected Result

```text
Status: COMPLIANT
Probability: 100%
```

---

## Scenario 2: Expired Insurance

### Input

```text
Insurance: Expired
RC: Present
PUCC: Valid
License: Valid
Past Violations: 0
```

### Expected Result

The compliance score is reduced because the insurance requirement fails.

Depending on the final score and other conditions, the vehicle may be classified as compliant or non-compliant.

---

## Scenario 3: Missing RC

### Input

```text
Insurance: Valid
RC: Missing
PUCC: Valid
License: Valid
Past Violations: 0
```

### Expected Result

```text
Status: NON-COMPLIANT
```

A missing RC is treated as a critical disqualifier.

---

## Scenario 4: Suspended License

### Input

```text
Insurance: Valid
RC: Present
PUCC: Valid
License: Suspended
Past Violations: 1
```

### Expected Result

```text
Status: NON-COMPLIANT
```

A suspended driving license triggers a critical failure.

---

# ⚙️ Core Prediction Logic

The core prediction function follows this process:

```text
User Input
    │
    ▼
Document Validation
    │
    ├── Insurance
    ├── RC
    ├── PUCC
    ├── Driving License
    └── Past Violations
    │
    ▼
Weighted Score Calculation
    │
    ▼
Severe Penalty Application
    │
    ▼
Critical Failure Detection
    │
    ▼
Compliance Probability
    │
    ▼
Final Prediction
```

---

# 🎯 Future Improvements

This project can be expanded significantly in future versions.

Some possible improvements include:

- 🤖 Integration with a real Machine Learning model
- 📊 Training using real or synthetic vehicle compliance datasets
- 🗄️ Database integration for vehicle records
- 🔐 User authentication and authorization
- 📤 Document upload and OCR-based verification
- 🧾 Automatic extraction of information from RC and insurance documents
- 🔎 Fraud detection using anomaly detection models
- 🌐 Integration with external APIs
- 📈 Historical prediction analytics
- 🗺️ Support for all Indian states and RTO regions
- 📱 Mobile application support
- 🔔 Insurance and document expiry notifications
- ☁️ Cloud deployment

---

# 🤖 Future Machine Learning Architecture

A future version could use the following pipeline:

```text
Vehicle & Driver Data
        │
        ▼
Data Preprocessing
        │
        ▼
Feature Engineering
        │
        ▼
Machine Learning Model
        │
   ┌────┴────┐
   ▼         ▼
Compliant   Non-Compliant
        │
        ▼
Probability Score
```

Possible machine learning algorithms could include:

- Logistic Regression
- Random Forest
- XGBoost
- Decision Tree
- Gradient Boosting

A real ML implementation would require a properly collected and validated dataset.

---

# ⚠️ Disclaimer

This project is developed for **educational and demonstration purposes**.

The current prediction system uses a weighted heuristic approach and should **not** be considered an official legal, insurance, regulatory, or government verification system.

The predictions generated by this application should not be used as a substitute for official document verification or legal compliance checks.

---

# 🤝 Contributing

Contributions are welcome!

If you would like to improve this project:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add your feature"
```

5. Push to your branch.

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request.

---

# 👨‍💻 Author

**Meyappan Viswanath**

Aspiring Full-Stack Developer | Exploring Data and Intelligent Applications

---

## ⭐ Support

If you found this project interesting or useful, consider giving the repository a **star ⭐**.

It helps support the project and motivates further development.

---

<div align="center">

Built with 🚗, 🛡️ and TypeScript.

**VeriDrive — Smarter Vehicle Document Compliance Checking**

</div>