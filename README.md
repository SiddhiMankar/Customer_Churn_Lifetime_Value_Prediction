# Customer Churn & Lifetime Value (CLTV) Prediction

A machine learning and data engineering project for **Customer Churn Analysis, RFM (Recency, Frequency, Monetary) Feature Engineering, and Customer Lifetime Value (CLTV) Modeling** based on e-commerce transaction data.

---

## 📌 Project Overview

This repository provides an end-to-end pipeline to transform raw transactional data into customer-centric behavioral metrics. The pipeline performs robust data cleaning, anomaly and outlier capping via Interquartile Range (IQR), and calculates fundamental Customer Lifetime Value (CLTV) predictors:

- **Recency**: Days elapsed since a customer's most recent transaction.
- **Frequency**: Total count of unique completed purchase orders per customer.
- **Monetary**: Total revenue contribution per customer.
- **Tenure**: Duration (in days) between the customer's initial purchase and the snapshot date.

---

## 📁 Repository Structure

```text
Customer_Churn_Lifetime_Value_Prediction/
├── data/
│   └── online_retail_II.xlsx    # Raw E-commerce transaction dataset
├── .gitignore                   # Ignored files (virtual environment, cache, checkpoints)
├── Untitled4.ipynb              # Main Jupyter Notebook containing EDA, Cleaning, and RFM Pipeline
├── executed_notebook.ipynb      # Generated notebook containing full execution outputs and plots
├── rfm_customer_data.csv        # Processed RFM dataset (4,285 customer profiles)
├── cltv_modeling_and_segmentation.ipynb  # CLTV modeling & K-Means clustering notebook
├── executed_cltv_notebook.ipynb # Executed notebook with all modeling plots
├── customer_cltv_predictions_and_segments.csv # Final predictions & segmentations output
├── *.png                        # Various visualizations (CLTV distributions, segments, matrices)
├── requirements.txt             # Python package dependencies
└── README.md                    # Project documentation & execution guide
```

---

## 📊 Dataset Information

- **Dataset**: UCI Online Retail II Dataset (`online_retail_II.xlsx`)
- **Location**: `data/online_retail_II.xlsx`
- **Fields**:
  - `Invoice`: Invoice number (6-digit integer; prefix 'C' indicates cancellation).
  - `StockCode`: Product code.
  - `Description`: Product name.
  - `Quantity`: Quantities of each product per transaction.
  - `InvoiceDate`: Timestamp of transaction.
  - `Price`: Product unit price.
  - `Customer ID`: Unique customer identifier.
  - `Country`: Customer's country of residence.

---

## ⚙️ Prerequisites & Environment Setup

### System Requirements
- **Python**: `3.8` or higher
- **Package Manager**: `pip`

---

## 🚀 Step-by-Step Execution Guide

Follow these steps to set up the environment and run the pipeline on your machine:

### Step 1: Open Terminal / PowerShell
Navigate to the project root directory:
```bash
cd c:\Projects\Customer_Churn_Lifetime_Value_Prediction
```

### Step 2: Create & Activate Virtual Environment

- **Windows (PowerShell)**:
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  ```

- **Windows (CMD)**:
  ```cmd
  python -m venv .venv
  .\.venv\Scripts\activate.bat
  ```

- **Linux / macOS**:
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

### Step 3: Install Required Dependencies & Register Jupyter Kernel
Install all required libraries specified in [`requirements.txt`](file:///c:/Projects/Customer_Churn_Lifetime_Value_Prediction/requirements.txt) and register the virtual environment kernel:
```bash
pip install --upgrade pip
pip install -r requirements.txt
python -m ipykernel install --user --name churn_venv --display-name "Python (.venv)"
```

### Step 4: Verify Data Placement
Ensure that `online_retail_II.xlsx` is present inside the `data/` folder:
```text
Customer_Churn_Lifetime_Value_Prediction/
└── data/
    └── online_retail_II.xlsx
