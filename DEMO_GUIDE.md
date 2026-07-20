# BloodNet Demo Guide

## Purpose
This document is a client-facing walkthrough for the BloodNet demo. It describes the main flows and feature locations without requiring the client to read the code.

> Note: This guide is written for demo use. It is not the app code, but it points to where the features live in the application.

---

## 1. Signup and Email Verification

### What happens
- The user signs up with name, email, password, phone number, role, city, and blood group.
- After signup, BloodNet generates an OTP code and sends it to the registered email.
- The user then enters the OTP on the verification screen.
- Once verified, the user is logged in and redirected to the dashboard.

### Why this matters
- The signup process ensures only real emails are used.
- Email verification also prevents unauthorized access.
- The demo shows both successful signup and verification.

### Where it is in the app
- `/signup` — registration form
- `/register/verify` — OTP verification page
- `app/api/auth/signup/route.ts` — backend signup logic
- `app/api/auth/otp/verify/route.ts` — OTP verification logic

---

## 2. 90-Day Eligibility Rule

### What this means
- After a donor gives whole blood, they must wait 90 days before donating again.
- The app tracks the donor's last donation date.
- If the 90-day waiting period has not passed, the donor is marked `not eligible`.
- When the waiting period is over, the donor becomes `eligible` again.

### Why this matters
- This is a standard medical safety rule.
- It prevents donors from donating too frequently.
- The app enforces this rule automatically.

### Where it is in the app
- Donor status appears on the donor dashboard and donor profile.
- The backend eligibility logic is in `lib/mappers.ts` and eligibility-related APIs.

---

## 3. Donor Submits Blood

### Donation flow for donor
1. Donor goes to the `Donations` page in their dashboard.
2. Donor submits donation details after giving blood at a registered hospital.
3. Donor uploads receipts or confirms the donation information.
4. The system stores the donation submission and waits for receiver/admin confirmation.

### Why this matters
- This shows the donor completing their side of the transaction.
- It starts the process that leads to certificate generation.

### Where it is in the app
- `app/donations/page.tsx` — donor donation management
- `components/donation-certificate.tsx` — certificate UI
- `app/api/donations/submission/route.ts` — backend donation submission logic

---

## 4. Receiver Gets Blood

### Receiver flow
1. Receiver creates a blood request on `Request Blood`.
2. The app matches the request to available donors and hospitals.
3. A donor accepts the request and delivers blood.
4. The receiver confirms receipt in the app.

### Why this matters
- It demonstrates the receiver side of the platform.
- It shows how matching and request fulfillment work.

### Where it is in the app
- `/request-blood` — blood request page
- `app/api/requests` or request-related API routes for request submission and matching

---

## 5. Certificate Generation

### How certificates are created
- Once a donation is fully confirmed, BloodNet generates a digital donation certificate.
- The certificate is linked to the donation record.
- Donors can download the certificate from their donation history.

### Why this matters
- Certificates reward donors for their contribution.
- They provide proof of the donation and can be shared.

### Where it is in the app
- `app/rewards/certificates/page.tsx` — certificates page
- `app/api/donations/certificate/route.ts` — certificate generation API
- `lib/donation-workflow.ts` — certificate PDF generation

---

## 6. Admin Approval

### Admin approval process
1. The admin receives notifications for donation submissions.
2. Admin reviews donation details and receiver confirmation.
3. Admin approves the donation.
4. Approval finalizes the donation and completes the certificate workflow.

### Why this matters
- Admin approval ensures quality control.
- It prevents fraudulent or incomplete donations from being finalized.

### Where it is in the app
- `app/admin/dashboard/page.tsx` — admin dashboard
- `app/api/admin/*` routes for admin actions and approval workflows
- `lib/fulfillment-service.ts` — approval business rules

---

## 7. Demo Script for Your Client

Use this script during the presentation:

1. "First, we register a new user using the signup page."
2. "After signup, the user receives an OTP by email and verifies their account."
3. "Now the user is logged in and can access their dashboard."
4. "If the user is a donor, they can submit a donation and see their eligibility status."
5. "After the receiver confirms receipt, the admin approves the donation."
6. "Finally, the donor receives a digital certificate and can download it from the dashboard."

---

## 8. Notes for the Client

- This demo is focused on the main user flows: signup, verification, donor submission, receiver request, admin approval, and certificate issuance.
- The app is designed to be easy to use and automatically tracks eligibility and donation history.
- If you want, I can also add a short video demo or a clickable walkthrough in the app itself.

<!--
Developer note: This file is a demo guide and should be kept separate from the app code. It explains the flow in plain language for non-technical audiences.
-->
