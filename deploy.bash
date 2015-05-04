DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR/../occurrence-calender-deploy
if [ $? -eq 0 ]; then
    rm -R ./*
    cp -R ../occurrence-calender/* ./
    rm ./app/config/secret/.gitignore
    git add .
    git commit -m "copy from other repo"
    git push heroku master
    cd $DIR
else
    echo occurrence-calender-deploy folder does not exist
fi