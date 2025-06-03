import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCart, addToCart } from "@/lib/cart";
import { toast } from "sonner";

interface QuizFlowProps {
  onBack: () => void;
}

interface SimilarMeal {
  id: string;
  name: string;
  restaurant: string;
  price: number | string;
  deliveryTime: string;
  emoji: string;
  description: string;
  relevance_score?: number;
  match_explanation?: string;
}

const QuizFlow = ({ onBack }: QuizFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SimilarMeal[]>([]);
  const { dispatch } = useCart();

  const questions = [
    {
      id: "mood",
      question: "How are you feeling today?",
      emoji: "😊",
      options: [
        { value: "happy", label: "Happy & Energetic", emoji: "🎉" },
        { value: "comfort", label: "Need Comfort Food", emoji: "🤗" },
        { value: "healthy", label: "Want Something Healthy", emoji: "🥗" },
        { value: "adventurous", label: "Feeling Adventurous", emoji: "🌶️" },
      ],
    },
    {
      id: "budget",
      question: "What's your budget range?",
      emoji: "💰",
      options: [
        { value: "budget", label: "$5-10", emoji: "💵" },
        { value: "moderate", label: "$10-20", emoji: "💳" },
        { value: "premium", label: "$20-35", emoji: "💎" },
        { value: "luxury", label: "$35+", emoji: "🥂" },
      ],
    },
    {
      id: "time",
      question: "How much time do you have?",
      emoji: "⏰",
      options: [
        { value: "asap", label: "ASAP (15-20 min)", emoji: "⚡" },
        { value: "normal", label: "Normal (30-45 min)", emoji: "🕐" },
        { value: "patient", label: "I can wait (45+ min)", emoji: "🧘" },
      ],
    },
    {
      id: "cuisine",
      question: "What cuisine sounds good?",
      emoji: "🍽️",
      options: [
        { value: "asian", label: "Asian", emoji: "🍜" },
        { value: "italian", label: "Italian", emoji: "🍝" },
        { value: "mexican", label: "Mexican", emoji: "🌮" },
        { value: "american", label: "American", emoji: "🍔" },
        { value: "healthy", label: "Healthy/Fresh", emoji: "🥙" },
        { value: "surprise", label: "Surprise Me!", emoji: "🎲" },
      ],
    },
  ];

  const progress = ((currentStep + 1) / questions.length) * 100;

  const buildSearchQuery = (answers: Record<string, string>) => {
    const moodMap = {
      happy: "fresh vibrant energizing",
      comfort: "hearty comforting warm traditional",
      healthy: "healthy light fresh nutritious",
      adventurous: "unique exotic spicy special"
    };

    const budgetMap = {
      budget: "affordable cheap budget-friendly under $10",
      moderate: "moderate-price reasonable-cost",
      premium: "premium high-quality",
      luxury: "luxury gourmet exclusive"
    };

    const timeMap = {
      asap: "quick fast ready-to-eat",
      normal: "standard-preparation",
      patient: "slow-cooked carefully-prepared"
    };

    const queryParts = [
      moodMap[answers.mood as keyof typeof moodMap],
      budgetMap[answers.budget as keyof typeof budgetMap],
      timeMap[answers.time as keyof typeof timeMap],
      answers.cuisine !== "surprise" ? answers.cuisine : "popular recommended"
    ];

    return queryParts.filter(Boolean).join(" ");
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const searchQuery = buildSearchQuery(answers);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-meals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.meals || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error("Failed to get recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(questions.length);
      fetchRecommendations();
    }
  };

  const handleAddToCart = (meal: SimilarMeal) => {
    addToCart(dispatch, {
      id: meal.id,
      name: meal.name,
      price: typeof meal.price === 'string' ? parseFloat(meal.price.replace('$', '')) : meal.price,
      quantity: 1,
      restaurant: meal.restaurant,
      emoji: meal.emoji
    });
  };

  const currentQuestion = questions[currentStep];

  if (currentStep >= questions.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost\" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Your Perfect Matches!</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500">Finding your perfect matches...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              {recommendations.map((meal) => (
                <Card 
                  key={meal.id} 
                  className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleAddToCart(meal)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{meal.emoji}</span>
                        <div>
                          <h4 className="font-medium text-gray-800">{meal.name}</h4>
                          <p className="text-sm text-gray-600">{meal.restaurant}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{meal.price}</p>
                      <p className="text-sm text-gray-500">{meal.deliveryTime}</p>
                    </div>
                  </div>
                  {meal.match_explanation && (
                    <p className="mt-2 text-sm text-gray-600">{meal.match_explanation}</p>
                  )}
                </Card>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={() => {
                  setCurrentStep(0);
                  setAnswers({});
                  setRecommendations([]);
                }}
                variant="outline" 
                className="flex-1"
              >
                Take Quiz Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No matches found. Try taking the quiz again!</p>
            <Button 
              onClick={() => {
                setCurrentStep(0);
                setAnswers({});
                setRecommendations([]);
              }}
              className="mt-4"
            >
              Take Quiz Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">Food Quiz</h2>
          <Progress value={progress} className="mt-2 h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{currentQuestion.emoji}</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h3>
        <p className="text-gray-600">Step {currentStep + 1} of {questions.length}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleAnswer(currentQuestion.id, option.value)}
            variant="outline"
            className="w-full h-16 text-left justify-start border-2 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <span className="text-2xl mr-3">{option.emoji}</span>
            <span className="font-semibold">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuizFlow;