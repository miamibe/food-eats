import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface SearchRequest {
  query: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the search query from the request body
    const { query }: SearchRequest = await req.json();

    if (!query) {
      throw new Error('Search query is required');
    }

    // Search for meals that match the query
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
      .textSearch('name', query.split(' ').join(' & '))
      .limit(5);

    if (error) {
      throw error;
    }

    // Transform the data to match the expected format
    const formattedMeals = meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      restaurant: meal.restaurants.name,
      price: `$${meal.price.toFixed(2)}`,
      deliveryTime: `${meal.restaurants.delivery_time_min}-${meal.restaurants.delivery_time_max} min`,
      emoji: meal.emoji || '🍽️',
      description: meal.description,
      relevance_score: 4.5 // Default score since we don't have actual relevance scoring
    }));

    return new Response(
      JSON.stringify({
        meals: formattedMeals
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});