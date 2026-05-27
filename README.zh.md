**🌐 语言：** [English](README.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Suomi](README.fi.md) · [Русский](README.ru.md) · 中文

---

# Cat Breeders Hub

一个面向猫咪繁育者的全栈 Web 应用，用于管理猫咪信息并通过实时聊天进行沟通。

## 技术栈

- **后端**：Django 4.2 + Django REST Framework + Django Channels + PostgreSQL + Redis
- **前端**：Angular 15（模块化）+ Angular Material
- **基础设施**：Docker + docker-compose

## 功能特性

- JWT 身份认证（注册、登录、令牌刷新）
- 猫咪管理（增删改查），并强制执行所有权验证
- 基于 WebSocket 的实时群组聊天（Django Channels + Redis）
- 消息 REST API（历史记录）
- Angular Material 用户界面

## 快速开始（Docker）

1. 复制环境配置文件：
   ```bash
   cp .env.example .env
   ```

2. 根据需要修改 `.env` 中的值（特别是 `DJANGO_SECRET_KEY`）

3. 构建并启动所有服务：
   ```bash
   docker-compose up --build
   ```

4. 访问应用：
   - 前端：http://localhost
   - 后端 API：http://localhost:8000/api/
   - Django 管理后台：http://localhost:8000/admin/

## 本地开发

### 后端

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 在 backend/ 目录下创建包含本地 DATABASE_URL 的 .env 文件
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 前端

```bash
cd frontend
npm install
npm start
```

## API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/register/` | 注册新用户 |
| POST | `/api/login/` | 登录（返回 JWT 令牌） |
| POST | `/api/token/refresh/` | 刷新 JWT 访问令牌 |
| GET | `/api/user/me/` | 当前用户信息 |
| GET | `/api/users/` | 列出所有繁育者 |
| GET/POST | `/api/cats/` | 列出自己的猫咪 / 创建猫咪 |
| GET/PUT/PATCH/DELETE | `/api/cats/<id>/` | 猫咪详情（仅限所有者） |
| GET/POST | `/api/messages/` | 公共聊天室消息 |

## WebSocket

- URL：`ws://localhost:8000/ws/chat/<房间名>/?token=<jwt_token>`
- 消息格式：`{"sender": "用户名", "text": "...", "timestamp": "..."}`

## 项目结构

```
Cat001/
├── backend/          # Django 项目
│   ├── cat_breeders/ # Django 项目包
│   ├── users/        # CustomUser 应用
│   ├── cats/         # Cat 模型与 API
│   └── chat/         # WebSocket 消费者与消息 API
├── frontend/         # Angular 15 应用
│   └── src/app/
│       ├── core/     # 服务、守卫、拦截器
│       ├── auth/     # 登录与注册
│       ├── cats/     # 猫咪增删改查
│       └── messages/ # 实时聊天
├── docker-compose.yml
└── .env
```
