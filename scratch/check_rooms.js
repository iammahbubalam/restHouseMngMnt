const postgres = require('postgres');

const sql = postgres('postgresql://neondb_owner:npg_tUqrEno57MJs@52.1.58.3/rest_house_mngmnt?sslmode=require&options=endpoint%3Dep-winter-cell-aqxqh5ht', {
  ssl: 'require',
  connect_timeout: 10,
});

async function checkRooms() {
  try {
    const rooms = await sql`SELECT building_id, count(*) FROM rooms GROUP BY building_id`;
    console.log('ROOMS_COUNT:' + JSON.stringify(rooms));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkRooms();
