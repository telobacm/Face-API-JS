module.exports = {
  apps: [
    {
      name: 'faceapijs',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        "PORT": 3000,
        "NODE_ENV": "development",
        "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/faceapijs",
        "NEXTAUTH_SECRET": "mcy63eMK8uG8KtGddQkZ2FudPFxyUH",
        "NEXTAUTH_URL": "http://localhost:3000",
        "NEXT_PUBLIC_API_URL": "http://localhost:3000",

      },
      exp_backoff_restart_delay: 100, // optional, adjust as needed
      watch: true, // optional, adjust as needed
      max_memory_restart: '400M' // optional, adjust as needed
    }
  ]
}