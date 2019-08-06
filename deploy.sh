REPOSITORY=/home/ubuntu/app
git pull
CURRENT_PID=$(pgrep -f MyblogApplication)
if [ -z $CURRENT_PID ]; then
else
        kill -9 $CURRENT_PID
        sleep 5
fi
./gradlew clean build
cp ./build/libs/*.jar $REPOSITORY/
JAR_NAME=$(ls $REPOSITORY/ |grep 'MyblogApplication' | tail -n 1)
java -jar $REPOSITORY/$JAR_NAME&