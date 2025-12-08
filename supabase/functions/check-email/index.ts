import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 요청 본문에서 이메일 추출
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Supabase 클라이언트 생성 (Service Role Key 사용)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. auth.users에서 이메일 확인
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error checking auth.users:', authError);
      return new Response(
        JSON.stringify({ error: 'Failed to check auth.users', details: authError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const existsInAuth = authUsers.users.some(user => 
      user.email?.toLowerCase().trim() === emailLower
    );

    // 2. public.users에서 이메일 확인
    const { data: publicUser, error: publicError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', emailLower)
      .maybeSingle();

    if (publicError && publicError.code !== 'PGRST116') {
      console.error('Error checking public.users:', publicError);
      return new Response(
        JSON.stringify({ error: 'Failed to check public.users', details: publicError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const existsInPublic = !!publicUser;

    // 결과 반환
    const exists = existsInAuth || existsInPublic;

    return new Response(
      JSON.stringify({ 
        exists,
        existsInAuth,
        existsInPublic,
        email: emailLower
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in check-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

