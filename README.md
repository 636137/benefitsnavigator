# BenefitsNavigator

**Multi-Benefit Eligibility Screener for Federal and State Programs**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FedRAMP](https://img.shields.io/badge/FedRAMP-Ready-blue)](https://fedramp.gov)
[![Section 508](https://img.shields.io/badge/Section%20508-Compliant-green)](https://section508.gov)

## Background

Code for America has demonstrated the transformative power of streamlined benefits access. GetCalFresh lowered application time from 45 minutes to under 10 minutes, and MNBenefits reduced an hour-long paper process to 12 minutes, enabling $636 million in benefits. However, these tools are built for specific state programs—no reusable, open-source multi-benefit eligibility engine exists at the federal level that screens across programs simultaneously.

**The Benefits Access Crisis:**
- Millions of eligible citizens don't claim available benefits
- Average citizen qualifies for 3-5 programs but only applies to 1-2
- Each program requires separate, complex application
- Federal loans and grants received lowest CX rating at just 35%
- Application abandonment rates exceed 40% for complex forms

**Regulatory Context:**
- 21st Century IDEA Act requires digital-first services
- OMB M-23-22 mandates accessible, user-centered design
- Executive Order on customer experience improvement
- Plain language requirements for government communications

## Need

Citizens often qualify for multiple federal and state benefits but navigate separate, complex application processes for each program. The fragmented landscape leads to:

**Key Pain Points:**
- **Low Uptake**: Eligible citizens unaware of available benefits
- **Application Burden**: 45-60 minute applications per program
- **Redundant Data Entry**: Same information requested multiple times
- **Complex Eligibility Rules**: Citizens can't determine qualification
- **No Holistic View**: Programs administered in silos
- **Language Barriers**: Limited multilingual support

**Target Populations:**
- Low-income families (SNAP, Medicaid, CHIP, housing assistance)
- Veterans (VA benefits, education, healthcare)
- Seniors (Medicare, Social Security, prescription assistance)
- Students (Pell Grants, work-study, loan forgiveness)
- Small businesses (SBA loans, tax credits, grants)

## Solution

A configurable rules engine that screens citizen eligibility across multiple federal benefit programs (SNAP, Medicaid, CHIP, housing assistance, tax credits, etc.) through a single, guided interview. The system provides personalized results with direct links to application portals and pre-populated form data where possible.

**Core Capabilities:**
- **Multi-Program Screening**: Check eligibility for 20+ federal programs simultaneously
- **Guided Interview**: Conversational, mobile-friendly questionnaire
- **Rules Engine**: Domain-specific language for eligibility criteria
- **Personalized Results**: Ranked by estimated benefit value
- **Application Prefill**: Export data to partner application systems
- **Multilingual**: Support for 10+ languages
- **Privacy-First**: No data stored without consent

## Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           Mobile-Responsive Frontend (USWDS)                │
│        Guided Interview | Results Dashboard                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 API Gateway (Zero-Trust)                    │
│              Login.gov Authentication                       │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────┐ ┌──▼─────────┐
│  Interview   │ │  Rules  │ │  Benefit   │
│   Engine     │ │ Engine  │ │  Catalog   │
└───────┬──────┘ └──┬──────┘ └──┬─────────┘
        │           │            │
        └───────────┼────────────┘
                    │
        ┌───────────▼────────────┐
        │  Eligibility Scorer    │
        │  (Multi-Program)       │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │   Results Ranker       │
        │  (Benefit Value Est.)  │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │  Application Prefill   │
        │  (Data Export API)     │
        └────────────────────────┘
```

### Technology Stack

- **Frontend**: React + USWDS 3.0 (mobile-first)
- **Interview Engine**: React Hook Form with conditional logic
- **Rules Engine**: Custom DSL (Domain-Specific Language) for eligibility
- **Backend**: Python FastAPI with PostgreSQL
- **Authentication**: Login.gov integration (optional)
- **Translation**: i18next with professional translations
- **Analytics**: Privacy-preserving usage metrics
- **Infrastructure**: AWS GovCloud or Azure Government

### Supported Programs

**Nutrition & Food:**
- SNAP (Supplemental Nutrition Assistance Program)
- WIC (Women, Infants, and Children)
- School Lunch Programs
- Senior Nutrition Programs

**Healthcare:**
- Medicaid
- CHIP (Children's Health Insurance Program)
- Medicare Savings Programs
- Prescription Assistance

**Housing:**
- Section 8 Housing Choice Vouchers
- Public Housing
- HOME Investment Partnerships
- Low-Income Home Energy Assistance (LIHEAP)

**Financial Assistance:**
- TANF (Temporary Assistance for Needy Families)
- SSI (Supplemental Security Income)
- EITC (Earned Income Tax Credit)
- Child Tax Credit

**Education:**
- Pell Grants
- Federal Work-Study
- Public Service Loan Forgiveness
- Head Start

**Veterans:**
- VA Healthcare
- Disability Compensation
- Education Benefits (GI Bill)
- Home Loan Guaranty

### Rules Engine DSL

Eligibility rules are written in a human-readable DSL:

```yaml
program: SNAP
eligibility:
  - condition: household_income < poverty_line * 1.3
    points: 100
  - condition: household_size >= 1
    points: 100
  - condition: citizenship == "US_CITIZEN" OR immigration_status IN ["LPR", "REFUGEE"]
    points: 100
  - condition: age >= 18 OR has_dependent == true
    points: 50
minimum_score: 250
estimated_benefit:
  formula: "household_size * 200 - (household_income * 0.3)"
  max: 1500
  min: 23
```

### Interview Flow

```
┌─────────────┐
│  Welcome    │
│  & Privacy  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Household   │
│    Info     │
│ (size, zip) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Income    │
│  & Assets   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Citizenship │
│  & Status   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Special    │
│Circumstances│
│(disability) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Results   │
│  Dashboard  │
│ (20+ progs) │
└─────────────┘
```

### Compliance Alignment

| Requirement | Implementation |
|------------|----------------|
| **21st Century IDEA Act** | Digital-first, mobile-responsive, plain language |
| **Section 508** | WCAG 2.0 AA, USWDS components, screen reader support |
| **Privacy Act** | No data stored without consent, encryption at rest/transit |
| **Plain Language** | 8th grade reading level, conversational interface |
| **Multilingual** | Spanish, Chinese, Vietnamese, Korean, Russian, Arabic, Tagalog, French, Haitian Creole, Portuguese |
| **FedRAMP** | Cloud deployment on authorized infrastructure |

## Outcomes

### Target Metrics

- **Application Time**: 75% reduction (45 min → 10 min)
- **Benefit Uptake**: 40% increase in eligible citizens claiming benefits
- **Multi-Program Applications**: 3x increase in citizens applying to multiple programs
- **Abandonment Rate**: <10% (vs. 40% baseline)
- **Citizen Satisfaction**: 90%+ (Code for America benchmark)
- **Estimated Benefits**: $500M+ in benefits claimed annually

### Success Criteria

- Match Code for America's demonstrated outcomes ($636M in benefits)
- Achieve 94% satisfaction rate (IRS Direct File benchmark)
- Support 1M+ screenings in first year
- Partner with 10+ state agencies for application prefill
- Reduce call center volume by 25%

### Impact Projections

Based on Code for America data:
- **GetCalFresh**: 45 min → 10 min (78% reduction)
- **MNBenefits**: 60 min → 12 min (80% reduction)
- **Benefits Enabled**: $636M across programs

Projected national impact:
- 10M eligible citizens not claiming SNAP alone
- Average unclaimed benefits: $2,400/year per household
- Total addressable impact: $24B+ annually

## Getting Started

### Prerequisites

```bash
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Docker (optional)
```

### Quick Start

```bash
# Clone repository
git clone https://github.com/636137/benefitsnavigator.git
cd benefitsnavigator

# Install dependencies
pip install -r requirements.txt
cd frontend && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Run locally
docker-compose up

# Access at http://localhost:3000
```

### Configuration

Create `.env`:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost/benefits

# Authentication (optional)
LOGIN_GOV_CLIENT_ID=your_client_id
LOGIN_GOV_REDIRECT_URI=http://localhost:3000/auth/callback

# Translation
TRANSLATION_API_KEY=your_key

# Analytics (privacy-preserving)
ANALYTICS_ENABLED=true
```

### Adding New Programs

1. Create eligibility rules in `rules/programs/new-program.yaml`
2. Add program metadata to `data/programs.json`
3. Update interview questions if needed
4. Test with `pytest tests/test_new_program.py`
5. Deploy

Example rule file:

```yaml
program: new-program
name: "New Benefit Program"
agency: "Department of Example"
description: "Provides assistance to eligible families"
eligibility:
  - condition: household_income < poverty_line * 1.5
    points: 100
  - condition: has_children == true
    points: 50
minimum_score: 100
application_url: "https://example.gov/apply"
estimated_benefit:
  formula: "children_count * 300"
  max: 1200
```

## API Documentation

### Screen Eligibility

```bash
POST /api/v1/screen
{
  "household_size": 4,
  "household_income": 35000,
  "state": "CA",
  "zip": "90210",
  "citizenship": "US_CITIZEN",
  "has_children": true,
  "children_count": 2
}

Response:
{
  "eligible_programs": [
    {
      "program": "SNAP",
      "score": 100,
      "estimated_benefit": 680,
      "application_url": "https://...",
      "requirements": [...]
    },
    ...
  ],
  "total_estimated_benefits": 12400
}
```

### Export Application Data

```bash
GET /api/v1/export/{session_id}

Response:
{
  "format": "json",
  "data": {
    "applicant": {...},
    "household": {...},
    "income": {...}
  },
  "compatible_systems": ["GetCalFresh", "MNBenefits"]
}
```

## Multilingual Support

Supported languages with professional translations:
- English
- Spanish (Español)
- Chinese Simplified (简体中文)
- Chinese Traditional (繁體中文)
- Vietnamese (Tiếng Việt)
- Korean (한국어)
- Russian (Русский)
- Arabic (العربية)
- Tagalog
- French (Français)
- Haitian Creole (Kreyòl Ayisyen)
- Portuguese (Português)

Add new language:

```bash
npm run translate:add -- --lang=hi --name="Hindi"
```

## Privacy & Security

- **No Data Storage**: Results not stored without explicit consent
- **Encryption**: All data encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Login.gov**: Optional authentication for saved results
- **Privacy-Preserving Analytics**: No PII in metrics
- **GDPR/CCPA Compliant**: Right to deletion, data portability

## State Integration

Partner with state agencies for application prefill:

```python
# Export to state system
export_data = navigator.export_for_state(
    state="CA",
    programs=["CalFresh", "Medi-Cal"],
    format="xml"
)
```

Supported state systems:
- California: CalFresh, Medi-Cal
- New York: ACCESS NYC
- Texas: YourTexasBenefits
- Florida: ACCESS Florida

## Contributing

We welcome contributions from:
- Federal and state agencies
- Civic tech organizations (Code for America, USDS, 18F)
- Benefits advocates
- Developers and designers

See [CONTRIBUTING.md](CONTRIBUTING.md).

**Priority Areas:**
- Additional program rules (state-specific benefits)
- Translation improvements
- State system integrations
- Mobile app development
- Accessibility enhancements

## Partnerships

Seeking partnerships with:
- **Federal Agencies**: USDA (SNAP), HHS (Medicaid/CHIP), HUD (Housing), SSA
- **State Agencies**: State benefits administrators
- **Nonprofits**: Benefits enrollment organizations
- **Technology**: Application system vendors

## Security

Report security issues to security@example.gov. See [SECURITY.md](SECURITY.md).

## License

MIT License - See [LICENSE](LICENSE).

## Acknowledgments

- Code for America (GetCalFresh, MNBenefits)
- USDS and 18F
- Benefits.gov
- U.S. Web Design System (USWDS)
- Login.gov

## Resources

- [Code for America Impact](https://codeforamerica.org/programs/social-safety-net/)
- [Benefits.gov](https://www.benefits.gov/)
- [SNAP Eligibility](https://www.fns.usda.gov/snap/recipient/eligibility)
- [Medicaid.gov](https://www.medicaid.gov/)
- [21st Century IDEA Act](https://digital.gov/resources/21st-century-integrated-digital-experience-act/)

---

**Status**: Active Development | **Maintainer**: Benefits Access Team | **Last Updated**: 2026-02-28
