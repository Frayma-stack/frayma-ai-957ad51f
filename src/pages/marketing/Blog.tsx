
import React from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, User, FileText, Lightbulb, Target } from 'lucide-react';

const Blog = () => {
  const categories = [
    { name: 'All Posts', count: 24, active: true },
    { name: 'POV Writing', count: 8, active: false },
    { name: 'GTM Execution', count: 10, active: false },
    { name: 'Product Updates', count: 6, active: false }
  ];

  const featuredPost = {
    title: 'The Death of Generic AI Content: Why GTM Teams Need Narrative Framing',
    excerpt: 'After analyzing 10,000+ AI-generated pieces, we discovered why 87% fail to move buyers. The problem isn\'t the AI—it\'s the approach.',
    author: 'Victor Eduoh',
    date: 'Dec 15, 2024',
    readTime: '8 min read',
    category: 'POV Writing',
    image: '/api/placeholder/600/400'
  };

  const posts = [
    {
      title: 'Building ICP StoryScripts That Actually Convert',
      excerpt: 'How to transform buyer research into narrative frameworks that drive 40% higher engagement rates.',
      author: 'Sarah Chen',
      date: 'Dec 12, 2024',
      readTime: '6 min read',
      category: 'GTM Execution',
      icon: <Target className="h-5 w-5" />
    },
    {
      title: 'The 3Rs Formula: Science-Backed Narrative Structure',
      excerpt: 'Why Resonance → Relevance → Results beats every other content framework for B2B SaaS.',
      author: 'Marcus Rodriguez',
      date: 'Dec 10, 2024',
      readTime: '5 min read',
      category: 'POV Writing',
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      title: 'From Founder Brain to GTM Assets: Voice Retention at Scale',
      excerpt: 'How we solved the authenticity problem in AI-generated content.',
      author: 'Emily Watson',
      date: 'Dec 8, 2024',
      readTime: '7 min read',
      category: 'Product Updates',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Case Study: How DataScale 10x\'d Their Thought Leadership Output',
      excerpt: 'Real results from a Series B SaaS company using narrative frameworks.',
      author: 'Alex Thompson',
      date: 'Dec 5, 2024',
      readTime: '4 min read',
      category: 'GTM Execution',
      icon: <Target className="h-5 w-5" />
    },
    {
      title: 'The Resonance Mirror: How We Score Narrative Strength',
      excerpt: 'Behind the scenes of our AI scoring system for buyer-moving content.',
      author: 'Dr. Lisa Park',
      date: 'Dec 3, 2024',
      readTime: '9 min read',
      category: 'Product Updates',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Why "Prompting" is Dead: The Rise of POV-First Content',
      excerpt: 'The fundamental shift from prompt engineering to narrative framing.',
      author: 'Victor Eduoh',
      date: 'Nov 30, 2024',
      readTime: '6 min read',
      category: 'POV Writing',
      icon: <Lightbulb className="h-5 w-5" />
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Narrative{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Intelligence Blog
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights on POV writing, GTM execution, and the future of strategic content creation
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                className={`${category.active 
                  ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white' 
                  : 'border-purple-200 text-gray-700 hover:border-purple-300'
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm">({category.count})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Article
            </h2>
          </div>

          <Card className="border-purple-200 shadow-xl max-w-4xl mx-auto">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-purple-200 to-orange-200 rounded-l-lg flex items-center justify-center">
                  <FileText className="h-16 w-16 text-white opacity-50" />
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="mb-4">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{featuredPost.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-600">
              Deep dives into narrative strategy and GTM execution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-3">
                    {post.icon}
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg text-gray-900 hover:text-purple-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    <span className="mr-3">{post.author}</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="mr-3">{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Get Your GTM Article Auto-Crafted
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our weekly insights and get a free article created using our narrative frameworks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 px-6">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No spam. Unsubscribe anytime. We respect your narrative intelligence.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Blog;
