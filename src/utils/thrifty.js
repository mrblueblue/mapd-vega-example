export class Thrifty {
  constructor(config) {
    this.connection = new MapdCon()
      .protocol(config.protocol)
      .host(config.host)
      .port(config.port)
      .dbName(config.dbName)
      .user(config.user)
      .password(config.password);
  }
  connect = config => {
    return new Promise((resolve, reject) => {
      return this.connection.connect((error, result) => {
        return error ? reject(error) : resolve(this);
      });
    });
  };
  query = stmt => {
    return new Promise((resolve, reject) => {
      return this.connection.query(stmt, null, (error, result) => {
        return error ? reject(error) : resolve(result);
      });
    });
  };
  logging = logging => {
    this.connection.logging(logging);
    return this;
  };
}
