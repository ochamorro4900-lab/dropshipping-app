// src/main.js
// Lógica del dashboard — verifica sesión y carga datos del usuario

import { supabase } from './supabaseClient.js'

// ── Verificar sesión activa ────────────────────────────────────────────────
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  // No hay sesión → redirigir al login
  window.location.href = '/src/pages/login.html'
}

const user = session.user

// ── Mostrar info del usuario ───────────────────────────────────────────────
const nombreCompleto = user.user_metadata?.nombre_completo || user.email
document.getElementById('user-name').textContent = nombreCompleto
document.getElementById('user-avatar').textContent = nombreCompleto.charAt(0).toUpperCase()

// ── Cargar estadísticas desde Supabase ────────────────────────────────────
async function cargarEstadisticas() {
  try {
    // Contar productos del usuario
    const { count: totalProductos } = await supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Contar proveedores del usuario
    const { count: totalProveedores } = await supabase
      .from('proveedores')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Contar pedidos de hoy
    const hoy = new Date().toISOString().split('T')[0]
    const { count: pedidosHoy } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${hoy}T00:00:00`)

    // Sumar ventas del mes
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const { data: pedidosMes } = await supabase
      .from('pedidos')
      .select('total')
      .eq('user_id', user.id)
      .gte('created_at', inicioMes)

    const ventasMes = pedidosMes?.reduce((acc, p) => acc + (p.total || 0), 0) || 0

    // Actualizar UI
    document.getElementById('stat-productos').textContent = totalProductos || 0
    document.getElementById('stat-proveedores').textContent = totalProveedores || 0
    document.getElementById('stat-pedidos').textContent = pedidosHoy || 0
    document.getElementById('stat-ventas').textContent = `$${ventasMes.toLocaleString('es-CO')}`

  } catch (err) {
    console.warn('Las tablas aún no existen o no tienes datos:', err.message)
  }
}

cargarEstadisticas()

// ── Cerrar sesión ──────────────────────────────────────────────────────────
document.getElementById('btn-logout').addEventListener('click', async () => {
  await supabase.auth.signOut()
  window.location.href = '/src/pages/login.html'
})
