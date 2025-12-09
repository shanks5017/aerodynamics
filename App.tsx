import React, { useState } from 'react';
import { Plane, Wind, Activity, Layers } from 'lucide-react';
import { formulas } from './services/physics';
import { FormulaCard } from './components/FormulaCard';

const App: React.FC = () => {
  const [activeFormulaId, setActiveFormulaId] = useState<string>(formulas[0].id);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 selection:bg-sky-500/30">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-sky-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-violet-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header Section */}
        <header className="mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-500/20 text-sky-400">
                <Plane size={20} />
            </div>
            <span className="text-xs font-mono text-sky-500/60 uppercase tracking-widest">AeroDynamics v1.1</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6">
            Aircraft <br />
            <span className="font-serif-math italic text-zinc-500">Performance</span> Calculator
          </h1>
          
          <p className="max-w-xl text-zinc-400 text-lg leading-relaxed">
            Execute critical flight formulas for density, altitude, and aerodynamics. 
            Analyze results with integrated AI intelligence.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="space-y-16">
            
            {/* Atmosphere Section */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <Wind size={18} className="text-zinc-600" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Atmospheric State</h2>
                    <div className="h-px flex-1 bg-zinc-900" />
                </div>
                <div className="space-y-6">
                    {formulas.slice(0, 2).map(formula => (
                        <FormulaCard 
                            key={formula.id} 
                            formula={formula} 
                            isActive={activeFormulaId === formula.id}
                            onActivate={() => setActiveFormulaId(formula.id)}
                        />
                    ))}
                </div>
            </section>

            {/* Aerodynamics Section */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <Activity size={18} className="text-zinc-600" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Flight Forces</h2>
                    <div className="h-px flex-1 bg-zinc-900" />
                </div>
                <div className="space-y-6">
                    {formulas.slice(2, 4).map(formula => (
                        <FormulaCard 
                            key={formula.id} 
                            formula={formula} 
                            isActive={activeFormulaId === formula.id}
                            onActivate={() => setActiveFormulaId(formula.id)}
                        />
                    ))}
                </div>
            </section>

             {/* Advanced Drag Section */}
             <section>
                <div className="flex items-center gap-3 mb-8">
                    <Layers size={18} className="text-zinc-600" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Drag Analysis & Efficiency</h2>
                    <div className="h-px flex-1 bg-zinc-900" />
                </div>
                <div className="space-y-6">
                    {formulas.slice(4, 8).map(formula => (
                        <FormulaCard 
                            key={formula.id} 
                            formula={formula} 
                            isActive={activeFormulaId === formula.id}
                            onActivate={() => setActiveFormulaId(formula.id)}
                        />
                    ))}
                </div>
            </section>

        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-zinc-900 text-center">
            <p className="text-zinc-600 text-sm font-mono">
                Designed for precision. Powered by Gemini.
            </p>
        </footer>

      </div>
    </div>
  );
};

export default App;