```

### Step 5: Launch & Execute the Notebook

#### Option A: Using Jupyter Notebook / JupyterLab
```bash
jupyter notebook Untitled4.ipynb
```
Once open, ensure the kernel is set to **Python (.venv)** and click **Cell -> Run All** (or **Kernel -> Restart & Run All**).

#### Option B: Using VS Code
1. Open the project folder in VS Code.
2. Open [`Untitled4.ipynb`](file:///c:/Projects/Customer_Churn_Lifetime_Value_Prediction/Untitled4.ipynb).
3. Select `.venv` as your Python Kernel.
4. Click **Run All**.

#### Option C: Headless CLI Execution
Run the notebook directly using `nbconvert` with the registered kernel:
```bash
jupyter nbconvert --to notebook --execute --ExecutePreprocessor.kernel_name=churn_venv Untitled4.ipynb --output executed_notebook.ipynb
```

---

## 🔄 Data Pipeline Methodology

1. **Missing Data Handling**:
   - Drops records lacking a valid `Customer ID`.

2. **Transaction Filtering**:
   - Removes cancelled orders (`Invoice` prefixed with `'C'`) and negative quantities.
   - Filters out non-product/service stock codes (e.g., `'POST'`, `'D'`, `'DOT'`, `'BANK CHARGES'`, `'AMAZONFEE'`).
   - Filters out zero or negative product unit prices (`Price <= 0`).

3. **Anomaly & Outlier Handling**:
   - Uses **IQR (Interquartile Range) Winsorization** to cap extreme values in `Quantity` and `Price` at `Q3 + 1.5 * IQR`. Capping preserves legitimate transaction entries without distorting customer value calculations.

4. **RFM & Tenure Feature Engineering**:
   - Sets a dynamic `Snapshot Date` defined as `max(InvoiceDate) + 1 day`.
   - Aggregates metrics per `Customer ID`:
     - $\text{Recency} = \text{Snapshot Date} - \max(\text{InvoiceDate})$
     - $\text{Frequency} = \text{Count of Unique Invoices}$
     - $\text{Monetary} = \sum (\text{Quantity} \times \text{Price})$
     - $\text{Tenure} = \text{Snapshot Date} - \min(\text{InvoiceDate})$

5. **Output Export**:
   - Exports 4,285 processed customer profiles to `rfm_customer_data.csv`.

---

## 📖 Output Data Dictionary (`rfm_customer_data.csv`)

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `Customer ID` | `int` | Unique identifier for each customer. |
| `Recency` | `int` | Days since the customer's last purchase. Lower values indicate recent engagement. |
| `Frequency` | `int` | Total number of unique completed purchase orders. Higher values indicate loyalty. |
| `Monetary` | `float` | Cumulative revenue spend by the customer. |
| `Tenure` | `int` | Days since customer's first recorded purchase. |

### Sample Output (`rfm_customer_data.csv`)
```csv
Customer ID,Recency,Frequency,Monetary,Tenure
12346,165,11,372.86,361
12347,3,2,1297.97,40
12348,74,1,221.16,74
12349,43,2,1996.34,225
12351,11,1,295.68,11
```

---

## 📈 CLTV Modeling & Segmentation Results

Using the pre-processed RFM dataset, we executed a robust machine learning pipeline to predict customer behavior and value, leading to actionable business segments.

### Achievements & Models Utilized:
1. **Churn & Future Transactions Prediction**: Leveraged the **BG/NBD (Beta Geometric / Negative Binomial Distribution) Model** to accurately predict the expected number of future transactions over 30, 90, and 180 days, and calculated the probability of each customer remaining "alive" (active).
2. **Customer Lifetime Value Estimation**: Applied the **Gamma-Gamma Model** to evaluate the average monetary value per transaction, successfully computing the 6-month projected Customer Lifetime Value (CLTV) with a monthly discount rate.
3. **Actionable Customer Segmentation**: Utilized **K-Means Clustering** (validated via Elbow method and Silhouette scores) to group the customer base into 4 distinct segments (e.g., Champions, Loyal Customers, At-Risk, Hibernating/Lost).

### Key Business Findings & Churn Insights:
Based on the modeling of our 4,285 filtered customers:
- **Active Customers (Will Return)**: 2,215 customers (**51.7%**) are predicted to remain active and continue purchasing.
- **Churned Customers (Won't Return)**: 2,070 customers (**48.3%**) are classified as churned.
- **Why?**: The model identifies churn based on a customer's individual shopping habits (frequency vs recency). A customer who buys frequently but has a sudden, unusually long gap in purchases (high recency) is flagged as highly likely to have churned. Conversely, a customer who naturally buys infrequently is given more leeway before being considered churned.
- **How We Proved This**: We leveraged the **`Probability_Alive`** measure calculated by the BG/NBD model, which statistically estimates the likelihood a customer is still active. A strict threshold of **`< 0.2`** (less than 20% chance of being active) was applied to this probability to definitively flag a customer as "Churned" (`Is_Churned = 1`).

### Outputs Generated:
- **Notebook**: [`cltv_modeling_and_segmentation.ipynb`](cltv_modeling_and_segmentation.ipynb) / [`executed_cltv_notebook.ipynb`](executed_cltv_notebook.ipynb)
- **Data**: [`customer_cltv_predictions_and_segments.csv`](customer_cltv_predictions_and_segments.csv)
- **Visuals**: Several high-quality plots highlighting churn risk distribution, CLTV distributions, segmentation scatter plots, and RFM segment heatmaps (`*.png`).

### Output Dictionary (`customer_cltv_predictions_and_segments.csv`)
Extends the base RFM fields with actionable predictions:
| Column Name | Type | Description |
| :--- | :--- | :--- |
| `Predicted_Purchases_*` | `float` | Expected number of purchases in the next 30, 90, or 180 days. |
| `Probability_Alive` | `float` | The conditional probability that a customer is still active. |
| `Churn_Risk_Score` | `float` | Calculated as `1.0 - Probability_Alive`. |
| `Is_Churned` | `int` | Binary flag indicating churn (1) if Probability_Alive < 0.2, else (0). |
| `Predicted_CLTV` | `float` | Estimated Customer Lifetime Value over a 6-month horizon. |
| `Cluster_ID` | `int` | Numeric identifier for K-Means cluster (0-3). |
| `Customer_Segment` | `str` | Human-readable segment label (e.g., Champions, At-Risk). |

---

## 📦 Key Dependencies

- **Pandas**: Data structures & manipulation
- **NumPy**: Numerical operations & vectorized capping
- **Matplotlib & Seaborn**: Outlier visualization & distribution analysis
- **OpenPyXL**: Excel file reading (`.xlsx`)
- **Lifetimes**: Probabilistic BG/NBD and Gamma-Gamma CLTV modeling
- **Scikit-Learn**: Machine learning utilities & scaling
