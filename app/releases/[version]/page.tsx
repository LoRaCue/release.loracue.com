import { fetchReleaseIndex, fetchManifests } from '@/lib/releases';
import { notFound } from 'next/navigation';
import { SignatureStatus } from '@/components/SignatureStatus';
import { Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
    const releases = await fetchReleaseIndex();
    return releases.releases.map((release) => ({
        version: release.version,
    }));
}

export default async function ReleasePage({ params }: { params: Promise<{ version: string }> }) {
    const { version } = await params;
    const index = await fetchReleaseIndex();
    const release = index.releases.find(r => r.version === version);

    if (!release) {
        notFound();
    }

    let manifest = null;
    try {
        manifest = await fetchManifests(release.manifests_url);
    } catch (e) {
        console.error('Failed to fetch manifest', e);
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">v{release.version}</h1>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                        <span>{new Date(release.published_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">{release.release_type}</span>
                        <span>•</span>
                        <SignatureStatus verified={true} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Downloads</h2>
                    <div className="grid gap-4">
                        {release.models.map(model => (
                            <div key={model.model} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{model.model}</h3>
                                    <p className="text-sm text-gray-500">{model.board_id}</p>
                                </div>
                                <a
                                    href={model.download_url}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <Download className="w-5 h-5" />
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                    <h2>Release Notes</h2>
                    {release.release_notes ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{release.release_notes}</ReactMarkdown>
                    ) : (
                        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-sm">
                            {release.changelog_summary}
                        </pre>
                    )}

                    {manifest && (
                        <>
                            <h2 className="mt-8">Technical Details</h2>
                            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                {JSON.stringify(manifest, null, 2)}
                            </pre>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
