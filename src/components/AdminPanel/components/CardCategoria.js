import React, { memo } from 'react';

const clampPercentage = (value) => {
  if (Number.isNaN(Number(value))) return 0;
  return Math.max(0, Math.min(100, Number(value)));
};

const CardCategoria = ({
  title,
  percentage,
  itemCount,
  Icon,
  onViewPending,
  badgeClassName,
  progressBarClassName
}) => {
  const normalizedPercentage = clampPercentage(percentage);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700/60 text-gray-100">
            {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
          </span>
          <h4 className="text-lg font-semibold text-gray-100">{title}</h4>
        </div>
        <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${badgeClassName}`}>
          {normalizedPercentage}%
        </span>
      </div>

      <div>
        <div className="w-full overflow-hidden rounded-full bg-gray-700/70 h-2.5">
          <div
            className={`h-full transition-all duration-500 ${progressBarClassName}`}
            style={{ width: `${normalizedPercentage}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          {normalizedPercentage}% completo — {itemCount} itens
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onViewPending}
          className="px-3 py-1.5 text-xs font-medium text-gray-200 border border-gray-600/70 rounded-md transition-colors hover:bg-gray-700/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        >
          Ver pendências
        </button>
      </div>
    </div>
  );
};

export default memo(CardCategoria);













