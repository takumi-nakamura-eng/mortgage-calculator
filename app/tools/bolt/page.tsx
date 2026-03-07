import { permanentRedirect } from 'next/navigation';

export default function BoltLegacyPage() {
  permanentRedirect('/tools/bolt-length');
}
