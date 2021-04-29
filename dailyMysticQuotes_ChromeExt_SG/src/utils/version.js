/*global chrome*/

const getVersion = async () => {
  let data = await chrome.management.getSelf();
  return data.version;
};

export default getVersion;
