import React, { useState } from 'react';
import { ContentType } from '@/components/ContentTypeSelector';
import ContentTypeCard from './ContentTypeCard';
import { 
  FileText, 
  Trophy, 
  Linkedin, 
  Mail, 
  Wand2,
  Package,
  Star,
  TrendingUp,
  MessageSquare,
  Target,
  Video,
  Presentation,
  Share2,
  Users,
  FileStack,
  BarChart3,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface CategorizedContentTypesGridProps {
  onSelect: (type: ContentType) => void;
}

type CategoryType = 'product-led' | 'sales-enablement';

interface ContentTypeItem {
  key: ContentType;
  title: string;
  description: string;
  features: string[];
  icon: typeof FileText;
  badge?: {
    text: string;
    icon?: typeof Star;
    className?: string;
  };
  gradient?: boolean;
}

interface Category {
  id: CategoryType;
  title: string;
  description: string;
  items: ContentTypeItem[];
}

const CategorizedContentTypesGrid: React.FC<CategorizedContentTypesGridProps> = ({ onSelect }) => {
  const [expandedCategory, setExpandedCategory] = useState<CategoryType>('product-led');

  const categories: Category[] = [
    {
      id: 'product-led',
      title: 'Product-Led Storytelling & Marketing',
      description: 'Create compelling narratives and marketing content',
      items: [
        {
          key: 'product-campaign',
          title: 'Feature/Product Update Campaign',
          description: 'Auto-craft complete GTM content packages for product or feature updates using the Product-Led Storytelling approach.',
          features: [
            'Articles (General + ICP-specific)',
            'Social Posts (LinkedIn, Twitter)',
            'Email Newsletter & Changelog',
            'Product Video Script'
          ],
          icon: Package,
          badge: {
            text: 'NEW',
            icon: Star,
            className: 'bg-purple-100 text-purple-700 hover:bg-purple-100'
          },
          gradient: true
        },
        {
          key: 'custom', // Using 'custom' for Product Video Content Script
          title: 'Product Video Content Script',
          description: 'Create engaging video scripts that showcase your product\'s value proposition',
          features: [
            'Hook & Opening',
            'Product Demo Flow',
            'Value Proposition',
            'Call to Action'
          ],
          icon: Video,
          badge: {
            text: 'Visual',
            className: 'bg-red-100 text-red-700 hover:bg-red-100'
          }
        },
        {
          key: 'success-story',
          title: 'Success Story',
          description: 'Customer case studies and testimonials that build credibility',
          features: [
            'Customer Case Studies',
            'Implementation Stories',
            'ROI Demonstrations',
            'Testimonials'
          ],
          icon: Trophy,
          badge: {
            text: 'Proof',
            className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
          }
        },
        {
          key: 'article',
          title: 'GTM Article',
          description: 'Long-form thought leadership, product showcases, and how-to guides',
          features: [
            'Thought Leadership',
            'Product Showcases',
            'Detailed How-to Guides',
            'Industry Insights'
          ],
          icon: FileText,
          badge: {
            text: 'Popular',
            icon: TrendingUp,
            className: 'bg-blue-100 text-blue-700 hover:bg-blue-100'
          }
        },
        {
          key: 'custom', // Using 'custom' for Webinar Slides Copy
          title: 'Webinar Slides Copy',
          description: 'Create compelling presentation content for webinars and demos',
          features: [
            'Slide Headlines',
            'Speaker Notes',
            'Interactive Elements',
            'Q&A Preparation'
          ],
          icon: Presentation,
          badge: {
            text: 'Engagement',
            className: 'bg-green-100 text-green-700 hover:bg-green-100'
          }
        },
        {
          key: 'linkedin',
          title: 'Social Media Content',
          description: 'Professional posts that drive engagement and build thought leadership',
          features: [
            'LinkedIn Posts',
            'Twitter Threads',
            'Product Updates',
            'Industry Commentary'
          ],
          icon: Share2,
          badge: {
            text: 'Social',
            icon: MessageSquare,
            className: 'bg-green-100 text-green-700 hover:bg-green-100'
          }
        }
      ]
    },
    {
      id: 'sales-enablement',
      title: 'Sales Enablement',
      description: 'Empower your sales team with compelling content',
      items: [
        {
          key: 'email',
          title: 'Outbound Sales Sequence',
          description: 'Multi-touch email sequences for cold outreach and lead nurturing',
          features: [
            'Cold Outbound Emails',
            'Follow-up Sequences',
            'Personalization Framework',
            'Response Tracking'
          ],
          icon: Mail,
          badge: {
            text: 'Outbound',
            icon: Target,
            className: 'bg-red-100 text-red-700 hover:bg-red-100'
          }
        },
        {
          key: 'email',
          title: 'Nurture/Upsell Email Sequence',
          description: 'Expansion and nurture sequences for existing customers',
          features: [
            'Upsell & Cross-sell',
            'Customer Success',
            'Renewal Campaigns',
            'Product Adoption'
          ],
          icon: TrendingUp,
          badge: {
            text: 'Growth',
            className: 'bg-blue-100 text-blue-700 hover:bg-blue-100'
          }
        },
        {
          key: 'article',
          title: 'Comparison Articles',
          description: 'Listicles, this vs that, us vs them, and competitive content',
          features: [
            'Competitive Comparisons',
            'Feature Listicles',
            'Alternative Guides',
            'Buyer\'s Guides'
          ],
          icon: FileStack,
          badge: {
            text: 'Compare',
            className: 'bg-purple-100 text-purple-700 hover:bg-purple-100'
          }
        },
        {
          key: 'custom',
          title: 'Sales Battlecard',
          description: 'Quick-reference competitive intelligence for sales teams',
          features: [
            'Competitive Intel',
            'Objection Handling',
            'Key Differentiators',
            'Pricing Strategy'
          ],
          icon: Target,
          badge: {
            text: 'Intel',
            className: 'bg-orange-100 text-orange-700 hover:bg-orange-100'
          }
        },
        {
          key: 'custom',
          title: 'Personalized Sales Deck',
          description: 'Customized presentation decks for prospect meetings',
          features: [
            'Prospect-specific Content',
            'Use Case Alignment',
            'ROI Projections',
            'Next Steps Framework'
          ],
          icon: BarChart3,
          badge: {
            text: 'Custom',
            className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100'
          }
        },
        {
          key: 'custom',
          title: 'Sales One-Pager',
          description: 'Concise value proposition summaries for quick prospect reference',
          features: [
            'Value Proposition',
            'Key Benefits',
            'Social Proof',
            'Contact Information'
          ],
          icon: FileText,
          badge: {
            text: 'Quick',
            className: 'bg-gray-100 text-gray-700 hover:bg-gray-100'
          }
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: CategoryType) => {
    setExpandedCategory(expandedCategory === categoryId ? 'product-led' : categoryId);
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const isExpanded = expandedCategory === category.id;
        const Icon = isExpanded ? ChevronDown : ChevronRight;
        
        return (
          <div key={category.id} className="space-y-4">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </button>

            {/* Category Content */}
            {isExpanded && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-4">
                {category.items.map((item, index) => (
                  <ContentTypeCard
                    key={`${category.id}-${index}`}
                    title={item.title}
                    description={item.description}
                    features={item.features}
                    icon={item.icon}
                    badge={item.badge}
                    gradient={item.gradient}
                    onClick={() => onSelect(item.key)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategorizedContentTypesGrid;