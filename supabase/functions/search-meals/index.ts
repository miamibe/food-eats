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

    // Search for meals using multiple approaches
    const { data: meals, error } = await supabase
      .from('meals')
      .select(`
        id,
        name,
        description,
        price,
        emoji,
        preparation_time,
        category,
        restaurants!inner (
          name,
          delivery_time_min,
          delivery_time_max
        )
      `)
      .or(`
        name.ilike.%${query}%,
        description.ilike.%${query}%,
        category.ilike.%${query}%
      `)
      .eq('is_available', true)
      .limit(8);

    if (error) {
      throw error;
    }

    // If no results found with direct search, try searching by restaurant cuisine type
    if (!meals || meals.length === 0) {
      const { data: cuisineMeals, error: cuisineError } = await supabase
        .from('meals')
        .select(`
          id,
          name,
          description,
          price,
          emoji,
          preparation_time,
          category,
          restaurants!inner (
            name,
            delivery_time_min,
            delivery_time_max,
            cuisine_type
          )
        `)
        .eq('is_available', true)
        .filter('restaurants.cuisine_type', 'ilike', `%${query}%`)
        .limit(8);

      if (!cuisineError && cuisineMeals && cuisineMeals.length > 0) {
        return new Response(
          JSON.stringify({
            meals: cuisineMeals.map(meal => ({
              id: meal.id,
              name: meal.name,
              restaurant: meal.restaurants.name,
              price: meal.price,
              deliveryTime: `${meal.restaurants.delivery_time_min}-${meal.restaurants.delivery_time_max} min`,
              emoji: meal.emoji || '🍽️',
              description: meal.description || '',
              category: meal.category || 'main',
              relevance_score: 4.0,
              match_explanation: `Matched ${meal.restaurants.cuisine_type} cuisine`
            }))
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
            status: 200,
          }
        );
      }
    }

    // Transform the data to match the expected format
    const formattedMeals = meals?.map((meal) => ({
      id: meal.id,
      name: meal.name,
      restaurant: meal.restaurants.name,
      price: meal.price,
      deliveryTime: `${meal.restaurants.delivery_time_min}-${meal.restaurants.delivery_time_max} min`,
      emoji: meal.emoji || '🍽️',
      description: meal.description || '',
      category: meal.category || 'main',
      relevance_score: 4.5,
      match_explanation: 'Direct match found'
    })) || [];

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
    console.error('Search error:', error);
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