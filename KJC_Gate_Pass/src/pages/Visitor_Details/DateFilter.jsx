// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { format } from 'date-fns';

// const DateFilter = () => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Sample data
//   const data = [
//     { id: 1, name: 'John Doe', date: '2024-08-25' },
//     { id: 2, name: 'Jane Smith', date: '2024-08-27' },
//     { id: 3, name: 'Sam Johnson', date: '2024-08-26' },
//     // Add more data as needed
//   ];

//   // Function to filter data based on selected date
//   const filteredData = selectedDate
//     ? data.filter(item => format(new Date(item.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
//     : data;

//   return (
//     <div>
//       <DatePicker
//         selected={selectedDate}
//         onChange={(date) => setSelectedDate(date)}
//         dateFormat="yyyy-MM-dd"
//         placeholderText="Select a date"
//       />
      
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map(item => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.name}</td>
//               <td>{item.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DateFilter;
