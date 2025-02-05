import React from 'react';

const BountyWrapper = (props) => {
  return (
    <div className='flex flex-1 flex-col space-y-8 pt-4 pb-8 w-full max-w-[800px] justify-start'>
      <div className='flex flex-col space-y-2 items-center w-full md:border rounded-sm border-gray-700 text-primary pb-8'>
        <h1 className='flex w-full text-2xl justify-center px-12 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm'>
          {props.header}
        </h1>
        {props.children}
      </div>
    </div>
  );
};
export default BountyWrapper;
