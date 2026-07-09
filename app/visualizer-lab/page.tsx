import { getEntryStats } from '@/lib/entries';
import VisualizerLabClient from './VisualizerLabClient';

export default async function VisualizerLabPage() {
  const stats = await getEntryStats();

  return <VisualizerLabClient totalCount={stats.count} />;
}
