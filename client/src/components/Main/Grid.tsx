import GridSkeleton from "../UI/GridSkeleton";
import Gallery from "./Gallery";
import { Suspense, lazy } from "react";
// const Gallery = lazy(() => import("./Gallery"));
export function Grid() {
  return (
    // 사진첩 만들기
    <div className="box-border w-full h-full gap-3 p-5 xl:overflow-hidden xl:px-16 xl:flex-row xl:flex ">
      {/* 사진 갤러리 만들기 */}
      <div className="w-full bg-white rounded-lg shadow-md">
        <Gallery></Gallery>
      </div>
    </div>
  );
}
