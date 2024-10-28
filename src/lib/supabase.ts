import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdGhwdnFzYWZqYnZqeGt0bXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxMjY5NDAsImV4cCI6MjAyMjcwMjk0MH0.0C9pXn0E-d5HX-5mxD-vL3GzgD0zAqwL';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Request {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}