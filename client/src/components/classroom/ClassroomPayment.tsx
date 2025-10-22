// import React from "react";
// import axios from "axios";

// const ClassroomPayment = ({ course }) => {
//   const handlePayment = async () => {
//     // 1. Create order on backend
//     const { data } = await axios.post("/payment/order", {
//       amount: course.price,
//     });

//     if (!data.success) return alert("Something went wrong!");

//     // 2. Razorpay options
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID, // put your key in .env
//       amount: data.order.amount,
//       currency: "INR",
//       name: course.title,
//       description: "Course Enrollment",
//       order_id: data.order.id,
//       handler: async (response) => {
//         const verify = await axios.post("http://localhost:5000/api/payment/verify", response);
//         if (verify.data.success) {
//           alert("Payment successful! ");
//           // You can now enroll the user in the course
//         }
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     // 3. Open Razorpay window
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div className="border p-4 rounded shadow-md flex flex-col gap-2">
//       <h2 className="font-semibold">{course.title}</h2>
//       <p>₹{course.price}</p>
//       <button
//         onClick={handlePayment}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Enroll Now
//       </button>
//     </div>
//   );
// };

// export default ClassroomPayment;
