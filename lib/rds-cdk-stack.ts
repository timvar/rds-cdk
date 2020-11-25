import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';

export class RdsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc1 = new ec2.Vpc(this, 'pepeVPC1', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          name: 'pepePublic1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'pepePrivate1',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: 20,
        },
      ],
    });

    const pepeDBEngine = rds.DatabaseInstanceEngine.postgres({
      version: rds.PostgresEngineVersion.VER_12,
    });

    /*    
    const pepeParameterGroup = new rds.ParameterGroup(this, 'pepeParameters', {
      engine: {
        engineType: 'postGres',
      },
    });

    pepeParameterGroup.addParameter('force_ssl', '1');
    */

    /* DB Instance 
    new rds.DatabaseInstance(this, 'pepePossuDB', {
      engine: pepeDBEngine,
      vpc: vpc1,
      allocatedStorage: 20,
      databaseName: 'pepedb',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO,
      ),
      storageType: rds.StorageType.GP2,
      instanceIdentifier: 'pepedb',
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      parameterGroup: pepeParameterGroup,

    });
  }

  */

    /*

  new rds.DatabaseCluster(this, 'pepeAurora', {
    engine: rds.DatabaseClusterEngine.auroraPostgres({
      version: rds.AuroraPostgresEngineVersion.VER_10_7
    }),
    instanceProps: {
      vpc: vpc1,
      enablePerformanceInsights: false,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE
      }
    }
  })

  */

    new rds.ServerlessCluster(this, 'pepeServerlessAurora', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      vpc: vpc1,
      scaling: {
        autoPause: cdk.Duration.minutes(10), // default is to pause after 5 minutes of idle time
        minCapacity: rds.AuroraCapacityUnit.ACU_2, // default is 2 Aurora capacity units (ACUs)
        maxCapacity: rds.AuroraCapacityUnit.ACU_4, // default is 16 Aurora capacity units (ACUs)
      },
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
