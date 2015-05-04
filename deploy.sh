DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR../occurrence-calender-deploy
cp -R ../occurrence-calender/* ./
rm ./app/config/secret/.gitignore
git add .
git commit -m "copy from other repo"
git push heroku master
cd $DIR