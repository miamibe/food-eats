
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

interface QuizFlowProps {
  onBack: () => void;
}

const QuizFlow = ({ onBack }: QuizFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completed - show results
      setCurrentStep(questions.length);
    }
  };

  const currentQuestion = questions[currentStep];

  if (currentStep >= questions.length) {
    // Results screen
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Your Perfect Matches!</h2>
        </div>

        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Great choices!</h3>
          <p className="text-gray-600 mb-6">Based on your preferences, here are your top picks:</p>
        </div>

        <div className="space-y-4">
          {[
            {
              name: "Spicy Thai Curry",
              restaurant: "Bangkok Kitchen",
              match: "95%",
              price: "$12.99",
              time: "25 min",
              emoji: "🍛",
            },
            {
              name: "Margherita Pizza",
              restaurant: "Tony's Pizzeria",
              match: "90%",
              price: "$14.50",
              time: "30 min",
              emoji: "🍕",
            },
            {
              name: "Chicken Burrito Bowl",
              restaurant: "Fresh Mexican",
              match: "85%",
              price: "$11.75",
              time: "20 min",
              emoji: "🌯",
            },
          ].map((item, index) => (
            <Card key={index} className="p-4 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{item.emoji}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.restaurant}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold text-sm">{item.match} match</div>
                  <div className="text-gray-600 text-sm">{item.price} • {item.time}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={() => {
              setCurrentStep(0);
              setAnswers({});
            }}
            variant="outline" 
            className="flex-1"
          >
            Take Quiz Again
          </Button>
          <Button className="flex-1 bg-green-500 hover:bg-green-600">
            Order Now
          </Button>
        </div>
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
