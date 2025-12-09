import React, { useState, useMemo, useEffect } from 'react';
import { FormulaConfig } from '../types';
import { Sparkles, ArrowRight, Info } from 'lucide-react';
import { explainAerodynamics } from '../services/geminiService';

interface FormulaCardProps {
  formula: FormulaConfig;
  isActive: boolean;
  onActivate: () => void;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ formula, isActive, onActivate }) => {
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    formula.inputs.forEach(inp => {
      initial[inp.id] = inp.defaultValue;
    });
    return initial;
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Calculate immediately when inputs change
  const result = useMemo(() => {
    return formula.calculate(inputs);
  }, [formula, inputs]);

  const handleInputChange = (id: string, value: string) => {
    const numVal = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [id]: isNaN(numVal) ? 0 : numVal
    }));
    // Reset AI insight when inputs change significantly
    if (aiInsight) setAiInsight(null);
  };

  const handleGetInsight = async () => {
    setLoadingAi(true);
    const insight = await explainAerodynamics(formula.title, inputs, result, formula.resultUnit);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  // Render LaTeX-like formula string nicely
  const renderFormulaText = (text: string) => {
    // Simple parser to italicize variables and handle fractions visually
    // This avoids heavy KaTeX dependency while keeping the aesthetic
    return (
      <div className="font-serif-math text-xl md:text-2xl tracking-wide text-zinc-300 my-4">
        {text.split('=').map((part, i) => (
            <span key={i}>
                {i > 0 && <span className="mx-2 text-zinc-500">=</span>}
                {part}
            </span>
        ))}
      </div>
    );
  };

  return (
    <div 
      onClick={onActivate}
      className={`
        relative overflow-hidden transition-all duration-500 ease-in-out border rounded-2xl p-6 md:p-8
        ${isActive 
          ? 'bg-zinc-900/50 border-zinc-700 shadow-2xl scale-[1.01]' 
          : 'bg-zinc-950/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 cursor-pointer opacity-80 hover:opacity-100'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className={`text-2xl font-bold mb-1 flex items-center gap-2 ${formula.color}`}>
            {formula.title}
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
            {formula.description}
          </p>
        </div>
        {isActive && (
           <div className={`p-2 rounded-full bg-zinc-800/50 text-zinc-400`}>
             <Info size={16} />
           </div>
        )}
      </div>

      {/* Formula Display */}
      <div className="mb-8 pl-4 border-l-2 border-zinc-800">
         {renderFormulaText(formula.latex)}
      </div>

      {/* Content - Only visible/expanded if active */}
      <div className={`transition-all duration-500 overflow-hidden ${isActive ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Inputs */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Parameters</h3>
            {formula.inputs.map((inp) => (
              <div key={inp.id} className="group">
                <div className="flex justify-between items-baseline mb-1">
                  <label className="text-sm text-zinc-300 font-medium flex items-center gap-2">
                    <span className="font-serif-math italic text-zinc-500">{inp.symbol}</span>
                    {inp.label}
                  </label>
                  <span className="text-xs text-zinc-600 font-mono">{inp.unit}</span>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        value={inputs[inp.id]}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all font-mono"
                    />
                </div>
              </div>
            ))}
          </div>

          {/* Result & Actions */}
          <div className="flex flex-col justify-between bg-zinc-950/50 rounded-xl p-6 border border-zinc-800/50">
             <div>
                 <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Calculated Result</h3>
                 <div className="flex items-baseline gap-2">
                     <span className={`text-4xl md:text-5xl font-mono font-light tracking-tighter ${formula.color}`}>
                        {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </span>
                     <span className="text-xl text-zinc-500 font-serif-math">{formula.resultUnit}</span>
                 </div>
             </div>

             <div className="mt-8">
                {/* AI Insight Section */}
                {aiInsight ? (
                    <div className="animate-fade-in bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <Sparkles size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">AI Analysis</span>
                        </div>
                        <p className="text-sm text-indigo-200 leading-relaxed">
                            {aiInsight}
                        </p>
                    </div>
                ) : (
                    <button 
                        onClick={handleGetInsight}
                        disabled={loadingAi}
                        className="w-full group relative flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg transition-all border border-zinc-800"
                    >
                        {loadingAi ? (
                             <span className="animate-pulse">Analyzing Flight Data...</span>
                        ) : (
                            <>
                                <Sparkles size={16} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                <span>Get Performance Insight</span>
                            </>
                        )}
                    </button>
                )}
             </div>
          </div>
        </div>

      </div>

        {/* Expand hint if inactive */}
        {!isActive && (
            <div className="mt-4 flex items-center text-xs text-zinc-600 uppercase tracking-widest gap-2">
                <span>Select to calculate</span>
                <ArrowRight size={12} />
            </div>
        )}
    </div>
  );
};
