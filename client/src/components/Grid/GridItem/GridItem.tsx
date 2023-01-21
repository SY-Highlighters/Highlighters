
import LazyImage from "../../Main/LazyImage";

const GridItem = (props: any) => {
  return (
    <div key={props.feedId} className="relative group">
      <div className="overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:aspect-none lg:h-40">
        {/* // 레이지 로딩 적용 */}
        {props.index < 20 ? (
          <img
            src={props.ogImage}
            className="object-cover object-center w-full h-full lg:h-full lg:w-full"
            alt=""
          />
        ) : (
          <LazyImage
            src={props.ogImage}
            className="object-cover object-center w-full h-full lg:h-full lg:w-full"
            // threshold={200}
            // effect="blur"
          />
        )}
        {/* <img
                    src={feed.og.image}
                    className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                  /> */}
      </div>
      <div className="flex justify-between mt-2">
        <div>
          <h3 className="text-sm font-bold text-gray-700">
            <a href={props.url} target="_blank" rel="noreferrer">
              <span aria-hidden="true" className="absolute inset-0" />
              {props.title}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default GridItem;
