import { DBSQLClient } from '@databricks/sql'

export const client: DBSQLClient = new DBSQLClient()

const connectOptions = {
  token: 'dapia6d0dc8b422cce00f3bec821cfe91f0e',
  host: 'ifood-prod-main.cloud.databricks.com',
  path: '/sql/1.0/warehouses/1b2987509fa47232',
}

client.connect(connectOptions)
