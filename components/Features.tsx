
import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      title: "Instant Background Removal",
      description: "One-click segmentation using deep neural networks. No green screen required, even for complex hair or textures.",
      icon: "🎭",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      title: "AI Script-to-Video",
      description: "Convert written prompts into full video edits complete with stock footage, transitions, and generated voiceovers.",
      icon: "📝",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Auto-Style Transfer",
      description: "Apply the cinematic look of any famous film or custom artistic style to your footage with pixel-perfect consistency.",
      icon: "🎨",
      gradient: "from-orange-400 to-red-500"
    }
  ];

  return (
    <section id="features" className="px-6 py-24 bg-zinc-950/50 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Professional Tools, <span className="text-blue-500">Supercharged.</span></h2>
          <p className="text-zinc-500">Unleash creativity with features that were impossible until now.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 rounded-3xl glass hover:border-white/20 transition-all hover:-translate-y-2 cursor-default">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{f.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
