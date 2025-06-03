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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not found');
      return new Response(
        JSON.stringify({ error: 'Supabase configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Groq API key
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey || groqApiKey.trim() === '') {
      console.error('GROQ_API_KEY not found or empty in environment');
      return new Response(
        JSON.stringify({ error: 'Groq API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 1: Get ALL available meals from database
    console.log('Fetching all available meals...');
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select(`
        *,
        restaurants (
          name,
          cuisine_type,
          delivery_time_min,
          delivery_time_max
        )
      `)
      .eq('is_available', true)
      .order('name');

    if (mealsError) {
      console.error('Error fetching meals:', mealsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch meals from database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!meals || meals.length === 0) {
      console.log('No meals found in database');
      return new Response(
        JSON.stringify({ meals: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${meals.length} total meals, sending to Groq for semantic search...`);

    // STEP 2: Format all meals for Groq
    const mealsText = meals.map((meal, index) => 
      `${index + 1}. ${meal.name}: ${meal.description || 'No description'} - $${meal.price} (${meal.category || 'N/A'}) [${meal.restaurants?.cuisine_type || 'Unknown'} cuisine from ${meal.restaurants?.name || 'Unknown'}]`
    ).join('\n');

    // STEP 3: Send to Groq for semantic search
    const semanticSearchPrompt = `User is searching for: "${query}"

From this menu, find the 5-8 BEST matches for the user's request:

${mealsText}

Consider ALL aspects of the query:
- Semantic meaning (hearty = filling/substantial/thick, cheap = affordable/budget, healthy = fresh/light/low-calorie)
- Cultural context (different cuisines have different "hearty" foods - Russian soups are hearty, Asian broths can be light)
- Price value (user's budget expectations)
- Nutritional implications (soups can be low-calorie, traditional dishes are often hearty)
- Cooking methods and ingredients (thick soups = hearty, vegetable-based = healthy)
- Meal categories (soups for comfort, salads for health, etc.)

Examples of semantic matching:
- "hearty" matches: thick soup, traditional stew, filling dishes, substantial meals
- "cheap" matches: affordable pricing, budget-friendly, good value
- "healthy" matches: vegetable-based, low-calorie, fresh ingredients, light dishes

Return ONLY a JSON array of the BEST matches:
[
    {
        "meal_number": 23,
        "relevance_score": 9,
        "match_explanation": "Traditional hearty soup, very filling and affordable"
    },
    {
        "meal_number": 7,
        "relevance_score": 8,
        "match_explanation": "Light vegetable dish, healthy and budget-friendly"
    }
]

Only include meals with relevance_score >= 6. Order by relevance_score (highest first).
Be generous with semantic matching - if a "thick soup" exists for a "hearty" query, include it!`;

    try {
      console.log('Sending semantic search request to Groq...');
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192', // Use larger model for better reasoning
          messages: [{ role: 'user', content: semanticSearchPrompt }],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      });

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('Groq semantic search error:', groqResponse.status, errorText);
        throw new Error(`Groq error: ${groqResponse.status}`);
      }

      const groqData = await groqResponse.json();
      const groqContent = groqData.choices[0]?.message?.content;
      
      console.log('Groq response received:', groqContent);

      // STEP 4: Parse Groq response and map back to meals
      let matches;
      try {
        // Extract JSON from response
        const jsonMatch = groqContent.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : groqContent;
        matches = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse Groq response:', groqContent);
        throw new Error('Invalid Groq response format');
      }

      // Map back to actual meal objects
      const results = [];
      for (const match of matches) {
        const mealIndex = match.meal_number - 1; // Convert to 0-based index
        if (mealIndex >= 0 && mealIndex < meals.length) {
          const meal = meals[mealIndex];
          results.push({
            id: meal.id,
            name: meal.name,
            restaurant: meal.restaurants?.name || 'Unknown Restaurant',
            price: `$${meal.price}`,
            deliveryTime: `${meal.restaurants?.delivery_time_min || 15}-${meal.restaurants?.delivery_time_max || 30} min`,
            emoji: meal.emoji || '🍽️',
            description: meal.description || '',
            category: meal.category || 'main',
            relevance_score: match.relevance_score,
            match_explanation: match.match_explanation
          });
        }
      }

      console.log(`Successfully matched ${results.length} meals using semantic search`);

      return new Response(
        JSON.stringify({ meals: results }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (groqError) {
      console.error('Groq semantic search failed:', groqError);
      
      // FALLBACK: Simple text-based search if Groq fails
      console.log('Using fallback text search...');
      const queryLower = query.toLowerCase();
      const fallbackResults = meals
        .filter(meal => {
          const searchText = `${meal.name} ${meal.description || ''} ${meal.category || ''} ${meal.restaurants?.cuisine_type || ''}`.toLowerCase();
          return searchText.includes(queryLower) || 
                 queryLower.split(' ').some(word => searchText.includes(word));
        })
        .slice(0, 8)
        .map(meal => ({
          id: meal.id,
          name: meal.name,
          restaurant: meal.restaurants?.name || 'Unknown Restaurant',
          price: `$${meal.price}`,
          deliveryTime: `${meal.restaurants?.delivery_time_min || 15}-${meal.restaurants?.delivery_time_max || 30} min`,
          emoji: meal.emoji || '🍽️',
          description: meal.description || '',
          category: meal.category || 'main',
          relevance_score: 6, // Add default relevance score for fallback results
          match_explanation: 'Found by text search' // Add explanation for fallback results
        }));

      return new Response(
        JSON.stringify({ meals: fallbackResults }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Search meals error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});