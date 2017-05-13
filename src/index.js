import mapd from "./services/mapd"
import createRow from "./charts/row"
import createScatter from "./charts/scatter"

mapd.connect().then(init)

function init (error, con){
  const row = createRow()
  const scatter = createScatter()

  row.run()
  scatter.run()
}
