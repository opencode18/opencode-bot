# Using opencodebot
OpenCode uses [@opencodebot](https://github.com/opencodebot), a GitHub workflow bot deployed on all OpenCode repositories, to handle issues and pull requests in our repositories in order to create a better workflow for OpenCode contributors.

Its purpose is to work around various limitations in GitHub’s permissions and notifications systems to make it possible to have a much more democractic workflow for our contributors. It allows anyone to self-assign or label an issue, not just the core contributors trusted with full write access to the repository (which is the only model GitHub supports).

## Usage

 ***Claim an issue*** - Comment ```@opencodebot claim``` on the issue you want to claim; **opencodebot** will assign you to the issue and label the issue as in progress.
 
 ***Unclaim an issue*** - Comment ```@opencodebot unclaim``` on the issue you want to unclaim; **opencodebot** will unassign you to the issue and remove "in progress" label.
 
## Instructions
* Participant can take only two issues simultaneously.
* Before starting work on issue,make sure that you have claimed it, and it is showing you as a assignee. 
* Just after opening PR, bot will automatically assign one of the mentors as reviewer on PR.

If you found any glitches in the bot, inform it to any mentor, we will try to resolve it as soon as possible.
