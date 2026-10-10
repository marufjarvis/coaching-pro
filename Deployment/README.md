# 📁 Coaching Pro Deployment Packages

এই ফোল্ডারে ডিপ্লয়মেন্টের জন্য ৩টি আলাদা এবং সম্পূর্ণ প্রস্তুত ফোল্ডার রয়েছে:

---

### 1. 🌐 `Frontend/` (ফ্রন্টএন্ড ফাইল)
- **কোথায় আপলোড করবেন:** আপনার cPanel-এর মূল ডোমেইন ডিরেক্টরি `public_html` (অথবা `marufsictcare.com`) ফোল্ডারে।
- **ফাইলসমূহ:** `index.html`, `assets/`, `manifest.webmanifest`, `sw.js`, `.htaccess` এবং সমস্ত অপটিমাইজড ইমেজ ও আইকন।

---

### 2. ⚙️ `Backend/` (ব্যাকএন্ড API)
- **কোথায় আপলোড করবেন:** `public_html`-এর বাইরে নিরাপদ ফোল্ডারে, যেমন: `/home/USERNAME/coaching_api`।
- **ফাইলসমূহ:** সম্পূর্ণ Laravel 12/13 REST API, PHP 8.3 & 8.4 সাপোর্টেড `vendor/` প্যাকেজ, কন্ট্রোলার, মডেল, মাইগ্রেশন, এবং কনফিগারেশন।
- **সিমলিংক:** `public_html/api` -> `coaching_api/public`।

---

### 3. 🗄️ `Database/` (ডাটাবেজ ফাইলসমূহ)
- **`empty_database.sql`:** 
  - cPanel > **phpMyAdmin** এ নতুন ডেটাবেজে সরাসরি Import করার জন্য সম্পূর্ণ ফ্রেশ খালি স্কিমা (কোনো ডেমো শিক্ষার্থী ছাড়া)।
- **`empty_database_backup.json`:** 
  - ওয়েবসাইট লাইভ অবস্থায় এডমিন প্যানেলের **Settings > Database Backup & Restore** এ গিয়ে আপলোড করলেই এক ক্লিকে সকল ডেমো ডাটা মুছে দিয়ে সফটওয়্যারকে নতুনের মতো ফ্রেশ করে ফেলার জন্য।

---

### 📦 1-Click Upload জিপ প্যাকেজ:
- **`frontend_public_html.zip`:** `Frontend/` ফোল্ডারের রেডি জিপ
- **`backend_api.zip`:** `Backend/` ফোল্ডারের রেডি জিপ
- **`database.zip`:** `Database/` ফোল্ডারের রেডি জিপ
