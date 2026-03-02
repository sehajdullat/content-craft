import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzrlssfhmjckjhyywvjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cmxzc2ZobWpja2poeXl3dmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTQ3MzQsImV4cCI6MjA4ODAzMDczNH0.TVT4bve8OQbJHokumufnB9-3cci_Pdkjnkx4HrgTKzo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
