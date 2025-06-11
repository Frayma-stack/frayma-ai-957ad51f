
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Users, FileText, Lightbulb, Target, Zap } from 'lucide-react';

const Homepage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Frayma transformed how we approach content creation. Instead of prompting AI endlessly, we now frame our POV and get buyer-moving content instantly.",
      author: "Sarah Chen",
      role: "VP Marketing",
      company: "TechFlow"
    },
    {
      quote: "Finally, an AI tool that understands GTM strategy. The 3Rs framework alone has revolutionized our narrative approach.",
      author: "Marcus Rodriguez", 
      role: "Founder",
      company: "DataScale"
    },
    {
      quote: "Our thought leadership went from generic to genuinely compelling. Frayma keeps our founder's voice while scaling our content output.",
      author: "Emily Watson",
      role: "Head of Content",
      company: "CloudVenture"
    }
  ];

  const features = [
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Narrative Framing Engine",
      description: "Transform raw ideas into structured POVs that drive buyer action"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "First-Person Voice Retention", 
      description: "Maintain your authentic voice while scaling content creation"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Built-In GTM Frameworks",
      description: "3Rs Formula, ICP StoryScripts, and proven narrative structures"
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Auto-craft GTM content that{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                moves buyers
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              By framing ideas, not just prompting AI. Transform your strategic insights into compelling narratives with structured story logic.
            </p>
            
            {/* Animated Flow */}
            <div className="flex justify-center items-center space-x-4 mb-12">
              <div className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm animate-fade-in">
                <Lightbulb className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Idea</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm animate-fade-in delay-100">
                <Target className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">POV</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg p-4 shadow-sm animate-fade-in delay-200">
                <span className="text-white font-bold text-sm">Frayma</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm animate-fade-in delay-300">
                <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">GTM Content</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-lg px-8 py-3">
                  Try the Narrative Engine
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Strategic Content Creation, Reimagined
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Move beyond prompting to true narrative framing with built-in GTM intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-purple-100 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
            Trusted by GTM Leaders
          </h2>
          
          <Card className="border-purple-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your GTM Content?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the narrative revolution. Start framing your ideas into buyer-moving stories today.
          </p>
          <Link to="/app">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-lg px-8 py-3">
              Get Started with Frayma
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Homepage;
