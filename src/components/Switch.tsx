import React, { useState } from 'react';

const Switch = ({ isChecked, onChange, isDisabled }: any) => {
  return (
    <label
      className={`flex items-center ${
        isDisabled ? 'cursor-not-allowed	' : 'cursor-pointer'
      }`}
    >
      <div className='relative'>
        <input
          type='checkbox'
          id='toggle'
          className='hidden'
          checked={isChecked}
          onChange={onChange}
          disabled={isDisabled}
        />
        <div
          className={`relative w-12 h-[30px] rounded-full overflow-hidden shadow-inner transition-all duration-300 ease-in-out ${
            isChecked ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
        >
          <div
            className={`absolute w-6 h-6 bg-white rounded-full shadow top-[3px] transition-all duration-300 ease-in-out ${
              isChecked
                ? 'transform translate-x-[88%]'
                : 'transform translate-x-[12%]'
            }`}
          />
        </div>
      </div>
    </label>
  );
};

export default Switch;
