const aws = require("aws-sdk");
const ddb = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  // event request user attributes (email, sub)

  // insert code to be executed by your lambda trigger

  // save new user to dynomoDB

  if (!event?.request?.userAttributes?.sub) {
    console.log("no sub provided");
    return;
  }

  const now = new Date();
  const timestamp = now.getTime();

  const userItem = {
    __typename: { S: "User" },
    _version: { N: "1" },
    _lastChangedAt: { N: timestamp.toString() },
    createdAt: { S: now.toISOString() },
    updatedAt: { S: now.toISOString() },
    id: { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email },
  };

  const params = {
    Item: userItem,
    TableName: tableName,
  };

  try {
    await ddb.putItem(params).promise();
    console.log("Successful");
  } catch (e) {
    console.log(e);
  }

  callback(null, event);
};
