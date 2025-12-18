'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore, StrategyInput } from '@/stores/project';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: 'business',
    title: 'Business Information',
    description: 'Tell us about your business',
    fields: ['businessName', 'businessType'],
  },
  {
    id: 'audience',
    title: 'Target Audience',
    description: 'Who are you building for?',
    fields: ['targetAudience', 'problem'],
  },
  {
    id: 'solution',
    title: 'Your Solution',
    description: 'What makes you unique?',
    fields: ['solution', 'uniqueValue'],
  },
  {
    id: 'tone',
    title: 'Brand Voice',
    description: 'How should your brand sound?',
    fields: ['tone', 'competitors'],
  },
];

const fieldConfig: Record<
  keyof StrategyInput,
  { label: string; placeholder: string; type: 'input' | 'textarea' }
> = {
  businessName: {
    label: 'Business Name',
    placeholder: 'e.g., Craftixel',
    type: 'input',
  },
  businessType: {
    label: 'What type of business is this?',
    placeholder: 'e.g., SaaS, E-commerce, Agency, Marketplace...',
    type: 'input',
  },
  targetAudience: {
    label: 'Who is your target audience?',
    placeholder: 'e.g., Small business owners, developers, designers...',
    type: 'textarea',
  },
  problem: {
    label: 'What problem do they face?',
    placeholder: 'Describe the main pain point your audience has...',
    type: 'textarea',
  },
  solution: {
    label: 'How do you solve it?',
    placeholder: 'Explain your solution and how it works...',
    type: 'textarea',
  },
  uniqueValue: {
    label: 'What makes you different?',
    placeholder: 'Your unique value proposition - why choose you over others?',
    type: 'textarea',
  },
  tone: {
    label: 'Brand tone of voice',
    placeholder: 'e.g., Professional, Friendly, Bold, Minimal, Playful...',
    type: 'input',
  },
  competitors: {
    label: 'Who are your competitors?',
    placeholder: 'List 2-3 competitors or similar products...',
    type: 'textarea',
  },
};

const emptyStrategyInput: StrategyInput = {
  businessName: '',
  businessType: '',
  targetAudience: '',
  problem: '',
  solution: '',
  uniqueValue: '',
  tone: '',
  competitors: '',
};

export default function StrategyPage() {
  const router = useRouter();
  const { getCurrentProject, updateStrategyInput, setPhase, createProject, projects } = useProjectStore();
  const project = getCurrentProject();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StrategyInput>(
    project?.strategyInput || emptyStrategyInput
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!project && projects.length === 0) {
      createProject('My First Project');
    }
  }, [project, projects.length, createProject]);

  useEffect(() => {
    if (project?.strategyInput) {
      setFormData(project.strategyInput);
    }
  }, [project?.strategyInput]);

  const handleInputChange = (field: keyof StrategyInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateStrategyInput(formData);
  };

  const handleNext = () => {
    handleSave();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    handleSave();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    handleSave();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate strategy');
      }

      const result = await response.json();

      // Update project with strategy output
      const { setStrategyOutput } = useProjectStore.getState();
      setStrategyOutput(result);
      setPhase('F2');
      router.push('/app/content');
    } catch (error) {
      console.error('Error generating strategy:', error);
      // For now, continue with mock data if API fails
      setPhase('F2');
      router.push('/app/content');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentStepConfig = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFormComplete = Object.values(formData).every((v) => v.trim() !== '');

  return (
    <>
      <AppHeader
        title="Strategy"
        description="Define your business and audience"
        showSaveButton
        onSave={handleSave}
      />

      <main className="p-6 max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  handleSave();
                  setCurrentStep(index);
                }}
                className={cn(
                  'flex items-center gap-2 text-sm transition-colors',
                  index === currentStep
                    ? 'text-primary font-medium'
                    : index < currentStep
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </span>
                <span className="hidden md:inline">{step.title}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        {/* Current Step */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentStepConfig.title}</CardTitle>
            <CardDescription>{currentStepConfig.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepConfig.fields.map((fieldKey) => {
              const field = fieldConfig[fieldKey as keyof StrategyInput];
              const value = formData[fieldKey as keyof StrategyInput];

              return (
                <div key={fieldKey} className="space-y-2">
                  <Label htmlFor={fieldKey}>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={fieldKey}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) =>
                        handleInputChange(fieldKey as keyof StrategyInput, e.target.value)
                      }
                      className="min-h-[120px]"
                    />
                  ) : (
                    <Input
                      id={fieldKey}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) =>
                        handleInputChange(fieldKey as keyof StrategyInput, e.target.value)
                      }
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {isLastStep ? (
              <Button
                onClick={handleGenerate}
                disabled={!isFormComplete || isGenerating}
                className="min-w-[160px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
