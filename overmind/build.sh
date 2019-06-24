node_modules/.bin/sequelize model:create --name Player --attributes name:string,totemId:string,birthYear:integer,photo:text
node_modules/.bin/sequelize model:create --name TeamMember --attributes playerId:integer,teamId:integer,gameId:integer,taggerId:integer 
node_modules/.bin/sequelize model:create --name Team --attributes gameId:integer,teamId:integer,name:string,logo:string

node_modules/.bin/sequelize model:create --name ArbiterChannel --attributes id:string,arbiterId:string,name:string,type:string,totemId:string,status:string


node_modules/.bin/sequelize model:create --name GameTeam --attributes id:integer,gameId:integer,ltGameId:integer,ltPlayerId:integer,ltTeamId:integer,createdAt:date,updatedAt:date
node_modules/.bin/sequelize model:create --name GamePlayer --attributes id:integer,playerId:string,gameId:integer,teamId:integer,ltGameId:integer,ltPlayerId:integer,ltTeamId:integer,createdAt:date,updatedAt:date
node_modules/.bin/sequelize model:create --name Game --attributes id:integer,ltId:integer,name:string,createdAt:date,startedAt:date,completedAt:date,updatedAt:date

node_modules/.bin/sequelize model:create --name ArbiterCommand --attributes id:integer,status:integer,message:string,response:string,arbiterId:string,createdAt:date,updatedAt:date

node_modules/.bin/sequelize model:create --name GamePlayerScore --attributes id:integer,gameId:integer,teamId:integer,playerId:integer,totalTagsReceived:integer,totalTagsGiven:integer,survivedTimeSec:integer,zoneTimeSec:integer
node_modules/.bin/sequelize model:create --name GamePlayerScoreTagRecord --attributes id:integer,gameId:integer,teamId:integer,playerId:integer,tagsReceived:integer,tagsGiven:integer,tagTeamId:integer,tagPlayerId:integer
