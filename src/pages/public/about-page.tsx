import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

interface AboutItem {
  key: string;
  title?: string;
  content: string;
}

export function AboutPage() {
  const [items, setItems] = useState<Record<string, AboutItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/about')
      .then((r) => setItems(r.data?.data?.data ?? {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-12 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">{items.platform_name?.content || 'OPORADH'}</h1>
      <div className="space-y-6">
        {items.mission && (
          <div>
            <h2 className="text-xl font-semibold mb-2">আমাদের লক্ষ্য</h2>
            <p className="text-slate-600">{items.mission.content}</p>
          </div>
        )}
        {items.vision && (
          <div>
            <h2 className="text-xl font-semibold mb-2">ভিশন</h2>
            <p className="text-slate-600">{items.vision.content}</p>
          </div>
        )}
        {items.why_oporadh && (
          <div>
            <h2 className="text-xl font-semibold mb-2">কেন OPORADH</h2>
            <p className="text-slate-600">{items.why_oporadh.content}</p>
          </div>
        )}
        {items.how_reporting_works && (
          <div>
            <h2 className="text-xl font-semibold mb-2">রিপোর্ট কীভাবে কাজ করে</h2>
            <p className="text-slate-600">{items.how_reporting_works.content}</p>
          </div>
        )}
        {items.privacy_policy && (
          <div>
            <h2 className="text-xl font-semibold mb-2">প্রাইভেসি</h2>
            <p className="text-slate-600">{items.privacy_policy.content}</p>
          </div>
        )}
        {items.safety_guidelines && (
          <div>
            <h2 className="text-xl font-semibold mb-2">নিরাপত্তা</h2>
            <p className="text-slate-600">{items.safety_guidelines.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
