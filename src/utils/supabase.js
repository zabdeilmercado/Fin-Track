import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vjnxdjznavihnpeyajqf.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbnhkanpuYXZpaG5wZXlhanFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTU4MDIsImV4cCI6MjA2MTc3MTgwMn0.YBnWuBOFkAQc8NtAZmmQ9aLHoA4PndA47a_fbaMxZD0"

export const supabase = createClient(supabaseUrl, supabaseKey)

//Form Action utils
export const formActionDefault ={
    formProcess: false,
    formStatus: 200,
    formErrorMessage: '',
    formSuccesMessage: ''
}