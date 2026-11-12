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
import { useAuthStore } from '@/stores/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন'),
  password: z.string().min(1, 'পাসওয়ার্ড দিন'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const user = res.data.data.user;
      setUser(user);
      toast.success('লগইন সফল');
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'MODERATOR') navigate('/moderator/dashboard');
      else navigate('/dashboard/home');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">লগইন করুন</CardTitle>
        <CardDescription className="text-center">OPORADH অ্যাকাউন্টে প্রবেশ করুন</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>ইমেইল</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={loading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>পাসওয়ার্ড</Label>
              <Link to="/forgot-password" className="text-xs text-slate-500 hover:underline">
                ভুলে গেছেন?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={loading}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> লগইন হচ্ছে...
              </>
            ) : (
              'লগইন'
            )}
          </Button>
          <p className="text-sm text-center text-slate-600">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="font-medium text-slate-900 hover:underline">
              রেজিস্টার
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
