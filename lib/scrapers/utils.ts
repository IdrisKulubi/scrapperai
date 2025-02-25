/* eslint-disable @typescript-eslint/no-explicit-any */
export const rateLimit = <T extends (...args: any[ ]) => Promise<any>>(
  fn: T,
  delay: number
) => {
  let lastInvocation = 0;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();
    const timeSinceLast = now - lastInvocation;
    
    if (timeSinceLast < delay) {
      await new Promise(resolve => setTimeout(resolve, delay - timeSinceLast));
    }

    lastInvocation = Date.now();
    return fn(...args);
  };
}; 