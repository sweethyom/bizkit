import { ReactNode, useState } from 'react';
import { Tooltip } from './Tooltip';

export const TooltipSection = ({ children, info }: { children: ReactNode; info: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className='relative w-fit'
    >
      {children}

      {showTooltip && <Tooltip>{info}</Tooltip>}
    </div>
  );
};
