var func = []
func[0] = 'help'
func[1] = 'claim'
func[2] = 'unclaim'
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on(['issues.opened','issues.edited'], async context => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue! ok' })
    return context.github.issues.createComment(issueComment)
  })

  app.on('issue_comment.created',async context =>{
    const comment = context.payload.comment.body
    const user = context.payload.comment.user.login
    var command
    if(user!="opencodebot[bot]"){
      command = parseCommand(comment)
      if(command!=null && command.length>0)
      	execCommand(command,user,context)
    }
  })
  app.on('pull_request.opened', async context => {
    // An issue was just opened.
    app.log('PR was opened')

    const {payload, github} = context;

    if (payload.pull_request.requested_reviewers.length > 0) return;

    const config = await context.config('reviewers.yml');

    if (config !== null && config.reviewers !== null && config.reviewers.length > 0) {
      const reviewers = config.reviewers
      app.log(payload.pull_request)
      const reviewerIndex = payload.pull_request.number % reviewers.length;
      await github.pullRequests.createReviewRequest(context.issue({
        reviewers: [reviewers[reviewerIndex]],
        headers: {
          accept: 'application/vnd.github.mercy-preview+json'
        }
      }));
    } else {
      app.log("No reviewers specified for the repo")
    }
  })
}
function parseCommand(comment){
  var pattern = []
  var command = []
  pattern.push(/@opencodebot help/gim)
  pattern.push(/@opencodebot claim/gim)
  pattern.push(/@opencodebot unclaim/gim)

  for(i=0;i<pattern.length;i++){
    var myarray = comment.match(pattern[i]);
    if(myarray!=null && myarray.length>0){
      command.push(func[i])
    }
  }
  if(command!=null && command.length>0){
    return command
  }
  else{
    return null
  }
}

async function execCommand(command,user,context){
  for(i=0;i<command.length;i++){
    var comment;
    switch(command[i]) {
      case func[0]:
        comment = context.issue({ body: 'This comment shows help menu.' })
        break;
      case func[1]:
        comment = await claimIssue(user,context)
        break;
      case func[2]:
        comment = await unclaimIssue(user,context)
        break;
      default:
        comment = "Could not identify the command."
        break;
    }
    await context.github.issues.createComment(comment)
  }
}

async function claimIssue(user,context){
  var comment 
  if(checkLabel('Everyone',context)){
    comment = context.issue({body: 'Issue is labled "Everyone".It cannot be claimed.'})
  }
  else if(checkAssignee(context)){
    comment = context.issue({body: "This issue is already assigned."})
  }
  else{
    if(await checkMaxIssue(user,context)){
      console.log(await checkMaxIssue(user,context))
      comment = context.issue({body:"You cannot take more than two issues simultaneously."})
    }
    else{
      context.github.issues.addAssignees(context.issue({assignees: user}));
      comment = context.issue({ body: 'This issue is assigned to @'+user+"."})
    }
    
  }
  return comment 
}

async function unclaimIssue(user,context){
  await context.github.issues.removeAssignees(context.issue({assignees: user}))
  return context.issue({ body: "@"+user+" is no longer working on this issue."})
}

function checkAssignee(context){
  var assignees = context.payload.issue.assignees
  console.log(assignees)
  if(assignees!= null && assignees.length > 0){
    return true
  }
  return false
}

function checkLabel(label,context){
  var result = context.payload.issue.labels
  console.log(result)
  if(result!=null){
    for(i=0;i<result.length;i++){
      if(result[i].name==label){
        return true
      }
    }
  }
  return false
}

async function checkMaxIssue(user,context){
  const query = "type:issue state:open assignee:"+ user +" org:opencodeiiita"
  var result = await context.github.search.issues({q:query})
  // console.log("Result")
  // console.log(result)
  const count = result.data.total_count
  // console.log("Data")
  // console.log(result.data)
  // console.log("Count")
  // console.log(count)
  if(count>=2){
    return true
  }
  return false
}