// import React from 'react'
// import noDataImage from '../assets/nothing here yet.webp';

// const NoData = () => {
//     return (
//         <div className="mt-30">
//             <img
//                 src={noDataImage}
//                 alt="no data"
//                 className="mx-auto w-52 h-52  object-contain"
//             />

//             <p className="text-center mt-3 text-gray-600 text-lg font-medium">
//                 No Data
//             </p>
//         </div>
//     )
// }

// export default NoData


// import React from 'react'
// import noDataImage from '../assets/nothing here yet.webp';

// const NoData = () => {
//     return (
//         <div className="mt-20 flex flex-col items-center">

//             {/* Image animation */}
//             <img
//                 src={noDataImage}
//                 alt="no data"
//                 className="w-52 h-52 object-contain animate-[float_3s_ease-in-out_infinite]"
//             />

//             {/* Text animation */}
//             <p className="text-center mt-4 text-gray-600 text-lg font-semibold animate-fadeIn">
//                 No Data
//             </p>
//         </div>
//     )
// }

// export default NoData


import React from 'react'
import noDataImage from '../assets/nothing here yet.webp';

const NoData = () => {
    return (
        <div className="mt-20 flex flex-col items-center">

            {/* Image animation */}
            <img
                src={noDataImage}
                alt="no data"
                className="
                    object-contain 
                    animate-[float_3s_ease-in-out_infinite]

                    h-52
                    w-40        /* mobile */
                    sm:w-44     /* sm */
                    md:w-48     /* tablet */
                    lg:w-52     /* laptop */
                    xl:w-52     /* desktop — same as original */
                "
            />

            {/* Text animation */}
            <p className="text-center mt-4 text-gray-600 text-lg font-semibold animate-fadeIn">
                No Data
            </p>
        </div>
    )
}

export default NoData
