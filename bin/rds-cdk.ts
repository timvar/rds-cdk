#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RdsCdkStack } from '../lib/rds-cdk-stack';

const app = new cdk.App();
new RdsCdkStack(app, 'RdsCdkStack');
