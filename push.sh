git add .
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"
BRANCH=$(git describe --contains --all HEAD)
echo 'the name of the commit is : ' $commit_message ', it will be pushed on the branch ' BRANCH
git push origin "$BRANCH"