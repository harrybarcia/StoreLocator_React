git add .
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"
echo 'the name of the commit is : ' $commit_message
git push origin "$BRANCH"