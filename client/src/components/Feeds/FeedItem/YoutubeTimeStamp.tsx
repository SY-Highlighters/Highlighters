const YoutubeTimeStamp = (props: any) => {
  // min, sec
  let time = Math.floor(props.time);
  let min =
    Math.floor(time / 60) < 10
      ? `0${Math.floor(time / 60)}`
      : Math.floor(time / 60);
  let sec = time % 60 < 10 ? `0${time % 60}` : time % 60;

  return (
    <span
      onClick={() => {
        props.setTime(time);
      }}
      className="cursor-pointer inline-flex items-center mr-2 px-3 py-0.5 rounded-md shadow-md text-sm font-medium opacity-80 bg-sky-500 hover:bg-sky-700 "
    >
      <span className="text-white">
        {min}:{sec}
      </span>
      {/* <button onClick={delClickHandler}></button> */}
    </span>
  );
};

export default YoutubeTimeStamp;
