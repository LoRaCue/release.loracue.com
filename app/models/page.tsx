import Image from 'next/image';

const models = [
    {
        id: 'lc-alpha',
        name: 'LC-Alpha',
        description: 'Standard model based on Heltec V3 with single button interface.',
        specs: ['Heltec V3', '1 Button', 'OLED Display'],
        image: '/models/alpha.png' // Placeholder
    },
    {
        id: 'lc-alpha-plus',
        name: 'LC-Alpha+',
        description: 'Enhanced model based on Heltec V3 with dual button interface.',
        specs: ['Heltec V3', '2 Buttons', 'OLED Display'],
        image: '/models/alpha-plus.png'
    },
    {
        id: 'lc-beta',
        name: 'LC-Beta',
        description: 'Low-power model using LilyGO T3 with E-Paper display.',
        specs: ['LilyGO T3', 'E-Paper', 'Long Battery Life'],
        image: '/models/beta.png'
    },
    {
        id: 'lc-gamma',
        name: 'LC-Gamma',
        description: 'Advanced model using LilyGO T5 with Touch interface.',
        specs: ['LilyGO T5', 'Touch Screen', 'High Performance'],
        image: '/models/gamma.png'
    }
];

export default function ModelsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Supported Models</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
                LoRaCue supports a variety of hardware platforms to suit different needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {models.map(model => (
                    <div key={model.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            {/* Placeholder image */}
                            <span>{model.name} Image</span>
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{model.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{model.description}</p>

                            <div className="flex flex-wrap gap-2">
                                {model.specs.map(spec => (
                                    <span key={spec} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
