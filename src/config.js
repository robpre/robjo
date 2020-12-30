const search = (window?.location?.search || '').slice(1);

export const config = {
  debugClient: search.includes('nodebug') ? false : process.env.NODE_ENV === "development",
};
