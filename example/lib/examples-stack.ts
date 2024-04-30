import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  Vpc,
  Instance,
  InstanceType,
  InstanceClass,
  InstanceSize,
  AmazonLinuxImage,
} from "aws-cdk-lib/aws-ec2";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { EngineVersion } from "aws-cdk-lib/aws-opensearchservice";
import {
  AuroraCapacityUnit,
  AuroraEngineVersion,
  AuroraMysqlEngineVersion,
  DatabaseCluster,
  DatabaseClusterEngine,
  PostgresEngineVersion,
  ServerlessCluster,
} from "aws-cdk-lib/aws-rds";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Bucket } from "aws-cdk-lib/aws-s3";
import {
  DefinitionBody,
  Pass,
  Result,
  StateMachine,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";
import * as eventBridge from "aws-cdk-lib/aws-events";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as guardduty from "aws-cdk-lib/aws-guardduty";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class ExamplesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mediaBucket = new Bucket(this, "MediaBucket", {
      bucketName: "media-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const hostedZone = new HostedZone(this, "HostedZone", {
      zoneName: "example.com",
    });

    const certificate = new Certificate(this, "Certificate", {
      domainName: hostedZone.zoneName,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    const distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new S3Origin(mediaBucket),
      },
      certificate: certificate,
      domainNames: [hostedZone.zoneName],
    });

    // API Gateway
    const api = new RestApi(this, "MediaApi", {
      restApiName: hostedZone.zoneName,
      domainName: {
        domainName: hostedZone.zoneName,
        certificate: certificate,
      },
    });

    const vpc = new Vpc(this, "Vpc", {
      maxAzs: 2,
      vpcName: "example-vpc",
    });

    const instance = new Instance(this, "Instance", {
      vpc,
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage(),
    });

    const cluster = new ServerlessCluster(this, "DatabaseCluster", {
      clusterIdentifier: "DatabaseCluster",
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

    const media = api.root.addResource("media");

    const mediaTable = new Table(this, "MediaTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    const usersTable = new Table(this, "UsersTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    const groupsTable = new Table(this, "GroupsTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    const lambda = new NodejsFunction(this, "MediaFunction", {
      entry: "./lib/lambda.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: mediaTable.tableName,
        USERS_TABLE_NAME: usersTable.tableName,
        SQL_TABLE_NAME: cluster.clusterIdentifier,
      },
    });

    const lambda2 = new NodejsFunction(this, "MediaFunction2", {
      entry: "./lib/lambda.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: mediaTable.tableName,
        GROUPS_TABLE_NAME: groupsTable.tableName,
      },
    });

    const eventBridged = new eventBridge.EventBus(this, "ExampleEventBus", {
      eventBusName: "ExampleEventBus",
    });

    const rule = new eventBridge.Rule(this, `Example`, {
      eventPattern: {
        source: ["com.example"],
        detailType: ["example"],
      },
      eventBus: eventBridged,
    });

    eventBridged.grantPutEventsTo(lambda2);

    rule.addTarget(new LambdaFunction(lambda2));

    const guardDuty = new guardduty.CfnDetector(this, "GuardDuty", {
      enable: true,
      findingPublishingFrequency: "SIX_HOURS",
      tags: [
        {
          key: "Name",
          value: "GuardDuty",
        },
      ],
    });

    const kinesis = new cdk.aws_kinesis.CfnStream(this, "Kinesis", {
      name: "Kinesis",
      shardCount: 1,
    });

    const neptune = new cdk.aws_neptune.CfnDBCluster(this, "Neptune", {
      dbClusterIdentifier: "Neptune",
      dbSubnetGroupName: vpc.vpcDefaultNetworkAcl,
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
    });

    const elasticCache = new cdk.aws_elasticache.CfnCacheCluster(
      this,
      "ElasticCache",
      {
        cacheNodeType: "cache.t3.micro",
        engine: "redis",
        numCacheNodes: 1,
        cacheSubnetGroupName: vpc.vpcDefaultNetworkAcl,
      }
    );

    const keySpaces = new cdk.aws_cassandra.CfnKeyspace(this, "KeySpaces", {
      keyspaceName: "KeySpaces",
    });

    const redShift = new cdk.aws_redshift.CfnCluster(this, "RedShift", {
      clusterIdentifier: "RedShift",
      nodeType: "dc2.large",
      clusterType: "single-node",
      dbName: "redshift",
      masterUsername: "admin",
    });

    const ses = new cdk.aws_ses.ConfigurationSet(this, "SES", {
      configurationSetName: "SES-Example",
    });

    const sqs = new cdk.aws_sqs.Queue(this, "SQS", {
      queueName: "SQS-Example",
    });

    const timeStream = new cdk.aws_timestream.CfnDatabase(this, "TimeStream", {
      databaseName: "TimeStream",
    });

    const amplify = new cdk.aws_amplify.CfnApp(this, "Amplify", {
      name: "Amplify-example",
    });

    const cognito = new cdk.aws_cognito.CfnUserPool(this, "Cognito", {
      userPoolName: "Cognito-example",
    });

    const conect = new cdk.aws_connect.CfnInstance(this, "Connect", {
      instanceAlias: "Connect-example",
      identityManagementType: "CONNECT_MANAGED",
      attributes: {
        useCustomTtsVoices: false,
        inboundCalls: true,
        outboundCalls: true,
      },
    });

    const cloudTrail = new cdk.aws_cloudtrail.CfnTrail(this, "CloudTrail", {
      isMultiRegionTrail: true,
      includeGlobalServiceEvents: true,
      isLogging: true,
      s3BucketName: mediaBucket.bucketName,
    });
    const identityManagement = new cdk.aws_identitystore.CfnGroup(
      this,
      "IdentityManagement",
      {
        displayName: "IdentityManagement",
        identityStoreId: "identityStoreId",
      }
    );

    const iotCore = new cdk.aws_iot.CfnTopicRule(this, "IotCore", {
      ruleName: "IotCore",
      topicRulePayload: {
        actions: [
          {
            lambda: {
              functionArn: lambda.functionArn,
            },
          },
        ],
        sql: "SELECT * FROM 'topic'",
      },
    });

    const iotAnalytics = new cdk.aws_iotanalytics.CfnDatastore(
      this,
      "IotAnalytics",
      {
        datastoreName: "IotAnalytics",
      }
    );

    const kms = new cdk.aws_kms.CfnKey(this, "Kms", {
      keyPolicy: {
        version: "2012-10-17",
        id: "key-policy",
        statement: [
          {
            effect: "Allow",
            principal: {
              service: "s3.amazonaws.com",
            },
            action: "kms:Encrypt",
            resource: "*",
          },
        ],
      },
    });

    const shield = new cdk.aws_shield.CfnProtection(this, "Shield", {
      name: "Shield",
      resourceArn: mediaBucket.bucketArn,
    });

    const waf = new cdk.aws_waf.CfnWebACL(this, "Waf", {
      defaultAction: {
        type: "ALLOW",
      },
      name: "Waf",
      metricName: "Waf",
    });

    const organization = new cdk.aws_organizations.CfnOrganization(
      this,
      "Organization",
      {
        featureSet: "ALL",
      }
    );

    const autoraPostgres = new DatabaseCluster(this, "AuroraPostgres", {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: {
          auroraPostgresFullVersion: "10.7",
          auroraPostgresMajorVersion: "10",
          _features: {
            s3Import: "",
            s3Export: "",
          },
        },
      }),
      instanceProps: {
        vpc,
        instanceType: InstanceType.of(
          InstanceClass.BURSTABLE2,
          InstanceSize.SMALL
        ),
      },
    });

    const metrics = new cdk.aws_cloudwatch.CfnMetricStream(this, "Metrics", {
      roleArn: "roleArn",
      firehoseArn: "firehoseArn",
      name: "Metrics",
      outputFormat: "json",
    });

    const workFloow = new cdk.aws_glue.CfnWorkflow(this, "WorkFlow", {
      name: "WorkFlow",
    });

    mediaTable.grantReadWriteData(lambda);
    mediaTable.grantReadWriteData(lambda2);

    media.addMethod("POST", new LambdaIntegration(lambda));
    media.addMethod("GET", new LambdaIntegration(lambda2));

    // Define the first state: Task state
    const firstState = new LambdaInvoke(this, "FirstState", {
      lambdaFunction: lambda,
      outputPath: "$.Payload",
    });

    // Define the second state: Pass state
    const secondState = new Pass(this, "SecondState", {
      result: Result.fromObject({ success: true }),
    });

    // Define the final state: Succeed state
    const finalState = new Succeed(this, "FinalState");

    // Define the state machine definition
    const definition = firstState.next(secondState).next(finalState);

    // Create the state machine
    const stateMachine = new StateMachine(this, "MyStateMachine", {
      definition,
      timeout: cdk.Duration.minutes(5), // optional: set a timeout for the state machine
    });

    const stateMachine2 = new StateMachine(this, "MyStateMachine2", {
      timeout: cdk.Duration.minutes(5), // optional: set a timeout for the state machine
      definitionBody: DefinitionBody.fromString(
        JSON.stringify({
          StartAt: "FirstState",
          States: {
            FirstState: {
              Type: "Task",
              Resource: lambda.functionArn,
              End: true,
            },
          },
        })
      ),
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
    });
  }
}
