export const getSearchParams = (url: string) => {
  // Create a params object
  // biome-ignore lint/style/useConst: <explanation>
  let params = {} as Record<string, string>

  new URL(url).searchParams.forEach((val, key) => {
    params[key] = val
  })

  return params
}
