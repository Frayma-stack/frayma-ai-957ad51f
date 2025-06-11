
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileText, Mail, Users, Lightbulb } from 'lucide-react';

const UseCases = () => {
  const [activeTab, setActiveTab] = useState(0);

  const useCases = [
    {
      id: 'thought-leadership',
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      title: 'Thought Leadership Articles',
      audience: 'Founders & Heads of Marketing',
      tension: 'Your CEO has brilliant insights but never finds time to write. Your thought leadership calendar is always behind, and when articles do get published, they lack the strategic depth that moves buyers.',
      process: [
        'Capture raw executive insights in 5-minute voice memos',
        'Frayma transforms thoughts into structured POVs using 3Rs Framework',
        'Auto-craft compelling articles that maintain authentic executive voice',
        'Store proven narrative angles in Ideas Bank for future content'
      ],
      outcome: 'Executive bylines that actually drive pipeline and establish market authority',
      metrics: '3x faster article creation, 5x higher engagement rates'
    },
    {
      id: 'sales-emails',
      icon: <Mail className="h-8 w-8 text-orange-500" />,
      title: 'Sales Email Sequences',
      audience: 'Outbound GTM Teams',
      tension: 'Your SDRs send hundreds of emails that sound like everyone else\'s. Generic templates get ignored, and personalization takes too long to scale effectively.',
      process: [
        'Build ICP StoryScripts for each buyer persona',
        'Create narrative-driven email sequences using proven frameworks',
        'Maintain personal voice while scaling outreach volume',
        'A/B test narrative angles automatically'
      ],
      outcome: 'Email sequences that break through noise with authentic, buyer-specific stories',
      metrics: '40% higher open rates, 2x more qualified meetings booked'
    },
    {
      id: 'linkedin-posts',
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'LinkedIn GTM Posts',
      audience: 'Content Marketers',
      tension: 'Your LinkedIn content feels forced and formulaic. You\'re posting regularly but not seeing engagement that translates to business results or meaningful conversations.',
      process: [
        'Transform product updates into buyer-relevant narratives',
        'Use Resonance Mirror to optimize for engagement',
        'Create series of connected posts that build toward GTM goals',
        'Repurpose successful angles across content formats'
      ],
      outcome: 'LinkedIn content that drives actual business conversations and pipeline',
      metrics: '250% increase in qualified inbound leads from social'
    },
    {
      id: 'ideas-bank',
      icon: <Lightbulb className="h-8 w-8 text-orange-500" />,
      title: 'GTM Ideas Bank Vault',
      audience: 'Cross-functional GTM Teams',
      tension: 'Great content ideas get lost in Slack threads. Your team knows your product stories but struggles to turn insights into consistent, buyer-moving content at scale.',
      process: [
        'Centralize all product insights, customer feedback, and market positioning',
        'Transform scattered ideas into structured narrative frameworks',
        'Create searchable vault of proven content angles and templates',
        'Enable any team member to create on-brand, strategic content'
      ],
      outcome: 'Organizational content intelligence that scales with your team',
      metrics: 'Never run out of strategic content ideas, 70% faster content creation'
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Real Teams, Real{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                GTM Results
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Frayma transforms specific GTM workflows for different roles and outcomes
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {useCases.map((useCase, index) => (
              <Button
                key={useCase.id}
                variant={activeTab === index ? "default" : "outline"}
                className={`${activeTab === index 
                  ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white' 
                  : 'border-purple-200 text-gray-700 hover:border-purple-300'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {useCase.icon}
                <span className="ml-2 hidden sm:inline">{useCase.title}</span>
              </Button>
            ))}
          </div>

          {/* Active Use Case */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-purple-200 shadow-xl">
              <CardHeader className="text-center border-b border-purple-100">
                <div className="flex justify-center mb-4">
                  {useCases[activeTab].icon}
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-2">
                  {useCases[activeTab].title}
                </CardTitle>
                <p className="text-lg text-purple-600 font-medium">
                  {useCases[activeTab].audience}
                </p>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* The Tension */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">
                    The Challenge
                  </h3>
                  <p className="text-red-700">
                    {useCases[activeTab].tension}
                  </p>
                </div>

                {/* The Process */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    How Frayma Solves It
                  </h3>
                  <div className="space-y-3">
                    {useCases[activeTab].process.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-blue-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Outcome */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    The Result
                  </h3>
                  <p className="text-green-700 mb-4">
                    {useCases[activeTab].outcome}
                  </p>
                  <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">
                      {useCases[activeTab].metrics}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-purple-100">
                  <Link to="/app">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                      Try This Use Case
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* All Use Cases Overview */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              One Platform, Multiple GTM Workflows
            </h2>
            <p className="text-xl text-gray-600">
              Transform every aspect of your content-driven GTM strategy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card 
                key={useCase.id}
                className="border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab(index)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {useCase.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {useCase.audience}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore This Use Case
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your GTM Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start with any use case and expand from there. Every workflow connects seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default UseCases;
