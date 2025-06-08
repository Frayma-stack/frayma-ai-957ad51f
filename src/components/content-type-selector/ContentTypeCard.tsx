
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ContentTypeCardProps {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  badge?: {
    text: string;
    icon?: LucideIcon;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  };
  gradient?: boolean;
  className?: string;
  onClick: () => void;
}

const ContentTypeCard: React.FC<ContentTypeCardProps> = ({
  title,
  description,
  features,
  icon: Icon,
  badge,
  gradient = false,
  className = "",
  onClick
}) => {
  const baseClasses = "cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300";
  const gradientClasses = gradient 
    ? "hover:border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50" 
    : "";

  return (
    <Card 
      className={`${baseClasses} ${gradientClasses} ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              gradient 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                : 'bg-blue-500'
            }`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
              {badge && (
                <Badge 
                  className={`mt-1 ${badge.className || ''}`}
                  variant={badge.variant}
                >
                  {badge.icon && <badge.icon className="h-3 w-3 mr-1" />}
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          {features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ContentTypeCard;
