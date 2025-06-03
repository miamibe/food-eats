import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search for meals
    const { data: meals, error } = await supabase
      .from('meals')
      .select(`
        id,
        name,
        description,
        price,
        emoji,
        preparation_time,
        restaurants!inner (
          name,
          delivery_time_min,
          delivery_time_max
        )
      `)
      .textSearch('name', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(8);

    if (error) {
      throw error;
    }

    // Transform the results
    const formattedMeals = meals.map(meal => ({
      id: meal.id,
      name: meal.name,
      restaurant: meal.restaurants.name,
      price: meal.price,
      deliveryTime: `${meal.restaurants.delivery_time_min}-${meal.restaurants.delivery_time_max} min`,
      emoji: meal.emoji || '🍽️',
      description: meal.description,
      relevance_score: 4.5
    }));

    return new Response(
      JSON.stringify({ meals: formattedMeals }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});