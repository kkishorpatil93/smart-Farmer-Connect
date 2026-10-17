# 🌾 Smart Farmer Connect (ಸ್ಮಾರ್ಟ್ ರೈತ ಸಂಪರ್ಕ)

> **Karnataka APMC Pre-Harvest Marketplace**  
> Helping farmers connect with verified APMC mandi traders *before* travelling with their crop.

---

## 📖 1. What This App Does (in Simple English)

In rural India (specifically Karnataka), farmers often harvest their crops, load them onto a rented truck, and travel dozens of kilometers to the nearest APMC (mandi) without knowing who will buy their produce or what price they will get.

**Smart Farmer Connect solves this problem:**
1. **The Farmer** takes a photo of their freshly harvested crop, enters the quantity (in kg or quintals), expected price, and chooses their target APMC market.
2. **Matching Mandi Traders** get an instant notification on their phones showing the crop, photo, and village.
3. **Traders send firm offers** with the price they are willing to pay and the quantity they need.
4. **The Farmer compares offers side-by-side** and accepts one or more offers.
5. **Contact details unlock** only after acceptance. A visit pass with a QR code is generated so the farmer can deliver directly to a confirmed buyer with confidence.

---

## 🛠️ 2. Technology Choices (Explained for Beginners)

| Technology | What it is | Why we chose it |
|---|---|---|
| **Next.js (App Router) + TypeScript** | Modern web framework | Allows building the frontend screens and backend server logic in a single project, with TypeScript catching bugs before running code. |
| **Tailwind CSS** | Styling framework | Enables fast, consistent, and lightweight mobile design using clean CSS utility classes. |
| **Supabase (PostgreSQL)** | Open-source cloud database | Provides a powerful relational database, user authentication (phone OTP), secure file storage, and real-time alerts all in one place. |
| **Row Level Security (RLS)** | Database safety rules | Enforces privacy directly inside the database. A trader cannot see a farmer's phone number until the farmer explicitly accepts their bid. |
| **next-intl** | Language translation | Delivers seamless bilingual experience in **Kannada (ಕನ್ನಡ)** and **English** for rural farmers and traders. |
| **Vitest & Playwright** | Automated testing tools | Vitest runs fast unit tests on calculations, while Playwright simulates real user actions on a simulated mobile phone. |

---

## 📂 3. Folder Structure

Here is how the project is organized:

```text
smart-farmer-connect/
├── docs/                     # Guides for deployment, integrations, and demo accounts
├── public/                   # Static icons, manifest, and logos
├── scripts/                  # Helper scripts to seed or reset test data
├── src/                      # Main source code
│   ├── app/                  # Next.js App Router pages and API routes
│   │   ├── globals.css       # Tailwind styles and 48px touch-target rules
│   │   ├── layout.tsx        # Base HTML layout with Kannada & Latin fonts
│   │   └── page.tsx          # Mobile-first homepage with Kannada toggle & crop card
│   ├── components/           # Reusable UI widgets (buttons, cards, modals)
│   ├── hooks/                # Custom React hooks (realtime subscriptions, etc.)
│   ├── lib/                  # Backend utilities
│   │   ├── adapters/         # SMS, WhatsApp, and Push adapters (with honest Mock mode)
│   │   ├── supabase/         # Supabase client and server configuration
│   │   └── utils/            # Unit conversion (kg/quintal) and state machine engine
│   └── types/                # TypeScript types for all 15 database tables
├── supabase/                 # Database configuration
│   ├── migrations/           # Numbered SQL files (tables, triggers, RLS)
│   └── seed.sql              # Sample farmers, sellers, APMC markets, and crop lots
└── tests/                    # Automated unit tests and E2E suites
```

---

## 🚀 4. How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18 or higher) and `npm` installed.

### Setup Commands

#### 🪟 Windows (PowerShell):
```powershell
# 1. Navigate to the project directory
cd smart-farmer-connect

# 2. Install dependencies
npm install

# 3. Create your local environment file
Copy-Item .env.example .env.local

# 4. Run unit tests
npm test

# 5. Start development server
npm run dev
```

#### 🍎 macOS & 🐧 Linux:
```bash
# 1. Navigate to the project directory
cd smart-farmer-connect

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Run unit tests
npm test

# 5. Start development server
npm run dev
```

Now open your browser and visit: **`http://localhost:3000`**

---

## 🧪 5. Running the Tests

To verify that the unit conversion math (kg to quintal/tonne) and state machine transitions work with 100% precision:

```bash
npm test
```

---

## 🗄️ 6. Applying Database Migrations & Seed Data

When using a local or cloud Supabase instance:
1. Copy the contents of `supabase/migrations/20261017000001_initial_schema.sql` into the Supabase SQL Editor and run it.
2. Run `supabase/migrations/20261017000002_triggers_and_constraints.sql`.
3. Run `supabase/migrations/20261017000003_row_level_security.sql`.
4. Run `supabase/seed.sql` to populate Karnataka APMC markets, Kannada crop types, 3 test farmers, 4 sellers, and sample listings.
