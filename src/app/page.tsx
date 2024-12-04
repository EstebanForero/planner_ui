"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "./sections/Calendar";
import Classes from "./sections/Classes";
import NavBar from "./sections/NavBar";

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full">
        <NavBar/>
        <div className="w-full h-full px-8 py-6">
          <Calendar/>
          <Classes/>
        </div>
      </div>
    </QueryClientProvider>
  );
}
