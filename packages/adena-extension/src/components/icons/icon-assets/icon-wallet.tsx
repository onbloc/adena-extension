import React, { ReactElement } from 'react';

const IconWallet = ({ className }: { className: string }): ReactElement => {
  return (
    <svg
      className={className}
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        className='icon-default'
        d='M2.52432 9.64346C2.23475 8.57752 2.86411 7.47866 3.93005 7.18909L20.4736 2.69482C21.7555 2.34656 23.0145 3.3218 22.9978 4.65011L22.9019 12.2414C22.8911 13.1016 22.3313 13.8586 21.5119 14.1209L7.15422 18.7174C6.06893 19.0649 4.91311 18.4367 4.61437 17.337L2.52432 9.64346Z'
        fill='#646486'
      />
      <rect
        className='icon-primary'
        x='1.5'
        y='7.50003'
        width='25'
        height='18'
        rx='2.5'
        fill='#646486'
        stroke='#212128'
      />
      <circle className='icon-default' cx='23' cy='17' r='1' fill='#212128' />
    </svg>
  );
};

export default IconWallet;
