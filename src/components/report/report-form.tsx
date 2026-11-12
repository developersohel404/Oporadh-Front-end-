import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import type { CrimeCategory } from '@/types/report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(5, 'শিরোনাম কমপক্ষে ৫ অক্ষর'),
  categoryId: z.string().uuid('ক্যাটাগরি নির্বাচন করুন'),
  description: z.string().min(20, 'বিবরণ কমপক্ষে ২০ অক্ষর'),
  incidentAddress: z.string().optional(),
  incidentDate: z.string().min(1, 'তারিখ দিন'),
  incidentTime: z.string().optional(),
  suspectName: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
});

export type ReportFormData = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<ReportFormData>;
  onSubmit: (data: ReportFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export function ReportForm({ defaultValues, onSubmit, loading, submitLabel = 'জমা দিন' }: Props) {
  const [categories, setCategories] = useState<CrimeCategory[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'NORMAL', ...defaultValues },
  });

  useEffect(() => {
    api.get('/crime-categories').then((r) => setCategories(r.data?.data ?? []));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>শিরোনাম *</Label>
            <Input {...register('title')} placeholder="যেমন: চুরির ঘটনা ঘটেছে" disabled={loading} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <Label>ক্যাটাগরি *</Label>
            <Select
              onValueChange={(v) => setValue('categoryId', v)}
              defaultValue={defaultValues?.categoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nameBn ?? c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
          <div>
            <Label>বিবরণ *</Label>
            <Textarea {...register('description')} rows={5} disabled={loading} />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>তারিখ *</Label>
              <Input type="date" {...register('incidentDate')} disabled={loading} />
              {errors.incidentDate && (
                <p className="text-xs text-red-500">{errors.incidentDate.message}</p>
              )}
            </div>
            <div>
              <Label>সময়</Label>
              <Input {...register('incidentTime')} placeholder="সকাল ১০টা" disabled={loading} />
            </div>
          </div>
          <div>
            <Label>ঠিকানা</Label>
            <Input {...register('incidentAddress')} disabled={loading} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>সন্দেহভাজন</Label>
              <Input {...register('suspectName')} disabled={loading} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                onValueChange={(v) => setValue('priority', v as any)}
                defaultValue={defaultValues?.priority ?? 'NORMAL'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">কম</SelectItem>
                  <SelectItem value="NORMAL">সাধারণ</SelectItem>
                  <SelectItem value="HIGH">উচ্চ</SelectItem>
                  <SelectItem value="URGENT">জরুরি</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'জমা হচ্ছে...' : submitLabel}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
