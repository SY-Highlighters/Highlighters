import * as React from "react";

interface ILazyImage {
  src: string;
  className: string;
}

const LazyImage: React.FC<ILazyImage> = (
  { src }: any,
  { className }: any
): JSX.Element => {
  // state
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // 실제 화면에 보여지고 있는지 여부를 확인

  // ref
  const imgRef = React.useRef<HTMLImageElement>(null); // 이미지 태그 요소
  const observer = React.useRef<IntersectionObserver>(); // IntersectionObserver 변수

  // useEffect
  React.useEffect(() => {
    observer.current = new IntersectionObserver(intersectionOberserver); // 인스턴스 생성
    imgRef.current && observer.current.observe(imgRef.current); // 이미지 태그 관찰 시작
  }, []);

  // IntersectionObserver 설정
  const intersectionOberserver = (
    entries: IntersectionObserverEntry[],
    io: IntersectionObserver
  ) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 관찰되고 있는 entry가 보여지게 된 다면
        io.unobserve(entry.target); // 관찰 종료
        setIsLoading(true); // 로딩 체크
      }
    });
  };

  return (
    // 화면에 보여지기 전이라면 NoImage, 화면에 보여지고 있다면 src에 해당하는 이미지
    <img className={className} ref={imgRef} src={isLoading ? src : "NoImage"} />
  );
};

export default LazyImage;
