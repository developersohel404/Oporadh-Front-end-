import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর'),
  email: z.string().email('সঠিক ইমেইল দিন'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'বিষয় দিন'),
  message: z.string().min(10, 'বার্তা কমপক্ষে ১০ অক্ষর'),
});

type FormData = z.infer<typeof schema>;

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const submit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/contact', data);
      toast.success('বার্তা পাঠানো হয়েছে!');
      reset();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-2">যোগাযোগ</h1>
      <p className="text-slate-500 mb-8">আপনার মতামত বা সমস্যা জানান</p>

      <Card>
        <CardHeader>
          <CardTitle>বার্তা পাঠান</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(submit)}>
          <CardContent className="space-y-4">
            <div>
              <Label>নাম *</Label>
              <Input {...register('name')} disabled={loading} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label>ইমেইল *</Label>
              <Input type="email" {...register('email')} disabled={loading} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label>ফোন</Label>
              <Input {...register('phone')} disabled={loading} />
            </div>
            <div>
              <Label>বিষয় *</Label>
              <Input {...register('subject')} disabled={loading} />
              {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
            </div>
            <div>
              <Label>বার্তা *</Label>
              <Textarea {...register('message')} rows={5} disabled={loading} />
              {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
