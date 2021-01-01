const search = (window?.location?.search || "").slice(1);

const dev = process.env.NODE_ENV === "development";

export const config = {
  dev,
  debugClient: search.includes("debugpanel"),
};
