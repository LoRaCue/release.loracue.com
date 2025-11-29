import { Hero } from "@/components/Hero";
import { ReleaseCard } from "@/components/ReleaseCard";
import { fetchReleaseIndex } from "@/lib/releases";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const releases = await fetchReleaseIndex();
  const recentReleases = releases.releases.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-20">
      <Hero />

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Releases</h2>
          <Link href="/releases" className="flex items-center gap-2 text-blue-600 font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentReleases.map(release => (
            <ReleaseCard key={release.version} release={release} />
          ))}
        </div>
      </section>
    </div>
  );
}
