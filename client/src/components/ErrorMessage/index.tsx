type MessageProps = {
  errorName: any;
};

const ErrorMessage = ({ errorName }: MessageProps) => {
  if (errorName)
    return (
      <div className="ml-1 flex flex-row pt-2.5">
        <span className="text-sm text-red-600">{errorName?.message}</span>
      </div>
    );
};

export default ErrorMessage;
