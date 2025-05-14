Para correrlo ejecute los siguientes comandos:
docker build -t death-note-frontend . --> Para montar el contenedor
docker run -d -p 3100:80 --name react-app death-note-frontend --> para correr el contenedor
