git add .
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"
git push origin api
git push origin app