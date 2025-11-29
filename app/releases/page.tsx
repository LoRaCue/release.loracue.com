import { fetchReleaseIndex } from '@/lib/releases';
import { ReleaseCard } from '@/components/ReleaseCard';

export default async function ReleasesPage() {
    const releases = await fetchReleaseIndex();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">All Releases</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {releases.releases.map(release => (
                    <ReleaseCard key={release.version} release={release} />
                ))}
            </div>
        </div>
    );
}
