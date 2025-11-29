import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';

export function Navigation() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
                    <Image
                        src="/logo.svg"
                        alt="LoRaCue Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-lg"
                    />
                    LoRaCue
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/releases" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Releases
                    </Link>
                    <Link href="/models" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Models
                    </Link>
                    <a
                        href="https://github.com/LoRaCue/loracue"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </nav>
    );
}
