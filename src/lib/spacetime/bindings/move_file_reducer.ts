const MoveFileReducer = {
  schema: {
    name: "move_file",
    args: [
        { name: "src", type: { "type": "string" } },
        { name: "dst", type: { "type": "string" } }
    ]
  }
};
export default MoveFileReducer;
