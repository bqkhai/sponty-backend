# build on local and push
# docker build --platform linux/amd64 -t registry.solidtech.vn/memories-backend .
# docker push registry.solidtech.vn/memories-backend

# build on server
docker compose down
docker build -t registry.solidtech.vn/memories-backend .
docker compose up -d --force-recreate
