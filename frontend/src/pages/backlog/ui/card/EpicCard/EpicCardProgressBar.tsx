export const EpicCardProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className='bg-gray-3 relative ml-auto flex h-2 w-full max-w-[33%] overflow-hidden rounded-full'>
      <div
        className='bg-primary inset-0 h-full transition-transform'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
