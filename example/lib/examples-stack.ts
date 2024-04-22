import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { EngineVersion } from 'aws-cdk-lib/aws-opensearchservice';
import { AuroraCapacityUnit, AuroraEngineVersion, AuroraMysqlEngineVersion, DatabaseCluster, DatabaseClusterEngine, PostgresEngineVersion, ServerlessCluster } from 'aws-cdk-lib/aws-rds';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { DefinitionBody, Pass, Result, StateMachine, Succeed } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ExamplesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mediaBucket = new Bucket(this, 'MediaBucket', {
      bucketName: 'media-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,

    });

    const hostedZone = new HostedZone(this, 'HostedZone', {
      zoneName: 'example.com',
    });

    const certificate = new Certificate(this, 'Certificate', {
      domainName: hostedZone.zoneName,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    const distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new S3Origin(mediaBucket),
      },
      certificate: certificate,
      domainNames: [hostedZone.zoneName],
    });



    // API Gateway
    const api = new RestApi(this, 'MediaApi', {
      restApiName: hostedZone.zoneName,
      domainName: {
        domainName: hostedZone.zoneName,
        certificate: certificate,
      },
    });

    const vpc = new Vpc(this, 'Vpc', {
      maxAzs: 2,
    });
    const cluster = new ServerlessCluster(this, 'DatabaseCluster', {
      clusterIdentifier: 'DatabaseCluster',
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_2_08_1,
      }),
      vpc,
      scaling: {
        autoPause: cdk.Duration.minutes(15), // optional: auto-pause the cluster after 15 minutes of inactivity
        minCapacity: AuroraCapacityUnit.ACU_1, // optional: minimum capacity units
        maxCapacity: AuroraCapacityUnit.ACU_32, // optional: maximum capacity units
      },
      deletionProtection: false, // optional: set deletion protection
    });

    const media = api.root.addResource('media');

    const mediaTable = new Table(this, 'MediaTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const usersTable = new Table(this, 'UsersTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const groupsTable = new Table(this, 'GroupsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const lambda = new NodejsFunction(this, 'MediaFunction', {
      entry: './lib/lambda.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: mediaTable.tableName,
        USERS_TABLE_NAME: usersTable.tableName,
        SQL_TABLE_NAME: cluster.clusterIdentifier,
      },
    });

    const lambda2 = new NodejsFunction(this, 'MediaFunction2', {
      entry: './lib/lambda.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: mediaTable.tableName,
        GROUPS_TABLE_NAME: groupsTable.tableName,
      },
    });

    mediaTable.grantReadWriteData(lambda);
    mediaTable.grantReadWriteData(lambda2);

    media.addMethod('POST', new LambdaIntegration(lambda));
    media.addMethod('GET', new LambdaIntegration(lambda2));


    // Define the first state: Task state
    const firstState = new LambdaInvoke(this, 'FirstState', {
      lambdaFunction: lambda,
      outputPath: '$.Payload',
    });

    // Define the second state: Pass state
    const secondState = new Pass(this, 'SecondState', {
      result: Result.fromObject({ success: true }),
    });

    // Define the final state: Succeed state
    const finalState = new Succeed(this, 'FinalState');

    // Define the state machine definition
    const definition = firstState
      .next(secondState)
      .next(finalState);

    // Create the state machine
    const stateMachine = new StateMachine(this, 'MyStateMachine', {
      definition,
      timeout: cdk.Duration.minutes(5), // optional: set a timeout for the state machine
    });

    const stateMachine2 = new StateMachine(this, 'MyStateMachine2', {
      timeout: cdk.Duration.minutes(5), // optional: set a timeout for the state machine
      definitionBody: DefinitionBody.fromString(JSON.stringify({
        StartAt: 'FirstState',
        States: {
          FirstState: {
            Type: 'Task',
            Resource: lambda.functionArn,
            End: true,
          },
        },
      })),
    });




    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });

  }
}
