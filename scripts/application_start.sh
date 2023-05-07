#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/pirate-mobile

#navigate into our working directory where we have all our github files
cd /home/pirate-mobile

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
yarn

#start our node app in the background
yarn start:debug 