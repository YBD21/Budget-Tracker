import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ActionTab = ({ record }: any) => {
  return (
    <div className="w-full flex justify-between gap-4">
      {/* Edit */}
      <button
        className="py-2 px-3 bg-black rounded-lg"
        onClick={() => console.log(record.key)}
        // onClick={() => handleEdit(entry)}
      >
        <EditIcon className="scale-125 text-white pointer-events-none" />
      </button>

      {/* Delete */}
      <button
        className="py-2 px-3 bg-red-900 rounded-lg"
        // onClick={() => handleDelete(entry)}
      >
        <DeleteIcon className="scale-125 text-white pointer-events-none" />
      </button>
    </div>
  );
};

export default ActionTab;
