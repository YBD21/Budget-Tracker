import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ActionTab = ({ record }: any) => {
  return (
    <div className="w-full flex justify-between gap-4">
      {/* Edit */}
      <button
        className="py-1.5 px-2.5 bg-black rounded-lg focus:ring-black active:ring-black hover:ring-black dark:bg-neutral-600 dark:focus:ring-neutral-400 dark:active:ring-neutral-400 dark:hover:ring-neutral-400 dark:border dark:border-neutral-400 hover:ring-2 hover:ring-opacity-50  focus:outline-none focus:ring-2  focus:ring-opacity-50 active:ring-4 active:ring-opacity-50"
        onClick={() => console.log(record.key)}
        // onClick={() => handleEdit(entry)}
      >
        <EditIcon className="scale-110 text-white pointer-events-none" />
      </button>

      {/* Delete */}
      <button
        className="py-1.5 px-2.5 bg-red-900 dark:bg-red-800 rounded-lg focus:ring-red-500 active:ring-red-500 hover:ring-red-400 dark:border dark:border-red-800 hover:ring-2 hover:ring-opacity-50  focus:outline-none focus:ring-2  focus:ring-opacity-50 active:ring-4 active:ring-opacity-50"
        // onClick={() => handleDelete(entry)}
        onClick={() => console.log(record.key)}
      >
        <DeleteIcon className="scale-110 text-white pointer-events-none" />
      </button>
    </div>
  );
};

export default ActionTab;
