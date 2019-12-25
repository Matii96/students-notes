module.exports = {
  apps : [{
    name: 'StudentsNotesAPI',
    script: 'dist/app/index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: [
      'node_modules',
      'logs',
      'package-lock.json',
      'database.sqlite',
      'database.sqlite-journal'
    ],
    watch_options: {
      followSymlinks: false
    },
    max_memory_restart: '1G'
  }]
}
