const WriteFileReducer = {
  schema: {
    name: "write_file",
    args: [
        { name: "path", type: { "type": "string" } },
        { name: "content", type: { "type": "string" } },
        { name: "append", type: { "type": "boolean" } }
    ]
  }
};
export default WriteFileReducer;
