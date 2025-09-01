import React, { useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'

function CategoryPage() {

  const [openUploadCategory, setOpenUploadCategory] = useState(false);


  return (
    <section>
      <div className='p-4 font-semibold shadow-md flex items-center justify-between'>
        <h2>Category</h2>
        <button onClick={() =>  setOpenUploadCategory(true) } className='text-sm rounded-md py-1 px-3   bg-blue-500 text-white hover:bg-blue-600' >Add Category</button>
      </div>

      {openUploadCategory && (
        <UploadCategoryModel close={() => setOpenUploadCategory(false)} />
      )}

     
    </section>
  )
}

export default CategoryPage
