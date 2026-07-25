# ☕ Mellow Café System — User Tutorial & Guide

Welcome to **Mellow Café System**! This guide will walk you through everything you need to know to manage your café's sales, stock, financial performance, and menu costing with ease.

---

## 📑 Table of Contents
1. [Overview & Quick Start](#1-overview--quick-start)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Logging Sales (POS)](#3-logging-sales-pos)
   - [Quick Tap Mode](#quick-tap-mode)
   - [Batch Entry Mode](#batch-entry-mode)
   - [End-of-Day Cash Reconciliation](#end-of-day-cash-reconciliation)
4. [Managing Inventory & Stock](#4-managing-inventory--stock)
   - [Adding & Editing Products](#adding--editing-products)
   - [Package-Based Bulk Costing](#package-based-bulk-costing)
   - [Restocking & Low Stock Alerts](#restocking--low-stock-alerts)
5. [Automated Shopping List Generator](#5-automated-shopping-list-generator)
6. [Business & Costing Calculators](#6-business--costing-calculators)
   - [Margin Calculator](#margin-calculator)
   - [Breakeven Calculator](#breakeven-calculator)
7. [Sales Analytics & Data Export](#7-sales-analytics--data-export)
8. [Frequently Asked Questions (FAQ)](#8-frequently-asked-questions-faq)

---

## 1. Overview & Quick Start

Mellow Café System is designed to make café operations simple, fast, and transparent. Whether you're recording live espresso sales during a busy morning rush or performing closing cash reconciliations at night, Mellow keeps your margins clear and your inventory up to date.

> [!TIP]
> **Mobile Friendly**: You can open Mellow on your smartphone, tablet, or laptop browser without installing heavy software or expensive hardware!

---

## 2. Dashboard Overview

When you log into Mellow, the **Dashboard** gives you an instant high-level view of your business health.

![Dashboard Overview](file:///c:/Users/cyril/OneDrive/Desktop/Mellow/public/dashboard-preview.png)

### Key Metrics Displayed:
- 💵 **Today's Gross Sales (₱)**: Total money taken in from sales today.
- 📈 **Today's Net Profit (₱)**: Revenue minus product costs (COGS) and daily pro-rated fixed overhead expenses.
- 📦 **Items Sold Today**: Total quantity of products sold.
- ⚠️ **Low Stock Alert Count**: Number of inventory items that need restocking soon.

---

## 3. Logging Sales (POS)

Navigate to **Sales** from the main navigation bar. Mellow offers three ways to record sales depending on how your café operates.

### Quick Tap Mode
*Best for: Mid-day peak hours when recording items as customers order.*

1. Tap on any item card (e.g. **Iced Caramel Latte**).
2. The item quantity increments instantly and records the sale.
3. Your inventory stock decrements automatically in real time.

---

### Batch Entry Mode
*Best for: End-of-day entry if you record sales manually on paper or tally sheets during shift changes.*

1. Switch the view to **Batch Entry**.
2. Type in the total quantity sold for each item during the day/shift.
3. Click **Submit Batch Sales**.

---

### End-of-Day Cash Reconciliation
*Best for: Closing shift routines.*

1. Click **Cash Reconciliation / Closing**.
2. Enter your **Starting Cash Float** (e.g., ₱2,000 kept in the cash drawer).
3. Count the physical cash in your drawer at closing and enter **Ending Physical Cash**.
4. Mellow will automatically compute:
   $$\text{Expected Cash} = \text{Starting Float} + \text{Total Cash Sales}$$
   $$\text{Discrepancy} = \text{Ending Cash} - \text{Expected Cash}$$
5. If there's an overage or shortage, it will be flagged for your review.

> [!NOTE]
> **Negative Stock Warning**: If an item stock reaches 0 and you continue selling, Mellow will allow the transaction but display a warning flag so your sales records remain accurate.

---

## 4. Managing Inventory & Stock

Navigate to **Inventory** to view, add, and restock your café items.

### Adding & Editing Products

1. Click **+ Add New Product**.
2. Enter product details:
   - **Product Name** (e.g. *Espresso Beans 1kg*)
   - **Category** (e.g. *Coffee Ingredients*, *Pastries*, *Beverages*)
   - **Selling Price (₱)** (Price charged to customers)
   - **Current Stock Level**
   - **Low Stock Threshold** (The level at which you receive a reorder alert)
   - **Target Stock Level** (Desired full inventory quantity)

---

### Package-Based Bulk Costing

When buying supplies in bulk packages (such as a 12-pack box of Oat Milk or a 5kg bag of Coffee Beans), calculating cost per individual piece/serving manually can lead to errors. Mellow automates this!

1. In the product form, toggle **Package Purchasing / Bulk Costing**.
2. Enter:
   - **Package Purchase Price (₱)**: Total cost paid to supplier (e.g., ₱1,440 for a box).
   - **Items per Package**: How many units/pieces are inside one package (e.g., 12 cartons).
3. Mellow automatically calculates your **Unit Cost (COGS)**:
   $$\text{Unit Cost} = \frac{\text{Package Price}}{\text{Items per Package}} = \frac{₱1,440}{12} = ₱120/\text{carton}$$
4. Both **Boxes** and **Individual Pieces** stock levels are displayed clearly in the inventory table.

---

### Restocking & Low Stock Alerts

Inventory items are color-coded:
- 🟢 **Good**: Stock is well above threshold.
- 🟡 **Low Stock**: Stock is equal to or below the low stock threshold.
- 🔴 **Out of Stock**: Stock has reached 0.

To quick-restock an item:
1. Click the **Restock** button next to any item in the Inventory table.
2. Enter the number of packages or units added.
3. The current stock is updated immediately.

---

## 5. Automated Shopping List Generator

Never forget what to buy at the wholesale market or supplier run!

1. Navigate to **Inventory** and click **Generate Shopping List** (or open the **Shopping List** tab).
2. Mellow checks all low-stock and out-of-stock items and calculates reorder quantities:
   $$\text{Recommended Quantity} = \text{Target Stock} - \text{Current Stock}$$
3. Add any extra ad-hoc items if needed (e.g., *Paper Towels*, *Trash Bags*).
4. Click **Copy to Clipboard (WhatsApp/SMS)** to quickly text your supplier or shopping assistant!

---

## 6. Business & Costing Calculators

Navigate to **Calculators** to optimize your menu prices and understand break-even sales targets.

### Margin Calculator
- Input an item's **COGS (Unit Cost)** and **Selling Price**.
- View **Profit Margin %** and **Net Profit per Cup/Unit (₱)**.
- *Rule of Thumb*: Most successful cafés aim for a 65% – 80% gross profit margin on beverages!

### Breakeven Calculator
- Enter your monthly fixed operating costs (Rent, Electricity, Internet, Salaries).
- Input your average profit margin per sold item.
- Mellow calculates exactly how many cups/items you need to sell per day and per month to cover all costs and break even.

---

## 7. Sales Analytics & Data Export

Navigate to **Analytics** to view performance trends over time.

- Filter by date range: **Today**, **Last 7 Days**, **This Month**, or **Custom Date Range**.
- See **Top Selling Items** ranked by sales volume and revenue.
- Click **Export CSV** to download a spreadsheet backup of your sales log and inventory data for accounting or tax archiving.

---

## 8. Frequently Asked Questions (FAQ)

#### Q: Does Mellow require dedicated POS hardware or card readers?
**A:** No! Mellow runs directly in any modern web browser on your phone, tablet, laptop, or desktop.

#### Q: What happens if I make a mistake logging a sale?
**A:** You can edit or void transactions under the **Sales History** tab in the Sales module.

#### Q: How is Daily Net Profit calculated?
**A:** Net Profit is computed as:
$$\text{Net Profit} = \text{Gross Revenue} - \text{COGS (Product Costs)} - \text{Pro-rated Fixed Expenses}$$

---

> 💡 *Need assistance or have feedback? Reach out to your café admin or system provider.*
