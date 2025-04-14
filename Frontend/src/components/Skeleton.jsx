import React, { useState } from 'react'

function Skeleton() {
    const arr=[1,2,3,4,5]; 
    return (
        <>
        {arr.map((item) => (
            <div className='flex items-center justify-center w-full'>
            <div className='flex items-center justify-start sm:justify-center p-4 w-full h-20 animate-pulse'>
                <div className='flex items-center justify-between gap-2 w-full sm:w-[60%]'>
                    <div className='flex items-center justify-between gap-2'>
                        <div className='size-10 sm:size-15 rounded-full bg-gray-300'></div>
                        <div className='flex flex-col gap-2'>
                            <div className='h-4 sm:h-5 w-24 sm:w-36 bg-gray-300 rounded'></div>
                            <div className='h-3 w-20 sm:w-28 bg-gray-300 rounded'></div>
                        </div>
                    </div>
                    <div className='h-8 sm:h-10 w-16 sm:w-24 bg-gray-300 rounded'></div>
                </div>
            </div>
        </div>
        ))}
        </>
    )
}

export default Skeleton