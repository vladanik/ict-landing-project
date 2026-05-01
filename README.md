# ICT Services Website

Company: **ICT Władysław Danik** 

A modern React-based landing page for ICT, showcasing services, projects, and contact capabilities with EmailJS integration.

---

## 🧩 Tech Stack

- React
- React Router
- EmailJS (contact form)
- CSS (custom styling, glass UI)
- Vercel (deployment)

## 🚀 Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local` in project root

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ADMIN=your_admin_template_id
REACT_APP_EMAILJS_TEMPLATE_AUTOREPLY=your_autoreply_template_id
REACT_APP_EMAILJS_PUBLIC_ID=your_public_key
```

### 3. Run project

```bash
npm start
```

## 🔐 Environment Variables

The project uses environment variables for EmailJS integration.

**⚠️ Important:**

- Variables must start with `REACT_APP_` to be available in frontend
- These are **public values** (EmailJS public key), not secrets
- Do NOT store private credentials here

## ✉️ Contact Form

The contact form uses EmailJS and sends:

1. 📩 Admin notification (to ICT mailbox)
2. 📩 Auto-reply email (to the user)

Collected data:

- Name
- Email
- Phone (optional)
- Category
- Caller type (e.g. client, developer, recruiter)
- Message

## 🍪 Cookies
### Cookie Notification

We use a single cookie to remember that you’ve acknowledged this notice.

- Stored for 365 days
- No tracking / analytics cookies are used
- No third-party cookies

## 📄 Legal

The website includes:

- Terms of Service
- Privacy Policy (GDPR compliant)
- Cookie Policy
- Downloadable `.docx` documents

## 📦 Release Notes

### v3.0 
#### ✨ Features
- Environment variables support for EmailJS (no hardcoded credentials)
- Dual email flow:
- Admin notification
- User auto-reply
- New "Caller type" field in contact form (lead segmentation)
#### 🎨 UI/UX Improvements
- Improved contact form UX (loading state, better messaging)
- Cookie banner redesigned (better desktop & mobile layout)
- Better mobile responsiveness (forms, services, layout)
#### 🧠 Architecture & Code
- Refactored EmailJS integration (centralized constants)
- Removed direct DOM manipulation (React state instead)
- Improved form handling and submission logic
#### 🔒 Security & Best Practices
- Removed hardcoded credentials from codebase
- Introduced .env.local and Vercel env variables
- Prepared structure for backend migration (future)

### v2.0
- License created
- Company logo added
- Pages aligned (Home, About, Projects, Services)
- Legal Notices page added with downloadable documents
- Data updated
- Vulnerabilities fixed
- React errors fixed

### v1.1
- Contact popup fixed on mobile
- External links open in new tab
- Code cleanup

### v1.0
- Project initialization
- Initial data added

## 📜 License

MIT License
© 2026 ICT Władysław Danik
