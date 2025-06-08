
import React from 'react';
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
  Target
} from "lucide-react";

interface ContentTypesGridProps {
  onSelect: (type: ContentType) => void;
}

const ContentTypesGrid: React.FC<ContentTypesGridProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Campaign Card - Featured */}
      <ContentTypeCard
        title="Product/Feature Update Campaign"
        description="Auto-craft complete GTM content packages for product or feature updates using the Product-Led Storytelling approach."
        features={[
          "Articles (General + ICP-specific)",
          "Social Posts (LinkedIn, Twitter)",
          "Email Newsletter & Changelog",
          "Product Video Script"
        ]}
        icon={Package}
        badge={{
          text: "NEW",
          icon: Star,
          className: "bg-purple-100 text-purple-700 hover:bg-purple-100"
        }}
        gradient={true}
        onClick={() => onSelect('product-campaign')}
      />

      {/* GTM Articles */}
      <ContentTypeCard
        title="GTM Articles"
        description="Long-form thought leadership, product showcases, and how-to guides"
        features={[
          "Thought Leadership",
          "Product Showcases", 
          "Detailed How-to Guides",
          "Industry Insights"
        ]}
        icon={FileText}
        badge={{
          text: "Popular",
          icon: TrendingUp,
          className: "bg-blue-100 text-blue-700 hover:bg-blue-100"
        }}
        onClick={() => onSelect('article')}
      />

      {/* LinkedIn Posts */}
      <ContentTypeCard
        title="LinkedIn Posts"
        description="Professional posts that drive engagement and build thought leadership"
        features={[
          "Thought Leadership",
          "Product Updates",
          "Industry Commentary",
          "Personal Stories"
        ]}
        icon={Linkedin}
        badge={{
          text: "Social",
          icon: MessageSquare,
          className: "bg-green-100 text-green-700 hover:bg-green-100"
        }}
        className="hover:border-gray-300"
        onClick={() => onSelect('linkedin')}
      />

      {/* Sales Email */}
      <ContentTypeCard
        title="Sales Email"
        description="Expansion, nurture sequences, sales outreach"
        features={[
          "Upsell & Cross-sell Emails",
          "Cold Outbound Emails",
          "Nurture Sequences"
        ]}
        icon={Mail}
        badge={{
          text: "Direct",
          icon: Target,
          className: "bg-red-100 text-red-700 hover:bg-red-100"
        }}
        className="hover:border-gray-300"
        onClick={() => onSelect('email')}
      />

      {/* Success Stories */}
      <ContentTypeCard
        title="Success Stories"
        description="Customer case studies and testimonials that build credibility"
        features={[
          "Customer Case Studies",
          "Implementation Stories",
          "ROI Demonstrations",
          "Testimonials"
        ]}
        icon={Trophy}
        badge={{
          text: "Proof",
          className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
        }}
        className="hover:border-gray-300"
        onClick={() => onSelect('success-story')}
      />

      {/* Custom Content */}
      <ContentTypeCard
        title="Custom Content"
        description="Any content type with custom prompts and specifications"
        features={[
          "Website Copy",
          "Video Content Scripts",
          "Twitter (X) Threads",
          "Custom Formats"
        ]}
        icon={Wand2}
        badge={{
          text: "Flexible",
          className: "bg-orange-100 text-orange-700 hover:bg-orange-100"
        }}
        className="hover:border-gray-300"
        onClick={() => onSelect('custom')}
      />
    </div>
  );
};

export default ContentTypesGrid;
