import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ID único do utilizador (sem necessidade de login)
export function getUserId() {
  let id = localStorage.getItem('rotinapp_uid')
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2) + Date.now()
    localStorage.setItem('rotinapp_uid', id)
  }
  return id
}

// Guardar dado na nuvem
export async function saveData(key, value) {
  const user_id = getUserId()
  const { error } = await supabase
    .from('rotinapp_data')
    .upsert(
      { 
        user_id, 
        data_key: key, 
        data_value: value, 
        updated_at: new Date().toISOString() 
      },
      { onConflict: 'user_id,data_key' }
    )
  if (error) console.error('Erro ao guardar:', error)
}

// Ler dado da nuvem
export async function loadData(key, defaultValue = null) {
  const user_id = getUserId()
  const { data, error } = await supabase
    .from('rotinapp_data')
    .select('data_value')
    .eq('user_id', user_id)
    .eq('data_key', key)
    .single()
  
  if (error || !data) return defaultValue
  return data.data_value
}