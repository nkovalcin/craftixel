'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus('loading');

    // Simulate API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save to localStorage for now
    const waitlist = JSON.parse(localStorage.getItem('craftixel_waitlist') || '[]');
    waitlist.push({ email, timestamp: new Date().toISOString() });
    localStorage.setItem('craftixel_waitlist', JSON.stringify(waitlist));

    setStatus('success');
    setEmail('');
  };

  return (
    <section id="waitlist" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Get early access
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the waitlist and be the first to create pixel-perfect designs with AI.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              className="h-12"
              required
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading' || status === 'success'}
              className="min-w-[140px]"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : status === 'success' ? (
                <>
                  <Check className="h-4 w-4" />
                  Joined!
                </>
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Success message */}
          {status === 'success' && (
            <p className="mt-4 text-sm text-green-600">
              You're on the list! We'll notify you when we launch.
            </p>
          )}

          {/* Note */}
          <p className="mt-6 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
