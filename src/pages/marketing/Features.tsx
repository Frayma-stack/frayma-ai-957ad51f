
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target, Users, Zap, FileText, Lightbulb, Star } from 'lucide-react';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'narrative-framing',
      icon: <Target className="h-12 w-12 text-purple-600" />,
      title: 'Narrative Framing Engine',
      job: 'Transform scattered thoughts into strategic POVs',
      description: 'Stop prompting AI randomly. Our Narrative Framing Engine guides you through structured POV development, ensuring every piece of content has strategic intent.',
      transformation: {
        before: 'Random AI prompts → Generic content',
        after: 'Strategic POV → Buyer-moving narratives'
      },
      differentiator: 'Unlike ChatGPT\'s blank prompt box, Frayma provides guided POV frameworks that connect to real GTM outcomes.'
    },
    {
      id: 'icp-storyscripts',
      icon: <Users className="h-12 w-12 text-orange-500" />,
      title: 'ICP StoryScripts + StoryBriefs Builder',
      job: 'Create buyer-specific narrative blueprints',
      description: 'Build detailed StoryScripts for each ICP segment, then use StoryBriefs to guide content creation that resonates with specific buyer journeys.',
      transformation: {
        before: 'One-size-fits-all content → Low conversion',
        after: 'ICP-specific narratives → Higher engagement'
      },
      differentiator: 'Purpose-built for B2B SaaS GTM teams who need buyer-segment precision, not generic content templates.'
    },
    {
      id: 'auto-craft',
      icon: <Zap className="h-12 w-12 text-purple-600" />,
      title: 'Auto-Craft Engine (3Rs Formula)',
      job: 'Generate compelling content with proven narrative structure',
      description: 'Our 3Rs Formula (Resonance, Relevance, Results) ensures every piece follows buyer psychology principles that drive action.',
      transformation: {
        before: 'Hope and guess → Inconsistent messaging',
        after: '3Rs Framework → Predictable buyer engagement'
      },
      differentiator: 'Built-in narrative frameworks vs. hoping your prompts work. Science-backed story structure, not AI randomness.'
    },
    {
      id: 'ideas-minting',
      icon: <Lightbulb className="h-12 w-12 text-orange-500" />,
      title: 'New Ideas Minting Engine',
      job: 'Never run out of strategic content angles',
      description: 'Transform product insights, customer feedback, and market positioning into an endless stream of content ideas with built-in narrative hooks.',
      transformation: {
        before: 'Content calendar anxiety → Forced topics',
        after: 'Strategic idea generation → Natural content flow'
      },
      differentiator: 'Connects product strategy to content strategy automatically, unlike generic idea generators.'
    },
    {
      id: 'resonance-mirror',
      icon: <Star className="h-12 w-12 text-purple-600" />,
      title: 'Resonance Mirror',
      job: 'Optimize content for maximum buyer impact',
      description: 'Get real-time feedback on narrative strength, emotional resonance, and buyer alignment before publishing.',
      transformation: {
        before: 'Publish and hope → Unpredictable results',
        after: 'Resonance-tested content → Confident publishing'
      },
      differentiator: 'AI scoring based on B2B buyer psychology, not generic readability metrics.'
    },
    {
      id: 'author-profiles',
      icon: <FileText className="h-12 w-12 text-orange-500" />,
      title: 'Author Profiles + Tone Control',
      job: 'Scale your voice without losing authenticity',
      description: 'Create detailed author profiles that capture voice, experience, and beliefs, then maintain consistency across all content while scaling output.',
      transformation: {
        before: 'Generic AI voice → Brand dilution',
        after: 'Authentic voice at scale → Brand strengthening'
      },
      differentiator: 'Preserves founder and executive voice authenticity while scaling, unlike voice-washing AI tools.'
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Features Built for{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                GTM Excellence
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed to transform how B2B SaaS teams create buyer-moving content
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card 
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index 
                      ? 'border-purple-300 shadow-lg bg-gradient-to-r from-purple-50 to-orange-50' 
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Job to be done:</strong> {feature.job}
                        </p>
                        {activeFeature === index && (
                          <div className="mt-4 space-y-3">
                            <p className="text-gray-700">
                              {feature.description}
                            </p>
                            <div className="bg-white/50 p-4 rounded-lg border border-purple-100">
                              <div className="text-sm">
                                <div className="text-red-600 mb-1">
                                  <strong>Before:</strong> {feature.transformation.before}
                                </div>
                                <div className="text-green-600">
                                  <strong>After:</strong> {feature.transformation.after}
                                </div>
                              </div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-sm text-purple-800">
                                <strong>Why different:</strong> {feature.differentiator}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feature Showcase */}
            <div className="lg:sticky lg:top-24">
              <Card className="border-purple-200 shadow-xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {features[activeFeature].icon}
                  </div>
                  <CardTitle className="text-2xl text-gray-900">
                    {features[activeFeature].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mock UI Preview */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="bg-white rounded border p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gradient-to-r from-purple-200 to-orange-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Interactive demo coming soon
                    </p>
                  </div>

                  <div className="text-center">
                    <Link to="/app">
                      <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                        Try This Feature
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Experience All Features Together
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            See how our integrated approach transforms your entire GTM content workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/use-cases">
              <Button variant="outline" size="lg">
                See Use Cases
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Features;
