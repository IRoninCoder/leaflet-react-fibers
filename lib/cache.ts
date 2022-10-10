
const items = new Map<any, any>()

/** Get an item from a memory cache */
export const Get = <K, V>(key: K): V => {
  return items.get(key)
}

/** Add an item to a memory cache */
export const Add = <K, V>(key: K, value: V): void => {
  items.set(key, value)
}

/** Remove an item from a memory cache */
export const Remove = <K>(key: K): void => {
  items.delete(key)
}
