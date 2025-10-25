# Automated PR Review Setup

This repository uses automated AI-powered code reviews for pull requests.

## How It Works

When a pull request is opened, updated, or when review comments are created, the AI Code Review GitHub Action automatically:

1. Analyzes the changed code in the PR
2. Provides intelligent feedback on:
   - Code quality and best practices
   - Potential bugs and issues
   - Performance improvements
   - Security concerns
   - TypeScript type safety
   - Code consistency with the repository patterns

## Setup Requirements

To enable automated PR reviews, the repository administrator needs to:

1. **Add OpenAI API Key as a GitHub Secret**:
   - Go to: Repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (get one from https://platform.openai.com/api-keys)

2. **Ensure Proper Permissions**:
   - The workflow already has the necessary permissions configured
   - `pull-requests: write` permission allows the bot to comment on PRs

## Configuration

The AI reviewer is configured in `.github/workflows/pr-review.yml` with:

- **Model**: GPT-4o (latest and most capable model)
- **Temperature**: 0.1 (for consistent, focused reviews)
- **Excluded Files**: Lock files, JSON configs, markdown docs, build artifacts
- **Max Files**: 50 files per review

## Triggering Reviews

Reviews are automatically triggered when:
- A pull request is opened
- A pull request is updated with new commits
- A pull request is reopened
- A review comment is created (allows for interactive discussion)

## Customization

You can customize the review behavior by editing `.github/workflows/pr-review.yml`:

- Change the AI model (e.g., `gpt-4`, `gpt-3.5-turbo`)
- Adjust the temperature (0.0-1.0, lower = more deterministic)
- Modify file exclusion patterns
- Change the maximum number of files to review

## Benefits

- **Consistent Reviews**: Every PR gets reviewed with the same high standards
- **Fast Feedback**: Reviews are typically provided within minutes
- **Learning Tool**: Helps contributors learn best practices
- **Catches Issues Early**: Identifies potential problems before human review
- **Complements Human Review**: AI reviews don't replace human reviewers but augment them

## Notes

- The AI reviewer provides suggestions, not requirements
- Human review and judgment are still essential
- The bot learns from the repository's code patterns and style
- Reviews are most effective for code changes (not config or documentation)
