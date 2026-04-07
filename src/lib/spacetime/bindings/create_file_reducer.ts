import { CreateFileArgs } from "./vfs_reducer_args";

const CreateFileReducer = {
  schema: {
    name: "create_file",
    args: [
        { name: "path", type: { "type": "string" } },
        { name: "content", type: { "type": "string" } }
    ]
  }
};

export default CreateFileReducer;
