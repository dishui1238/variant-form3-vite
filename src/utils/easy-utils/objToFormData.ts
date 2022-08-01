/**
 * @description 将js对象转formdata
 * @param obj 需要转换的对象
 * @returns Formdata
 */
 export function objToFormData(obj: {[Key: string]: any}) {
  const formData = new FormData()
  Object.keys(obj).forEach(key => {
    if (obj[key] instanceof Array) {
      obj[key].forEach((item: any) => {
        formData.append(key, item)
      })
      return
    }
    formData.append(key, obj[key])
  })
  return formData
}
