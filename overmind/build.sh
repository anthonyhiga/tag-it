node_modules/.bin/sequelize model:create --name Player --attributes id:string,email:string,password:string
node_modules/.bin/sequelize model:create --name TeamMember --attributes id:string,email:string,password:string
node_modules/.bin/sequelize model:create --name Team --attributes name:string,email:string,password:string

node_modules/.bin/sequelize model:create --name Gun --attributes name:string,email:string,password:string


node_modules/.bin/sequelize model:create --name GameTeam --attributes id:integer,gameId:integer,ltGameId:integer,ltPlayerId:integer,ltTeamId:integer,createdAt:date,updatedAt:date
node_modules/.bin/sequelize model:create --name GamePlayer --attributes id:integer,playerId:string,gameId:integer,teamId:integer,ltGameId:integer,ltPlayerId:integer,ltTeamId:integer,createdAt:date,updatedAt:date
node_modules/.bin/sequelize model:create --name Game --attributes id:integer,ltId:integer,name:string,createdAt:date,startedAt:date,completedAt:date,updatedAt:date

node_modules/.bin/sequelize model:create --name ArbiterCommand --attributes id:integer,status:integer,message:string,response:string,arbiterId:string,createdAt:date,updatedAt:date

