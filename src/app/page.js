import Image from "next/image";
import Navbar from "./component/Navbar";

export default function Home() {
  return (
    <>
      <Navbar/>
      <div className="w-full h-screen bg-white text-gray-900">
        <h1 className="text-center text-4xl mt-10 font-bold">Welcome to Application</h1>
      
      </div>
    </>
  );
}
