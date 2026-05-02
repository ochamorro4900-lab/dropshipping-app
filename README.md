# 🛒 DropShop — Plataforma de gestión Dropshipping

**Proyecto:** Asignatura Modelos de Computación  
**Autor:** Oscar Andres Chamorro Vallejo  
**Universidad:** Universidad de Nariño

---

## 🚀 Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Vite** | Servidor de desarrollo y bundler |
| **Supabase** | Base de datos (PostgreSQL) + Autenticación |
| **Vanilla JS (ES Modules)** | Lógica del frontend |
| **GitHub** | Control de versiones |

---

## 📁 Estructura del proyecto

```
dropshipping-app/
├── index.html               ← Redirección al login
├── vite.config.js           ← Configuración de Vite
├── package.json
├── .env                     ← Variables de entorno (NO subir a GitHub)
├── .env.example             ← Plantilla de variables
├── .gitignore
└── src/
    ├── supabaseClient.js    ← Cliente de Supabase
    ├── main.js              ← Lógica del dashboard
    ├── auth/
    │   ├── login.js         ← Lógica de inicio de sesión
    │   └── register.js      ← Lógica de registro
    ├── pages/
    │   ├── login.html       ← Página de login
    │   ├── register.html    ← Página de registro
    │   └── dashboard.html   ← Panel principal
    └── styles/
        └── main.css         ← Estilos globales
```

---

## ⚙️ Configuración paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/dropshipping-app.git
cd dropshipping-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. En el panel de Supabase ve a **Settings → API**
4. Copia la **URL** y la **anon key**
5. Crea el archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...tu-clave-aqui
```

### 4. Crear las tablas en Supabase

Ve al **SQL Editor** de Supabase y ejecuta:

```sql
-- Tabla de perfiles de usuario
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nombre_completo TEXT,
  email TEXT,
  rol TEXT DEFAULT 'vendedor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  proveedor_id UUID,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de proveedores
CREATE TABLE proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  contacto TEXT,
  email TEXT,
  pais TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  cliente_nombre TEXT,
  cliente_email TEXT,
  total DECIMAL(10,2),
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas de seguridad (Row Level Security)
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Cada usuario solo ve sus propios datos
CREATE POLICY "Ver propio perfil" ON perfiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Ver propios productos" ON productos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Ver propios proveedores" ON proveedores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Ver propios pedidos" ON pedidos FOR ALL USING (auth.uid() = user_id);
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173/src/pages/login.html](http://localhost:5173/src/pages/login.html)

---

## 🐙 Subir a GitHub

```bash
# Inicializar repositorio (solo la primera vez)
git init
git add .
git commit -m "feat: login y autenticación con Supabase"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/dropshipping-app.git
git branch -M main
git push -u origin main
```

> ⚠️ **IMPORTANTE:** Nunca subas el archivo `.env` a GitHub. Ya está en `.gitignore`.

---

## 📋 Flujo de autenticación

```
Usuario → login.html → Supabase Auth → Dashboard
              ↓
         register.html → Supabase Auth + tabla perfiles
```

---

## 🛠️ Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor local de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Previsualizar build |
