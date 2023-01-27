git add .
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"
read "your commit message is: " commit_message
git push origin "$BRANCH"