// src/auth/register.js
// Lógica de registro de nuevos usuarios con Supabase Auth

import { supabase } from '../supabaseClient.js'

const form = document.getElementById('register-form')
const errorMsg = document.getElementById('error-msg')
const successMsg = document.getElementById('success-msg')
const btnRegister = document.getElementById('btn-register')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const nombre = document.getElementById('nombre').value.trim()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const confirm = document.getElementById('confirm-password').value

  errorMsg.textContent = ''
  successMsg.textContent = ''

  // Validaciones básicas
  if (password.length < 6) {
    errorMsg.textContent = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (password !== confirm) {
    errorMsg.textContent = 'Las contraseñas no coinciden.'
    return
  }

  btnRegister.disabled = true
  btnRegister.textContent = 'Registrando...'

  // Registro en Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre_completo: nombre }  // guardado en auth.users → raw_user_meta_data
    }
  })

  if (error) {
    errorMsg.textContent = traducirError(error.message)
    btnRegister.disabled = false
    btnRegister.textContent = 'Crear cuenta'
    return
  }

  // Si el registro fue exitoso, también insertamos el perfil en la tabla "perfiles"
  if (data.user) {
    await supabase.from('perfiles').insert({
      id: data.user.id,
      nombre_completo: nombre,
      email: email,
      rol: 'vendedor'   // rol por defecto
    })
  }

  successMsg.textContent = '¡Cuenta creada! Revisa tu correo para confirmar tu registro.'
  btnRegister.disabled = false
  btnRegister.textContent = 'Crear cuenta'
  form.reset()
})

function traducirError(msg) {
  if (msg.includes('already registered')) return 'Este correo ya está registrado.'
  if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('Unable to validate')) return 'Correo inválido.'
  return 'Error al registrar. Intenta de nuevo.'
}
