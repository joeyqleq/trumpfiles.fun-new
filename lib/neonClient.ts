if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL in environment');
  }
  const sql = neon(process.env.DATABASE_URL);