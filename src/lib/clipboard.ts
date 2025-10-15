export async function copyToClipboard(text: string) {
  try {
    return await navigator.clipboard.writeText(text)
  } catch (err) {
    console.warn('Clipboard copy failed...', err)
  }
}
