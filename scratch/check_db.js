const postgres = require('postgres');

const sql = postgres('postgresql://neondb_owner:npg_tUqrEno57MJs@52.1.58.3/rest_house_mngmnt?sslmode=require&options=endpoint%3Dep-winter-cell-aqxqh5ht', {
  ssl: 'require',
  connect_timeout: 10,
});

async function checkBuildings() {
  try {
    const buildings = await sql`SELECT * FROM buildings`;
    console.log('BUILDINGS_DATA:' + JSON.stringify(buildings));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkBuildings();
