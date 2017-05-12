import mapd from "./services/mapd"
import createRow from "./charts/row"
import createScatter from "./charts/scatter"

mapd.connect().then(init)

const filters = []

function init (error, con){
  createRow()
  createScatter()
}
