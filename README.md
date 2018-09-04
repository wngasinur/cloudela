# mongodb

mongodump -d admin -o condo.db --excludeCollectionsWithPrefix=system

mongorestore -d cloudela condo.db/admin/


#pm2 

pm2 start ecosystem.config.js --env production
