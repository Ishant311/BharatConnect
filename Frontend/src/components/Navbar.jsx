import React from 'react'
import Logo from './Logo'

function Navbar() {
  return (
    <div className='fixed top-0 left-0 right-0 flex items-center justify-between w-full p-4 bg-white shadow-md'>
        <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'><Logo/></h1>
            {/* <input type='text' placeholder='Search...' className='p-2 border rounded-lg' /> */}
        </div>
        <div className='items-center gap-4 hidden sm:flex'>
        </div>
    </div>
  )
}

export default Navbar