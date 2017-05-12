function mapd () {
  const connection = new MapdCon()
   .protocol("https")
   .host("metis.mapd.com")
   .port("443")
   .dbName("mapd")
   .user("mapd")
   .password("HyperInteractive")

  function connect () {
    return new Promise((resolve, reject) => {
      return connection.connect((error, result) => {
        return error ? reject(error) : resolve(result)
      })
    })
  }

  function query (stmt) {
    return new Promise((resolve, reject) => {
      return connection.query(stmt, null, (error, result) => {
        return error ? reject(error) : resolve(result)
      })
    })
  }

  return {
    connect,
    query
  }
}

export default mapd()
