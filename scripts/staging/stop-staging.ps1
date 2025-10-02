# Stop staging environment
$env:PATH = "D:\Program Files\Docker\resources\bin;" + $env:PATH
docker compose down
