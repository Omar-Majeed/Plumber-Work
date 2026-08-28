<#
.SYNOPSIS
    Initialises git for this project and pushes it to a new GitHub repository.

.DESCRIPTION
    Run this from the project folder. It is safe to run more than once — it
    skips any step that is already done and never force-pushes or deletes
    anything.

    With the GitHub CLI installed (https://cli.github.com) it creates the
    repository for you. Without it, create an empty repository on github.com
    first (no README, no .gitignore, no licence) and pass its URL.

.EXAMPLE
    .\push-to-github.ps1
    Creates a private repo named "hohmanns-plumbing" using the GitHub CLI.

.EXAMPLE
    .\push-to-github.ps1 -RepoName hohmanns-site -Public
    Creates a public repo with a different name.

.EXAMPLE
    .\push-to-github.ps1 -RepoUrl https://github.com/you/hohmanns-plumbing.git
    Pushes to a repository you already created on github.com.
#>

[CmdletBinding()]
param(
    [string] $RepoName = "hohmanns-plumbing",
    [string] $RepoUrl,
    [switch] $Public
)

$ErrorActionPreference = "Stop"

function Step($message) { Write-Host "`n==> $message" -ForegroundColor Cyan }
function Ok($message)   { Write-Host "    $message" -ForegroundColor Green }
function Warn($message) { Write-Host "    $message" -ForegroundColor Yellow }

# --- sanity checks ---------------------------------------------------------

if (-not (Test-Path ".\package.json")) {
    throw "Run this from the project folder (no package.json found here)."
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "git is not installed or not on PATH. Install it from https://git-scm.com"
}

# --- 1. repository ---------------------------------------------------------

Step "Preparing the local repository"

if (Test-Path ".\.git") {
    Ok "Already a git repository."
} else {
    git init -b main | Out-Null
    Ok "Initialised a new repository on branch 'main'."
}

$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if ($branch -eq "HEAD" -or [string]::IsNullOrWhiteSpace($branch)) {
    git checkout -b main | Out-Null
    $branch = "main"
}
Ok "Branch: $branch"

# --- 2. commit -------------------------------------------------------------

Step "Staging and committing"

git add -A

$pending = git status --porcelain
if ([string]::IsNullOrWhiteSpace($pending)) {
    Ok "Nothing new to commit."
} else {
    $count = ($pending -split "`n" | Where-Object { $_ }).Count
    git commit -m "Hohmanns Plumbing Services website" | Out-Null
    Ok "Committed $count file(s)."
}

Write-Host ""
Write-Host "    Excluded by .gitignore: node_modules, .next, artifacts, .env.local" -ForegroundColor DarkGray

# --- 3. remote + push ------------------------------------------------------

Step "Publishing to GitHub"

$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    Ok "Remote 'origin' already set: $existingRemote"
    git push -u origin $branch
    Ok "Pushed."
    exit 0
}

if ($RepoUrl) {
    git remote add origin $RepoUrl
    Ok "Remote 'origin' set to $RepoUrl"
    git push -u origin $branch
    Ok "Pushed."
    exit 0
}

if (Get-Command gh -ErrorAction SilentlyContinue) {
    $authed = $true
    gh auth status 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { $authed = $false }

    if (-not $authed) {
        Warn "The GitHub CLI is installed but not signed in."
        Warn "Run:  gh auth login"
        Warn "Then run this script again."
        exit 1
    }

    $visibility = if ($Public) { "--public" } else { "--private" }
    gh repo create $RepoName $visibility --source=. --remote=origin --push
    Ok "Created and pushed to $RepoName."
    exit 0
}

Warn "The GitHub CLI is not installed, and no -RepoUrl was given."
Warn ""
Warn "Either install it from https://cli.github.com and re-run this script,"
Warn "or create an empty repository at https://github.com/new"
Warn "(no README, no .gitignore, no licence) and then run:"
Warn ""
Warn "    .\push-to-github.ps1 -RepoUrl https://github.com/<you>/$RepoName.git"
exit 1
