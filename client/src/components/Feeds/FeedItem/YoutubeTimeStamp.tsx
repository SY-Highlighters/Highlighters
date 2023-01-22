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
        className="text-indigo-500 font-bold cursor-pointer items-center px-1 py-0.5 rounded-md text-sm opacity-80 bg-indigo-100 hover:bg-blue-200"
      >
        {min}:{sec}
      </span>
  );
};

export default YoutubeTimeStamp;
