// const modules = import.meta.globEager('./*.vue')

// export default {
//   install(app) {
//     for (const path in modules) {
//       let cname = modules[path].default.name
//       app.component(cname, modules[path].default)
//     }
//   }
// }

let comps = {}

const modules = import.meta.globEager('./*.vue')
for (const path in modules) {
  let cname = modules[path].default.name
  comps[cname] = modules[path].default
}

export default comps

