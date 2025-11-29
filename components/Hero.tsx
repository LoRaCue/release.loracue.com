import Image from 'next/image';
import Link from 'next/link';
import { fetchReleaseIndex } from '@/lib/releases';
import { ArrowRight, Download, ShieldCheck } from 'lucide-react';

export async function Hero() {
    const releases = await fetchReleaseIndex();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 py-24 lg:py-32">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="container relative mx-auto px-4">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Image
                            src="/logo.svg"
                            alt="LoRaCue Logo"
                            width={100}
                            height={100}
                            className="w-24 h-24 drop-shadow-lg"
                            priority
                        />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        LoRaCue <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Firmware</span>
                    </h1>

                    <p className="text-xl text-blue-100/80 mb-10 max-w-2xl leading-relaxed">
                        Enterprise-grade firmware for LoRa presentation remotes.
                        Secure, reliable, and built for professionals.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-12">
                        {releases.latest_stable && (
                            <Link href={`/releases/${releases.latest_stable}`} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-blue-900/20">
                                <Download className="w-5 h-5" />
                                Download Stable v{releases.latest_stable}
                            </Link>
                        )}
                        {releases.latest_prerelease && (
                            <Link href={`/releases/${releases.latest_prerelease}`} className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-800/50 text-white rounded-full font-bold text-lg backdrop-blur-sm border border-blue-700 hover:bg-blue-800/70 transition-all">
                                Try Beta v{releases.latest_prerelease}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-8 text-blue-200/60 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Ed25519 Signed
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                            Latest: {new Date(releases.generated_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
