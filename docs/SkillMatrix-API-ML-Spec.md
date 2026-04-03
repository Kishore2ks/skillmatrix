# SkillMatrix UI — API & ML Integration Specification

**Audience:** API Backend & ML Teams  
**Author:** SkillsAlpha Frontend  
**Date:** April 2026  
**Version:** 1.0 (POC)

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Flow & Screen Walkthrough](#2-user-flow--screen-walkthrough)
3. [Data Model (TypeScript Types)](#3-data-model-typescript-types)
4. [API Endpoints Required](#4-api-endpoints-required)
   - [4.1 Generate Domains](#41-generate-domains)
   - [4.2 Generate Sub-Domains](#42-generate-sub-domains)
   - [4.3 Generate Competencies](#43-generate-competencies)
   - [4.4 Generate Roles](#44-generate-roles)
5. [Full Response Shape Examples](#5-full-response-shape-examples)
6. [Local Storage (Persistence Layer for POC)](#6-local-storage-persistence-layer-for-poc)
7. [Export Format (Excel)](#7-export-format-excel)
8. [Current POC vs. Production State](#8-current-poc-vs-production-state)
9. [Competency Category Concepts](#9-competency-category-concepts)
10. [Proficiency Levels](#10-proficiency-levels)
11. [Org Units & Skill Levels](#11-org-units--skill-levels)
12. [Error Handling Expectations](#12-error-handling-expectations)

---

## 1. Overview

The **AI Competency Matrix Generator** is a React (TypeScript) single-page app that allows HR/L&D teams to:

1. **Select an industry** and region
2. **Generate a hierarchical competency taxonomy** (Domains → Sub-Domains → Competencies)
3. **Build role definitions** by mapping competencies to org units and skill levels
4. **Export** the full matrix and role data to Excel

In the current **POC**, all data generation is done from **static local templates** in `skill-matrix-data.ts`. The intent is for the API & ML teams to replace each generation step with a **real AI-powered API call**.

There are **4 distinct AI generation touch-points**, each of which should become a dedicated API endpoint.

---

## 2. User Flow & Screen Walkthrough

### Step 1 — Landing / Configure Form

```
┌─────────────────────────────────────────────────────┐
│  AI Competency Matrix Generator                      │
│                                                       │
│  [Smart Domains]  [Competency Taxonomy]  [Role Builder]│
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Select Your Industry *                          │ │
│  │  [ 🏦 Financial Services ]  [ 🏥 Healthcare IT ] │ │
│  │  [ 🛒 E-commerce        ]  [ 💻 Technology     ] │ │
│  │       ── or enter custom ──                      │ │
│  │  [ Type your industry (e.g., Retail)...        ] │ │
│  │                                                   │ │
│  │  Region: [ 🇺🇸 United States  ▼ ]                │ │
│  │                                                   │ │
│  │            [ ✨ Generate Competency Matrix ]      │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**User actions:**
- Picks one of 4 preset industries **or** types a custom industry name
- Selects a region: `US | Europe | Asia | Global`
- Clicks **Generate Competency Matrix**

**App behaviour:**
- Checks `localStorage` for previously saved data for that industry
- If found → shows a dialog asking to **Use Existing** or **Regenerate**
- If not found → immediately calls the domain-generation function (→ future: **API call 1**)
- Transitions to the Matrix view after a simulated 1.5s loading delay

---

### Step 2 — Competency Matrix Tab

```
┌───────────────────────────────────────────────────────────────┐
│  Competency Matrix — Financial Services          [Save][Clear] │
│  ┌──────────────────┐  ┌──────────────────────────────────┐   │
│  │ Competency Matrix │  │ Role Generator                   │   │
│  └──────────────────┘  └──────────────────────────────────┘   │
│                                                                 │
│  [ 6 Domains ]  [ 18 Sub-Domains ]  [ 42 Competencies ]        │
│                                                                 │
│  🔍 Search ...       [Expand All] [Select All] [Add] [Export]  │
│                                                                 │
│  ▶ 🏦 Banking & Lending                    [Edit][Generate][🗑] │
│    ▶ Retail Banking                        [Edit][Generate][🗑] │
│      ▶ Customer Account Management                             │
│         Skills: Account Servicing                              │
│         Knowledge: Banking Products                            │
│         Attitude: Customer Focus                               │
└───────────────────────────────────────────────────────────────┘
```

**Hierarchy:**
```
Domain
  └── Sub-Domain
        └── Competency
              ├── Skills      (blue badges)
              ├── Knowledge   (purple badges)
              └── Attitudes   (amber badges)
```

**Per-Domain actions:**
- **Expand/Collapse** — toggle sub-domain list visibility
- **Edit** — rename domain name + description inline
- **Generate Sub-Domains** — (→ future: **API call 2**) fetches sub-domains for this domain
- **Delete** — removes the domain (with confirmation dialog)
- **Add Sub-Domain** — manual inline form

**Per-Sub-Domain actions:**
- **Expand/Collapse** — toggle competency list
- **Edit** — rename sub-domain inline
- **Generate Competencies** — (→ future: **API call 3**) fetches competencies for this sub-domain
- **Delete**
- **Add Competency** — manual inline form

**Per-Competency actions:**
- **Expand/Collapse** — view the SKA breakdown
- **Delete**

---

### Step 3 — Role Generator Tab

```
┌──────────────────────────────────────────────────────────────┐
│  Generate Roles from Competencies                             │
│                                                               │
│  Select Domain:        [ Cloud Infrastructure ▼ ]            │
│  Select Sub-Domains:   ☑ Compute Services (2)                │
│                        ☑ Storage Solutions (2)               │
│                        ☐ Networking (0)                      │
│                                                               │
│  Organisation Unit:    [ Engineering ▼ ]                     │
│  Skill Level:          [ L3 ▼ ]                              │
│                                                               │
│  8 competencies from 2 sub-domain(s) · Engineering · Advanced│
│                                                               │
│                              [ 👤 Generate Roles ]           │
│                                                               │
│  Generated Roles (2)                          [Export Roles]  │
│  ▶ Cloud Infrastructure Specialist                           │
│    [8 competencies] [Compute Services] [Engineering] [L3]    │
│  ▶ Compute Services Lead                                     │
│    [6 competencies] [Compute Services] [Engineering] [L3]    │
└──────────────────────────────────────────────────────────────┘
```

**User selects:**
1. A domain (only domains with at least one sub-domain that has competencies are shown)
2. One or more sub-domains (multi-select checkboxes)
3. An Organisation Unit (Engineering / Sales / HR / Marketing / Operations)
4. A Skill Level (L1=Beginner, L2=Intermediate, L3=Advanced, L4=Expert)

**App behaviour:**
- Builds a `skillsBySubDomain` payload
- Calls role generation (→ future: **API call 4**)
- Deduplicates roles by name against previously saved roles
- Persists to `localStorage`

---

## 3. Data Model (TypeScript Types)

These are the canonical types the UI works with. API responses **must** match this shape.

```typescript
// ─── Atomic Items ──────────────────────────────────────────────
interface CompetencyItem {
  id: string;           // unique, e.g. "skill-item-1712000000000-0"
  name: string;
  description: string;
}

// ─── Competency (SKA bundle) ────────────────────────────────────
interface Competency {
  id: string;           // e.g. "competency-1712000000000-0"
  name: string;
  description: string;
  skills: CompetencyItem[];      // "S" — practical capability items
  knowledge: CompetencyItem[];   // "K" — conceptual understanding items
  attitudes: CompetencyItem[];   // "A" — behavioural/mindset items
  isExpanded?: boolean;          // UI-only display state, ignored by API
}

// ─── Sub-Domain ─────────────────────────────────────────────────
interface SubDomain {
  id: string;           // e.g. "subdomain-1712000000000-0"
  name: string;
  description: string;
  competencies: Competency[];
  competenciesGenerated: boolean;  // true after API call 3 is done
  isExpanded: boolean;             // UI-only
  isSelected: boolean;             // used in role generator selection
}

// ─── Domain ─────────────────────────────────────────────────────
interface Domain {
  id: string;           // e.g. "domain-1712000000000-0"
  name: string;
  description: string;
  subDomains: SubDomain[];
  subDomainsGenerated: boolean;    // true after API call 2 is done
  isExpanded: boolean;             // UI-only
  isSelected: boolean;             // used in role generator selection
}

// ─── Company Info (input to API call 1) ─────────────────────────
interface CompanyInfo {
  industry: string;                          // e.g. "Financial Services"
  companySize: 'Startup' | 'Small' | 'Medium' | 'Enterprise';
  region: 'US' | 'Europe' | 'Asia' | 'Global';
}

// ─── Role ────────────────────────────────────────────────────────
type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface RoleSkill {
  competencyId: string;
  competencyName: string;
  subDomainName: string;
  proficiency: ProficiencyLevel;
}

interface Role {
  id: string;
  roleName: string;
  description?: string;
  primarySubDomain: string;
  assignedSkills: RoleSkill[];
  organization_unit_level_id?: number;  // 1=Beginner,2=Intermediate,3=Advanced,4=Expert
  organization_unit_id?: number;        // 10=Eng,20=Sales,30=HR,40=Mktg,50=Ops
  isExpanded?: boolean;                 // UI-only
}

// ─── Role Generation Request ─────────────────────────────────────
interface RoleGenerationRequest {
  domain: string;
  skillsBySubDomain: Array<{
    subDomainName: string;
    competencies: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  }>;
}
```

---

## 4. API Endpoints Required

### 4.1 Generate Domains

**Trigger:** User clicks "Generate Competency Matrix" on the landing form.

**Method:** `POST /api/skill-matrix/generate-domains`

**Request Body:**
```json
{
  "industry": "Financial Services",
  "companySize": "Medium",
  "region": "US"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `industry` | `string` | ✅ | Free text or one of the 4 presets |
| `companySize` | `"Startup" \| "Small" \| "Medium" \| "Enterprise"` | ✅ | Currently always `"Medium"` from the UI |
| `region` | `"US" \| "Europe" \| "Asia" \| "Global"` | ✅ | User-selected |

**Expected Response:**
```json
{
  "domains": [
    {
      "id": "domain-001",
      "name": "Banking & Lending",
      "description": "Core banking operations including retail, corporate, and specialized lending services",
      "subDomains": [],
      "subDomainsGenerated": false,
      "isExpanded": false,
      "isSelected": true
    },
    {
      "id": "domain-002",
      "name": "Investment Management",
      "description": "Portfolio management, asset allocation, and investment advisory services",
      "subDomains": [],
      "subDomainsGenerated": false,
      "isExpanded": false,
      "isSelected": true
    }
    // ... typically 5–8 domains for the given industry
  ]
}
```

> **ML Note:** The ML model should return 5–8 industry-relevant domains. Each domain should have a clear, specific `description`. `subDomains` must be an **empty array** — the UI will request sub-domains per domain on demand (lazy loading pattern).

---

### 4.2 Generate Sub-Domains

**Trigger:** User clicks the **"Generate Sub-Domains"** button on a domain row.

**Method:** `POST /api/skill-matrix/generate-subdomains`

**Request Body:**
```json
{
  "domainName": "Banking & Lending",
  "industry": "Financial Services",
  "region": "US"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `domainName` | `string` | ✅ | The domain the user clicked on |
| `industry` | `string` | ✅ | Context — top-level industry |
| `region` | `string` | ❌ | Optional context |

**Expected Response:**
```json
{
  "subDomains": [
    {
      "id": "subdomain-001",
      "name": "Retail Banking",
      "description": "Consumer banking services including deposits, loans, and personal finance",
      "competencies": [],
      "competenciesGenerated": false,
      "isExpanded": false,
      "isSelected": true
    },
    {
      "id": "subdomain-002",
      "name": "Corporate Banking",
      "description": "Business banking, corporate loans, and treasury services",
      "competencies": [],
      "competenciesGenerated": false,
      "isExpanded": false,
      "isSelected": true
    }
    // ... typically 3–5 sub-domains per domain
  ]
}
```

> **ML Note:** Return 3–5 sub-domains per domain. `competencies` **must** be an empty array. The UI will lazy-load competencies per sub-domain.

---

### 4.3 Generate Competencies

**Trigger:** User clicks **"Generate Competencies"** on a sub-domain row.

**Method:** `POST /api/skill-matrix/generate-competencies`

**Request Body:**
```json
{
  "subDomainName": "Retail Banking",
  "domainName": "Banking & Lending",
  "industry": "Financial Services",
  "region": "US"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `subDomainName` | `string` | ✅ | The specific sub-domain |
| `domainName` | `string` | ✅ | Parent domain for context |
| `industry` | `string` | ✅ | Top-level context |
| `region` | `string` | ❌ | Optional context |

**Expected Response:**
```json
{
  "competencies": [
    {
      "id": "competency-001",
      "name": "Customer Account Management",
      "description": "Managing retail customer accounts and banking products",
      "skills": [
        {
          "id": "skill-item-001",
          "name": "Account Servicing",
          "description": "Opening, maintaining, and closing customer accounts"
        }
      ],
      "knowledge": [
        {
          "id": "knowledge-item-001",
          "name": "Banking Products",
          "description": "Understanding of savings, loans, and deposit products"
        }
      ],
      "attitudes": [
        {
          "id": "attitude-item-001",
          "name": "Customer Focus",
          "description": "Always prioritising the customer experience"
        }
      ],
      "isExpanded": false
    },
    {
      "id": "competency-002",
      "name": "Sales & Cross-Selling",
      "description": "Selling and cross-selling financial products to retail customers",
      "skills": [
        {
          "id": "skill-item-002",
          "name": "Needs-Based Selling",
          "description": "Identifying and fulfilling customer financial needs"
        }
      ],
      "knowledge": [
        {
          "id": "knowledge-item-002",
          "name": "Product Features & Benefits",
          "description": "Deep knowledge of all retail banking products"
        }
      ],
      "attitudes": [
        {
          "id": "attitude-item-002",
          "name": "Proactive Outreach",
          "description": "Taking initiative to engage customers with relevant offers"
        }
      ],
      "isExpanded": false
    }
  ]
}
```

> **ML Note:** Return 2–4 competencies per sub-domain. Each competency **must** contain at least 1 item in each of `skills`, `knowledge`, and `attitudes`. This SKA (Skill–Knowledge–Attitude) structure is critical — the UI renders them as separate colour-coded sections (blue / purple / amber). IDs must be globally unique strings.

---

### 4.4 Generate Roles

**Trigger:** User fills in domain, sub-domains, org unit, skill level and clicks **"Generate Roles"**.

**Method:** `POST /api/skill-matrix/generate-roles`

**Request Body:**
```json
{
  "domain": "Cloud Infrastructure",
  "industry": "Technology & Software",
  "organizationUnitId": 10,
  "organizationUnitName": "Engineering",
  "skillLevelId": 3,
  "skillLevelName": "Advanced",
  "skillsBySubDomain": [
    {
      "subDomainName": "Compute Services",
      "competencies": [
        {
          "id": "competency-001",
          "name": "Cloud Compute Management",
          "description": "Provisioning and managing cloud compute resources"
        }
      ]
    },
    {
      "subDomainName": "Storage Solutions",
      "competencies": [
        {
          "id": "competency-002",
          "name": "Cloud Storage Management",
          "description": "Designing and managing cloud storage for reliability and cost"
        }
      ]
    }
  ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `domain` | `string` | ✅ | Selected domain name |
| `industry` | `string` | ✅ | Top-level context |
| `organizationUnitId` | `number` | ✅ | See [Org Units table](#11-org-units--skill-levels) |
| `organizationUnitName` | `string` | ✅ | Human-readable label |
| `skillLevelId` | `number` | ✅ | 1–4, see [Skill Levels table](#11-org-units--skill-levels) |
| `skillLevelName` | `string` | ✅ | Human-readable proficiency |
| `skillsBySubDomain` | `array` | ✅ | All selected competencies grouped by sub-domain |

**Expected Response:**
```json
{
  "roles": [
    {
      "id": "role-001",
      "roleName": "Cloud Infrastructure Specialist",
      "description": "Expert in managing and scaling cloud infrastructure across multiple providers",
      "primarySubDomain": "Compute Services",
      "organization_unit_id": 10,
      "organization_unit_level_id": 3,
      "assignedSkills": [
        {
          "competencyId": "competency-001",
          "competencyName": "Cloud Compute Management",
          "subDomainName": "Compute Services",
          "proficiency": "Advanced"
        },
        {
          "competencyId": "competency-002",
          "competencyName": "Cloud Storage Management",
          "subDomainName": "Storage Solutions",
          "proficiency": "Advanced"
        }
      ],
      "isExpanded": true
    },
    {
      "id": "role-002",
      "roleName": "Compute Services Lead",
      "description": "Leads cloud compute strategy and engineering within the organization",
      "primarySubDomain": "Compute Services",
      "organization_unit_id": 10,
      "organization_unit_level_id": 3,
      "assignedSkills": [
        {
          "competencyId": "competency-001",
          "competencyName": "Cloud Compute Management",
          "subDomainName": "Compute Services",
          "proficiency": "Advanced"
        }
      ],
      "isExpanded": true
    }
  ]
}
```

> **ML Note:** The ML model should return 2–4 roles per generation request. Each role must have a distinct `roleName`, a meaningful `description`, and an `assignedSkills` array populated from the provided competencies. The `proficiency` value in `assignedSkills` should match `skillLevelName` from the request. Use `isExpanded: true` so roles show expanded on first load.

---

## 5. Full Response Shape Examples

### Domains Response (Full)
```json
{
  "domains": [
    {
      "id": "domain-fin-001",
      "name": "Banking & Lending",
      "description": "Core banking operations including retail, corporate, and specialized lending services",
      "subDomains": [],
      "subDomainsGenerated": false,
      "isExpanded": false,
      "isSelected": true
    },
    {
      "id": "domain-fin-002",
      "name": "Investment Management",
      "description": "Portfolio management, asset allocation, and investment advisory services",
      "subDomains": [],
      "subDomainsGenerated": false,
      "isExpanded": false,
      "isSelected": true
    },
    {
      "id": "domain-fin-003",
      "name": "Risk & Compliance",
      "description": "Risk assessment, regulatory compliance, and audit functions",
      "subDomains": [],
      "subDomainsGenerated": false,
      "isExpanded": false,
      "isSelected": true
    }
  ]
}
```

### Competencies Response (Full, with all SKA items)
```json
{
  "competencies": [
    {
      "id": "competency-retail-001",
      "name": "Customer Account Management",
      "description": "Managing retail customer accounts and banking products",
      "isExpanded": false,
      "skills": [
        {
          "id": "skill-retail-001-1",
          "name": "Account Servicing",
          "description": "Opening, maintaining, and closing customer accounts"
        },
        {
          "id": "skill-retail-001-2",
          "name": "Digital Onboarding",
          "description": "Guiding customers through mobile and web account setup"
        }
      ],
      "knowledge": [
        {
          "id": "knowledge-retail-001-1",
          "name": "Banking Products",
          "description": "Understanding of savings, loans, and deposit products"
        },
        {
          "id": "knowledge-retail-001-2",
          "name": "Regulatory Requirements",
          "description": "KYC, AML, and account documentation obligations"
        }
      ],
      "attitudes": [
        {
          "id": "attitude-retail-001-1",
          "name": "Customer Focus",
          "description": "Always prioritising the customer experience"
        }
      ]
    }
  ]
}
```

---

## 6. Local Storage (Persistence Layer for POC)

The UI currently uses **browser `localStorage`** to save and restore work-in-progress. This avoids data loss on page refresh during the POC phase.

| Key Pattern | Content | When written |
|-------------|---------|--------------|
| `skills-matrix-{industry-slug}` | `Domain[]` JSON array | On "Save Draft" button or after generation |
| `role-definitions-{industry-slug}` | `Role[]` JSON array | After each role generation |

**Industry slug** = `industry.replace(/\s+/g, '-')`, e.g. `"Financial Services"` → `"Financial-Services"`

**Example keys:**
```
skills-matrix-Financial-Services
role-definitions-Financial-Services
skills-matrix-Technology-&-Software
```

When the user clicks "Generate" for an industry that has saved data, a dialog appears offering:
- **Use Existing Data** — loads from localStorage instantly
- **Regenerate** — clears localStorage and calls the generation function fresh

> **Note for API team:** When the real API is integrated, `localStorage` can be replaced with a proper backend persistence layer (database). The shape of the saved data would be identical to the API response types.

---

## 7. Export Format (Excel)

The UI has two export buttons that generate `.xlsx` files using `SheetJS`.

### 7a. Competency Matrix Export

**Filename:** `competency-matrix-{industry-slug}.xlsx`  
**Sheet:** `Competency Matrix`

| Level | Name | Description | Category | Sub-Domains | Competencies |
|-------|------|-------------|----------|-------------|--------------|
| `DOMAIN` | Banking & Lending | Core banking operations... | _(empty)_ | `3` | `8` |
| `  SUB-DOMAIN` | Retail Banking | Consumer banking services... | _(empty)_ | _(empty)_ | `2` |
| `    COMPETENCY` | Customer Account Management | Managing retail... | `2S / 2K / 1A` | _(empty)_ | _(empty)_ |
| _(blank row)_ | | | | | |

> `Category` column format for competencies: `{#skills}S / {#knowledge}K / {#attitudes}A`

### 7b. Roles Export

**Filename:** `roles-{industry-slug}.xlsx`  
**Sheet:** `Roles`

| Role | Description | Organisation Unit | Skill Level | Sub-Domain | Competency |
|------|-------------|-------------------|-------------|------------|------------|
| Cloud Infrastructure Specialist | Expert in... | Engineering | Advanced | Compute Services | _(empty)_ |
| _(empty)_ | | | | Compute Services | Cloud Compute Management |
| _(empty)_ | | | | Storage Solutions | Cloud Storage Management |
| _(blank row)_ | | | | | |
| Compute Services Lead | Leads cloud... | Engineering | Advanced | Compute Services | _(empty)_ |

---

## 8. Current POC vs. Production State

| Capability | POC (Current) | Production (Expected) |
|------------|---------------|----------------------|
| Generate Domains | Static template lookup in `skill-matrix-data.ts` | `POST /api/skill-matrix/generate-domains` |
| Generate Sub-Domains | Static template lookup in `skill-matrix-data.ts` | `POST /api/skill-matrix/generate-subdomains` |
| Generate Competencies | Static template lookup in `skill-matrix-data.ts` | `POST /api/skill-matrix/generate-competencies` |
| Generate Roles | Mock 2 hardcoded roles | `POST /api/skill-matrix/generate-roles` |
| Data persistence | `localStorage` | Backend DB / User session |
| Auth | Demo bypass (hardcoded user) | Real JWT auth flow |
| Industry coverage | 4 preset + custom (falls back to Tech template) | Any industry via ML model |
| Simulated latency | 1.5–2s `setTimeout()` | Real network latency |

---

## 9. Competency Category Concepts

The UI strictly uses the **SKA (Skill – Knowledge – Attitude)** taxonomy:

| Category | Colour in UI | Definition |
|----------|-------------|------------|
| **Skill** | Blue | Practical, observable, actionable capabilities — what the person *does* |
| **Knowledge** | Purple | Conceptual understanding, facts, frameworks — what the person *knows* |
| **Attitude** | Amber / Orange | Behavioural dispositions, mindset, values — how the person *approaches* work |

**Each competency must have at least 1 item in each category.** Ideally 1–3 items per category.

**Example:**
```
Competency: "Data Pipeline Development"
  Skill:     "ETL/ELT Development — Building pipelines with Apache Spark, dbt, or Glue"
  Knowledge: "Data Warehouse Design — Kimball, Data Vault, and medallion architecture patterns"
  Attitude:  "Data Reliability — Treating data pipelines with the same rigour as production code"
```

---

## 10. Proficiency Levels

Used in the Role Generator to assign a proficiency level to each role's competencies.

| UI Label | API Value | `skillLevelId` | Meaning |
|----------|-----------|---------------|---------|
| L1 | `"Beginner"` | `1` | Foundational awareness; needs guidance |
| L2 | `"Intermediate"` | `2` | Can work independently on standard tasks |
| L3 | `"Advanced"` | `3` | Deep expertise; can mentor others |
| L4 | `"Expert"` | `4` | Industry-leading mastery; drives strategy |

---

## 11. Org Units & Skill Levels

Currently the UI hardcodes these values. The API team should provide a lookup endpoint in future, but for now the IDs are fixed:

### Organisation Units

| `organization_unit_id` | Label |
|------------------------|-------|
| `10` | Engineering |
| `20` | Sales |
| `30` | HR |
| `40` | Marketing |
| `50` | Operations |

### Skill Levels (maps 1:1 to Proficiency)

| `organization_unit_level_id` | Label |
|-----------------------------|-------|
| `1` | L1 (Beginner) |
| `2` | L2 (Intermediate) |
| `3` | L3 (Advanced) |
| `4` | L4 (Expert) |

---

## 12. Error Handling Expectations

The UI shows `toast` notifications for errors. The API should return error shapes that the UI can display.

**Expected error response format:**
```json
{
  "error": true,
  "statusCode": 400,
  "message": "Industry field is required",
  "details": null
}
```

**HTTP status codes the UI handles:**

| Code | Meaning | UI Behaviour |
|------|---------|--------------|
| `200` | Success | Renders generated data |
| `400` | Bad Request | Shows error toast with `message` |
| `401` | Unauthorised | Redirects to login |
| `422` | Validation Error | Shows field-level error toast |
| `500` | Server Error | Shows generic "Something went wrong" toast |

---

## Summary Checklist for API & ML Team

- [ ] `POST /api/skill-matrix/generate-domains` — accepts `{ industry, companySize, region }`, returns `{ domains: Domain[] }` with empty `subDomains` arrays
- [ ] `POST /api/skill-matrix/generate-subdomains` — accepts `{ domainName, industry, region }`, returns `{ subDomains: SubDomain[] }` with empty `competencies` arrays
- [ ] `POST /api/skill-matrix/generate-competencies` — accepts `{ subDomainName, domainName, industry, region }`, returns `{ competencies: Competency[] }` with populated `skills`, `knowledge`, `attitudes`
- [ ] `POST /api/skill-matrix/generate-roles` — accepts `RoleGenerationRequest` + org/level context, returns `{ roles: Role[] }`
- [ ] All `id` fields must be globally unique strings
- [ ] `isExpanded`, `isSelected`, `subDomainsGenerated`, `competenciesGenerated` are UI state fields — the API should always return them as `false` (the UI manages them)
- [ ] Each competency must have at least 1 item in `skills`, `knowledge`, and `attitudes`
- [ ] `proficiency` in `RoleSkill` must be one of: `"Beginner" | "Intermediate" | "Advanced" | "Expert"`

---

*Document generated from POC source code analysis. For questions, contact the SkillsAlpha Frontend team.*
