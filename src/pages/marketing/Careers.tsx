
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Clock, Users, Code, Target, Heart } from 'lucide-react';

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All Roles', count: 6 },
    { id: 'engineering', name: 'Engineering', count: 3 },
    { id: 'marketing', name: 'Marketing', count: 2 },
    { id: 'customer-success', name: 'Customer Success', count: 1 }
  ];

  const openRoles = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      department: 'engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build beautiful, intuitive interfaces for our narrative intelligence platform. You\'ll work on complex editor components, real-time collaboration features, and AI-powered content creation tools.',
      requirements: [
        'Expert in React, TypeScript, and modern frontend technologies',
        'Experience with real-time collaborative editing (like Notion, Figma)',
        'Strong eye for design and user experience',
        'Interest in AI/ML applications in creative tools'
      ],
      why: 'Shape how GTM teams interact with AI for strategic content creation'
    },
    {
      id: 2,
      title: 'AI/ML Engineer',
      department: 'engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and refine our narrative intelligence algorithms. You\'ll work on voice retention models, content scoring systems, and framework-driven content generation.',
      requirements: [
        'Strong background in NLP and large language models',
        'Experience with prompt engineering and model fine-tuning',
        'Python expertise with ML frameworks (PyTorch, Transformers)',
        'Understanding of content generation and evaluation metrics'
      ],
      why: 'Pioneer the future of strategic AI for B2B content creation'
    },
    {
      id: 3,
      title: 'Full-Stack Engineer',
      department: 'engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Own features end-to-end, from database design to user interface. You\'ll build the backbone systems that power our GTM framework execution.',
      requirements: [
        'Full-stack experience with modern web technologies',
        'Database design and API development expertise',
        'Experience with cloud platforms (AWS, GCP)',
        'Interest in building tools for creative professionals'
      ],
      why: 'Build the infrastructure that transforms how teams create narrative content'
    },
    {
      id: 4,
      title: 'Head of Growth Marketing',
      department: 'marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead our GTM strategy and help B2B SaaS teams discover narrative intelligence. You\'ll practice what we preach—using our own frameworks to drive growth.',
      requirements: [
        'Proven track record growing B2B SaaS companies',
        'Deep understanding of GTM motions and buyer psychology',
        'Experience with content-driven growth strategies',
        'Strong analytical mindset with data-driven approach'
      ],
      why: 'Use our narrative frameworks to revolutionize how we grow ourselves'
    },
    {
      id: 5,
      title: 'Content Strategist & GTM Writer',
      department: 'marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create compelling content that demonstrates our narrative frameworks in action. You\'ll be the living example of how Frayma transforms content creation.',
      requirements: [
        'Exceptional writing skills with B2B SaaS experience',
        'Understanding of GTM strategies and buyer journeys',
        'Experience with thought leadership content',
        'Passion for narrative strategy and storytelling frameworks'
      ],
      why: 'Showcase the power of narrative intelligence through your own content'
    },
    {
      id: 6,
      title: 'Customer Success Manager',
      department: 'customer-success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help GTM teams maximize their narrative intelligence. You\'ll guide customers through framework adoption and content strategy transformation.',
      requirements: [
        'Customer success experience with B2B SaaS tools',
        'Understanding of content marketing and GTM strategies',
        'Strong communication and relationship-building skills',
        'Interest in helping teams improve their storytelling'
      ],
      why: 'Directly impact how teams tell better stories and drive business results'
    }
  ];

  const filteredRoles = selectedDepartment === 'all' 
    ? openRoles 
    : openRoles.filter(role => role.department === selectedDepartment);

  const perks = [
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: 'Remote-First Culture',
      description: 'Work from anywhere with flexible hours and quarterly team retreats'
    },
    {
      icon: <Target className="h-6 w-6 text-orange-500" />,
      title: 'Mission-Driven Work',
      description: 'Help transform how the world\'s best GTM teams tell their stories'
    },
    {
      icon: <Heart className="h-6 w-6 text-purple-600" />,
      title: 'Learning & Growth',
      description: 'Annual learning budget, conference attendance, and skill development'
    },
    {
      icon: <Code className="h-6 w-6 text-orange-500" />,
      title: 'Cutting-Edge Tech',
      description: 'Work with the latest AI/ML tools and modern development stack'
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Join the{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Narrative Revolution
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Help us build the future of strategic content creation for B2B SaaS teams
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-700">
                Helping founders and GTM teams tell better stories through narrative intelligence—frameworks that transform ideas into buyer-moving content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Department Filter */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {departments.map((dept) => (
              <Button
                key={dept.id}
                variant={selectedDepartment === dept.id ? "default" : "outline"}
                className={`${selectedDepartment === dept.id
                  ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white' 
                  : 'border-purple-200 text-gray-700 hover:border-purple-300'
                }`}
                onClick={() => setSelectedDepartment(dept.id)}
              >
                {dept.name}
                <span className="ml-2 text-sm">({dept.count})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Find your role in shaping the future of GTM content
            </p>
          </div>

          <div className="space-y-6">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">
                        {role.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {role.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {role.type}
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {departments.find(d => d.id === role.department)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About the Role</h4>
                    <p className="text-gray-700">{role.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What We're Looking For</h4>
                    <ul className="space-y-1">
                      {role.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-gray-700 text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Why This Role Matters</h4>
                    <p className="text-purple-700 text-sm">{role.why}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Join Frayma?
            </h2>
            <p className="text-xl text-gray-600">
              More than a job—be part of a mission that transforms how teams tell stories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, index) => (
              <Card key={index} className="border-purple-200 text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {perk.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {perk.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {perk.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Hiring Process
            </h2>
            <p className="text-xl text-gray-600">
              Designed to be respectful of your time while finding the right fit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-200 text-center">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Application Review
                </h3>
                <p className="text-gray-600 text-sm">
                  We review your application and portfolio within 48 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 text-center">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Culture & Skills Interview
                </h3>
                <p className="text-gray-600 text-sm">
                  30-minute conversation about your experience and our mission
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 text-center">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Final Interview
                </h3>
                <p className="text-gray-600 text-sm">
                  Meet the team and discuss how you'll contribute to our mission
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Shape the Future of GTM Content?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join us in building narrative intelligence that transforms how teams tell their stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
              View Open Roles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="text-gray-400 text-sm mt-4 sm:mt-8">
              <p>Don't see the right role? <a href="mailto:careers@frayma.ai" className="text-purple-400 hover:text-purple-300">Email us anyway</a></p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Careers;
