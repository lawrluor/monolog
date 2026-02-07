// Promise.allSettled() is not supported in React-Native, so we can implement our own allSettled
// meaning each individual video's data either successfully fetched or failed.
// Only then will we return final video data, recorded_sections
// This ensures that if any videos fail, the rest will still be loaded

export const allSettled = <T,>(promises: Promise<T>[]) => {
  return Promise.all(promises.map((promise: Promise<T>) => {
    promise
      .then((value: T) => { return value })
      .catch((error: Error) => { console.log("[ERROR] VideosContext: allSettled:", error) })
  }));
}