
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Users, FileText, Lightbulb, Target, Zap, Check } from 'lucide-react';

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
      icon: <Target className="h-6 w-6 text-purple-600" />,
      title: "Narrative Framing Engine",
      description: "Transform raw ideas into structured POVs that drive buyer action"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "First-Person Voice Retention", 
      description: "Maintain your authentic voice while scaling content creation"
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: "Built-In GTM Frameworks",
      description: "3Rs Formula, ICP StoryScripts, and proven narrative structures"
    }
  ];

  const benefits = [
    "10x faster content creation",
    "Consistent brand voice",
    "Data-driven insights",
    "Enterprise-grade security"
  ];

  return (
    <MarketingLayout>
      {/* Hero Section - Minimalistic */}
      <section className="relative bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight">
              Generate rare GTM ideas that{' '}
              <span className="font-medium bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                move buyers
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              Start free with Frayma's AI-powered narrative engine. Turn your insights into buyer-moving content strategies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/app">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-sm">
                  Start Generating Ideas - Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-lg">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Simple Process Flow */}
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Frame Ideas</h3>
                <p className="text-sm text-gray-600">Structure your thoughts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Build POV</h3>
                <p className="text-sm text-gray-600">Create compelling narratives</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Generate</h3>
                <p className="text-sm text-gray-600">Auto-craft content</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Deploy</h3>
                <p className="text-sm text-gray-600">Publish and engage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Strategic Content Creation, Reimagined
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
              Move beyond prompting to true narrative framing with built-in GTM intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-8">
                Why teams choose Frayma
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Check className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">5 minutes</div>
                <p className="text-gray-600 mb-6">From idea to published content</p>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-sm text-gray-500 italic">
                    "What used to take hours now takes minutes. Our content quality has never been higher."
                  </p>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-medium text-sm">JD</span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">Jane Doe</div>
                      <div className="text-xs text-gray-500">Content Lead</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Minimalistic */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-16">
            Trusted by GTM Leaders
          </h2>
          
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-gray-700 mb-8 font-light italic leading-relaxed">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-medium">
                  {testimonials[currentTestimonial].author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Clean and Simple */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Ready to Generate Your First GTM Ideas?
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-light">
            Start free today. Generate 20 rare GTM ideas and discover strategies that move buyers.
          </p>
          <Link to="/app">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-lg font-medium rounded-lg shadow-sm">
              Generate Ideas Now - Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Homepage;
