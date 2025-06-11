
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Target, Users, Zap, MessageSquare } from 'lucide-react';

const Differentiators = () => {
  const [comparisonView, setComparisonView] = useState(0);
  const [toneValue, setToneValue] = useState([50]);

  const comparisons = [
    {
      title: 'Framing > Prompting',
      subtitle: 'Strategic POV Development vs. Random Prompting',
      frayma: {
        approach: 'Structured POV Framework',
        example: 'Guide: "What's your take on buyer behavior changes?" → Narrative framework → Strategic content',
        outcome: 'Consistent, buyer-moving narratives'
      },
      competitor: {
        approach: 'Blank Prompt Box',
        example: 'User types: "Write a LinkedIn post about our product" → Generic AI response',
        outcome: 'Random quality, no strategic intent'
      }
    },
    {
      title: 'First-Person Voice Retention',
      subtitle: 'Authentic Voice at Scale vs. Generic AI Voice',
      frayma: {
        approach: 'Author Profile Intelligence',
        example: 'Captures voice patterns, experiences, beliefs → Maintains authentic CEO tone in all content',
        outcome: 'Scalable authenticity, brand strengthening'
      },
      competitor: {
        approach: 'Generic AI Output',
        example: 'Same robotic tone regardless of author → "I\'m excited to announce..." templates',
        outcome: 'Voice washing, brand dilution'
      }
    },
    {
      title: 'Built-in GTM Frameworks',
      subtitle: 'Strategic GTM Intelligence vs. Content Templates',
      frayma: {
        approach: '3Rs Formula + ICP StoryScripts',
        example: 'Built-in buyer psychology frameworks → Resonance-tested content structures',
        outcome: 'Predictable GTM outcomes'
      },
      competitor: {
        approach: 'Generic Templates',
        example: 'Basic content formats → Hope for the best approach',
        outcome: 'Inconsistent results, no GTM strategy'
      }
    }
  ];

  const competitors = [
    { name: 'ChatGPT', color: 'bg-green-100 text-green-800' },
    { name: 'Claude', color: 'bg-orange-100 text-orange-800' },
    { name: 'Jasper', color: 'bg-purple-100 text-purple-800' },
    { name: 'Copy.ai', color: 'bg-blue-100 text-blue-800' },
    { name: 'Writer.com', color: 'bg-red-100 text-red-800' }
  ];

  const getToneExample = (value: number) => {
    if (value < 25) {
      return "Data-driven insights suggest a paradigm shift in buyer evaluation criteria, necessitating strategic narrative realignment.";
    } else if (value < 50) {
      return "We're seeing buyers evaluate solutions differently. Your narrative needs to adapt to these changing patterns.";
    } else if (value < 75) {
      return "Here's the thing about modern buyers—they don't just want features, they want transformation stories.";
    } else {
      return "Buyers today? They're not buying products. They're buying into narratives that make them the hero.";
    }
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Why Frayma Beats{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Everything Else
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three fundamental differences that make Frayma the only choice for serious GTM teams
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Selector */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {comparisons.map((comparison, index) => (
                <Button
                  key={index}
                  variant={comparisonView === index ? "default" : "ghost"}
                  className={`${comparisonView === index 
                    ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white' 
                    : 'text-gray-700'
                  }`}
                  onClick={() => setComparisonView(index)}
                >
                  {comparison.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Comparison */}
          <div className="max-w-6xl mx-auto">
            <Card className="border-purple-200 shadow-xl">
              <CardHeader className="text-center border-b border-purple-100">
                <CardTitle className="text-3xl text-gray-900 mb-2">
                  {comparisons[comparisonView].title}
                </CardTitle>
                <p className="text-lg text-gray-600">
                  {comparisons[comparisonView].subtitle}
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Frayma Approach */}
                  <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">F</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Frayma AI</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-2">Approach</h4>
                        <p className="text-gray-700">{comparisons[comparisonView].frayma.approach}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-2">Example</h4>
                        <p className="text-gray-700 italic">{comparisons[comparisonView].frayma.example}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-2">Outcome</h4>
                        <p className="text-green-700 font-medium">{comparisons[comparisonView].frayma.outcome}</p>
                      </div>
                    </div>
                  </div>

                  {/* Competitor Approach */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Other AI Tools</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Approach</h4>
                        <p className="text-gray-700">{comparisons[comparisonView].competitor.approach}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Example</h4>
                        <p className="text-gray-700 italic">{comparisons[comparisonView].competitor.example}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Outcome</h4>
                        <p className="text-red-700 font-medium">{comparisons[comparisonView].competitor.outcome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Voice Demo */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Experience Voice Control
            </h2>
            <p className="text-xl text-gray-600">
              See how Author Profiles maintain authentic voice at any tone
            </p>
          </div>

          <Card className="border-purple-200 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Adjust Tone: Formal ← → Conversational
                  </label>
                  <Slider
                    value={toneValue}
                    onValueChange={setToneValue}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Sample Output (Executive Author Profile)
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {getToneExample(toneValue[0])}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>
                    <strong>Notice:</strong> The core insight remains consistent while tone adapts to context
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Competitor Comparison Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Compare Frayma to Popular Alternatives
            </h2>
            <p className="text-xl text-gray-600">
              See why strategic GTM teams choose Frayma over generic AI tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${competitor.color}`}>
                    {competitor.name}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">POV Frameworks</span>
                      <span className="text-red-600">✗</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voice Retention</span>
                      <span className="text-red-600">✗</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GTM Integration</span>
                      <span className="text-red-600">✗</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Buyer Psychology</span>
                      <span className="text-red-600">✗</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Frayma Card */}
            <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-orange-50 lg:col-span-3 md:col-span-2">
              <CardContent className="p-6 text-center">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white">
                  Frayma AI
                </div>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-gray-600">POV Frameworks</span>
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-gray-600">Voice Retention</span>
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-gray-600">GTM Integration</span>
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-gray-600">Buyer Psychology</span>
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Experience the Frayma Difference
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Stop settling for generic AI. Get strategic GTM intelligence built for your success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                Try Frayma Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800">
                See All Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Differentiators;
