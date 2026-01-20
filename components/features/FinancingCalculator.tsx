import React, { useState } from 'react';
import { Slider } from '../ui/Slider';
import { formatPrice } from '../../services/supabase';

interface FinancingCalculatorProps {
  vehiclePrice: number;
  currency?: string;
  className?: string;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  vehiclePrice,
  currency = 'CHF',
  className = '',
}) => {
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.2)); // 20% default
  const [loanTerm, setLoanTerm] = useState(48); // 48 months default
  const [interestRate, setInterestRate] = useState(3.9); // 3.9% default

  // Calculate monthly payment
  const loanAmount = vehiclePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  
  const monthlyPayment = monthlyInterestRate > 0
    ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
    : loanAmount / loanTerm;

  const totalInterest = (monthlyPayment * loanTerm) - loanAmount;
  const totalCost = vehiclePrice + totalInterest;

  return (
    <div className={`bg-brand-gray/30 border border-white/10 p-6 ${className}`}>
      <h3 className="text-lg font-display font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="M7 15h0M2 9.5h20"></path>
        </svg>
        Financing Calculator
      </h3>

      {/* Vehicle Price Display */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <span className="text-xs uppercase tracking-widest text-brand-muted block mb-1">Vehicle Price</span>
        <span className="text-2xl font-display font-bold text-white">{formatPrice(vehiclePrice, currency)}</span>
      </div>

      {/* Sliders */}
      <div className="space-y-8">
        <Slider
          label="Down Payment"
          min={0}
          max={vehiclePrice}
          step={1000}
          value={downPayment}
          onChange={setDownPayment}
          formatValue={(v) => formatPrice(v, currency)}
        />

        <Slider
          label="Loan Term"
          min={12}
          max={84}
          step={12}
          value={loanTerm}
          onChange={setLoanTerm}
          formatValue={(v) => `${v} months`}
        />

        <Slider
          label="Interest Rate"
          min={1}
          max={12}
          step={0.1}
          value={interestRate}
          onChange={setInterestRate}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
      </div>

      {/* Results */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-brand-muted block mb-1">Loan Amount</span>
            <span className="text-lg text-white font-bold">{formatPrice(loanAmount, currency)}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-brand-muted block mb-1">Total Interest</span>
            <span className="text-lg text-white font-bold">{formatPrice(totalInterest, currency)}</span>
          </div>
        </div>

        {/* Monthly Payment - Highlighted */}
        <div className="bg-brand-yellow/10 border border-brand-yellow/30 p-4 text-center">
          <span className="text-xs uppercase tracking-widest text-brand-yellow block mb-2">
            Estimated Monthly Payment
          </span>
          <span className="text-4xl font-display font-bold text-brand-yellow">
            {formatPrice(Math.round(monthlyPayment), currency)}
          </span>
          <span className="text-brand-yellow/60 text-sm">/month</span>
        </div>

        <div className="mt-4 text-center">
          <span className="text-xs text-brand-muted">
            Total cost: {formatPrice(Math.round(totalCost), currency)}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-brand-muted leading-relaxed">
        * This is an estimate only. Actual rates and payments may vary based on credit approval, 
        down payment, and other factors. Contact us for a personalized quote.
      </p>
    </div>
  );
};

// Compact version for sidebars
export const FinancingCalculatorCompact: React.FC<{
  vehiclePrice: number;
  currency?: string;
  onGetQuote?: () => void;
}> = ({ vehiclePrice, currency = 'CHF', onGetQuote }) => {
  // Simple calculation with defaults
  const downPayment = Math.round(vehiclePrice * 0.2);
  const loanAmount = vehiclePrice - downPayment;
  const loanTerm = 48;
  const interestRate = 3.9 / 100 / 12;
  
  const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) /
    (Math.pow(1 + interestRate, loanTerm) - 1);

  return (
    <div className="bg-brand-gray/20 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest text-brand-muted">Financing from</span>
        <span className="text-xs text-brand-yellow">3.9% APR</span>
      </div>
      
      <div className="text-center mb-4">
        <span className="text-3xl font-display font-bold text-white">
          {formatPrice(Math.round(monthlyPayment), currency)}
        </span>
        <span className="text-brand-muted">/month</span>
      </div>
      
      <p className="text-xs text-brand-muted mb-4 text-center">
        20% down payment, {loanTerm} months
      </p>
      
      {onGetQuote && (
        <button
          onClick={onGetQuote}
          className="w-full py-3 border border-brand-yellow text-brand-yellow text-xs uppercase tracking-widest font-bold hover:bg-brand-yellow hover:text-brand-black transition-colors"
        >
          Get Personalized Quote
        </button>
      )}
    </div>
  );
};
