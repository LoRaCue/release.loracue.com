import Link from 'next/link';
import { Release } from '@/lib/types';
import { SignatureStatus } from './SignatureStatus';
import { ArrowRight, Download } from 'lucide-react';

export function ReleaseCard({ release }: { release: Release }) {
    return (
        <div className="group relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">v{release.version}</h3>
                        {release.release_type === 'stable' ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">Stable</span>
                        ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full border border-amber-200">Prerelease</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">
                        Released on {new Date(release.published_at).toLocaleDateString()}
                    </p>
                </div>
                <SignatureStatus verified={true} />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {release.supported_boards.map(board => (
                    <span
                        key={board}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800"
                    >
                        {board}
                    </span>
                ))}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                {release.changelog_summary || "No changelog summary available."}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                    {release.models.slice(0, 2).map(model => (
                        <a
                            key={model.model}
                            href={model.download_url}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {model.model}
                        </a>
                    ))}
                </div>

                <Link
                    href={`/releases/${release.version}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 hover:underline"
                >
                    Details <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
