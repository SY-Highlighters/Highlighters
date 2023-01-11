export function TagItem(props: any) {
  // const tagClickHandler = () => {
  //   if (props.onFunc) {
  //     tagAdd();
  //   } else {

  //   };
  // };
  // async function tagAdd() {

  // }

  return (
    <button className="mt-1">
      <span className="inline-flex items-center mr-1 px-1.5 py-0.2 rounded-full text-xs font-medium bg-sky-100 text-sky-800 hover:bg-sky-300">
        #{props.name}
      </span>
    </button>
  );
}
