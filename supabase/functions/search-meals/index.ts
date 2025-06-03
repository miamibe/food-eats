
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MealCriteria {
  keywords: string[] | null;
  dietary_restrictions: string[] | null;
  ingredients: string[] | null;
  textures: string[] | null;
  flavors: string[] | null;
  categories: string[] | null;
  exclude: string[] | null;
  price_preference: string | null;
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

    // Get Groq API key and validate it
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey || groqApiKey.trim() === '') {
      console.error('GROQ_API_KEY not found or empty in environment');
      return new Response(
        JSON.stringify({ error: 'Groq API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanApiKey = groqApiKey.trim();

    // STEP 1: Extract structured criteria from user query using Groq
    console.log('Step 1: Extracting criteria from user query...');
    const extractionPrompt = `Extract meal selection criteria from this user query: "${query}"

Return ONLY a valid JSON object with these fields (use null for missing criteria):
{
    "keywords": ["keyword1", "keyword2"],
    "dietary_restrictions": ["low_carb", "vegetarian", "gluten_free", "healthy"], 
    "ingredients": ["meat", "vegetables", "chicken", "fish"],
    "textures": ["crispy", "soft", "crunchy"],
    "flavors": ["spicy", "sweet", "exotic", "mild"],
    "categories": ["salad", "main", "dessert"],
    "exclude": ["keywords", "to", "avoid"],
    "price_preference": "budget|moderate|premium"
}

Examples:
"хочу что-то полезное - минимум углеводов, мясо овощи с экзотическим вкусом и хрустящее"
→ {"keywords": ["полезное", "мясо", "овощи"], "dietary_restrictions": ["low_carb", "healthy"], "ingredients": ["meat", "vegetables"], "textures": ["crispy"], "flavors": ["exotic"], "categories": null, "exclude": null, "price_preference": null}`;

    const extractionResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: extractionPrompt }],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!extractionResponse.ok) {
      const errorText = await extractionResponse.text();
      console.error('Groq extraction error:', extractionResponse.status, errorText);
      throw new Error(`Groq extraction error: ${extractionResponse.status} - ${errorText}`);
    }

    const extractionData = await extractionResponse.json();
    const extractionContent = extractionData.choices[0]?.message?.content;
    
    let criteria: MealCriteria;
    try {
      // Clean the response content to extract only the JSON part
      const jsonMatch = extractionContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : extractionContent;
      criteria = JSON.parse(jsonString);
      console.log('Extracted criteria:', criteria);
    } catch (parseError) {
      console.error('Failed to parse extraction response:', extractionContent);
      // Fallback to simple keyword search
      criteria = {
        keywords: [query],
        dietary_restrictions: null,
        ingredients: null,
        textures: null,
        flavors: null,
        categories: null,
        exclude: null,
        price_preference: null
      };
    }

    // STEP 2: Build database query based on extracted criteria
    console.log('Step 2: Building database query...');
    let dbQuery = supabase
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

    // Apply filters based on criteria
    if (criteria.keywords && criteria.keywords.length > 0) {
      // Create individual OR conditions for each keyword
      const keywordConditions = criteria.keywords.map(keyword => {
        const cleanKeyword = keyword.replace(/[%_]/g, '\\$&'); // Escape SQL wildcards
        return `name.ilike.%${cleanKeyword}%,description.ilike.%${cleanKeyword}%,category.ilike.%${cleanKeyword}%`;
      }).join(',');
      dbQuery = dbQuery.or(keywordConditions);
    }

    if (criteria.categories && criteria.categories.length > 0) {
      dbQuery = dbQuery.in('category', criteria.categories);
    }

    // Price filtering
    if (criteria.price_preference === 'budget') {
      dbQuery = dbQuery.lt('price', 15);
    } else if (criteria.price_preference === 'premium') {
      dbQuery = dbQuery.gt('price', 20);
    } else if (criteria.price_preference === 'moderate') {
      dbQuery = dbQuery.gte('price', 10).lte('price', 20);
    }

    // STEP 3: Execute database query
    console.log('Step 3: Executing database query...');
    const { data: meals, error: mealsError } = await dbQuery.limit(20);

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

    console.log(`Found ${meals.length} meals from database`);

    // STEP 4: Rerank results using Groq
    console.log('Step 4: Reranking results...');
    const mealsText = meals.map((meal, index) => 
      `${index + 1}. ${meal.name} (${meal.restaurants?.name}) - ${meal.description} - $${meal.price} - ${meal.category || 'main'}`
    ).join('\n');

    const rerankPrompt = `User query: "${query}"

Rank these meals from most relevant to least relevant based on the user's request:
${mealsText}

Return only the numbers in order of relevance (e.g., "3,1,7,2,5,4,6,8,9,10"):`;

    const rerankResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: rerankPrompt }],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    let rankedMeals = meals;
    if (rerankResponse.ok) {
      const rerankData = await rerankResponse.json();
      const rerankContent = rerankData.choices[0]?.message?.content;
      
      try {
        const rankings = rerankContent.split(',').map((num: string) => parseInt(num.trim()) - 1);
        rankedMeals = rankings
          .filter(index => index >= 0 && index < meals.length)
          .map(index => meals[index])
          .slice(0, 10); // Top 10 results
        console.log('Successfully reranked meals');
      } catch (rerankError) {
        console.error('Failed to parse rerank response, using original order');
        rankedMeals = meals.slice(0, 10);
      }
    } else {
      console.error('Rerank request failed, using original order');
      rankedMeals = meals.slice(0, 10);
    }

    // STEP 5: Format final results
    console.log('Step 5: Formatting final results...');
    const formattedMeals = rankedMeals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      restaurant: meal.restaurants?.name || 'Unknown Restaurant',
      price: `$${meal.price}`,
      deliveryTime: `${meal.restaurants?.delivery_time_min || 15}-${meal.restaurants?.delivery_time_max || 30} min`,
      emoji: meal.emoji || '🍽️',
      description: meal.description || '',
      category: meal.category || 'main'
    }));

    console.log(`Returning ${formattedMeals.length} ranked meals`);

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
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
