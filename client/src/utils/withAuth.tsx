// "use client";
// import { redirect } from "next/navigation";
// import { useStateValue } from "@/context/StateProvider";
// import { useEffect } from "react";

// const withAuth = (Component) => {
//   return function WithAuth(props) {
//     // import userData from contexProvider or dataLayer
//     const [{ userData }] = useStateValue();
//     const role = userData?.role;

//     useEffect(() => {
//       if (role === "Client") {
//         redirect("/Home");
//       } else {
//         redirect("/");
//       }
//     }, []);

//     if (!role) {
//       return null;
//     }

//     return <Component {...props} />;
//   };
// };

// export default withAuth;
