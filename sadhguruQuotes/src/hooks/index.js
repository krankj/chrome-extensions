import { useState, useEffect } from "react";
import {
  getFromLocalCache,
  setToLocalCache,
  getFromChromeCache,
  setToChromeCache,
} from "../utils/localstorage";

export const useSemiPersistentState = (key, initState) => {
  const [value, setValue] = useState(getFromLocalCache(key) || initState);
  useEffect(() => {
    setToLocalCache(key, value);
  }, [key, value]);

  return [value, setValue];
};

export const useChromeStorage = (key, initState) => {
  // const [value, setValue] = useState(async () => {
  //   let value = await getFromChromeCache(key);
  //   console.log("Value is", value);
  //   return value || initState;
  // });
  const [value, setValue] = useState(getFromChromeCache(key) || initState);

  useEffect(() => {
    (async function () {
      await setToChromeCache(key, value);
    })();
  }, [key, value]);

  return [value, setValue];
};
