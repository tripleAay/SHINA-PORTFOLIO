'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEX_T_PUBLIC_SUPABASE_URLL;
  const supabaseKey =
    process.env.NEX_T_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase environment variables are missing. Set NEX_T_PUBLIC_SUPABASE_URLL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}