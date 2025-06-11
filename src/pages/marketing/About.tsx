
import React from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Target, Users, Lightbulb, Heart } from 'lucide-react';

const About = () => {
  const timeline = [
    {
      year: '2019',
      title: 'Agency Beginnings',
      description: 'Victor Eduoh starts helping B2B SaaS companies with content strategy, discovering the gap between product brilliance and buyer communication.'
    },
    {
      year: '2021',
      title: 'Product-Led Storytelling Framework',
      description: 'After analyzing hundreds of GTM campaigns, the PLS methodology emerges—a systematic approach to turning product insights into buyer-moving narratives.'
    },
    {
      year: '2023',
      title: 'The AI Content Crisis',
      description: 'Generic AI tools flood the market. Quality content becomes indistinguishable. The need for strategic narrative framing becomes urgent.'
    },
    {
      year: '2024',
      title: 'Frayma AI is Born',
      description: 'The first AI platform purpose-built for GTM teams, combining narrative frameworks with authentic voice retention and strategic intelligence.'
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: 'Taste-First AI',
      description: 'We believe AI should enhance human creativity, not replace it. Every feature is designed to amplify strategic thinking, not substitute for it.'
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: 'GTM Frameworks Over Generic Tools',
      description: 'Built specifically for B2B SaaS GTM teams, not as another general-purpose writing assistant. Every framework serves a strategic GTM purpose.'
    },
    {
      icon: <Heart className="h-8 w-8 text-purple-600" />,
      title: 'Founder Voice Retention',
      description: 'Scaling content shouldn\'t mean losing authenticity. We\'re obsessed with preserving the unique voice that makes leaders compelling.'
    }
  ];

  const team = [
    {
      name: 'Victor Eduoh',
      role: 'Founder & CEO',
      bio: 'Creator of Product-Led Storytelling methodology. Former content strategist for 50+ B2B SaaS companies.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Product',
      bio: 'Former VP of Marketing at three successful SaaS exits. Expert in narrative psychology and buyer behavior.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Engineering',
      bio: 'AI researcher with focus on language models and voice preservation. Previously at OpenAI and Anthropic.',
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Story Behind{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Frayma AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How a content strategy problem became a narrative intelligence revolution
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              The Problem That Started Everything
            </h2>
            
            <p className="text-xl leading-relaxed mb-6">
              In 2019, Victor Eduoh was running a content agency for B2B SaaS companies. The same pattern emerged repeatedly: brilliant founders with transformative products struggled to communicate their value in ways that moved buyers.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              The conventional wisdom was "just tell better stories." But that missed the fundamental issue—most founders and GTM teams lacked systematic frameworks for translating product insights into narrative structures that resonate with buyers.
            </p>
            
            <p className="text-lg leading-relaxed mb-8">
              When AI writing tools emerged, they made the problem worse. Generic prompting created generic content. What was needed wasn't better AI—it was better frameworks for strategic narrative development.
            </p>
            
            <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-8 my-8">
              <blockquote className="text-xl italic text-gray-800 text-center">
                "We realized the future wasn't about prompting AI randomly—it was about framing ideas strategically, then letting AI execute the narrative frameworks."
              </blockquote>
              <div className="text-center mt-4">
                <span className="font-semibold text-gray-900">Victor Eduoh, Founder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Evolution of an Idea
            </h2>
            <p className="text-xl text-gray-600">
              From agency insights to AI-powered narrative intelligence
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-orange-500 rounded-full"></div>
            
            <div className="space-y-12">
              {timeline.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:px-8">
                    <Card className={`border-purple-200 ${index % 2 === 0 ? 'md:mr-4' : 'md:ml-4'}`}>
                      <CardContent className="p-6">
                        <div className="text-purple-600 font-bold text-lg mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full border-4 border-white flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 md:px-8">
                    {/* Empty space for alternating layout */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values Drive Everything
            </h2>
            <p className="text-xl text-gray-600">
              Principles that guide how we build narrative intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-purple-200 text-center">
                <CardContent className="p-8">
                  <div className="mb-6 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet the Narrative Intelligence Team
            </h2>
            <p className="text-xl text-gray-600">
              Obsessed with helping GTM teams tell better stories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-purple-200 text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Building the Future of GTM Content
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10,000+</div>
              <p className="text-gray-600">GTM assets analyzed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
              <p className="text-gray-600">B2B SaaS companies served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
              <p className="text-gray-600">Improvement in narrative resonance</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">3x</div>
              <p className="text-gray-600">Faster content creation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join the Narrative Revolution
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be part of the movement transforming how B2B SaaS teams create buyer-moving content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                Start Your Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/careers">
              <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800">
                Join Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default About;
