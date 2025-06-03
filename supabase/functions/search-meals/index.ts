
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

    console.log('Searching for meals with query:', query);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Groq API key
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'Groq API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch available meals from database
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select(`
        *,
        restaurants (
          name,
          delivery_time_min,
          delivery_time_max
        )
      `)
      .eq('is_available', true);

    if (mealsError) {
      console.error('Error fetching meals:', mealsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch meals from database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found meals in database:', meals?.length);

    // Call Groq API to get meal recommendations based on user query
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are a food recommendation assistant. Based on the user's craving, analyze the following available meals and return the most relevant ones as a JSON array. Each meal should include: id, name, restaurant_name, price, delivery_time, emoji, description, match_score (0-100). Only return meals that match the user's request. Available meals: ${JSON.stringify(meals)}`
          },
          {
            role: 'user',
            content: `I'm craving: ${query}. Please recommend the best matching meals from the available options.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      console.error('Groq API error:', groqResponse.status);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    console.log('Groq response content:', content);

    // Parse the JSON response from Groq
    let recommendedMeals;
    try {
      recommendedMeals = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', content);
      // Fallback to simple filtering based on query keywords
      const queryLower = query.toLowerCase();
      recommendedMeals = meals?.filter(meal => 
        meal.name.toLowerCase().includes(queryLower) ||
        meal.description?.toLowerCase().includes(queryLower) ||
        meal.category?.toLowerCase().includes(queryLower)
      ).slice(0, 5) || [];
    }

    // Format the response
    const formattedMeals = recommendedMeals.map((meal: any) => ({
      id: meal.id,
      name: meal.name,
      restaurant: meal.restaurant_name || meal.restaurants?.name,
      price: `$${meal.price}`,
      deliveryTime: `${meal.restaurants?.delivery_time_min || 15}-${meal.restaurants?.delivery_time_max || 30} min`,
      emoji: meal.emoji || '🍽️',
      description: meal.description || ''
    }));

    console.log('Returning formatted meals:', formattedMeals.length);

    return new Response(
      JSON.stringify({ meals: formattedMeals }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Search meals error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
