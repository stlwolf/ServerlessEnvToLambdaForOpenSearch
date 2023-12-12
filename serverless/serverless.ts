import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      OpenSearchInstance: {
        Type: "AWS::OpenSearchService::Domain",
        Properties: {
          EngineVersion: "OpenSearch_2.7",
          DomainName: "sample-open-search",
          ClusterConfig: {
            InstanceType: "t3.small.search",
            InstanceCount: 1,
            DedicatedMasterEnabled: false,
            ZoneAwarenessEnabled: false,
          },
          EBSOptions: {
            EBSEnabled: true,
            VolumeType: "gp3",
            VolumeSize: "20",
          },
          EncryptionAtRestOptions: {
            Enabled: true,
          },
          NodeToNodeEncryptionOptions: {
            Enabled: true,
          },
          DomainEndpointOptions: {
            EnforceHTTPS: true,
          },
          AdvancedSecurityOptions: {
            Enabled: true,
            InternalUserDatabaseEnabled: true,
            MasterUserOptions: {
              MasterUserName: "user",
              MasterUserPassword: "hogehuga12!@HUHU",
            },
          },
          AccessPolicies: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  AWS: "*",
                },
                Action: "es:*",
                Resource: "arn:aws:es:ap-northeast-1:${aws:accountId}:domain/sample-open-search/*",
              },
            ],
          },
        },
      },
    }
  }
};

module.exports = serverlessConfiguration;
