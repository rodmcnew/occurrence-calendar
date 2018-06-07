# This script deploys the app to Heroku
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR/../occurrence-calendar-deploy
if [ $? -eq 0 ]; then
    rm -R ./*
    cp -R ../occurrence-calendar/* ./
    # Bring main .gitignore so node_modules don't go to Heroku
    cp ../occurrence-calendar/.gitignore ./
    # Ensure secrets.js makes it to Heroku
    rm ./app/config/secret/.gitignore
    git add .
    git commit -m "copy from other repo"
    git push heroku master
    cd $DIR
else
    echo occurrence-calender-deploy folder does not exist
fi
