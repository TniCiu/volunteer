
/*
* Simple method to Convert a String to Slug
* Tham khảo thêm kiến thức ở đây: https://byby.dev/js-slugify-string

*/
export const slugify = (val) => {
  if (!val) return ''
  return val
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

}