// src/auth/login.js
// Lógica de inicio de sesión con Supabase Auth

import { supabase } from '../supabaseClient.js'

const form = document.getElementById('login-form')
const errorMsg = document.getElementById('error-msg')
const btnLogin = document.getElementById('btn-login')

// Verificar si ya hay sesión activa → redirigir al dashboard
const { data: { session } } = await supabase.auth.getSession()
if (session) {
  window.location.href = '/src/pages/dashboard.html'
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value

  errorMsg.textContent = ''
  btnLogin.disabled = true
  btnLogin.textContent = 'Ingresando...'

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    errorMsg.textContent = traducirError(error.message)
    btnLogin.disabled = false
    btnLogin.textContent = 'Iniciar sesión'
    return
  }

  // Login exitoso → ir al dashboard
  window.location.href = '/src/pages/dashboard.html'
})

// Traduce errores comunes de Supabase al español
function traducirError(msg) {
  if (msg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (msg.includes('Email not confirmed')) return 'Debes confirmar tu correo antes de ingresar.'
  if (msg.includes('too many requests')) return 'Demasiados intentos. Espera un momento.'
  return 'Error al iniciar sesión. Intenta de nuevo.'
}
