
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StoryDetails } from './StoryForm';

interface PromptGuideProps {
  storyDetails: StoryDetails | null;
}

const PromptGuide: FC<PromptGuideProps> = ({ storyDetails }) => {
  const getPrompts = () => {
    if (!storyDetails || !storyDetails.product) {
      return [
        { 
          title: "Begin with your experience",
          content: "Start by sharing a personal experience that led you to create your product or service."
        },
        { 
          title: "Identify the pain point",
          content: "Describe the problem you were facing that your target audience can relate to."
        },
        { 
          title: "Introduce your solution",
          content: "Talk about how you created or discovered the solution to this problem."
        },
        { 
          title: "Highlight key benefits",
          content: "Share how your solution has improved your life or the lives of others."
        },
        { 
          title: "End with an invitation",
          content: "Invite your audience to experience the same benefits with your product or service."
        }
      ];
    }

    return [
      { 
        title: "Begin with your experience",
        content: `Start by sharing a personal experience that led you to create ${storyDetails.product}. What frustration or need did you encounter that your target audience (${storyDetails.targetAudience}) can relate to?`
      },
      { 
        title: "Identify the pain point",
        content: `Describe how ${storyDetails.problem} was affecting you or others personally. Make this emotional and relatable.`
      },
      { 
        title: "Introduce your solution",
        content: `Talk about how you created ${storyDetails.product} as a solution${storyDetails.solution ? ` that ${storyDetails.solution}` : ''}. Share your process of discovery or creation.`
      },
      { 
        title: "Highlight key benefits",
        content: `Share how ${storyDetails.product} has improved your life${storyDetails.keyFeatures.length > 0 ? ` with benefits like ${storyDetails.keyFeatures.join(', ')}` : ''}. Use specific examples.`
      },
      { 
        title: "End with an invitation",
        content: `Invite your audience to experience the same benefits with ${storyDetails.product}${storyDetails.uniqueValue ? `, emphasizing that ${storyDetails.uniqueValue}` : ''}.`
      }
    ];
  };

  const prompts = getPrompts();

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Story Prompts</CardTitle>
        <CardDescription>
          Use these prompts to guide your narrative
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {prompts.map((prompt, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-story-blue">
                {prompt.title}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700">{prompt.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PromptGuide;
