docker-compose stop
docker rm $(docker ps -a -f status=exited -q)
docker rmi -f $(docker images -f dangling=true -q)

printf '\n\n\n\n####### Building film-trailer #######\n\n'
cd film-trailer && git clean -fxd && git reset --hard && git checkout master && git clean -fxd && git reset --hard
docker build -t roshan/film-trailer:latest .
cd ..

printf '\n\n\n\n####### Building trailer-u #######\n\n'
cd trailer-ui && git clean -fxd && git reset --hard && git checkout master && git clean -fxd && git reset --hard
docker build -t roshan/trailer-ui:latest .

pwd

docker-compose up -d
