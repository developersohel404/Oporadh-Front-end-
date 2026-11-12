import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, getApiError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({ email: z.string().email('সঠিক ইমেইল দিন') });
type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      toast.success('রিসেট লিংক পাঠানো হয়েছে');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">পাসওয়ার্ড ভুলে গেছেন?</CardTitle>
        <CardDescription className="text-center">ইমেইল দিন — রিসেট লিংক পাঠাব</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label>ইমেইল</Label>
            <Input type="email" {...register('email')} disabled={loading} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> পাঠানো হচ্ছে...
              </>
            ) : (
              'পাঠান'
            )}
          </Button>
          <Link to="/login" className="text-sm text-slate-600 hover:underline">
            ← লগইনে ফিরে যান
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
