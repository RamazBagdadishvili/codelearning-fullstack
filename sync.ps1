# 1. ვამზადებთ ყველა ფაილს
git add .

# 2. ვამოწმებთ, არის თუ არა რაიმე შესანახი (Commit)
$status = git status --porcelain
if ($status) {
    echo "Files changed, committing..."
    git commit -m "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
} else {
    echo "No local changes to commit."
}

# 3. ვამოწმებთ, გვაქვს თუ არა ასატვირთი კომიტები (Push)
# Get the current branch name
$branch = git branch --show-current
if (!$branch) { $branch = "main" }

echo "Checking for updates..."
git fetch origin $branch

$ahead = git log origin/$branch..$branch --oneline
if ($ahead) {
    echo "Uploading to GitHub..."
    git push origin $branch
    echo "Done! Changes are now on GitHub."
} else {
    echo "Everything is already on GitHub."
}
