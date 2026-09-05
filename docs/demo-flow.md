# DealFlow360 — Demo Flow

> This document describes the end-to-end demo scenario the team should build toward.
> Features are NOT yet implemented. This serves as the north star for integration.

---

## Demo Scenario: "Enterprise Software Deal — $120,000 ARR"

**Actors:**
- Sarah (Sales Rep)
- Mike (Sales Manager)
- Diana (Finance Approver)
- TechCorp Ltd (Customer — accesses via portal)

---

## Act 1: Quotation Creation

1. Sarah logs in as `SALES_REP`
2. Navigates to **Quotations → New Quotation**
3. Selects customer: **TechCorp Ltd**
4. Adds products:
   - Enterprise CRM License × 50 seats @ $1,200/seat/year
   - Implementation Services × 1 @ $20,000
   - Premium Support × 1 @ $15,000
5. System auto-calculates totals: **$95,000 subtotal**
6. Sarah applies a **10% volume discount**: Total = **$85,500**
7. System calculates margin: **42%**
8. Sarah adds notes and saves as **DRAFT**

---

## Act 2: DealTwin Analysis

1. Sarah opens DealTwin panel on the quotation
2. System shows **Risk Score: MEDIUM** (discount > threshold)
3. Sarah runs **What-If Simulation**:
   - "What if I reduce discount to 7%?"
   - System shows: margin improves to 47%, win probability stays similar
4. DealTwin suggests **Best Deal Path**: Offer 8% discount + add free onboarding
5. Sarah adjusts discount to **8%** — total = **$87,800**

---

## Act 3: Approval Workflow

1. Sarah clicks **Submit for Approval**
2. System creates `ApprovalRequest` with 2 steps:
   - Step 1: Manager approval (Mike)
   - Step 2: Finance approval (Diana) — triggered by deal size > $50,000
3. Mike logs in → sees pending approval in **Approvals** module
4. Mike reviews quotation details and DealTwin risk assessment
5. Mike clicks **Approve** with comment: "Good deal, proceed"
6. Diana logs in → Finance approval queue
7. Diana reviews margin (45%) — within acceptable range
8. Diana clicks **Approve**
9. Quotation status changes to **APPROVED**

---

## Act 4: Customer Portal

1. System sends TechCorp a portal access link
2. Customer logs in at `/customer/login`
3. Customer sees their active quotation
4. Customer reviews line items and totals
5. Customer submits a **Negotiation Request**: "Can you do 12% discount?"
6. Negotiation alert appears in Sarah's dashboard
7. Sarah responds through the portal: "We can do 9% — final offer"
8. Customer **Accepts** the quotation

---

## Act 5: Fulfillment

1. Quotation accepted → Fulfillment module activated
2. System checks inventory (software licenses: unlimited; services: schedulable)
3. Fulfillment record created: services scheduled for next month
4. Warehouse manager (if physical goods) confirms allocation

---

## Act 6: Billing

1. Invoice #INV-2024-001 auto-generated: **$88,650** (after 9% discount)
2. Subscription created: **Monthly SaaS license** @ $4,500/month
3. One-time invoice for services and setup
4. Payment recorded: TechCorp pays via wire transfer
5. Invoice status → **PAID**

---

## Act 7: Analytics Dashboard

1. Manager views **Deal Health Dashboard**
2. Sees pipeline: 5 deals in approval, 2 won this week
3. Revenue chart shows $340,000 this quarter
4. Anomaly detected: One deal with 35% discount flagged
5. Conversion rate: 68% (above target)

---

## Key Integration Points

| Handoff | From | To |
|---------|------|----|
| Quote submitted for approval | Member 2 (quotations) | Member 2 (approvals) |
| Approval completed | Member 2 (approvals) | Member 3 (fulfillment + billing) |
| Customer accepted quote | Member 4 (portal) | Member 3 (billing) |
| Deal won/lost | Member 2 (quotations) | Member 4 (analytics) |
| Anomaly detected | Member 4 (analytics) | Dashboard notification |

---

## MVP Demo Requirements

For a successful hackathon demo, the following must work end-to-end:

- [ ] User login (roles working)
- [ ] Create a quotation with line items
- [ ] DealTwin panel shows risk assessment
- [ ] Submit for approval → appears in approval queue
- [ ] Manager approves → finance approves → status changes
- [ ] Customer logs into portal and views quote
- [ ] Invoice generated
- [ ] Dashboard shows deal metrics

> Everything else is enhancement. These 8 flows must work.
