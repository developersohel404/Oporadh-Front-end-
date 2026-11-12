import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api, getApiError } from '@/lib/api';
import { CheckCircle2, Loader2, Mail, XCircle } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Content() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>(
    token ? 'loading' : 'pending'
  );
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    api
      .get(`/auth/verify-email?token=${token}`)
      .then((r) => {
        setStatus('success');
        setMsg(r.data.message);
      })
      .catch((e) => {
        setStatus('error');
        setMsg(getApiError(e));
      });
  }, [token]);

  if (status === 'loading')
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>যাচাই হচ্ছে...</p>
        </CardContent>
      </Card>
    );
  if (status === 'success')
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">ইমেইল যাচাই সফল</CardTitle>
          <CardDescription className="text-center">{msg}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to="/login" className="w-full">
            <Button className="w-full">লগইনে যান</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  if (status === 'error')
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-2">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-center">যাচাই ব্যর্থ</CardTitle>
          <CardDescription className="text-center">{msg}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to="/login" className="w-full">
            <Button className="w-full">লগইনে যান</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-center mb-2">
          <Mail className="h-16 w-16 text-blue-500" />
        </div>
        <CardTitle className="text-center">ইমেইল চেক করুন</CardTitle>
        <CardDescription className="text-center">
          আপনার ইমেইলে verification link পাঠানো হয়েছে
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link to="/login" className="w-full">
          <Button variant="outline" className="w-full">
            ফিরে যান
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Content />
    </Suspense>
  );
}
