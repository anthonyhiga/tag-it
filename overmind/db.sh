rm build/dist/database.sqlite
cp -R config build/dist
cd build/dist && npx sequelize-cli db:migrate
