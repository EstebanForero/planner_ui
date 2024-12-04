"use client";
import Calendar from "./sections/Calendar";
import Classes from "./sections/Classes";
import NavBar from "./sections/NavBar";

export default function Home() {
  return (
    <div className="w-full h-full">
      <NavBar/>
      <div className="w-full h-full px-8 py-6">
        <Calendar/>
        <Classes/>
      </div>
    </div>
  );
}
