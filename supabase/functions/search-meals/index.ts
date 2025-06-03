import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface SearchMealsRequest {
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

    // Parse the request body
    const { query }: SearchMealsRequest = await req.json();

    if (!query) {
      throw new Error('Query parameter is required');
    }

    // Search for meals and join with restaurants
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
      .eq('is_available', true)
      .limit(10);

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
      description: meal.description || '',
      relevance_score: 1
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
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({
        error: error.message,
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