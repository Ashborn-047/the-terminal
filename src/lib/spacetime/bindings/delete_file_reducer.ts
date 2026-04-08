const DeleteFileReducer = {
  schema: {
    name: "delete_file",
    args: [
        { name: "path", type: { "type": "string" } }
    ]
  }
};
export default DeleteFileReducer;
