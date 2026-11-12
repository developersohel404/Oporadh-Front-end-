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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, getApiError } from '@/lib/api';
import { getBengaliName } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

interface Loc {
  id: string;
  name: string;
  nameBn: string | null;
}

const schema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর'),
  nickname: z.string().optional(),
  email: z.string().email('সঠিক ইমেইল দিন'),
  password: z.string().min(8, 'কমপক্ষে ৮ অক্ষর'),
  divisionName: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  districtName: z.string().min(1, 'জেলা নির্বাচন করুন'),
  upazilaName: z.string().min(1, 'উপজেলা নির্বাচন করুন'),
  unionName: z.string().optional(),
  pourashavaName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [divisions, setDivisions] = useState<Loc[]>([]);
  const [districts, setDistricts] = useState<Loc[]>([]);
  const [upazilas, setUpazilas] = useState<Loc[]>([]);
  const [unions, setUnions] = useState<Loc[]>([]);
  const [pourashavas, setPourashavas] = useState<Loc[]>([]);
  const [areaType, setAreaType] = useState<'union' | 'pourashava'>('union');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.get('/locations/divisions').then((r) => setDivisions(r.data?.data ?? []));
  }, []);

  const onDivisionChange = async (id: string) => {
    const div = divisions.find((d) => d.id === id);
    if (!div) return;
    setValue('divisionName', div.name, { shouldValidate: true });
    setDistricts([]);
    setUpazilas([]);
    setUnions([]);
    setPourashavas([]);
    const r = await api.get(`/locations/divisions/${id}/districts`);
    setDistricts(r.data?.data?.districts ?? []);
  };

  const onDistrictChange = async (id: string) => {
    const d = districts.find((x) => x.id === id);
    if (!d) return;
    setValue('districtName', d.name, { shouldValidate: true });
    setUpazilas([]);
    setUnions([]);
    setPourashavas([]);
    const r = await api.get(`/locations/districts/${id}/upazilas`);
    setUpazilas(r.data?.data?.upazilas ?? []);
  };

  const onUpazilaChange = async (id: string) => {
    const u = upazilas.find((x) => x.id === id);
    if (!u) return;
    setValue('upazilaName', u.name, { shouldValidate: true });
    const [uRes, pRes] = await Promise.all([
      api.get(`/locations/upazilas/${id}/unions`).catch(() => ({ data: { data: { unions: [] } } })),
      api
        .get(`/locations/upazilas/${id}/pourashavas`)
        .catch(() => ({ data: { data: { pourashavas: [] } } })),
    ]);
    setUnions(uRes.data?.data?.unions ?? []);
    setPourashavas(pRes.data?.data?.pourashavas ?? []);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        password: data.password,
        divisionName: data.divisionName,
        districtName: data.districtName,
        upazilaName: data.upazilaName,
        unionName: areaType === 'union' ? data.unionName : undefined,
        pourashavaName: areaType === 'pourashava' ? data.pourashavaName : undefined,
      });
      toast.success('রেজিস্ট্রেশন সফল! ইমেইল যাচাই করুন।');
      navigate('/verify-email');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">নতুন অ্যাকাউন্ট</CardTitle>
        <CardDescription className="text-center">OPORADH-এ যোগ দিন</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>পূর্ণ নাম *</Label>
              <Input {...register('name')} disabled={loading} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label>ডাকনাম</Label>
              <Input {...register('nickname')} disabled={loading} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ইমেইল *</Label>
              <Input type="email" {...register('email')} disabled={loading} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label>পাসওয়ার্ড *</Label>
              <Input type="password" {...register('password')} disabled={loading} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>বিভাগ *</Label>
              <Select onValueChange={onDivisionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="বিভাগ" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {getBengaliName(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>জেলা *</Label>
              <Select onValueChange={onDistrictChange}>
                <SelectTrigger>
                  <SelectValue placeholder="জেলা" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {getBengaliName(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>উপজেলা *</Label>
            <Select onValueChange={onUpazilaChange}>
              <SelectTrigger>
                <SelectValue placeholder="উপজেলা" />
              </SelectTrigger>
              <SelectContent>
                {upazilas.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {getBengaliName(u)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={areaType === 'union'}
                onChange={() => setAreaType('union')}
              />
              ইউনিয়ন
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={areaType === 'pourashava'}
                onChange={() => setAreaType('pourashava')}
              />
              পৌরসভা
            </label>
          </div>
          {areaType === 'union' ? (
            <div>
              <Label>ইউনিয়ন *</Label>
              <Select onValueChange={(v) => setValue('unionName', v, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="ইউনিয়ন" />
                </SelectTrigger>
                <SelectContent>
                  {unions.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {getBengaliName(u)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label>পৌরসভা *</Label>
              <Select
                onValueChange={(v) => setValue('pourashavaName', v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="পৌরসভা" />
                </SelectTrigger>
                <SelectContent>
                  {pourashavas.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {getBengaliName(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> তৈরি হচ্ছে...
              </>
            ) : (
              'অ্যাকাউন্ট খুলুন'
            )}
          </Button>
          <p className="text-sm text-center text-slate-600">
            অ্যাকাউন্ট আছে?{' '}
            <Link to="/login" className="font-medium hover:underline">
              লগইন
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
