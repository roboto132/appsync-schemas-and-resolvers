import { LambdaClient, InvokeCommand } from ("@aws-sdk/client-lambda");

export const invoke = async (arnFunction, payload) => {
  const client = new LambdaClient({});
  const command = new InvokeCommand({
    FunctionName: arnFunction,
    Payload: JSON.stringify(payload),
    LogType: "Tail",
  });

  const { Payload } = await client.send(command);
  const result = Buffer.from(Payload).toString();

  return JSON.parse(result);
};
