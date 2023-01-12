import { useEffect, useState } from "react";

export default function ColorButton(props: any) {
  return (
    <button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 w-15">
      Red
    </button>
  );
}
