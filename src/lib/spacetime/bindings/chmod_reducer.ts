const ChmodReducer = {
  schema: {
    name: "chmod",
    args: [
        { name: "path", type: { "type": "string" } },
        { name: "mode", type: { "type": "string" } }
    ]
  }
};
export default ChmodReducer;
