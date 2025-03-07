# Makefile
SHELL = cmd.exe

install:
	npm install

start-backend:
	cd backend & npm run develop

start-frontend:
	cd a & npm run dev