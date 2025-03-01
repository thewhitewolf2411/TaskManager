import db from "../../../services/common/db";
import bcrypt from "bcryptjs";

const seedAdminUser = async () => {
  const adminEmail = "admin@taskmanager.com";
  const adminPassword = "Admin@123"; // Change this or load from env
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  try {
    // Check if admin exists
    const checkAdmin = await db.query(`SELECT id FROM "user".users WHERE email = $1 LIMIT 1;`, [adminEmail]);
    if (checkAdmin.rows.length > 0) {
      console.log("Admin user already exists.");
      return;
    }

    // Get the admin role ID
    const roleQuery = await db.query(`SELECT id FROM "user".user_roles WHERE name = 'admin' LIMIT 1;`);
    if (roleQuery.rows.length === 0) {
      console.log("Admin role not found. Ensure roles are seeded first.");
      return;
    }
    const adminRoleId = roleQuery.rows[0].id;

    // Insert admin user
    await db.query(
      `INSERT INTO "user".users (email, password, first_name, last_name, role_id) VALUES ($1, $2, $3, $4, $5)`,
      [adminEmail, hashedPassword, "System", "Admin", adminRoleId]
    );

    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

// Run seed function
seedAdminUser();
