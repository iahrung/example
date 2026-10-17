# Workspace – Kiến trúc dự án

## Tổng quan

Dự án là nền tảng **Lottery / Gaming** gồm 4 thành phần chính:

```
/var/www/workspace/
├── backend/        # PHP API Server (Webman Framework)
├── admin/          # Admin Dashboard – bản mới nhất (Vue 3 + TypeScript)
├── admin_old/      # Admin Dashboard – bản cũ hơn (tham khảo)
├── frontend/       # Member Center / WAP (Vue 3 + Vant, mobile)
└── database/       # SQL dump (MySQL)
```

---

## Chi tiết từng thành phần

### 1. `backend/` – PHP API Server

| Thông tin | Giá trị |
|-----------|---------|
| **Framework** | Webman (workerman/webman-framework v2.1) |
| **Language** | PHP 8.1+ |
| **ORM** | Illuminate Database (Laravel ORM) |
| **Auth** | JWT |
| **Cache/Session** | Redis |
| **Database** | MySQL |
| **Entry point** | `start.php` |
| **API prefix** | `/api/v1/*` |
| **Config** | `config/` (database.php, route.php, jwt.php, redis.php…) |
| **Admin plugin** | `plugin/admin/` (Webman Admin v2.1) |

**Khởi chạy:**
```bash
cd backend
cp .env.example .env   # cấu hình DB, Redis, JWT
composer install
php start.php start
```

**Cấu trúc chính:**
```
backend/
├── app/
│   ├── controller/api/     # ~20+ API controllers
│   ├── controller/admin/   # Admin controllers
│   ├── model/              # Eloquent models
│   ├── service/            # Business logic
│   ├── middleware/         # Auth, CORS, Encryption, RateLimit
│   ├── repository/         # Data access layer
│   └── dto/, validator/, exception/, cache/
├── config/                 # App, DB, Redis, JWT, Route, Middleware
├── plugin/admin/           # Webman Admin panel plugin
├── public/                 # Static assets
├── composer.json
└── start.php               # Entry point
```

---

### 2. `admin/` – Admin Dashboard (Vue 3 + TypeScript) ✅ Bản mới nhất

| Thông tin | Giá trị |
|-----------|---------|
| **Framework** | Vue 3 (Composition API) |
| **Language** | TypeScript 5.6 |
| **Build tool** | Vite 7.1 |
| **Package manager** | pnpm ≥ 8.8 |
| **UI** | Element Plus 2.11 |
| **CSS** | Tailwind CSS 4 + SCSS |
| **State** | Pinia 3 |
| **Router** | Vue Router 4.5 |
| **HTTP** | Axios 1.12 |
| **Charts** | ECharts 6 |
| **i18n** | Vue-i18n 9 (zh/en) |
| **Node** | ≥ 20.19 |

**Khởi chạy:**
```bash
cd admin
pnpm install
pnpm dev       # development
pnpm build     # production build
```

**Modules chính (views/):**
`dashboard`, `member`, `finance`, `lottery`, `activity`, `statistics`, `system`, `robot`, `monitor`, `chat28`, `im`, `maintenance`, `live`, `article`, `auth`, `change` …

---

### 3. `admin_old/` – Admin Dashboard (bản cũ – tham khảo)

Tương tự `admin/` nhưng ít module hơn (thiếu: monitor, robot, chat28, im, maintenance).
Dùng để tham khảo khi cần.

---

### 4. `frontend/` – Member Center / WAP (Mobile)

| Thông tin | Giá trị |
|-----------|---------|
| **Framework** | Vue 3 |
| **Build tool** | Vite 5.2 |
| **UI** | Vant 4.9 (Mobile UI) |
| **CSS** | SCSS + postcss-pxtorem (rem) |
| **State** | Pinia 3 |
| **HTTP** | Axios 1.13 |
| **Misc** | dayjs, qrcode, crypto-js, Swiper 11 |
| **Entry** | `src/main.js` |

**Khởi chạy:**
```bash
cd frontend
npm install    # hoặc pnpm install
npm run dev
npm run build
```

---

### 5. `database/` – SQL Dump

| File | Mô tả |
|------|-------|
| `by_2025-12-20_02-34-44_mysql_data_bNGEO.sql` | Full MySQL dump, ngày 2025-12-20 |

**Import:**
```bash
mysql -u root -p <db_name> < database/by_2025-12-20_02-34-44_mysql_data_bNGEO.sql
```

---

## Kiến trúc tổng thể

```
                ┌─────────────────────────────┐
                │         Người dùng           │
                └───────────┬────────┬─────────┘
                            │        │
                    Mobile  │        │  Desktop Admin
                            ▼        ▼
              ┌─────────────┐   ┌──────────────┐
              │  frontend/  │   │   admin/     │
              │ Vue3 + Vant │   │ Vue3 + Elmt+ │
              │   (WAP)     │   │  (Dashboard) │
              └──────┬──────┘   └──────┬───────┘
                     │                 │
                     │   HTTP/REST     │
                     └────────┬────────┘
                              ▼
                   ┌──────────────────┐
                   │    backend/      │
                   │  Webman (PHP)    │
                   │  /api/v1/*       │
                   └─────┬──────┬────┘
                         │      │
              ┌──────────┘      └──────────┐
              ▼                            ▼
        ┌──────────┐               ┌──────────────┐
        │  MySQL   │               │    Redis     │
        │(database)│               │(cache/session│
        └──────────┘               └──────────────┘
```

---

## Công nghệ tóm tắt

| Layer | Công nghệ |
|-------|-----------|
| Backend API | PHP 8.1 + Webman + Illuminate ORM |
| Admin UI | Vue 3 + TypeScript + Element Plus + Vite |
| User UI | Vue 3 + Vant + Vite (Mobile) |
| Database | MySQL |
| Cache | Redis |
| Auth | JWT |
| API Docs | `backend/Hemai_API_Postman.json` |
