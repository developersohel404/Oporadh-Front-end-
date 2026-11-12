import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

export function CommentForm({
  onSubmit,
  placeholder = 'আপনার মন্তব্য লিখুন...',
  disabled,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      await onSubmit(trimmed);
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        disabled={disabled || loading}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={disabled || loading || !content.trim()}>
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              পাঠানো হচ্ছে...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 mr-1" />
              পাঠান
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
