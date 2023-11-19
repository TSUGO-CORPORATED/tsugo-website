// import React, { useState } from 'react';

// export default function UserClientAppointment() {
//     const [title, setTitle] = useState('');
//     const [when, setWhen] = useState('');
//     const [where, setWhere] = useState('');
//     const [what, setWhat] = useState('');
//     const [language, setLanguage] = useState('');

//     const handleSubmit = (event) => {
//         event.preventDefault();
//     };

//     return (
//         <div>
//             <h1>Make an Appointment</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Title:</label>
//                     <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>When:</label>
//                     <input type="text" value={when} onChange={(e) => setWhen(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>Where:</label>
//                     <input type="text" value={where} onChange={(e) => setWhere(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>What:</label>
//                     <input type="text" value={what} onChange={(e) => setWhat(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>Which Language:</label>
//                     <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
//                 </div>
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// }