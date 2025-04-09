const ongoingRequests = new Map<string, Promise<any>>()

export async function skipRequestWithDeduplication<T>(
  key: string,
  requestFn: () => Promise<T>
) {
  if (ongoingRequests.has(key)) {
    return ongoingRequests.get(key)
  }

  const promise = requestFn()
    .then(result => {
      ongoingRequests.delete(key)

      return result
    })
    .catch(error => {
      ongoingRequests.delete(key)
      throw error
    })

  ongoingRequests.set(key, promise)

  return promise
}
