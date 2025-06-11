
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Star, FileText, Users, Zap } from 'lucide-react';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Narrative Starter',
      price: { monthly: 39, yearly: 390 },
      description: 'Perfect for individual creators and small teams getting started with strategic content',
      features: [
        '10 long-form GTM assets per month',
        '1 author profile',
        'Basic narrative frameworks',
        'Ideas Bank (100 ideas)',
        'Email support',
        'Core tone controls'
      ],
      cta: 'Start Your GTM Journey',
      highlighted: false
    },
    {
      name: 'Narrative Pro',
      price: { monthly: 150, yearly: 1500 },
      description: 'Ideal for growing teams that need advanced GTM intelligence and collaboration',
      features: [
        '50 long-form GTM assets per month',
        '5 author profiles',
        'Advanced narrative frameworks',
        'Ideas Bank (500 ideas)',
        'ICP StoryScripts builder',
        'Resonance Mirror scoring',
        'Priority support',
        'Team collaboration tools'
      ],
      cta: 'Scale Your Narratives',
      highlighted: true
    },
    {
      name: 'Full-Scale Narrative',
      price: { monthly: 750, yearly: 7500 },
      description: 'Enterprise-grade solution for organizations scaling GTM content at volume',
      features: [
        'Unlimited GTM assets',
        'Unlimited author profiles',
        'Custom narrative frameworks',
        'Unlimited Ideas Bank',
        'API access',
        'Custom integrations',
        'Dedicated success manager',
        'Advanced analytics',
        'White-label options'
      ],
      cta: 'Transform Your GTM',
      highlighted: false
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.price.yearly : plan.price.monthly;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (!isYearly) return null;
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    const savings = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    return savings;
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Pricing That Scales{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                With Your GTM
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From individual creators to enterprise teams, find the perfect plan for your narrative needs
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-12 h-6 rounded-full p-0 ${
                  isYearly ? 'bg-gradient-to-r from-purple-600 to-orange-500' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </Button>
              <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                  Save up to 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative ${
                  plan.highlighted 
                    ? 'border-purple-300 shadow-2xl scale-105' 
                    : 'border-gray-200 shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      ${getPrice(plan)}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                    {isYearly && getSavings(plan) && (
                      <div className="text-green-600 text-sm font-medium mt-1">
                        Save {getSavings(plan)}%
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/app">
                    <Button 
                      className={`w-full ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Included */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Every Plan Includes Core GTM Intelligence
            </h2>
            <p className="text-xl text-gray-600">
              Built-in frameworks and features that set Frayma apart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-200">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  3Rs Formula Built-In
                </h3>
                <p className="text-gray-600 text-sm">
                  Every piece of content follows proven Resonance, Relevance, Results framework
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Author Voice Retention
                </h3>
                <p className="text-gray-600 text-sm">
                  Maintain authentic voice across all content while scaling output
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  GTM Framework Integration
                </h3>
                <p className="text-gray-600 text-sm">
                  Built-in narrative structures designed specifically for B2B SaaS
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What counts as a 'long-form GTM asset'?",
                answer: "Articles, sales emails, LinkedIn posts, case studies, and other strategic content pieces created through our narrative frameworks. Short updates and edits don't count against your limit."
              },
              {
                question: "Can I upgrade or downgrade anytime?",
                answer: "Yes, you can change plans at any time. Upgrades take effect immediately, and downgrades apply at your next billing cycle."
              },
              {
                question: "What's included in the Ideas Bank?",
                answer: "Your Ideas Bank stores strategic content angles, proven narrative frameworks, and reusable POV templates that you can draw from for future content creation."
              },
              {
                question: "Do you offer enterprise discounts?",
                answer: "Yes, we offer custom pricing for large teams and enterprise deployments. Contact us to discuss your specific needs."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Start with Your First Strategic POV
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No credit card required. Start creating buyer-moving content in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Pricing;
